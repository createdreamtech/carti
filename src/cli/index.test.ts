import * as testUtil from "../test/test_util"
import fs, { readJSON, readJSONSync } from "fs-extra"
import rimraf from "rimraf"
import { promisify } from "util"

const rmAll = promisify(rimraf)

const locations = testUtil.createCartiTestLocations()
const { localTestEnvironment, remoteTestEnvironment } = testUtil.createTestEnvironments(locations) 

const CARTI_TEST_LOCAL = process.env["CARTI_TEST_LOCAL"] ? true : false;
const cartiCmd = (pth: string) => `${pth}/node_modules/.bin/carti`

const testBundleCmdArgs = (dir: string) => {
    return `${cartiCmd(dir)} bundle -t flashdrive -n dapp-test-data -v 1.0.0 -d hello_world_flash_drive dapp-test-data.ext2`
}

const testBundleCommand = (dir: string) => {
    return testUtil.createTestCommand(testBundleCmdArgs(dir), (output: string) => {
        return testUtil.contains("bundled: dapp-test-data")(output);
    })
}

const testBundleInstallArgs = (dir: string, bundleName: string) => {
    return `${cartiCmd(dir)} install ${bundleName}`
}

const testBundleInstallCommand = (dir: string, bundleName: string) => {
    return testUtil.createTestCommand(testBundleInstallArgs(dir, bundleName), () => true)
}

const testGetArgs = (dir: string, bundleName: string) => {
    return `${cartiCmd(dir)} get -y ${bundleName}`
}

const testGetCommmand = (dir: string, bundleName: string) => {
    return testUtil.createTestCommand(testGetArgs(dir, bundleName), () => true)
}

const diskLocation = (dir: string) =>
    `${dir}/carti_bundles/baenrwic6ybfsdmdtm52fhgbeip6ndoi3e62bonaadmotji4x6vvdpedt3m/dapp-test-data.ext2`
const testPublishCmdArgs = (dir: string, uri: string) => {
    return `${cartiCmd(dir)} publish uri dapp-test-data ${uri}`
}
const testPublishCommand = (dir: string, uri: string) => {
    return testUtil.createTestCommand(testPublishCmdArgs(dir, uri), () => {
        const cfg = readJSONSync(`${dir}/bundles.json`)
        return (cfg.bundles && cfg.bundles[0] && cfg.bundles[0].uri === uri)
    });
}

const testAddRepoCmdArgs = (dir: string, uri: string) => {
    return `${cartiCmd(dir)} repo add ${uri}`
}

const testAddRepoCommand = (dir: string, uri: string) => {
   return testUtil.createTestCommand(testAddRepoCmdArgs(dir, uri), () => true)
}

const testMachineInitCmdArgs = (dir: string) => {
    return `${cartiCmd(dir)} machine init`
}

const testMachineInitCommand = (dir: string, check: () => true = () => true) => {
    return testUtil.createTestCommand(testMachineInitCmdArgs(dir), check)
}

interface AddCmdOptions {
    length: string,
    start: string,
    label: string
}

const testMachineAddCmdArgs = (dir: string, bundleName: string, cmd: AddCmdOptions) => {
    return `${cartiCmd(dir)} machine add flash ${bundleName} --start ${cmd.start} --length ${cmd.length} -m cool`
}

const testMachineAddCommand = (dir: string, bundleName: string, cmd: AddCmdOptions) => {
    return testUtil.createTestCommand(testMachineAddCmdArgs(dir, bundleName, cmd), () => true)
}

const testMachineRmCmdArgs = (dir: string, label: string) => {
    return `${cartiCmd(dir)} machine rm flash ${label}`
}

const testMachineRmCommand = (dir: string, label: string) => {
    return testUtil.createTestCommand(testMachineRmCmdArgs(dir, label), () => true)
}

const testMachineBuildArgs = (dir: string) => {
    return `${cartiCmd(dir)} machine build`
}

const testMachineBuildCommand = (dir: string) => {
    return testUtil.createTestCommand(testMachineBuildArgs(dir), () => true)
}

const testMachineInstallArgs = (dir: string, uri: string) => {
    return `${cartiCmd(dir)} machine install ${uri}`
}

const testMachineInstallCommand = (dir: string, uri: string) => {
    return testUtil.createTestCommand(testMachineInstallArgs(dir, uri), () => true)
}

describe("integration tests for cli", () => {
    afterAll(async () => {
        await rmAll(locations.LOCAL_BASE_TEST_DIR)
        await rmAll(locations.REMOTE_BASE_TEST_DIR)
    })

    /*
        The test pattern for this is 
        local builds bundle
        local publishes bundle
        remote installs locals bundle
        remote creates a machine to use bundle
        remote adds custom bundle from local to it's machine
        remote builds machine
        local installs remote's machine creating a stored_machine
    */
    it("should bundle a flash drive, publish it, install it, create a machine, and install the machine", async () => {
        await testUtil.installTestCarti(localTestEnvironment)
        await testUtil.installTestCarti(remoteTestEnvironment)

        const localBundleCmd = testBundleCommand(localTestEnvironment.cwd)
        const publishBundleCmd = testPublishCommand(localTestEnvironment.cwd,
            diskLocation(localTestEnvironment.cwd))
        const addRepoCmd = testAddRepoCommand(remoteTestEnvironment.cwd,
            localTestEnvironment.cwd)
        const installBundleCmd = testBundleInstallCommand(remoteTestEnvironment.cwd, "dapp-test-data")
        const getCmd = testGetCommmand(remoteTestEnvironment.cwd, "dapp-test-data")
        const machineInitCmd = testMachineInitCommand(remoteTestEnvironment.cwd, () => {

            // NOTE by default the init fills out a config with default settings so you must edit the file specifically
            // for your flash drive, there is a concurrency issue that prevents this from happening.
            // not explicitly after  the command has finished. Hence this inline code here
            const machineFile = fs.readFileSync(`${remoteTestEnvironment.cwd}/carti-machine-package.json`)
            const machineJSON = JSON.parse(machineFile.toString())
            machineJSON.machineConfig.flash_drive = machineJSON.machineConfig.flash_drive
                .filter((flash: any) => { flash.cid !== "default-flash" })
            fs.writeFileSync(`${remoteTestEnvironment.cwd}/carti-machine-package.json`,
                JSON.stringify(machineJSON, null, 2))
            return true;
        })
        const machineAddCmd = testMachineAddCommand(remoteTestEnvironment.cwd, "dapp-test-data",
            { length: "0x100000", start: "0x8000000000000000", label: "cool" })

        const machineRmCmd = testMachineRmCommand(remoteTestEnvironment.cwd, "cool")

        const machineBuildCmd = testMachineBuildCommand(remoteTestEnvironment.cwd)
        const machineInstallCmd = testMachineInstallCommand(localTestEnvironment.cwd, `${remoteTestEnvironment.cwd}/carti-machine-package.json`)
        expect(await testUtil.testCommand(localBundleCmd, localTestEnvironment, CARTI_TEST_LOCAL)).toBe(true)
        //otherwise throws exception
        expect(await testUtil.testCommand(publishBundleCmd, Object.assign({}, localTestEnvironment, { input: "\r\n" }), CARTI_TEST_LOCAL)).toBe(true)
       
        expect(await testUtil.testCommand(addRepoCmd, remoteTestEnvironment, CARTI_TEST_LOCAL)).toBe(true)
        expect(await testUtil.testCommand(getCmd, remoteTestEnvironment, CARTI_TEST_LOCAL)).toBe(true)
        expect(await testUtil.testCommand(installBundleCmd, Object.assign({},
            remoteTestEnvironment, { input: "\r\n" }), CARTI_TEST_LOCAL)).toBe(true)
        expect(await testUtil.testCommand(machineInitCmd, remoteTestEnvironment, CARTI_TEST_LOCAL)).toBe(true)
        expect(await testUtil.testCommand(machineAddCmd,
            Object.assign({}, remoteTestEnvironment, { input: "\r\n" }), CARTI_TEST_LOCAL)).toBe(true)
        expect(await testUtil.testCommand(machineBuildCmd, remoteTestEnvironment, CARTI_TEST_LOCAL)).toBe(true)
        expect(await testUtil.testCommand(machineInstallCmd, localTestEnvironment, CARTI_TEST_LOCAL)).toBe(true)
        expect(await testUtil.testCommand(machineRmCmd,
            Object.assign({}, remoteTestEnvironment, { input: "\r\n" }), CARTI_TEST_LOCAL)).toBe(true)
    })

})