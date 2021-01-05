import { Readable } from "stream"
import url from "url"
import { defaultGitFetcher } from "./git"
import { diskFetcher } from "./disk"
export { Fetcher } from "./fetcher"
import { DiskProvider, Storage } from "@createdreamtech/carti-core"
import { Fetcher, makeHttpFetcher } from "@createdreamtech/carti-core"
import path from "path"

export async function fetcher(uri: string, fileName: string): Promise<Readable> {
    const urlParts = url.parse(uri)
    if (urlParts.protocol === null)
        return diskFetcher(path.resolve(uri), fileName)
    return defaultGitFetcher(uri, fileName)
}
//TODO conceptual shift from path specified content to specific instance content i.e.
// fileName is respected vs content-hashed should be considered
// currently expect following format **/*/cid/filename , where **/* is the gateway
// for storage it basically expects you to refer to something in a carti_bundles
// folder on disk or to a remote package over http. This is subject to change
export function bundleFetcher(uri: string): Fetcher {
    const urlParts = url.parse(uri)
    if (urlParts.protocol === null){
        const parts = uri.split(path.sep)
        if(parts.length < 3){
            throw new Error("Disk bundle path format should be in **/*/cid/filename")
        }
        const basePath =parts.slice(0,-2).join(path.sep)
        return new Storage(new DiskProvider(basePath));
    }
    return makeHttpFetcher(uri)
}


