import { Bundle, parseBundlesFile, writeBundlesFile } from "@createdreamtech/carti-core"
import fs from "fs-extra"

export class BundleManager {
    bundlesFilePath: string
    constructor(dir: string) {
        this.bundlesFilePath = `${dir}/bundles.json`;
    }
    async addBundle(b: Bundle) {
        const bundleConfig = await this.getBundles()
        if (bundleConfig.find((bundle) => bundle.id === b.id))
            return
        const bundles = bundleConfig.concat(b)
        return writeBundlesFile(this.bundlesFilePath, { bundles })
    }

    async rmBundle(b: Bundle) {
        const bundleConfig = await this.getBundles()
        const bundles = bundleConfig.filter((bundle) => bundle.id !== b.id)
        return writeBundlesFile(this.bundlesFilePath, { bundles })
    }

    async getBundles(): Promise<Bundle[]> {
        try {
            const bundles = await parseBundlesFile(fs.createReadStream(this.bundlesFilePath))
            return bundles || []
        } catch (e) {
            return []
        }
    }
}