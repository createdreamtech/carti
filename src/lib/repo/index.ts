import { CartiConfigStorage } from "../storage"
import { Fetcher } from "../fetcher";
import { parseBundlesFile } from "@createdreamtech/carti-core"
import { makeLogger } from "../logging"
const logger = makeLogger("Repo")

const BUNDLES_NAME = "bundles.json"
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

    async add(path: string) {
        //TODO remove hardcoded reference
        // const bundles:Bundle[] = 
        const bundles = await this.resolveBundles(path)
        console.log("resolving bundles", bundles)
        return this.cgs.add(path, bundles)
    }

    async rm(path: string) {
        return this.cgs.rm(path)
    }
    async update(path?: string) {
        if (path)
            return this.add(path)
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