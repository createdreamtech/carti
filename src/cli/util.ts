import { Bundle } from "@createdreamtech/carti-lib"
import inquirer, { ListQuestion } from "inquirer"
export interface BundleRenderer {
    (b: Bundle): string
}
export const defaultBundleRenderer = (b: Bundle)=>{
    return `${b.name} type:${b.bundleType} version:${b.version} uri:${b.uri}`
}
export function pickBundle(message: string, bundles: Array<Bundle>, renderer: BundleRenderer): ListQuestion {
    const choices = bundles.map(renderer)
    return {
        name: "bundle",
        message,
        type: "list",
        choices,
    }

}