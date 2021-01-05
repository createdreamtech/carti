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
