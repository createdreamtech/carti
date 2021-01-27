import program from "commander";
import { makeLogger } from "../../lib/logging"
import { Bundle } from "@createdreamtech/carti-core"
import { Config } from "../../lib/config"
import { shortDesc } from "../../lib/bundle";
import { Listing } from "../../lib/storage/bundle_listing";


export const addListCommand = (config: Config): program.Command => {
    const machineCommand = program.command("list")
        .description("Lists installed bundles see --all for all bundles")
        .usage("list")
        .option("--all", "lists all bundles installed or retrievable")
        .action(async (options:any) => {
            return handleList(config,options.all)
        })
    return machineCommand
}


const renderBundle = (b: Bundle, uri: string): string => {
    const { bundleType, name, version, id } = b;
    return shortDesc({ bundleType, name, version, id, uri })
}

async function handleList(config: Config, all:boolean): Promise<void> {
    let localList = await config.localConfigStorage.listing();
    let globalList = await config.globalLocalConfigStorage.listing();
    let uninstalledList:Listing = {}; 
    if(all)
        uninstalledList = await config.globalConfigStorage.listing()
    const renderList = (list: Listing, uriType?: string): string[] => {
        let descs: string[] = []
        Object.keys(list).forEach((key: string) => {
            descs = descs.concat(list[key].map((b: Bundle) => renderBundle(b, uriType || b.uri || 'uninstalled')))
        })
        return descs
    }
    console.log(renderList(localList,'local')
        .concat(renderList(globalList, 'global'))
        .concat(renderList(uninstalledList)).join('\r\n'))
}
