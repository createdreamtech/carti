import process from "process"
import os from "os"
import { CartiConfigStorage } from "../storage"
import { CartiBundleStorage, CartiBundleStorageSystem } from "../storage/carti_bundles"
import { Repo } from "../repo"
import { fetcher } from "../fetcher";
import { BundleManager } from "../bundle"
import fs from "fs-extra";
import { CartiPackage, Ram, Rom, Boot, FlashDrive } from "@createdreamtech/carti-core/build/src/generated/machine_config_pkg_schema"

export interface Config {
    localConfigStorage: CartiConfigStorage
    // globalLocalConfigStorage is configuration storage for bundles installed into the global path
    // it differs from globalConfigStorage, as it is used to resolve remote dependencies off disk
    // these can be unified, but could be more difficult to resolve. making this separate preserves the semantics 
    globalLocalConfigStorage: CartiConfigStorage
    globalConfigStorage: CartiConfigStorage
    bundleStorage: CartiBundleStorageSystem
    bundleListingManager: BundleManager
    repo: Repo
}
export const CARTI_DOCKER_PACKAGE_PATH ="/opt/carti/packages"
export const CARTI_BUILD_PATH = `${process.cwd()}/carti_build`
export const CARTI_BUILD_BUNDLES_PATH = `${CARTI_BUILD_PATH}/bundles`

const cartesiMachinePath = `${process.cwd()}/carti-machine-package.json`
const bundlesPath = `${process.cwd()}/carti_bundles`
const globalBundlesPath = `${os.homedir()}/.carti/carti_bundles`
const bundleListingFilename = ".bundles_index.json"
const globalBundleListingPath = `${os.homedir()}/.carti`
const globalLocalBundleListingPath = `${os.homedir()}/.carti/carti_bundles/.carti-disk`
const localBundleListingPath = `${bundlesPath}/.carti`
const bundlesJsonPath = `${process.cwd()}`

// builds an index to keep track of how to resolve things that are installed locally 
const localConfigStorage = new CartiConfigStorage(localBundleListingPath, bundleListingFilename)
// builds an index to keep track of how to resolve things that are installed globally
const globalLocalConfigStorage = new CartiConfigStorage(globalLocalBundleListingPath, bundleListingFilename)

// builds an index to keep track of how to resolve things that are not installed but remote 
const globalConfigStorage = new CartiConfigStorage(globalBundleListingPath, bundleListingFilename)
const bundleStorage = new CartiBundleStorageSystem(
    new CartiBundleStorage(globalBundlesPath),
    new CartiBundleStorage(bundlesPath)) 
const repo = new Repo(globalConfigStorage, fetcher)
const bundleListingManager = new BundleManager(bundlesJsonPath)

export const config: Config = {
    localConfigStorage,
    globalLocalConfigStorage,
    globalConfigStorage,
    bundleStorage,
    bundleListingManager,
    repo
}
const defaultRom: Rom = {
    cid: "default-rom",
    resolvedPath: "/opt/cartesi/share/images/rom.bin"
}
const defaultBoot: Boot = {
    args: "ls",
}
const defaultRam: Ram = {
    cid: "default-ram",
    length: "0x4000000",
    resolvedPath: "/opt/cartesi/share/images/linux.bin"
}
const defaultFlash: FlashDrive = [
    {
        label: "root",
        cid: "default-flash",
        length: "0x3c00000",
        start: "0x8000000000000000",
        shared: false,
        resolvedPath: "/opt/cartesi/share/images/rootfs.ext2"
    }
]
export async function initMachineConfig(): Promise<void> {
    const packageCfg = { assets: [], machineConfig: { flash_drive: defaultFlash, ram: defaultRam, rom: defaultRom, boot: defaultBoot }, version: "0.0.0-development", }
    const exists = await fs.pathExists(cartesiMachinePath)
    if (exists) {
        console.warn("Machine has already been init")
        return
    }
    return writeMachineConfig(packageCfg)
}
// NOTE this actually returns a machine config if it exists it 
// might be partially specified and invalid so no need to validate here
export async function getMachineConfig(): Promise<CartiPackage> {
    try {
        const configFile = await fs.readFile(cartesiMachinePath)
        return JSON.parse(configFile.toString())
    } catch (e) {
        return { assets: [], machineConfig: { flash_drive: defaultFlash, ram: defaultRam, rom: defaultRom, boot: defaultBoot }, version: "", }
    }
}

export async function writeMachineConfig(pkgConfig: CartiPackage): Promise<void> {
    return fs.writeFile(cartesiMachinePath, JSON.stringify(pkgConfig, null, 2))
}
