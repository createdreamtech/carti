#!/usr/bin/env node
import program from "commander";
const version = require("../../../package.json").version; // tslint:disable-line
import { makeLogger } from "../lib/logging";
import { startCartiFromCLI } from "./commands";
import _ from "lodash";
import { addRepoCommand, defaultRepoHandler } from "./commands/repo";
import { Repo } from "../lib/repo";
import { startCarti } from "..";

const logger = makeLogger("Carti", "cli");
const config = startCarti()
program
  .version(version, "-v, --version")
  addRepoCommand(defaultRepoHandler(config.repo))
/*  .option(
    "-d, --dir <directory>",
    "Directory for storing keys",
    "./signatory",
  )
  .option(
    "-p, --port <port>",
    "Set port for Signatory",
    "1999",
  )
  .action(async () => {
    try {
      await startCartiFromCLI(program);
    } catch (e) {
      logger.error("Could not start Signatory.");
      logger.debug(e.stack);
    }
  })*/
  .parse(process.argv);
