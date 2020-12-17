#!/usr/bin/env node
import program from "commander";
const version = require("../../../package.json").version; // tslint:disable-line
import { makeLogger } from "../lib/logging";
import { startCartiFromCLI } from "./commands";
import _ from "lodash";
import { addRepoCommand } from "./commands/repo";
import { Repo } from "../lib/repo";
import { startCarti } from "..";

const logger = makeLogger("cli");
const config = startCarti()
program
  .version(version, "-v, --version")
  .addCommand(addRepoCommand(config.repo))
  .parse(process.argv);
