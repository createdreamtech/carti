import program from "commander";
import { makeLogger } from "../../lib/logging"
import {haveYouInstalledDefaultRepo } from "../../lib/config"


export const addDockerCommand = (): program.Command => {
    const machineCommand = program.command("docker")
        .description("shows docker instructions for testing your carti machine")
        .usage("docker")
        .action(async () => {
const instructions=`
# To run the machine with docker pull the cartesi/playground image

# Run machine build
# if all bundles for the machine are installed

carti machine build --runscript

# run docker


docker run -e USER=$(id -u -n) -e UID=$(id -u)  -e GID=$(id -g) -e GROUP=$(id -g -n) \\
-v$(pwd):/opt/carti -v $(pwd)/carti_build/bundles:/opt/carti/packages \\
-it cartesi/playground /bin/bash


# In the container 
cd /opt/carti; luapp5.3 run-config.lua machine-config
`
console.log(instructions)
        })
    return machineCommand
}
