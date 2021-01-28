import { Bundle } from "@createdreamtech/carti-core"
import { ListQuestion } from "inquirer"
export interface BundleRenderer {
    (b: Bundle): string
}
export const defaultBundleRenderer = (b: Bundle) => {
    return `${b.name} type:${b.bundleType} version:${b.version} uri:${b.uri}`
}
export function pickBundle(message: string, bundles: Array<Bundle>, renderer: BundleRenderer): ListQuestion {
    if(bundles.length === 0){
        throw new Error(`Could not find matching bundles`)
    }
    const choices = bundles.map(renderer)
    return {
        name: "bundle",
        message,
        type: "list",
        choices,
    }

}