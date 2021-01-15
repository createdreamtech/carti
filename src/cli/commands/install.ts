import { Bundle } from "@createdreamtech/carti-core";
import program from "commander";
import { parseShortDesc, shortDesc } from "../../lib/bundle";
import { Config } from "../../lib/config";
import inquirer from "inquirer";
import * as utils from "../util";
import { bundle } from "@createdreamtech/carti-core";
import { bundleFetcher } from "../../lib/fetcher";
import { CID } from "multiformats";

export const addInstallCommand = (config: Config): program.Command => {
   return program
   .command("install <name>") 
   .description("Install a bundle locally")
   .option("-y, --yes", "choose match without prompt")
       .action(async (name, options) => {
       return handleInstall(config,name, options.yes) as any
   })
}

const renderBundle = (b: Bundle): string => {
    const {bundleType, name, version, id, uri} = b;
    return shortDesc({ bundleType, name, version, id , uri}) 
}

export async function handleInstall(config: Config, name:string, first:boolean): Promise<Bundle> {
    const bundles = await config.globalConfigStorage.get(name)
    let bun = bundles[0]
    if (!first) {
        const question = utils.pickBundle("Which bundle would you like to install", bundles, renderBundle)
        const answer = await inquirer.prompt([question])
        const { id } = parseShortDesc(answer.bundle)
        bun = bundles.filter((b) => b.id === id)[0]
    }
    await bundle.install(bun,bundleFetcher(bun.uri as string), config.bundleStorage)
    const path = await config.bundleStorage.path(CID.parse(bun.id))
    await config.localConfigStorage.add(path, [bun])
    return bun
}