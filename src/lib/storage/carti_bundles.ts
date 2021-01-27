import * as cartiLib from "@createdreamtech/carti-core"
import { CID } from "multiformats";
export class CartiBundleStorage extends cartiLib.Storage {

    diskProvider: cartiLib.DiskProvider
    constructor(dir: string) {
        const diskProvider = new cartiLib.DiskProvider(dir)
        super(diskProvider)
        this.diskProvider = diskProvider
    }

    async path(cid: CID): Promise<string> {
        return this.diskProvider.path(cid)
    }
}
export interface BundlePath {
    local?: string
    global?: string
}
export class CartiBundleStorageSystem {
    
    global: CartiBundleStorage
    local: CartiBundleStorage

    constructor(global: CartiBundleStorage, local: CartiBundleStorage){
        this.global = global
        this.local = local 
    }

    async path(cid: CID, ): Promise<BundlePath> {
        const local = await this.local.path(cid)
        const global = await this.global.path(cid)
        return {
            local,
            global
        }
    }
}