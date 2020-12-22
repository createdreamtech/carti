import program, { commands } from "commander";
import { makeLogger } from "../../lib/logging"
import * as clib  from "@createdreamtech/carti-lib"
import { Bundle, Storage, bundle,  DiskProvider } from "@createdreamtech/carti-lib"
import {Config} from "../../lib/config"
import inquirer, {Question} from "inquirer"
import * as utils from "../util"
import {shortDesc, parseShortDesc } from "../../lib/bundle";

interface PublishOptions {
    nosave?: boolean;
}

const logger = makeLogger("Publish Command")

export const publishCommand = (handler: (c: any)=>Promise<void>): program.Command => {
   return program
   .command("publish") 
   .option("-t, --type", "type s3| (disk for development purposes) for publishing package data")
   .description("Publish local package pushing data to storage allocation")
   .action(handler)
}
export const addPublishCommand = (config: Config): program.Command => {
   const publishCommand = new program.Command("publish")
      .description("Publish carti bundle to permanent storage")
   publishCommand.command("s3 <src> <uri>")
      .description("add bundle to s3 listing repo")
      .option("--nosave", "don't add to .bundles.json")
      .action((src, uri)=>{
          handlePublish(config, src, new Storage(new DiskProvider("/tmp")))
      })
   publishCommand.command("disk <src> <path>")
      .description("Publish file to disk storage for testing")
      .option("--nosave", "don't add to .bundles.json")
      .action((src, path, options)=>{
          handlePublish(config, src, new Storage(new DiskProvider(path)))
      })
   return publishCommand
}

const publishQuestions: Question[] = [
    {
        type: "list",
        name: "bundle",
        message: "Which bundle would you like to publish?"
    }
]
const renderBundle = (b: Bundle): string => {
    const {bundleType, name, version, id} = b;
    return shortDesc({ bundleType, name, version, id , uri: "local"}) 
}

async function handlePublish(config: Config, name:string, storage: Storage): Promise<void> {
    const bundles: Bundle[] = await config.localConfigStorage.get(name)
    console.log(bundles)
    const question = utils.pickBundle("Which bundle would you like to publish", bundles, renderBundle)
    const answer = await inquirer.prompt([question])
    const {id} = parseShortDesc(answer.bundle)
    const bundle = bundles.filter((b) => b.id === id)[0]
    const uploadBundle = Object.assign({}, bundle, { path: bundle.uri as string }) 
    delete uploadBundle.uri
    console.log(uploadBundle)
    clib.bundle.bundle(uploadBundle as bundle.BundleMeta, storage)
}