import { spawnSync } from "child_process"
import { stderr, stdin } from "process";
import { ReadStream } from "tty";

export interface TestCommand {
    command:Array<string>
    check: (...x: any)=> boolean
}
export function createTestCommand(cmd: string, check: (...x: any) => boolean): TestCommand{
    const command = cmd.split(" ")
    return { command, check }    
}
export interface TestEnv {
    cwd: string 
    env: { [key: string]: any }
    input?: string | Buffer | DataView 
}

export function testCommand(cmd: TestCommand, env:TestEnv){
    const [command, ...args] = cmd.command;
    const res = spawnSync(command, args, env)
    
    if(res.error){
        console.error(stderr.toString())
        throw  res.error 
    }
    return cmd.check(res)
}

export function shellCommand(cmd:string, env:TestEnv){
    const [command, ...args] = cmd.split(" ");
    return spawnSync(command, args, env)
}

// createTestCommand("machine init")
/*

 command = createTestCommand("machine blargh foobar", (output) =>{

 })
 it("should add blarghy to blop", ()=>{
    [ addPackage,
      removePackage,

 })
 testCommand(command) 
 itestCommand()


*/