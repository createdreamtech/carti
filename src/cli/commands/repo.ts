import program, { commands } from "commander";
import { Repo } from "../../lib/repo";
import { CartiCommand } from "./commands";
type Commands = "add" | "rm" | "update"
interface RepoHandler {
   (command:Commands, source?:string): Promise<void>
}
export const addRepoCommand: CartiCommand = (handler: RepoHandler): program.Command =>{
   return program
   .command("repo <command> [src]") 
   .description("Manage carti packages repository")
   .addHelpCommand('add [src]', "adds a package repository listing")
   .addHelpCommand('rm [src]', "rm removes a package repository listing")
   .addHelpCommand('update', "updates all package repository listings")
   .addHelpCommand('update [src]', "updates the src package repository listing")
   .action(handler)
}

//TODO fix error handling
export const defaultRepoHandler = (repo: Repo): RepoHandler => {

   return async (command: Commands, source?: string) => {
      switch (command) {
         case "add":
            if (source)
               await repo.add(source)
            else {
               // TODO replace with logger
               console.error("total failure")
            }
            return
         case "update":
            await repo.update(source)
            return
         case "rm":
            if (source)
               await repo.rm(source)
      }
   }
}

