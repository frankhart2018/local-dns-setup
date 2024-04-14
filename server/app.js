import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import winston from "winston";
import DnsController from "./controllers/dns/dns-controller.js";

const CONNECTION_STRING =
  process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/localdns";
console.log("CONNECTION_STRING ", CONNECTION_STRING);
mongoose.connect(CONNECTION_STRING);

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
const app = express();
app.use(cors(corsOptions));
app.use(express.json());

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

app.get("/", (req, res) => {
  res.status(200).send({
    status: "Ok",
  });
});

DnsController(app, logger);

app.listen(process.env.PORT || 4000, process.env.HOST || "127.0.0.1");
