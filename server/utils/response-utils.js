import { getCurrentTime } from "./date-utils.js";

const sendRespone = (req, res, logger, logLevel, status, sendObject) => {
  logger.log({
    level: logLevel,
    message: `[${getCurrentTime()}] ${req.method} ${
      req.originalUrl
    }: Status ${status}`,
  });

  res.status(status).send(sendObject);
};

export { sendRespone };
