import program from "commander";
import { makeLogger } from "../../lib/logging"
import { Bundle } from "@createdreamtech/carti-core"
import { Config } from "../../lib/config"
import { CID } from "multiformats";
import chalk from "chalk";


export const addWhichCommand = (config: Config): program.Command => {
    const machineCommand = program.command("which <name>")
        .description("Which resolves where a package is located")
        .usage("which <name>")
        .action(async (name) => {
            return handleWhich(config,name)
        })
    return machineCommand
}


const renderBundle = (b: Bundle, path:string): string => {
    const { name, version, id } = b;
    return `${name}:${id}:${version}:${chalk.green(path)}`
}

async function handleWhich(config: Config, name:string): Promise<void> {
    const bundles = await config.localConfigStorage.get(name)
    for (const bun of bundles){
        const path =  await config.bundleStorage.path(CID.parse(bun.id))
        console.log(renderBundle(bun,path))
    }
}
