import { Bundle } from "@createdreamtech/carti-core";
import program from "commander";
import { parseShortDesc, shortDesc } from "../../lib/bundle";
import { Config } from "../../lib/config";
import inquirer from "inquirer";
import * as utils from "../util";
import { bundle } from "@createdreamtech/carti-core";
import { bundleFetcher } from "../../lib/fetcher";
import { CID } from "multiformats";
import { commandHandler } from "./command_util";



export const addInstallCommand = (config: Config): program.Command => {
   return program
   .command("install <name>") 
   .description("Install a bundle locally")
   .option("-y, --yes", "choose match without prompt")
   .option("-g, --global", "install bundle to global storage")
       .action(async (name, options) => {
       return commandHandler(handleInstall,config,name, options.yes, options.global) as any
   })
}

const renderBundle = (b: Bundle): string => {
    const {bundleType, name, version, id, uri} = b;
    return shortDesc({ bundleType, name, version, id , uri}) 
}

export async function handleInstall(config: Config, name:string, first:boolean, global?:boolean): Promise<Bundle> {
    const bundles = await config.globalConfigStorage.get(name)
    let bun = bundles[0]

    if (!first) {
        const question = utils.pickBundle("Which bundle would you like to install", bundles, renderBundle)
        //NOTE RXJS used internally by inquirer breaks try/catch
        const answer = await inquirer.prompt([question])
        const { id } = parseShortDesc(answer.bundle)
        bun = bundles.filter((b) => b.id === id)[0]
    }
    const bundleStorage = global ? config.bundleStorage.global : config.bundleStorage.local
    const configStorage = global ? config.globalLocalConfigStorage : config.localConfigStorage
    await bundle.install(bun,bundleFetcher(bun.uri as string), bundleStorage)
    const path = await bundleStorage.path(CID.parse(bun.id))
    await configStorage.add(path, [bun])
    return bun
}