import  program from "commander" 
export interface CartiCommand {
    (x: (...y:any) => Promise<void>): program.Command
}