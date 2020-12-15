import fs from "fs-extra"
import { GlobalListing } from "./global_listing";
import { GlobalIndex } from "./global_index";
import { Bundle } from "@createdreamtech/carti-lib";

/*GLOBAL PACKAGE INDEX is an index that takes .bundles.json and inlines it into a flat file
this is written in the format 
{
    ...
    path_including_branch_specifier_if_necessary: {
        bundles:[{
            name:
            version:
        }]
        commit?: string
    }
    ...
}
*/
const GLOBAL_PACKAGE_INDEX=".carti_index";
/* CartiGlobalStorage provides storage for ~/.carti/
includes master indices for resolving packages and updating package entries
*/
export class CartiGlobalStorage {

    globalListing: GlobalListing
    globalIndex: GlobalIndex
    constructor(dir: string){
        this.globalListing = new GlobalListing(dir)
        this.globalIndex = new GlobalIndex(() => this.globalListing.getListing())
    }

    async get(name: string): Promise<Array<Bundle>>{
        return this.globalIndex.getPackageByName(name)
    }

    async getById(id: string): Promise<Array<Bundle>> {
        return this.globalIndex.getPackageByName(name)
    }

    async add(path:string, bundles: Bundle[]){
        await this.globalListing.add(path, bundles)
        return this.globalIndex.updateIndex()
    }

    async rm(path:string){
        await this.globalListing.rm(path)
        return this.globalIndex.updateIndex()
    }
    async listing(){
        return this.globalListing.getListing()
    }

}
/*

   const cgs = new CartiGlobalStorage(dir)
    
    const repo = new Repo(cgs, fetcher);
    repo.add("path"){
        Array<Bundles> bundles = fetcher.get(path)
        return cgs.add(path,bundles)
    }
    repo.rm("path") {
        cgs.rm(path)
    }
    repo.update("path") {
        Array<Bundles> bundles = fetcher.get(path)
        cgs.add(path, bundles)
    }
    repo.updateAll {
        const listing = cgs.getListing()
        const pendingRepos = []
        const pendingPaths = []
        for(const entry of Object.keys(listing)){
            pendingRepos.push(fetcher.get(path))
            pendingPaths.push(path)
        }
        const results = await Promise.allSettled(pendingRepos)
        for (const [index,entry] of array.entries()){
            if(entry.status === "fulfilled")
                cgs.add(pendingPaths[index], entry.value)
        }
    }

    storage.get


*/