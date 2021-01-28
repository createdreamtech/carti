import process from "process"
import os from "os"
import { CartiConfigStorage } from "../storage"
import { CartiBundleStorage, CartiBundleStorageSystem } from "../storage/carti_bundles"
import { Repo } from "../repo"
import { fetcher } from "../fetcher";
import { BundleManager } from "../bundle"
import fs from "fs-extra";
import { CartiPackage, Ram, Rom, Boot, FlashDrive, Repos } from "@createdreamtech/carti-core/build/src/generated/machine_config_pkg_schema"
import chalk from "chalk"

export interface Config {
    localConfigStorage: CartiConfigStorage
    // globalLocalConfigStorage is configuration storage for bundles installed into the global path
    // it differs from globalConfigStorage, as it is used to resolve remote dependencies off disk
    // these can be unified, but could be more difficult to resolve. making this separate preserves the semantics 
    globalLocalConfigStorage: CartiConfigStorage
    globalConfigStorage: CartiConfigStorage
    bundleStorage: CartiBundleStorageSystem
    bundleListingManager: BundleManager
    repo: Repo
}
export const CARTI_DOCKER_PACKAGE_PATH ="/opt/carti/packages"
export const CARTI_BUILD_PATH = `${process.cwd()}/carti_build`
export const CARTI_BUILD_BUNDLES_PATH = `${CARTI_BUILD_PATH}/bundles`

const cartesiMachinePath = `${process.cwd()}/carti-machine-package.json`
const bundlesPath = `${process.cwd()}/carti_bundles`
const globalBundlesPath = `${os.homedir()}/.carti/carti_bundles`
const bundleListingFilename = ".bundles_index.json"
const globalBundleListingPath = `${os.homedir()}/.carti`
const globalLocalBundleListingPath = `${os.homedir()}/.carti/carti_bundles/.carti-disk`
const localBundleListingPath = `${bundlesPath}/.carti`
const bundlesJsonPath = `${process.cwd()}`

export function haveYouInstalledDefaultRepo(always:boolean = false){
    const message = `Don't forget to add the default repo!`
    const command1 = `${chalk.green("carti repo add https://github.com/createdreamtech/carti-default")}`
    const message2 = `For super ease add the defaults to global`
    const command2 = `${chalk.green("carti machine install -g https://raw.githubusercontent.com/createdreamtech/carti-default/main/carti-machine-package.json --nobundle --nobuild")}`

    if(always || fs.pathExistsSync(`${os.homedir()}/.carti`) === false){
        console.log("\n\n")
        console.log(message)
        console.log(command1)
        console.log(message2)
        console.log(command2)
        console.log("\n\n")
    }
    
}

// builds an index to keep track of how to resolve things that are installed locally 
const localConfigStorage = new CartiConfigStorage(localBundleListingPath, bundleListingFilename)
// builds an index to keep track of how to resolve things that are installed globally
const globalLocalConfigStorage = new CartiConfigStorage(globalLocalBundleListingPath, bundleListingFilename)

// builds an index to keep track of how to resolve things that are not installed but remote 
const globalConfigStorage = new CartiConfigStorage(globalBundleListingPath, bundleListingFilename)
const bundleStorage = new CartiBundleStorageSystem(
    new CartiBundleStorage(globalBundlesPath),
    new CartiBundleStorage(bundlesPath)) 
const repo = new Repo(globalConfigStorage, fetcher)
const bundleListingManager = new BundleManager(bundlesJsonPath)

export const config: Config = {
    localConfigStorage,
    globalLocalConfigStorage,
    globalConfigStorage,
    bundleStorage,
    bundleListingManager,
    repo
}
const defaultRepos: Repos = [
    "https://github.com/createdreamtech/carti-default"
]
const defaultRom: Rom = {
    cid: "baenrwigwdfweve3apyvwicc2zpmzz6vdhsg62xnmzhauruw6ud4dbbafuq"
}
const defaultBoot: Boot = {
    args: "ls",
}
const defaultRam: Ram = {
    cid: "baenrwia5vqqvdu5chzjqq57tfo45z2txorpnmljeiuwemcibba43noqpvu",
    length: "0x4000000"
}
const defaultFlash: FlashDrive = [
    {
        cid: "baenrwig2hfjzzeqmozb7sws6tyxmyazvuipjp5hxamtllifsokwh73eucy",
        start: "0x8000000000000000",
        label: "root",
        length: "0x3c00000",
        shared: false
    }
]
const defaultAssets = [
    {
        "cid": "baenrwigwdfweve3apyvwicc2zpmzz6vdhsg62xnmzhauruw6ud4dbbafuq",
        "name": "default-rom",
        "fileName": "rom.bin"
      },
      {
        "cid": "baenrwia5vqqvdu5chzjqq57tfo45z2txorpnmljeiuwemcibba43noqpvu",
        "name": "default-ram",
        "fileName": "linux-5.5.19-ctsi-2.bin"
      },
      {
        "cid": "baenrwig2hfjzzeqmozb7sws6tyxmyazvuipjp5hxamtllifsokwh73eucy",
        "name": "default-root",
        "fileName": "rootfs.ext2"
      }
]
export async function initMachineConfig(): Promise<void> {
    const packageCfg = { assets: defaultAssets, 
        machineConfig: { 
            flash_drive: defaultFlash, 
            ram: defaultRam, 
            rom: defaultRom, 
            boot: defaultBoot 
        }, 
        version: "0.0.0-development", 
        repos: defaultRepos
    }

    const exists = await fs.pathExists(cartesiMachinePath)
    if (exists) {
        console.warn("Machine has already been init")
        return
    }
    return writeMachineConfig(packageCfg)
}
// NOTE this actually returns a machine config if it exists it 
// might be partially specified and invalid so no need to validate here
export async function getMachineConfig(): Promise<CartiPackage> {
    try {
        const configFile = await fs.readFile(cartesiMachinePath)
        return JSON.parse(configFile.toString())
    } catch (e) {
        return { assets: [], machineConfig: { flash_drive: defaultFlash, ram: defaultRam, rom: defaultRom, boot: defaultBoot }, version: "", }
    }
}

export async function writeMachineConfig(pkgConfig: CartiPackage): Promise<void> {
    return fs.writeFile(cartesiMachinePath, JSON.stringify(pkgConfig, null, 2))
}
