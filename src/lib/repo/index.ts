import { Bundle } from "@createdreamtech/carti-lib";
import {CartiGlobalStorage} from "../storage"
export class Repo {

    cgs: CartiGlobalStorage 
    fetcher:any
    constructor(cgs: CartiGlobalStorage, fetcher: any/*Fetcher*/){
        this.cgs = cgs;
        this.fetcher = fetcher;
    }

    async add(path: string){
        const bundles:Bundle[] = await this.fetcher.get(path)
        return this.cgs.add(path,bundles)
    }

    async rm(path: string) {
        return this.cgs.rm(path)
    } 
    async update(path?:string){
        if(path)
            return this.add(path)
        return this.updateAll()
    }

    async updateAll(){
        const listing = this.cgs.listing()
        const pendingRepos = []
        const pendingPaths = []
        for(const entry of Object.keys(listing)){
            pendingRepos.push(this.fetcher.get(entry))
            pendingPaths.push(entry)
        }
        const results = await Promise.allSettled(pendingRepos)
        for (const index in results){
            const entry = results[index]
            if(entry.status === "fulfilled")
                this.cgs.add(pendingPaths[index], entry.value)
        }
    }
}