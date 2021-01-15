import { CartiConfigStorage } from "../storage"
import { Fetcher } from "../fetcher";
import { parseBundlesFile } from "@createdreamtech/carti-core"
import { makeLogger } from "../logging"
import url from "url"
import path from "path"
const logger = makeLogger("Repo")

const BUNDLES_NAME = "bundles.json"

const resolveURI = (uri?: string) => {
  if(!uri){
      return undefined
  }
  const {protocol} = url.parse(uri)
  if(protocol)
    return uri 

  return path.resolve(uri)
}

export class Repo {

    cgs: CartiConfigStorage
    fetcher: Fetcher
    constructor(cgs: CartiConfigStorage, fetcher: Fetcher) {
        this.cgs = cgs;
        this.fetcher = fetcher;
    }
    async resolveBundles(path: string) {
        const content = await this.fetcher(path, BUNDLES_NAME)
        return parseBundlesFile(content)
    }

    async add(uri: string) {
        //TODO remove hardcoded reference
        // const bundles:Bundle[] = 
        const ur = resolveURI(uri)
        if(ur === undefined){
            console.error("could not add uri to repo")
            return
        }
        const bundles = await this.resolveBundles(ur)
        return this.cgs.add(ur, bundles)
    }

    async rm(uri: string) {
        const ur = resolveURI(uri)
        if(ur) 
            return this.cgs.rm(ur)
    }
    async update(uri?: string) {
        const ur = resolveURI(uri)
        if (ur)
            return this.add(ur)
        return this.updateAll()
    }

    async updateAll() {
        const listing = this.cgs.listing()
        const pendingRepos = []
        const pendingPaths = []
        for (const entry of Object.keys(listing)) {

            pendingRepos.push(await this.resolveBundles(entry))
            pendingPaths.push(entry)
        }
        const results = await Promise.allSettled(pendingRepos)
        for (const index in results) {
            const entry = results[index]
            if (entry.status === "fulfilled")
                this.cgs.add(pendingPaths[index], entry.value)
        }
    }
}