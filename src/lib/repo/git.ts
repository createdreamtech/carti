import {Octokit} from "@octokit/rest";

//const octokit = new Octokit();

/*

checkRepoExists()
getFileFromRepo()

*/

export class Repo {

    octokit:Octokit
    constructor(octokit: Octokit){
        this.octokit = octokit
    }
    getFile(uri: string){
        this.octokit.repos.getContent({
            owner:"createdreamtech",
            repo: "carti-lib",
            path: ".gitignore"
        })

    }

}