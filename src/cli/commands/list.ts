import program from "commander";
import { makeLogger } from "../../lib/logging"
import { Bundle } from "@createdreamtech/carti-core"
import { Config } from "../../lib/config"
import { shortDesc } from "../../lib/bundle";


export const addListCommand = (config: Config): program.Command => {
    const machineCommand = program.command("list")
        .description("Lists all the installed packages")
        .usage("list")
        .action(async () => {
            return handleList(config)
        })
    return machineCommand
}


const renderBundle = (b: Bundle): string => {
    const { bundleType, name, version, id } = b;
    return shortDesc({ bundleType, name, version, id, uri: "local" })
}

async function handleList(config: Config): Promise<void> {
    const list = await config.localConfigStorage.listing()
    let localBundleDescs: string[] = []
    Object.keys(list).forEach((key: string) => {
        localBundleDescs = localBundleDescs.concat(list[key].map((b: Bundle) => renderBundle(b)))
    })
    console.log(localBundleDescs.join("\r\n"))
}
