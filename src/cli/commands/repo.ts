import program from "commander";
import { Repo } from "../../lib/repo/git";
import { CartiCommand } from "./commands";
type Commands = "add" | "rm" | "update"
export const addRepoCommand: CartiCommand = (handler: (command:Commands, source:string)=>Promise<void>): program.Command =>{
   return program
   .command("repo <command> [src]") 
   .description("Manage carti packages repository")
   .action(handler)
}

