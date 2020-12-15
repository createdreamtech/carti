import fs from "fs-extra";
import _ from "lodash";
import { makeLogger } from "../lib/logging";
import { Command } from "commander";
const logger = makeLogger("Carti", "Commands");






const parseCommands = async (prog: Command) => {
  let dir = "./carti";
  let port = "8557";
  if (prog.dir) { dir = prog.dir; }
  if (prog.port) { port = prog.port; }
  return { port, dir };
};

const launchCommands = async (): Promise<void> => {
//  const rocksStorage = new RocksStorage(dir);
 // return startSignatory(rocksStorage, port);

};
/**
 * startSignatoryFromCLI launches the signatory with command line arguments
 * @param program - are the commandline arguments
 */
export const startCartiFromCLI = async (program: any): Promise<void> => {
//  const commands = await parseCommands(program);
    logger.info(program)
 // launchCommands(commands);
};