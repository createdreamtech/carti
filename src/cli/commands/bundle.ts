import program from "commander";
import { makeLogger } from "../../lib/logging"
import * as cartiLib from "@createdreamtech/carti-core"
import path, { basename } from "path";
import { CID } from "multiformats"
import { config } from "../../lib/config"
import fs from "fs-extra";
import os from "os";
import { https } from "follow-redirects"
import { progressBar } from "./command_util";

const bundler = cartiLib.bundle
const logger = makeLogger("Bundle Command")

type BundleType = "ram" | "rom" | "flashdrive"

interface BundleCommand {
    type: BundleType
    name: string
    desc: string
    version: string
    filename?: string
    global?: boolean
}

const isFilePath = (filePath: string): boolean => {
    return fs.pathExistsSync(path.resolve(filePath))
}

const downloadAsset = async (uri: string, fileName?: string): Promise<string> => {
    const pt = await fs.mkdtemp(`${os.tmpdir()}/carti-tmp`)

    const parseFilename = (contentDisposition?: string): string | null => {
        if (!contentDisposition)
            return ""
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        return match ? match[1] : ""
    }
    return new Promise((resolve, reject) => {

        let downloadFile!: fs.WriteStream;
        let fullPath: string;
        https.get(uri, async (response) => {

            /*if (response.statusCode === 302) {
                fullPath = await downloadAsset(response.headers['location'] as string, fileName);
            }*/
           if (response.statusCode! >= 400) {
                reject(new Error(`Failed to get '${uri}' (${response.statusCode})`));
                return;

            }
            
            
            response.headers['']
            const f = fileName || parseFilename(response.headers['content-disposition'])
            if (f === "") {
                throw new Error("please set a filename could not parse filename from uri")
            }
            fullPath = `${pt}/${f}`
            downloadFile = fs.createWriteStream(fullPath);
            downloadFile.on('finish', () => resolve(fullPath));

        /*    request.on('error', err => {
                fs.unlink(fullPath, () => reject(err));
            });
            */

            downloadFile.on('error', err => {
                fs.unlink(fullPath, () => reject(err));
            });

            response.pipe(downloadFile);

        });

    });
}

const handleBundleCommand = async (bundleUri: string, bundle: BundleCommand) => {
    const { name, type, desc, version, filename } = bundle;
    const { bundleStorage, localConfigStorage, globalLocalConfigStorage } = config
    let bundlePath = bundleUri
    let shouldClean = false;
    if (isFilePath(bundleUri) === false) {
        bundlePath = await downloadAsset(bundleUri, filename)
        shouldClean = true;
    }
    const configStorage = bundle.global ? globalLocalConfigStorage : localConfigStorage
    const bStorage = bundle.global ? bundleStorage.global : bundleStorage.local
    const progress =await progressBar("Bundling package")
    const bun = await bundler.bundle({
        bundleType: type,
        name,
        fileName: path.basename(bundlePath),
        path: path.resolve(bundlePath),
        version,
    }, bStorage)
    if(shouldClean){
        await fs.remove(bundlePath)
    }
    const bPath = await bStorage.path(CID.parse(bun.id))
    const bundles = [Object.assign({}, bun, { uri: bPath })]
    await configStorage.add(bPath, bundles)
    progress.stop()
    console.log(`bundled: ${name} as ${bun.id}`)
}

export const addBundleCommand = (): program.Command => {
    return program.command("bundle <src>")
        .description("Bundle data for a cartesi machine src is a url payload or filepath")
        .storeOptionsAsProperties(false)
        .passCommandToAction(false)
        .requiredOption("-t, --type <type>", "input type of data ram|rom|flashdrive")
        .requiredOption("-n, --name <name>", "name of the bundle")
        .requiredOption("-v, --version <version>", "version of the bundle")
        .requiredOption("-d, --desc <desc>", "description of the bundle")
        .option("-f, --filename [name]", "optional filename of the bundle, used to override any default")
        // NOTE global is supported but will not be implemented yet because it helps to have boundaries
        // to reduce complexity of what's publishable, this also makes almost everything global released
        // "aka not a development bundle"
        //.option("-g, --global", "bundle into the global storage path")
        .action(handleBundleCommand)
}