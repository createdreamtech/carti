import program, { commands } from "commander";
import { makeLogger } from "../../lib/logging"
import * as clib  from "@createdreamtech/carti-lib"
import { Bundle, Storage, bundle,  DiskProvider, S3Provider } from "@createdreamtech/carti-lib"
import {Config} from "../../lib/config"
import inquirer, {Question} from "inquirer"
import * as utils from "../util"
import path from "path";
import {shortDesc, parseShortDesc } from "../../lib/bundle";


export const addListCommand = (config: Config): program.Command => {
   const machineCommand = new program.Command("list")
      .description("Lists all the installed packages")
      .usage("list")
      .action(()=>{
          handleList(config)
      })
   return machineCommand 
}


const renderBundle = (b: Bundle): string => {
    const {bundleType, name, version, id} = b;
    return shortDesc({ bundleType, name, version, id , uri: "local"}) 
}

async function handleList(config: Config): Promise<void> {
    const list = await config.localConfigStorage.listing()
    let localBundleDescs: string[] = []
    Object.keys(list).forEach((key:string)=>{
        localBundleDescs = localBundleDescs.concat(list[key].map((b:Bundle)=>renderBundle(b)))
    })
    console.log(localBundleDescs.join("\r\n"))
}
