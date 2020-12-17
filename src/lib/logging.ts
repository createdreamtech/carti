/**
 * Creates a logger scoped by service and context
 */
import winston from "winston";
import stream from "stream";

const LOG_LEVEL = process.env.SIGNER_DEBUG ? "debug" : "info";
const LOG_STREAM = process.env.LOG_STREAM ? true : false;
const LOG_FORMAT = LOG_STREAM ? winston.format.json() : winston.format.simple();

export interface LogFormat {
  message: string;
  level: string;
  context: string;
}

export class LogStream extends stream.Transform {
  private writeLog: (chunk: string) => void;

  constructor(streaming: boolean = false) {
    super();
    if (streaming) {
      this.writeLog = this.writeJSON.bind(this);
    } else {
      this.writeLog = this.writeConsole.bind(this);
    }
  }

  public read(size?: number): LogFormat {
    return super.read(size);
  }

  public _write(chunk: string, encoding: any, callback: (error?: Error) => void) {
    try {
      this.writeLog(chunk);
      callback();
    } catch (e) {
      process.stderr.write("JSON parser failed in logger\n");
      callback(e);
    }
  }
  private writeJSON(chunk: string) {
    const parsedLog = JSON.parse(chunk.toString());
    this.push(parsedLog);
  }

  private writeConsole(chunk: string) {
    process.stdout.write(chunk);
  }
}

const logStream = new LogStream(LOG_STREAM);

export const makeLogger = (context: string, path: string = "/") => {
  return winston.createLogger({
    format: LOG_FORMAT,
    level: LOG_LEVEL,
    transports: new winston.transports.Stream({
      stream: logStream,
    }),
    defaultMeta: {context, path },
    exitOnError: false,
  });
};

export const getLogStream = (): LogStream => {
  return logStream;
};