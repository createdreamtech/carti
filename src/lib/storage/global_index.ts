import { Bundle } from "@createdreamtech/carti-core"
import { Listing } from './bundle_listing'

interface Index {
    [k: string]: Bundle[]
}
interface OriginIndex {
    [k: string]: string[]
}

interface Indices {
    name: Index,
    id: Index,
    origin: OriginIndex,
}
type IndexType = keyof Indices
// GlobalIndex is never used directly the context is restricted for use within the Storage context,
// this allows us to have trust that the index is setup prior to usage 
export class GlobalIndex {

    indices: Indices = {
        name: {} as Index,
        id: {} as Index,
        origin: {} as OriginIndex,
    }
    getList: () => Promise<Listing>
    listCache!: Listing;
    constructor(list: () => Promise<Listing>) {
        this.getList = list
    }

    //TODO quite a bit inefficient 
    async updateIndex() {
        this.listCache = await this.getList()
        this.buildIndex(this.listCache)
    }


    async getPackageByName(name: string): Promise<Array<Bundle>> {
        return this.getBundles("name", name)
    }

    async getPackageById(id: string): Promise<Array<Bundle>> {
        return this.getBundles("id", id)
    }

    async getOrigin(id: string) : Promise<Array<string>> {
        return this.get("origin", id) as Promise<string[]>
    }

    private buildIndex(list: Listing) {
        Object.keys(this.indices).forEach((field) => {
            Object.keys(list).forEach((k) => {
                const value = list[k]
                value.forEach((b) => {
                    const f = field as IndexType
                    if (f !== "origin") {
                        this.indices[f][b[f]] = this.indices[f][b[f]] || []
                        this.indices[f][b[f]].push(b)
                    }else{
                        this.indices[f][b.id]=this.indices[f][b.id] || []
                        this.indices[f][b.id].push(k)
                    }
                })
            })
        })
    }

    private async getBundles(field: "name" | "id", value: string): Promise<Bundle[]> {
        return this.get(field, value) as Promise<Bundle[]>
    }

    private async get(field: IndexType, value: string){
        if (this.indices[field].hasOwnProperty(value))
            return this.indices[field][value];
        return []
    }
}
