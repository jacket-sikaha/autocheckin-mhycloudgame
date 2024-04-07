import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import CustomMongoDBTransport from "./customMongoDBTransport";
import { getShanghaiDate } from "./util";

const { combine, timestamp, printf, colorize, align, errors, json } =
  winston.format;

const config =
  process.env.NODE_ENV === "development"
    ? {
        level: "info",
        format: combine(
          errors({ stack: true }),
          colorize({ all: true }),
          timestamp({
            format: getShanghaiDate,
          }),
          json(),
          align(),
          printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
        ),
        transports: [new winston.transports.Console()],
      }
    : {
        level: "info",
        format: combine(
          errors({ stack: true }),
          timestamp({ format: getShanghaiDate }),
          json()
        ),
        transports: [
          new winston.transports.Console(),
          new CustomMongoDBTransport({}),
        ],
      };

const logger = winston.createLogger(config);

export default logger;
