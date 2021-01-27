import program from "commander";
import { makeLogger } from "../../lib/logging"
import { Bundle } from "@createdreamtech/carti-core"
import { Config } from "../../lib/config"
import { CID } from "multiformats";
import chalk from "chalk";
import { handleInstall } from "./install"


export const addGetCommand = (config: Config): program.Command => {
    const machineCommand = program.command("get <name>")
        .description("get installs bundle if not local and returns bundle location information")
        .usage("get <name>")
        .option("-y, --yes", "choose first match")
        .option("-p, --path", "only return path information")
        .option("-g, --global", "install bundle into global location")
        .action(async (name, options) => {
            return handleGet(config, name, options.yes, options.path, options.global)
        })
    return machineCommand
}


const renderBundle = (b: Bundle, path:string): string => {
    const { name, version, id } = b;
    return `${name}:${id}:${version}:${chalk.green(path)}`
}

async function handleGet(config: Config, name:string, yes:boolean, pathOnly: boolean, global?: boolean): Promise<void> {
    let bundles = await config.localConfigStorage.get(name)
    bundles = bundles.concat(await config.globalLocalConfigStorage.get(name))
    let bun = bundles[0]
    const render = async (b:Bundle) =>{
        const bundleId = CID.parse(b.id)
        const lExists = await config.bundleStorage.local.diskProvider.exists(bundleId)
        const bPath = await config.bundleStorage.path(bundleId)
        const path = lExists? bPath.local! : bPath.global! 
        if(pathOnly){
            console.log(path)
            return
        }
        console.log(renderBundle(b,path!))
    }
    if(bundles.length === 0){
        bun = await handleInstall(config, name, yes, global)
        render(bun)
        return
    }
    if(yes)
        return render(bun)

    for (const bun of bundles){
        await render(bun)
    }
}
