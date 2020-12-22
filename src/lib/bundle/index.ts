import { Bundle } from "@createdreamtech/carti-lib"
import { flatMap } from "lodash"
//TODO fix typing here should be of type BundleType
interface ShortBundle {
    id: string,
    name: string,
    version:string,
    uri: string,
    bundleType: string
}
export function shortDesc(b: ShortBundle) {
   return `@${b.bundleType}/${b.name}:${b.version}:${b.id}:${b.uri}`
}

export function parseShortDesc(shortDesc:string): ShortBundle {
    const entries = shortDesc.split(":")
    let [bundleType, name] = entries[0].split("/")
    bundleType = bundleType.substring(1)
    const version = entries[1]
    const id = entries[2]
    const uri = entries[3]
    return {
        uri,
        id,
        version,
        bundleType,
        name
    }
}