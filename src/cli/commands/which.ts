import program from "commander";
import { makeLogger } from "../../lib/logging"
import { Bundle } from "@createdreamtech/carti-core"
import { Config } from "../../lib/config"
import { CID } from "multiformats";
import chalk from "chalk";
import { CartiBundleStorage } from "../../lib/storage/carti_bundles";


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
    let localBundles = await config.localConfigStorage.get(name)
    let globalBundles = await config.globalLocalConfigStorage.get(name)
    const showBundles = async (bundles: Bundle[], storage: CartiBundleStorage) => {
        for (const bun of bundles) {
            const path = await storage.path(CID.parse(bun.id))
            console.log(renderBundle(bun, path))
        }
    }
    await showBundles(localBundles, config.bundleStorage.local)
    await showBundles(globalBundles, config.bundleStorage.global)
    return
}
