import {BundleListing } from "./bundle_listing";
import fs from "fs-extra";
import path from "path";
import os from "os";
import { Bundle } from "@createdreamtech/carti-core";
import _ from "lodash"
import {expect} from "chai"
describe("global listing ~/.carti.json", ()=>{

    const mockBundle: Bundle = {
        bundleType: "ram",
        fileName:"testFile.ext2",
        id:"1234",
        name:"mock-sql",
        version:"1.0.0",
        deps:[],
        uri: "https://github.com/some/examplepath"
    }

    it("should crud from a listing file in specified dir", async ()=>{
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp-carti-p'))
        const globalListing = new BundleListing(dir, "test-listing.json")
        expect(fs.readdirSync(dir)[0]=== "test-listing.json")
        await globalListing.add("http://fakeBundle", [mockBundle])
        let listing = await globalListing.getListing()
        console.log(listing)
        expect(_.isEqual(listing["http://fakeBundle"], [mockBundle])).true
        await globalListing.rm("http://fakeBundle")
        listing = await globalListing.getListing()
        expect(_.isEqual(listing,{})).true
        
    })

})