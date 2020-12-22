import fs from "fs-extra"
import { BundleListing } from "./bundle_listing";
import { GlobalIndex } from "./global_index";
import { Bundle } from "@createdreamtech/carti-lib";

/* CartiGlobalStorage provides storage for ~/.carti/
includes master indices for resolving packages and updating package entries
*/
export class CartiConfigStorage {

    globalListing: BundleListing
    globalIndex: GlobalIndex
    private initIndex: boolean
    constructor(dir: string, listingFileName: string){
        this.globalListing = new BundleListing(dir, listingFileName)
        this.globalIndex = new GlobalIndex(() => this.globalListing.getListing())
        this.initIndex = false
        
    }



    async get(name: string): Promise<Array<Bundle>>{
        if(!this.initIndex)
            await this.globalIndex.updateIndex()

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
