import { gitFetcher } from "./git"
import * as utils from "../utils"
describe("fetching tests", () => {
    // TODO make a mock for github integration
    it.skip("should retrieve package metadata", async () => {
        const fetcher = gitFetcher()
        //TODO replace integration test with mock
        const result = await fetcher("https://github.com/createdreamtech/carti-example-packages", "bundles.json")
        console.log(JSON.parse(await utils.fromStreamToStr(result)))
    })

})