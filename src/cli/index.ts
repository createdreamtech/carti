#!/usr/bin/env node
import program from "commander";
const version = require("../../../package.json").version; // tslint:disable-line
import { makeLogger } from "../lib/logging";
import _ from "lodash";
import * as commands from "./commands"

import { config } from "../lib/config"
const logger = makeLogger("cli");
program
  //.version(version, "-v, --version")
  .addCommand(commands.addRepoCommand(config.repo))
  .addCommand(commands.addBundleCommand())
  .addCommand(commands.addPublishCommand(config))
  .addCommand(commands.addInstallCommand(config))
  .addCommand(commands.addMachineCommand(config))
  .addCommand(commands.addListCommand(config))
  .parse(process.argv);
