import program from "commander";
interface InstallCommand {
    name: string
}
export const fetchCommand = (handler: (c: any)=>Promise<void>): program.Command => {
   return program
   .command("fetch <name>") 
   .description("Retrieve a carti bundle from a repo")
   .action(handler)
}

