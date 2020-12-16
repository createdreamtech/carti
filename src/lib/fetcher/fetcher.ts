import { Readable } from "stream";

export interface Fetcher {
    (uri: string, fileName:string):Promise<Readable>
}