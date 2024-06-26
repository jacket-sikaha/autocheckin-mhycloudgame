import { insertLog, insertErrorLog } from "@/mongodb";
import Transport from "winston-transport";
import util from "util";

//
// Inherit from `winston-transport` so you can take advantage
// of the base functionality and `.exceptions.handle()`.
//
export default class CustomMongoDBTransport extends Transport {
  constructor(opts: any) {
    super(opts);
  }

  async log(
    info: {
      timestamp: string;
      level: string;
      message: string;
      service: string;
      stack?: string;
    },
    callback: (arg0: null, arg1: boolean) => void
  ) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    const logData = {
      level: info.level.toUpperCase(),
      message: info.message,
      timestamp: info.timestamp,
    };
    try {
      if (info.level === "error") {
        await insertErrorLog(info);
      } else {
        await insertLog(logData);
      }
      console.log("info", info);
      callback(null, true);
    } catch (error) {
      throw error;
    }
  }
}
