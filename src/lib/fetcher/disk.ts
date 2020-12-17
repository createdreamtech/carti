import fs from "fs-extra"
import { Readable } from "stream"
export async function diskFetcher(basePath: string, fileName: string): Promise<Readable> {
    return fs.createReadStream(`${basePath}/${fileName}`)
}