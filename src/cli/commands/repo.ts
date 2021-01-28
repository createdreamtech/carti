import chalk from "chalk";
import program from "commander";
import { makeLogger } from "../../lib/logging"
import { Repo } from "../../lib/repo";
import { commandHandler } from "./command_util";

const logger = makeLogger("Repo Command")

export const addRepoCommand = (repo: Repo): program.Command => {
   const repoCommand = program.command("repo")
      .description("Manage carti package listing repo")

   repoCommand.command("add <src>")
      .description("add package listing repo")
      .action(async (src) => 
         commandHandler(() => {
            if (!src) throw new Error("could not add missing listing")
            return repo.add(src)
         })
      )

   repoCommand.command("list")
      .description("list current known package listing repos")
      .action(async () => 
         commandHandler(async () => {
          const list = await repo.list()
          list.forEach((r)=>{
               console.log(`${chalk.green(r)}`)
          })
         })
      )

   repoCommand.command("update [src]")
      .description("update all package listings or an individual package repo")
      .action((src) => commandHandler(() => repo.update(src)))

   repoCommand.command("rm <src>")
      .description("remove")
      .action(async (src) => commandHandler(()=>repo.rm(src)))
   return repoCommand
}