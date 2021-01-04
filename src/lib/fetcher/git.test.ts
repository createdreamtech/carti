import { gitFetcher } from "./git"
import * as utils from "../utils"
describe("fetching tests", () => {

    it("should retrieve package metadata", async () => {
        const fetcher = gitFetcher()
        const result = await fetcher("https://github.com/createdreamtech/carti-example-packages", "bundles.json")
        console.log(JSON.parse(await utils.fromStreamToStr(result)))
    })

})