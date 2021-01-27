import program from "commander";
import { makeLogger } from "../../lib/logging"
import {haveYouInstalledDefaultRepo } from "../../lib/config"


export const addDefaultsCommand = (): program.Command => {
    const machineCommand = program.command("defaults")
        .description("shows some default bundle information")
        .usage("defaults")
        .action(async () => {
            haveYouInstalledDefaultRepo(true)
        })
    return machineCommand
}
