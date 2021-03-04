import { spawnSync, spawn } from "child_process"
import { Readable } from "stream";

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

export async function testCommand(cmd: TestCommand, env: TestEnv, local: boolean) {

    let [command, ...args] = cmd.command;
    if(local){
        command = "node"
        args = [`${process.cwd()}/build/src/cli/index.js`].concat(args)
    }
    const { check } = cmd;
    return new Promise((resolve, reject) => {
        const child = spawn(command, args,  {...env, stdio: 'pipe'})
        const stderrOutput = []
        const stdOutput = []

        const outputHandler = async (std: Readable, check: (...x: any) => boolean) => {
            const output: Uint8Array[] = []
            return new Promise((resolve, reject) => {
                let result = false;
                std.on("data", (datum) => {
                    output.push(datum)
                })
                std.on("end", () => {
                    result = check(Buffer.concat(output).toString('utf8'))
                })
                std.on("close", ()=>{
                    resolve(result)
                })
            })
        }
        const prom = outputHandler(child.stdout, check);
        child.on("close", async (code: number, signal: NodeJS.Signals) => {
            if (code === 1) {
                reject(new Error(`${JSON.stringify(cmd)} failure with ${JSON.stringify(env)}`))
            }
        })
        child.on("exit", async ()=>{
            resolve (await prom)
        })

        if(env.input) {
            child.stdin.write(env.input);
            child.stdin.end();
        }
    })
}

export function shellCommand(cmd:string, env:TestEnv){
    const [command, ...args] = cmd.split(" ");
    return spawnSync(command, args, env)
}
