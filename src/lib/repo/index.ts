import { Bundle } from "@createdreamtech/carti-lib";
import {CartiGlobalStorage} from "../storage"
import url from "url"
import { Readable } from "stream";
import { Fetcher } from "../fetcher";
import { parseBundlesFile } from "@createdreamtech/carti-lib"
import {makeLogger} from "../logging"
import * as utils from "../utils"
const logger = makeLogger("Repo")

const BUNDLES_NAME=".bundles.json"
export class Repo {

    cgs: CartiGlobalStorage 
    fetcher:Fetcher
    constructor(cgs: CartiGlobalStorage, fetcher: Fetcher){
        this.cgs = cgs;
        this.fetcher = fetcher;
    }
    async resolveBundles(path: string){
        const content = await this.fetcher(path, BUNDLES_NAME)
        return parseBundlesFile(content)
    }

    async add(path: string){
        //TODO remove hardcoded reference
       // const bundles:Bundle[] = 
        const bundles = await this.resolveBundles(path)
        return this.cgs.add(path,bundles)
    }

    async rm(path: string) {
        return this.cgs.rm(path)
    } 
    async update(path?:string){
        if(path)
            return this.add(path)
        return this.updateAll()
    }

    async updateAll(){
        const listing = this.cgs.listing()
        const pendingRepos = []
        const pendingPaths = []
        for(const entry of Object.keys(listing)){
            
            pendingRepos.push(await this.resolveBundles(entry))
            pendingPaths.push(entry)
        }
        const results = await Promise.allSettled(pendingRepos)
        for (const index in results){
            const entry = results[index]
            if(entry.status === "fulfilled")
                this.cgs.add(pendingPaths[index], entry.value)
        }
    }
}