import  program from "commander" 
export interface CartiCommand {
    (x: () => Promise<void>): program.Command
}