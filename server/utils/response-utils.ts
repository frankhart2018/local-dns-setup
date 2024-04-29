import { getCurrentTime } from "./date-utils.js";
import { Logger } from "winston";
import { Request, Response } from "express";

const sendRespone = (
  req: Request<any>,
  res: Response,
  logger: Logger,
  logLevel: string,
  status: number,
  sendObject: object,
) => {
  logger.log({
    level: logLevel,
    message: `[${getCurrentTime()}] ${req.method} ${
      req.originalUrl
    }: Status ${status}`,
  });

  res.status(status).send(sendObject);
};

export { sendRespone };
