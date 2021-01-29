import type { Bundle } from "@createdreamtech/carti-core"
import fs from 'fs-extra'
import { makeLogger } from "../logging";

export const GLOBAL_PACKAGE_LISTING = ".bundles_index.json";
const defaultPackage = {};
const logger = makeLogger("GlobalListing")
export interface Listing {
    [key: string]: Bundle[]
}
/*
    GlobalListing is the representaiton of the package location data retrieved from various package
    repositories. It is used to resolve the where to retrieve packages from and can be added also be
    added to from the local file path and is not restricted to a uri
*/

export class BundleListing {

    dir: string
    packageListingPath: string
    constructor(dir: string, fileName: string) {
        this.dir = dir
        this.packageListingPath = `${dir}/${GLOBAL_PACKAGE_LISTING}`;

    }

    exists(){
        return fs.existsSync(this.dir) && fs.existsSync(this.packageListingPath)
    }

    ensureExists(){
        //TODO check that the listing file itself is correct
        if(this.exists() === false){
            fs.ensureDirSync(this.dir)
            fs.writeJSONSync(this.packageListingPath, defaultPackage)
        }
    }
    // used to add package listings from a particular origin
    async add(path: string, bundle: Bundle[]) {
        await this.ensureExists()
        const listing: Listing = await fs.readJSON(this.packageListingPath)
        listing[path] = bundle
        return fs.writeFile(this.packageListingPath, JSON.stringify(listing, null, 2))
    }

    async has(path: string): Promise<boolean> {
        const listing: Listing = await fs.readJSON(this.packageListingPath)
        return listing.hasOwnProperty(path)
    }

    // used to rm package listings from a particular origin
    async rm(path: string) {
        if(this.exists() === false) return 
        const listing: Listing = await fs.readJSON(this.packageListingPath)
        delete listing[path]
        return fs.writeFile(this.packageListingPath, JSON.stringify(listing, null, 2))
    }

    async getListing(): Promise<Listing> {
        if(this.exists()) return fs.readJSON(this.packageListingPath) as Promise<Listing>
        return {} 
    }
}