import program from "commander";
import { makeLogger } from "../../lib/logging"
import { machineConfigPackage, rmPackageEntry, rmPackageEntryByLabel, setPackageBoot } from "@createdreamtech/carti-core"
import * as clib from "@createdreamtech/carti-core"
import { Bundle, bundle, PackageEntryOptions, generateLuaConfig } from "@createdreamtech/carti-core"
import { Config, getMachineConfig, initMachineConfig, writeMachineConfig, CARTI_DOCKER_PACKAGE_PATH, CARTI_BUILD_BUNDLES_PATH, machineConfigExists } from "../../lib/config"
import inquirer from "inquirer"
import { shortDesc, parseShortDesc } from "../../lib/bundle";
import * as utils from "../util"
import os from "os"
import { https } from "follow-redirects"
import fs from "fs-extra"
import { spawnSync } from "child_process";
import path from "path"
import rimraf from "rimraf";
import { promisify } from 'util';
import { bundleFetcher } from "../../lib/fetcher";
import { Readable } from "stream";
import { fromStreamToStr } from "../../lib/utils";
import url from "url"
import { CID } from "multiformats";
import { cwd } from "process";
import { CartiBundleStorage } from "../../lib/storage/carti_bundles";
import { commandHandler, progressBar } from "./command_util";
import chalk from "chalk";
const rmAll = promisify(rimraf)

type addMachineCommandType = "ram" | "rom" | "flashdrive";

export const addMachineCommand = (config: Config): program.Command => {
    const add = (addType: addMachineCommandType) => {
        return (name: string, options: PackageEntryOptions & {yes: boolean}) => {
            const { length, start, shared, yes, label,} = options
            return commandHandler(handleAdd, config, name, { length, start, shared, label }, addType, yes)
        }
    }
    const machineCommand = program.command("machine")
        .description("Utilize cartesi machine commands to specify and generate stored machines")
        .storeOptionsAsProperties(false)
        .passCommandToAction(false)

    const machineRepoCommand = new program.Command("repo")
        .description("a util to annotate repo dependencies for automatic retrieval from config")
        .storeOptionsAsProperties(false)
        .passCommandToAction(false)

    machineRepoCommand.command("deps")
        .description("lists links to repo dependencies for optional inclusion in config")
        .action(() => commandHandler(handleDepsRepo, config))

    machineRepoCommand.command("list")
        .description("lists repos specified in the machine config")
        .action(() => commandHandler(handleListRepo, config))

    machineRepoCommand.command("add <repos>")
        .description("write comma seperated list of repos to add into config")
        .action((repos) => commandHandler(handleAddRepo, config, repos))

    machineRepoCommand.command("rm <repos>")
        .description("write comma seprated list of repos to remove from config")
        .action((repos) => commandHandler(handleRmRepo, config, repos))


    const machineRmCommand = new program.Command("rm")
        .description("Rm bundles from cartesi machine description using ram | rom | flashdrive options")
        .storeOptionsAsProperties(false)
        .passCommandToAction(false)

    machineRmCommand.command("ram")
        .description("remove ram entry from machine-package")
        .action(() => commandHandler(handleRm, config, "ram"))

    machineRmCommand.command("rom")
        .description("remove rom entry from machine-package")
        .action(() => commandHandler(handleRm, config, "rom"))

    machineRmCommand.command("flash <label>")
        .description("remove flash drive entry from machine-package, must specify label")
        .usage("mylabel")
        .action((label) => commandHandler(handleRm, config, "flashdrive", label))


    const machineAddCommand = new program.Command("add")
        .description("Add bundle to cartesi machine description using ram | rom | flashdrive options")
        .storeOptionsAsProperties(false)
        .passCommandToAction(false)

    machineAddCommand.command("ram <bundle>")
        .description("add a bundle to the ram entry for carti-machine-package.json")
        .option("-l, --length <length>", "length of the drive in hex format ex. 0x4000")
        .option("-r, --resolvedpath <resolvedpath>", "specify a package outside of a cid the mechanism default uses")
        .option("-y, --yes", "choose match without prompt")
        .action(add("ram"))

    machineAddCommand.command("flash [bundle]")
        .requiredOption("-m, --label <label>")
        .option("-l, --length <length>", "length of the drive in hex format ex. 0x4000000")
        .option("-s, --start <start>", "start position of the drive in hex format ex. 0x800000")
        .option("--shared", "toggles the shared field defaults false")
        .option("-r, --resolvedpath <resolvedpath>", "specify a package outside of a cid the mechanism default uses")
        .option("-y, --yes", "choose match without prompt")
        .description("add a bundle to the flash entry for carti-machine-package.json")
        .action(add("flashdrive"))
    
    machineAddCommand.command("boot <args>")
    .description("Add boot argument for rom with default prefix or your own")
    .usage("'ls /bin'")
    .option("-p, --prefix <prefix>", "prefix for bootargs ex. console=hvc0 rootfstype=ext2 root=/dev/mtdblock0 rw quiet mtdparts=flash.0:-(root) ")
    .action((args,options)=>{
        return commandHandler(handleBoot, config, args, options.prefix)
    })

    machineAddCommand.command("rom <bundle>")
        .description("add a bundle to the rom entry for carti-machine-package.json")
        .option("-r, --resolvedpath <resolvedpath>", "specify a package outside of a cid the mechanism default uses")
        .option("-y, --yes", "choose match without prompt")
        .action(add("rom"))

    /*
        TODO: Feature needs more integration placeholder here. Pending implementation
        machineAddCommand.command("raw <bundle> - pending ")
        .description("add a raw asset bundle to the entry for carti-machine-package.json")
        .action(add("raw"))
        */

    
    machineCommand.addCommand(machineAddCommand)
    machineCommand.addCommand(machineRmCommand)
    machineCommand.addCommand(machineRepoCommand)
    machineCommand.command("build")
        .description("Build a lua cartesi machine configuration from carti-machine-package.json")
        .option("-d, --dir <dir>", "specify an output directory for machine-config.lua")
        .option("-r, --runscript", "output a default lua run script")
        .action(async (options) => {
            return commandHandler(handleBuild, config, options.dir, options.runscript)
        })

    machineCommand.command("init")
        .description("Init a stored machine from carti-machine-package.json it is destructive")
        .action(handleInit)


    machineCommand.command("install <uri>")
        .description("Install a cartesi machine, installing bundles and optionally a lua cartesi machine config from a uri or file path specified carti-machine-package.json")
        .option("--nobuild", "install remote machine bundles but does not generate a lua config")
        .option("--nobundle", "do not output machine bundles into a single mountable build location")
        .option("--norepo", "do not auto add repos")
        .option("-s, --save", "save remote carti-machine-package.json to local machine")
        .option("-g, --global", "install all bundles into global location")
        .action(async (uri:string, options:any) => commandHandler(handleInstall, 
            config, 
            uri, 
            options.nobuild, 
            options.nobundle || false, 
            options.norepo || false,
            options.save || false,
            options.global))

    return machineCommand
}


const renderBundle = (b: Bundle): string => {
    const { bundleType, name, version, id } = b;
    return shortDesc({ bundleType, name, version, id, uri: "installed" })
}

async function handleInit() {
    return initMachineConfig()
}

async function getPackageFile(uri: string): Promise<Readable> {
    if (url.parse(uri).protocol === null)
        return fs.createReadStream(path.resolve(uri))

    return new Promise((resolve, reject) => {
        https.get(uri, (response) => {
            if(!response || response.statusCode! >= 400){
                reject(new Error(`Could not process package file from ${uri}`))
            }
            resolve(response)
        })
    })
}

async function handleListRepo(config: Config) {
    let cfg = await getMachineConfig()
    if (!cfg.repos) return
    const uniqueUri: string[] = []
    cfg.repos.forEach((u) => {
        uniqueUri.push(u)
    })
    console.log(uniqueUri.join(','))
}

async function handleDepsRepo(config: Config){
    let cfg = await getMachineConfig()
    const lookup: any = {}
    const uniqueUri:string[] =[]
    for(const asset of cfg.assets){
        const uri = await config.globalConfigStorage.origin(asset.cid)
        uri.forEach((u)=>{
            if (lookup[u]) return
            lookup[u] = true
            uniqueUri.push(u)
        })
    }
    console.log(uniqueUri.join(','))
}

async function handleAddRepo(config: Config, repos: string){
    let cfg = await getMachineConfig()
    const rs = cfg.repos || [];
    cfg.repos = repos.split(',').concat(rs)
    return writeMachineConfig(cfg)
}

async function handleRmRepo(config: Config, repos: string){
    let cfg = await getMachineConfig()
    const rs = repos.split(",")
    const lookup: any = {}
    rs.forEach((r)=>{
        lookup[r] = true;
    })
    if(!cfg.repos) return
    cfg.repos = cfg.repos.filter((f)=>!lookup[f])
    return writeMachineConfig(cfg)
}

async function handleInstall(config: Config, uri: string, nobuild:boolean, nobundleDir: boolean, norepo:boolean, saveConfig:boolean, global?: boolean): Promise<void> {
    //TODO add error handling here
    if(nobundleDir === false) await fs.ensureDir(CARTI_BUILD_BUNDLES_PATH)
    const packageStorage = new CartiBundleStorage(CARTI_BUILD_BUNDLES_PATH) 

    const packageConfig: machineConfigPackage.CartiPackage = JSON.parse(await fromStreamToStr(await getPackageFile(uri)))
    if(saveConfig){
        await writeMachineConfig(packageConfig)
    }
    //check packages can all be resolved
    if (norepo === false && packageConfig.repos) {
        for(const repo of packageConfig.repos){
            try {
                if (await config.repo.has(repo)) {
                    console.log(`skipping adding repo, already knows repo: ${repo}`)
                } else {
                    await config.repo.add(repo)
                    console.log(`adding repo: ${repo}`)
                }
            } catch (e) {
                debugger
                console.log(`skipping, could not add ${repo} cause: ${e.message}`)
            }
        }
    }

    for (const asset of packageConfig.assets) {
        let bundles = await config.globalConfigStorage.getById(asset.cid)
        if (bundles.length === 0 ){
            // Note search for bundles locally as well, users may have fully resolved
            // bundles that are published but not added via repo
            const localBundles = await config.localConfigStorage.getById(asset.cid)
            if (localBundles.length === 0)
                throw new Error(`Could not resolve bundle for id:${asset.cid} name:${asset.name} try adding the repo`)
            bundles = localBundles
        }
        const localExists = await config.bundleStorage.local.diskProvider.exists(CID.parse(asset.cid))
        const globalExists = await config.bundleStorage.global.diskProvider.exists(CID.parse(asset.cid))
        // write to the build store if the option is not disabled 
        if (nobundleDir === false) {
            if (globalExists) await bundle.install(bundles[0], config.bundleStorage.global, packageStorage)
            if (localExists) await bundle.install(bundles[0], config.bundleStorage.local, packageStorage)
        }
        if (!global && localExists || global && globalExists){
            const progress = await progressBar(`Skipping install, found bundle: ${bundles[0].name}`)
                setTimeout(()=>progress.stop(), 1000)
            continue
        }
        const bundleStorage = global ? config.bundleStorage.global : config.bundleStorage.local
        const configStorage = global ? config.globalLocalConfigStorage : config.localConfigStorage

        const progress = await progressBar(`Installing bundle: ${bundles[0].name}`)
        await bundle.install(bundles[0], bundleFetcher(bundles[0].uri as string), bundleStorage)
        await progress.stop()
        //if you create a built bundles directory then write fetched bundles into the shared store
        if(nobundleDir === false) await bundle.install(bundles[0], bundleStorage, packageStorage)
        const path = await bundleStorage.path(CID.parse(bundles[0].id))
        await configStorage.add(path, [bundles[0]])
    }
    if(nobuild){
        console.log(`${chalk.magenta("Successful")} machine installed`)
        return 
    }
    await buildMachine(config, packageConfig)
    console.log(`${chalk.magenta("Successful")} machine installed`)
}

async function handleRm(config: Config, driveType: addMachineCommandType, label?:string) {

    let cfg = await getMachineConfig()
    let cid = "";

    switch (driveType) {
        case "flashdrive":
        if(label)
            cfg = rmPackageEntryByLabel(label, cfg) 
        else
            console.error("missing label, label required for flashdrive rm")
        break
        case "ram":
            cid = cfg.machineConfig.rom.cid
            cfg = rmPackageEntry({id: cid,bundleType: "ram"}, cfg)
            break
        case "rom":
            cid = cfg.machineConfig.rom.cid
            cfg = rmPackageEntry({id: cid,bundleType: "rom"}, cfg)
            break
    }

    return writeMachineConfig(cfg)
}

async function handleAdd(config: Config, name: string, options: clib.PackageEntryOptions, addType: addMachineCommandType, yes: boolean): Promise<void> {
    let bundles: Bundle[] = await config.localConfigStorage.get(name)
    bundles = bundles.concat(await config.globalLocalConfigStorage.get(name))
    let bundle = bundles[0];
    if (!yes && bundle) {
        const question = utils.pickBundle("Which bundle would you like to add to your cartesi machine build", bundles, renderBundle)
        const answer = await inquirer.prompt([question])
        const { id } = parseShortDesc(answer.bundle)
        bundle = bundles.filter((b) => b.id === id)[0]
    }
    let cfg = await getMachineConfig()
    // Note equivalent to lua config https://github.com/cartesi/machine-emulator/blob/master/src/cartesi-machine.lua#L638
    if(addType === "flashdrive"){
        if(bundle){
            const pth = await config.bundleStorage.path(CID.parse(bundle.id))
            const filePath = fs.pathExistsSync(pth.local!) ? pth.local : pth.global
            options.length = options.length || `0x${BigInt(fs.statSync(`${filePath}`).size).toString(16)}`
        }else {
            if(!options.length){
                throw new Error("Bundleless flash drive not allowed to not specify length")
            }
        }
    }
    // Note ram default size is 64 << 20 https://github.com/cartesi/machine-emulator/blob/master/src/cartesi-machine.lua#L209
    if(addType === "ram")
        options.length = options.length || `0x${(BigInt(64)<< BigInt(20)).toString(16)}`

    // NOTE we respect commandline ideal of what the bundleType should be so if you install something in
    // ram you can install the same data as a flash drive
    try{
        cfg = clib.updatePackageEntry(Object.assign({}, bundle, { bundleType: addType }), cfg, options)
    }catch(e){
        console.error(`Error: ${e.message}`)
        return
    }
    return writeMachineConfig(cfg)
}

async function handleBuild(config: Config, dir?: string, runscript?:string): Promise<void> {
    return buildMachine(config, await getMachineConfig(), dir, runscript)
}

async function handleBoot(config: Config, args: string, bootPrefix?: string): Promise<void> {
    let cfg = await getMachineConfig()
    cfg = setPackageBoot(cfg,args,bootPrefix) 
    return writeMachineConfig(cfg)
}

async function buildMachine(config: Config, cfg: machineConfigPackage.CartiPackage, dir?:string, runscript?:string): Promise<void> {
    const machineConfig = clib.createNewMachineConfig(cfg, dir || CARTI_DOCKER_PACKAGE_PATH)
    const luaConfig = generateLuaConfig(machineConfig, "return")
    const outputDir = cwd()
    await fs.writeFile(`${outputDir}/machine-config.lua`, luaConfig)
    if(runscript)
        await fs.copyFile(`${__dirname}/../../scripts/run-config.lua`, `${outputDir}/run-config.lua`)
}


async function runPackageBuild(packageDir: string) {
    const { uid, gid, username } = os.userInfo()
    const command = ["run",
        "-e",
        `USER=${username}`,
        "-e",
        `UID=${uid}`,
        "-e",
        `GID=${gid}`,
        "-v",
        `${packageDir}:/opt/carti/packages`,
        "cartesi/playground:0.1.1",
        "/bin/bash",
        "-c",
        //"cd /opt/cartesi/packages && echo $(ls -l)" ]
        "cd /opt/carti/packages && luapp5.3 run-config.lua machine-config && echo 'package built'"]
    console.log("docker " + command.join(" "))
    //TODO improve should stream output to stdout
    const result = spawnSync("docker", command)
    if (result.error || result.stderr.toString()) {
        console.error(result.stderr.toString())
        return;
    }
    console.log(result.stdout.toString())
    const storedMachinePath = `${packageDir}/cartesi-machine`
    if (fs.existsSync(`${process.cwd()}/stored_machine`))
        await rmAll(`${process.cwd()}/stored_machine`)

    //NOTE just renaming to keep path's consistent
    await fs.move(storedMachinePath, `${process.cwd()}/stored_machine`)
    await rmAll(storedMachinePath)
    const loadMachineCommand = `docker run -e USER=$(id -u -n) -e UID=$(id -u) -e GID=$(id -g) \\
-v $(pwd)/cartesi-machine:/opt/cartesi-machine \\
cartesi/playground cartesi-machine --load='/opt/cartesi-machine'`
    console.log(`Copy command to run stored machine:`)
    console.log(`${loadMachineCommand}`)
}
