import fs from "fs-extra"
import { Readable } from "stream"
export async function diskFetcher(basePath: string, fileName: string): Promise<Readable> {
    console.log(`${basePath}/${fileName}`)
    return fs.createReadStream(`${basePath}/${fileName}`)
}