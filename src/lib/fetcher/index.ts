import { Readable } from "stream"
import url from "url"
import { defaultGitFetcher } from "./git"
import { diskFetcher } from "./disk"
export { Fetcher } from "./fetcher"
import { DiskProvider, Storage } from "@createdreamtech/carti-core"
import { Fetcher, makeHttpFetcher } from "@createdreamtech/carti-core"

export async function fetcher(uri: string, fileName: string): Promise<Readable> {
    const urlParts = url.parse(uri)
    if (urlParts.protocol === null)
        return diskFetcher(uri, fileName)
    return defaultGitFetcher(uri, fileName)
}
//TODO conceptual shift from path specified content to specific instance content i.e.
// fileName is respected vs content-hashed should be considered
export function bundleFetcher(uri: string): Fetcher {
    const urlParts = url.parse(uri)
    if (urlParts.protocol === null)
        return new Storage(new DiskProvider(uri));
    return makeHttpFetcher(uri)
}


