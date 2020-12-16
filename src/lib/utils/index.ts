import {Readable} from "stream"
export function fromStreamToStr(strm: Readable): Promise<string>{
    return new Promise((resolve)=>{
        const chunks: any = []
        strm.on("data", (chunk) => {
            chunks.push(chunk)
        })
        strm.on('end', () => {
            const result = Buffer.concat(chunks).toString('utf-8')
            resolve(result)
        })
    })
}