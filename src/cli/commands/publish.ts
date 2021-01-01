import program, { commands } from "commander";
import { makeLogger } from "../../lib/logging"
import * as clib  from "@createdreamtech/carti-lib"
import { Bundle, Storage, bundle,  DiskProvider, S3Provider } from "@createdreamtech/carti-lib"
import {Config} from "../../lib/config"
import inquirer, {Question} from "inquirer"
import * as utils from "../util"
import path from "path";
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
   publishCommand.command("s3 <bundle> <bucket> <uri>")
      .description("add bundle to s3 listing repo bundle ")
      .usage("s3 bundleName bucketName publicURI")
      .option("--nosave", "don't add to bundles.json")
      .requiredOption("--bucket", "Name of the s3 bucket to upload to")
      .action((bundle, bucket, uri, options)=>{
          handlePublish(config, bundle, new Storage(new S3Provider(bucket)), uri)
      })
   publishCommand.command("disk <src> <path>")
      .description("Publish file to disk storage for testing")
      .option("--nosave", "don't add to bundles.json")
      .action((src, pth, options)=>{
          const absPath =path.resolve(pth)
          handlePublish(config, src, new Storage(new DiskProvider(absPath)), absPath)
      })
   return publishCommand
}


const renderBundle = (b: Bundle): string => {
    const {bundleType, name, version, id} = b;
    return shortDesc({ bundleType, name, version, id , uri: "local"}) 
}

async function handlePublish(config: Config, name:string, storage: Storage, uri?:string): Promise<void> {
    const bundles: Bundle[] = await config.localConfigStorage.get(name)
    const question = utils.pickBundle("Which bundle would you like to publish", bundles, renderBundle)
    const answer = await inquirer.prompt([question])
    const {id} = parseShortDesc(answer.bundle)
    const bundle = bundles.filter((b) => b.id === id)[0]
    const uploadBundle = Object.assign({}, bundle, { path: bundle.uri as string, uri }) 
    if(!uri)
        delete uploadBundle.uri
    const bun = await clib.bundle.bundle(uploadBundle as bundle.BundleMeta, storage)
    bun.uri = uri
    config.bundleListingManager.addBundle(bun)
}