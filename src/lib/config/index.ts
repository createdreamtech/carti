import process from "process"
import os from "os"
import { CartiConfigStorage } from "../storage"
import { CartiBundleStorage } from "../storage/carti_bundles"

export interface Config {
    localConfigStorage: CartiConfigStorage 
    globalConfigStorage: CartiConfigStorage 
    bundleStorage: CartiBundleStorage
}
const bundlesPath = `${process.cwd()}/carti_bundles`
const bundleListingFilename = ".carti_bundles.json"
const globalBundleListingPath = `${os.homedir()}/.carti`
const localBundleListingPath =`${bundlesPath}/.carti`

const localConfigStorage = new CartiConfigStorage(localBundleListingPath, bundleListingFilename)
const globalConfigStorage = new CartiConfigStorage(globalBundleListingPath, bundleListingFilename)
const bundleStorage = new CartiBundleStorage(bundlesPath)

export const config:Config = {
    localConfigStorage,
    globalConfigStorage,
    bundleStorage
}