import process from "process"
import os from "os"
import { CartiConfigStorage } from "../storage"
import { CartiBundleStorage } from "../storage/carti_bundles"
import { Repo } from "../repo"
import { fetcher } from "../fetcher";
import { pack, S3Provider } from "@createdreamtech/carti-core"
import { BundleManager } from "../bundle"
import fs from "fs-extra";
import { CartiPackage, PackageMachineConfig, Ram, Rom, FlashDrive } from "@createdreamtech/carti-core/build/src/generated/machine_config_pkg_schema"
import ajv from "ajv"

export interface Config {
    localConfigStorage: CartiConfigStorage 
    globalConfigStorage: CartiConfigStorage 
    bundleStorage: CartiBundleStorage
    bundleListingManager: BundleManager
    repo: Repo
}
const cartesiMachinePath = `${process.cwd()}/cartesi-machine-package.json`
const bundlesPath = `${process.cwd()}/carti_bundles`
const bundleListingFilename = ".carti_bundles.json"
const globalBundleListingPath = `${os.homedir()}/.carti`
const localBundleListingPath =`${bundlesPath}/.carti`
const bundlesJsonPath = `${process.cwd()}`

const localConfigStorage = new CartiConfigStorage(localBundleListingPath, bundleListingFilename)
const globalConfigStorage = new CartiConfigStorage(globalBundleListingPath, bundleListingFilename)
const bundleStorage = new CartiBundleStorage(bundlesPath)
const repo = new Repo(globalConfigStorage,fetcher) 
const bundleListingManager = new BundleManager(bundlesJsonPath)

export const config:Config = {
    localConfigStorage,
    globalConfigStorage,
    bundleStorage,
    bundleListingManager,
    repo
}
const defaultRom: Rom = {
   cid: "default-rom",
   bootargs: "console=hvc0 rootfstype=ext2 root=/dev/mtdblock0 rw quiet mtdparts=flash.0:-(root)",
   resolvedPath: "/opt/cartesi/share/images/rom.bin"
}
const defaultRam : Ram ={
    cid: "default-ram",
    length: "0x4000000",
    resolvedPath: "/opt/cartesi/share/images/linux.bin"
}
const defaultFlash: FlashDrive = [
    {
        cid: "default-flash",
        length: "0x3c00000",
        start: "0x8000000000000000",
        shared: false,
        resolvedPath:"/opt/cartesi/share/images/rootfs.ext2"
    }
]
export async function initMachineConfig(): Promise<void> {
    const packageCfg = { assets: [], machineConfig: { flash_drive: defaultFlash, ram: defaultRam, rom: defaultRom }, version: "0.0.0-development", }
    if(fs.existsSync(cartesiMachinePath)){
        console.warn("Machine has already been init")
        return 
    }
   return writeMachineConfig(packageCfg) 
}
// NOTE this actually returns a machine config if it exists it 
// might be partially specified and invalid so no need to validate here
export async function getMachineConfig(): Promise<CartiPackage>{
    try{
        const configFile = await fs.readFile(cartesiMachinePath)
        return JSON.parse(configFile.toString())
    }catch(e){
        return { assets: [], machineConfig: { flash_drive: defaultFlash, ram: defaultRam, rom: defaultRom}, version: "", }
    }
}


export async function writeMachineConfig(pkgConfig: CartiPackage) : Promise<void>{
    return fs.writeFile(cartesiMachinePath, JSON.stringify(pkgConfig,null,2))
}
/*
export interface CartiPackage {
    machineConfig: PackageMachineConfig;
    assets: Assets;
    version: Version;
    metadata?: Metadata;
    [k: string]: any;
  }
  */