import program from "commander";
import { makeLogger } from "../../lib/logging"
const version = require("../../../../package.json").version; // tslint:disable-line
export const addVersionCommand = (): program.Command => {
    const machineCommand = program.command("version")
        .description("shows some default bundle information")
        .usage("version")
        .action(async () => console.log(version))
    return machineCommand
}
