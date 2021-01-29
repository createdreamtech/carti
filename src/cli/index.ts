#!/usr/bin/env node
import program from "commander";
const version = require("../../../package.json").version; // tslint:disable-line
import { makeLogger } from "../lib/logging";
import _ from "lodash";
import * as commands from "./commands"

import { config, haveYouInstalledDefaultRepo } from "../lib/config"
const logger = makeLogger("cli");

commands.addBundleCommand()
commands.addInstallCommand(config)
commands.addPublishCommand(config)
commands.addMachineCommand(config)
commands.addRepoCommand(config.repo)
commands.addListCommand(config)
commands.addWhichCommand(config)
commands.addGetCommand(config)
commands.addDefaultsCommand()
commands.addDockerCommand()
commands.addVersionCommand()
haveYouInstalledDefaultRepo()
program
  .parse(process.argv);
