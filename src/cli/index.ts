#!/usr/bin/env node
import program from "commander";
const version = require("../../../package.json").version; // tslint:disable-line
import { makeLogger } from "../lib/logging";
import _ from "lodash";
import { addRepoCommand } from "./commands/repo";
import { addBundleCommand } from "./commands/bundle";
import { addPublishCommand } from "./commands/publish";
import { config } from "../lib/config"
import { addInstallCommand } from "./commands/install";
import { addMachineCommand } from "./commands/machine";
import { addListCommand } from "./commands/list";

const logger = makeLogger("cli");
program
  //.version(version, "-v, --version")
  .addCommand(addRepoCommand(config.repo))
  .addCommand(addBundleCommand())
  .addCommand(addPublishCommand(config))
  .addCommand(addInstallCommand(config))
  .addCommand(addMachineCommand(config))
  .addCommand(addListCommand(config))
  .parse(process.argv);
