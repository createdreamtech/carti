import {Bundle} from "@createdreamtech/carti-lib"
import {Listing} from './global_listing'

interface Index {
    [k:string]: Bundle[]
}

interface Indices {
    name: Index,
    id: Index,
}
type IndexType = keyof Indices

export class GlobalIndex {

    indices: Indices = {
        name: {} as Index,
        id: {} as Index
    }
    getList: ()=>Promise<Listing>
    constructor(list:()=>Promise<Listing>){
        this.getList = list
    }

    //TODO quite a bit inefficient 
    async updateIndex(){
        const list = await this.getList()
        this.buildIndex(list)
    }


    async getPackageByName(name: string): Promise<Array<Bundle>>{
        return this.get("name", name)
    }

    async getPackageById(name: string): Promise<Array<Bundle>>{
        return this.get("name", name)
    }

    
    private buildIndex(list: Listing){
        Object.keys(this.indices).forEach((field)=>{
            Object.keys(list).forEach((k) => {
                const value = list[k]
                value.forEach((b) => {
                    const f = field as IndexType
                    this.indices[f][b[f]] = this.indices[f][b[f]] || []
                    this.indices[f][b[f]].push(b)
                })
            })
        })

    }
    private async get(field:IndexType, value:string){
        if(this.indices[field].hasOwnProperty(value))
            return this.indices[field][value];
        return []
    }
    

}

/*
const globalListing = new GlobalListing("~/.carti")
 
  new GlobalListing()
  new GlobalIndex(() => globalListing.getListing())
  CartiGlobalStorage(new GlobalListing , new globalIndex)

*/