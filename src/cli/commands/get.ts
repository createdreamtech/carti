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
        .action(async (name, options) => {
            return handleGet(config, name, options.yes, options.path)
        })
    return machineCommand
}


const renderBundle = (b: Bundle, path:string): string => {
    const { name, version, id } = b;
    return `${name}:${id}:${version}:${chalk.green(path)}`
}

async function handleGet(config: Config, name:string, yes:boolean, pathOnly: boolean): Promise<void> {
    let bundles = await config.localConfigStorage.get(name)
    let bun = bundles[0]
    const render = async (b:Bundle) =>{
        const path = await config.bundleStorage.path(CID.parse(b.id))
        if(pathOnly){
            console.log(path)
            return
        }
        console.log(renderBundle(b,path))
    }
    if(bundles.length === 0){
        bun = await handleInstall(config,name,yes)
        render(bun)
        return
    }
    if(yes)
        return render(bun)

    for (const bun of bundles){
        await render(bun)
    }
}
