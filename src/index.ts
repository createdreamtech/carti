import { report } from "process";
import { defaultRepoHandler } from "./cli/commands/repo";
import { makeLogger } from "./lib/logging";
import { Repo } from "./lib/repo";
import { CartiGlobalStorage } from "./lib/storage";
import {fetcher} from "./lib/fetcher"
export { getLogStream } from "./lib/logging";

interface Config{
    repo: Repo,
    cgs: CartiGlobalStorage,
}

export const startCarti = (): Config => {
    const cgs = new CartiGlobalStorage("~/.carti")
    const repo = new Repo(cgs, fetcher)
    return {cgs, repo}
};



/*

type URI = string
type Path = string
.addCommandRepo()
//Repo {
     file
     constructor(bundleRetriever: fileRetriever, globalStorage){

     }
    //string or uri
    add(path:URI | Path)
    try {
    const data = this.fileRetriever(path)
    }catch(e){
        logger.error(`could not retreive file`, e)
    }
    await globalStorage.addPackage(bundle)
    
}
// globalStorage

addPackage(bundle:Bundle) {
   
   globalIndex.rebuild() 
}


const dir = PackageListing(dir)
inMemoryIndex = GlobalIndex()
package(){
    readPackageJSON
    const mem = Object.assign({},packages, bundle)
    writePackageJSON()
}

fileRetriever(path) => PackageBundler

if(isGit(path)){
    

const fetchFileFromGit(path)
}else {
 fetchFileFromDisk(path)
}
parse and return bundled file

//add
fetch the .bundles file from the repo or disk
parse .bundles file 
read the existing global package data
if exists
    load list into memory 
    write an entry into the global package data object
else
    write an entry int othe global package data object
write to disk
signal update on bus/channel




*/