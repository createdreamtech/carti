import program from "commander";
import { makeLogger } from "../../lib/logging"
import * as cartiLib from "@createdreamtech/carti-lib"
import path from "path";
import process from "process"

const bundler = cartiLib.bundle

const logger = makeLogger("Bundle Command")
/*
carti bundle --type rom --name foobar --desc "a simple foobar package"
*/
type BundleType = "ram" | "rom" | "flashdrive" 
const BUNDLES_DIR= "carti_bundles"
import os from "os"


interface BundleCommand {
    type: BundleType
    name: string
    desc: string
    version: string
}
const handleBundleCommand = async(bundlePath: string, bundle: BundleCommand)=>{
    const {name, type ,desc,version} = bundle;
    const storage = new cartiLib.Storage(new cartiLib.DiskProvider(`${process.cwd()}/${BUNDLES_DIR}`))
    console.log(path.resolve(bundlePath))
    const bun = await bundler.bundle({
          bundleType:type,
          name,
          path: path.resolve(bundlePath),
          version,
      }, storage) 
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