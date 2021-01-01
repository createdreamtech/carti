import { Bundle, BundleConfig, parseBundlesFile, writeBundlesFile } from "@createdreamtech/carti-lib"
import fs from "fs-extra"
import { loggers } from "winston";
export class BundleManager {
    bundlesFilePath:string
    constructor(dir: string){
        this.bundlesFilePath = `${dir}/bundles.json`;
        fs.ensureDirSync(dir)
        if(!fs.existsSync(this.bundlesFilePath)){
            fs.writeFileSync(this.bundlesFilePath,JSON.stringify({bundles:[]}))
        }
    }
    async addBundle(b: Bundle){
        const bundleConfig = await this.getBundles()
        if(bundleConfig.find((bundle)=>bundle.id === b.id) )
            return
        const bundles = bundleConfig.concat(b)
        return writeBundlesFile(this.bundlesFilePath, {bundles})
    }

    async rmBundle(b: Bundle){
        const bundleConfig = await this.getBundles()
        const bundles = bundleConfig.filter((bundle)=>bundle.id !== b.id)
        return writeBundlesFile(this.bundlesFilePath, {bundles})
    }

    async getBundles(): Promise<Bundle[]>{
        try {
            return await parseBundlesFile(fs.createReadStream(this.bundlesFilePath)) || []
        }catch(e){
            return []
        }
    }
}