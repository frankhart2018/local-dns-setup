import { getCurrentTime } from "../../utils/date-utils.js";
import { addARecord, addZone } from "./dns-dao.js";

const createZoneHandler = async (req, res, logger) => {
  const zoneObj = req.body;

  logger.info(`[${getCurrentTime()}] PUT /create-zone : Status 200`);
  res.status(200).send(await addZone(zoneObj));
};

const addARecordHandler = async (req, res, logger) => {
  const zoneName = req.body.zoneName;
  const aName = req.body.aName;
  const ip = req.body.ip;

  const result = await addARecord(zoneName, aName, ip);
  if (result !== null) {
    logger.info(`[${getCurrentTime()}] POST /add-a-record : Status 200`);
    res.status(200).send(result);
  } else {
    logger.error(`[${getCurrentTime()}] POST /add-a-record : Status 404`);
    res.status(404).send({
      status: `Zone '${zoneName}' not found or A name '${aName}' is already added!`,
    });
  }
};

const DnsController = (app, logger) => {
  app.put("/create-zone", (req, res) => createZoneHandler(req, res, logger));
  app.post("/add-a-record", (req, res) => addARecordHandler(req, res, logger));
};

export default DnsController;
