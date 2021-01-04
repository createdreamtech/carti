import program from "commander";
import { makeLogger } from "../../lib/logging"
import * as cartiLib from "@createdreamtech/carti-core"
import path, { basename } from "path";
import { CID } from "multiformats"
import { config } from "../../lib/config"

const bundler = cartiLib.bundle
const logger = makeLogger("Bundle Command")

type BundleType = "ram" | "rom" | "flashdrive"

interface BundleCommand {
    type: BundleType
    name: string
    desc: string
    version: string
}

const handleBundleCommand = async (bundlePath: string, bundle: BundleCommand) => {
    const { name, type, desc, version } = bundle;
    const { bundleStorage, localConfigStorage } = config
    const bun = await bundler.bundle({
        bundleType: type,
        name,
        fileName: path.basename(bundlePath),
        path: path.resolve(bundlePath),
        version,
    }, bundleStorage)
    const bPath = await bundleStorage.path(CID.parse(bun.id))
    const bundles = [Object.assign({}, bun, { uri: bPath })]
    await localConfigStorage.add(bPath, bundles)
    console.log(`bundled: ${name} as ${bun.id}`)
}

export const addBundleCommand = (): program.Command => {
    return program.command("bundle <path>")
        .description("Bundle data for a cartesi machine")
        .storeOptionsAsProperties(false)
        .passCommandToAction(false)
        .requiredOption("-t, --type <type>", "input type of data raw|ram|rom|flashdrive")
        .requiredOption("-n, --name <name>", "name of the bundle")
        .requiredOption("-v, --version <version>", "version of the bundle")
        .requiredOption("-d, --desc <desc>", "description of the bundle")
        .action(handleBundleCommand)
}