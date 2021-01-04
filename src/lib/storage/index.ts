import { BundleListing } from "./bundle_listing";
import { GlobalIndex } from "./global_index";
import { Bundle } from "@createdreamtech/carti-core";

/* CartiGlobalStorage provides storage for ~/.carti/
includes master indices for resolving packages and updating package entries
*/
export class CartiConfigStorage {

    globalListing: BundleListing
    globalIndex: GlobalIndex
    private initializedIndex: boolean
    constructor(dir: string, listingFileName: string) {
        this.globalListing = new BundleListing(dir, listingFileName)
        this.globalIndex = new GlobalIndex(() => this.globalListing.getListing())
        this.initializedIndex = false

    }

    async setIndex() {
        if (this.initializedIndex === false) {
            await this.globalIndex.updateIndex()
            this.initializedIndex = true
        }
    }

    async get(name: string): Promise<Array<Bundle>> {
        await this.setIndex()
        return this.globalIndex.getPackageByName(name)
    }

    async getById(id: string): Promise<Array<Bundle>> {
        await this.setIndex()
        return this.globalIndex.getPackageById(id)
    }

    async add(path: string, bundles: Bundle[]) {
        await this.globalListing.add(path, bundles)
        return this.globalIndex.updateIndex()
    }

    async rm(path: string) {
        await this.globalListing.rm(path)
        return this.globalIndex.updateIndex()
    }
    async listing() {
        return this.globalListing.getListing()
    }

}
