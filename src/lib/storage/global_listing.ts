import type {Bundle} from "@createdreamtech/carti-lib"
import fs, { writeJSON } from 'fs-extra'

const GLOBAL_PACKAGE_LISTING=".carti_packages.json";
const defaultPackage = {};
export interface Listing {
  [key:string]: Bundle[]
}
/*
    GlobalListing is the representaiton of the package location data retrieved from various package
    repositories. It is used to resolve the where to retrieve packages from and can be added also be
    added to from the local file path and is not restricted to a uri
*/
export class GlobalListing {

    dir:string
    packageListingPath: string
    constructor(dir:string){
        this.dir = dir
        this.packageListingPath = `${dir}/${GLOBAL_PACKAGE_LISTING}`;
        //TODO check that the listing file itself is correct
        fs.ensureDirSync(dir) 
        if(fs.existsSync(this.packageListingPath) === false){
            fs.writeJSONSync(this.packageListingPath, defaultPackage)
        }    
    }
    // used to add package listings from a particular origin
    async add(path:string, bundle: Bundle[]){
        const listing:Listing = await fs.readJSON(this.packageListingPath)
        listing[path] = bundle
        return fs.writeJSON(this.packageListingPath, listing)
    }

    // used to rm package listings from a particular origin
    async rm(path: string) {
        const listing:Listing = await fs.readJSON(this.packageListingPath)
        delete listing[path]
        return fs.writeJSON(this.packageListingPath, listing)
    }

    async getListing(): Promise<Listing> {
        return fs.readJSON(this.packageListingPath) as Promise<Listing>
    }
}