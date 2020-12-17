import program from "commander";
interface FetchCommand {
    name: string
}
export const fetchCommand = (handler: (c: FetchCommand)=>Promise<void>): program.Command => {
   return program
   .command("fetch <name>") 
   .description("Retrieve a carti bundle from a repo")
   .action(handler)
}

