import { Octokit } from "@octokit/rest"
import { Fetcher } from "./fetcher"
import url from "url";
import { Readable } from "stream";
export const defaultGitFetcher = gitFetcher()
export function gitFetcher(): Fetcher {
    const octokit = new Octokit()
    return async (uri: string, path: string) => {
        const urlParts = url.parse(uri)
        if (urlParts.path === null)
            throw Error(`could not fetch path ${path}`)

        let [, owner, repo] = urlParts.path.split("/")

        // TODO add support for alternate git urls
        const result = await octokit.repos.getContent({
            //     baseUrl: `${urlParts.protocol}//${urlParts.hostname!}`,
            owner,
            repo,
            path
        })
        //@ts-ignore
        const name = result.data.name;
        //@ts-ignore
        const content = result.data.content
        const decodedContent = Buffer.from(content, 'base64');
        const str = new Readable();
        str.push(decodedContent)
        str.push(null)
        return str
    }

}