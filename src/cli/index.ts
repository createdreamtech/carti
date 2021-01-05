#!/usr/bin/env node
import program from "commander";
const version = require("../../../package.json").version; // tslint:disable-line
import { makeLogger } from "../lib/logging";
import _ from "lodash";
import * as commands from "./commands"

import { config } from "../lib/config"
const logger = makeLogger("cli");

commands.addBundleCommand()
commands.addInstallCommand(config)
commands.addPublishCommand(config)
commands.addMachineCommand(config)
commands.addRepoCommand(config.repo)
commands.addPublishCommand(config)
commands.addListCommand(config)

program
  //.version(version, "-v, --version")
  .parse(process.argv);
