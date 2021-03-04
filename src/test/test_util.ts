import { spawnSync, spawn } from "child_process"
import { Readable } from "stream"
import fs from "fs-extra"
import os from "os"
const version = require("../../package.json").version; // tslint:disable-line

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

export interface CartiTestLocations {
    LOCAL_BASE_TEST_DIR: string
    LOCAL_TEST_HOME: string
    LOCAL_TEST_PROJECT_DIR: string
    REMOTE_BASE_TEST_DIR: string
    REMOTE_TEST_HOME: string
    REMOTE_TEST_PROJECT_DIR: string
} 

export const createCartiTestLocations = (): CartiTestLocations => {
    const LOCAL_BASE_TEST_DIR = fs.mkdtempSync(`${os.tmpdir()}/test-carti`)
    const LOCAL_TEST_HOME = LOCAL_BASE_TEST_DIR
    const LOCAL_TEST_PROJECT_DIR = `${LOCAL_BASE_TEST_DIR}/local-project`

    const REMOTE_BASE_TEST_DIR = fs.mkdtempSync(`${os.tmpdir()}/test-carti`)
    const REMOTE_TEST_HOME = REMOTE_BASE_TEST_DIR
    const REMOTE_TEST_PROJECT_DIR = `${REMOTE_BASE_TEST_DIR}/remote-project`
    return {
        LOCAL_BASE_TEST_DIR,
        LOCAL_TEST_PROJECT_DIR,
        LOCAL_TEST_HOME,
        REMOTE_BASE_TEST_DIR,
        REMOTE_TEST_HOME,
        REMOTE_TEST_PROJECT_DIR
    }
}
export interface TestEnvironments {
    remoteTestEnvironment: TestEnv
    localTestEnvironment: TestEnv
}

export const cartiCmd = (pth: string) => `${pth}/node_modules/.bin/carti`

export function isLocalScript(){
    return process.env["CARTI_TEST_LOCAL"] ? true : false;
}

export const createTestEnvironments = (locations: CartiTestLocations): TestEnvironments =>{

    const localTestEnvironment = createTestEnvironment(locations.LOCAL_TEST_PROJECT_DIR, 
        locations.LOCAL_TEST_HOME, 
        isLocalScript())
    const remoteTestEnvironment = createTestEnvironment(locations.REMOTE_TEST_PROJECT_DIR, 
        locations.REMOTE_TEST_HOME, 
        isLocalScript())
        return {
            localTestEnvironment,
            remoteTestEnvironment
        }
}

// Takes project directory to build, test home directory, and then if local specified it sets the 
// node_path to be the cwd for testing purposes
export const createTestEnvironment = (projectDir: string, testHome: string, local: boolean): TestEnv => {
    fs.ensureDirSync(projectDir)
    let env: any = { HOME: testHome, PATH: process.env.PATH }
    if (local)
        env["NODE_PATH"] = `${process.cwd()}/node_modules`
    return {
        cwd: projectDir,
        env
    }
}
export const installTestCarti = async (env: TestEnv) => {
    // setup environment to install itself in a clean dir
    // set a static package directory to skip npm pack
    if (!isLocalScript()) {
        spawnSync("npm", ["pack"])
        const cartiNodePackage = `createdreamtech-carti-${version}.tgz`
        fs.copyFileSync(`${process.cwd()}/${cartiNodePackage}`, `${env.cwd}/${cartiNodePackage}`)
        spawnSync("npm", ["init", "-y"], { cwd: env.cwd })
        const res = spawnSync("npm", ["install", `${env.cwd}/${cartiNodePackage}`], { cwd: env.cwd })
        if (res.error)
            console.error(res.error)
    }
    fs.copyFileSync(`${__dirname}/../fixtures/dapp-test-data.ext2`, `${env.cwd}/dapp-test-data.ext2`)
    const helpCommand = createTestCommand(`${cartiCmd(env.cwd)} --help`, contains("help"))
    await testCommand(helpCommand, env, isLocalScript())
}

export const contains = (phrase: string) => {
    return (res: string): boolean => {
        return res.match(phrase) !== null
    }
}