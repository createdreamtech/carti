import { Readable } from "stream"
import url from "url"
import { gitFetcher, defaultGitFetcher } from "./git"
import { diskFetcher } from "./disk"
export {Fetcher} from "./fetcher"

export async function fetcher(uri: string , fileName: string): Promise<Readable>{
    const urlParts = url.parse(uri)
    if(urlParts.protocol === null)
        return diskFetcher(uri, fileName)
    return defaultGitFetcher(uri, fileName)
}

