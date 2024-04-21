import { getCurrentTime } from "../../utils/date-utils.js";
import { addARecord, addZone, getARecords } from "./dns-dao.js";

const createZoneHandler = async (req, res, logger) => {
  const zoneObj = req.body;

  logger.info(`[${getCurrentTime()}] PUT /zone : Status 200`);
  res.status(200).send(await addZone(zoneObj));
};

const addARecordHandler = async (req, res, logger) => {
  const zoneName = req.body.zoneName;
  const aName = req.body.aName;
  const ip = req.body.ip;

  const result = await addARecord(zoneName, aName, ip);
  if (result !== null) {
    logger.info(`[${getCurrentTime()}] POST /a-record : Status 200`);
    res.status(200).send(result);
  } else {
    logger.error(`[${getCurrentTime()}] POST /a-record : Status 406`);
    res.status(406).send({
      status: `Zone '${zoneName}' not found or A name '${aName}' is already added!`,
    });
  }
};

const getARecordsHandler = async (req, res, logger) => {
  const { zoneName } = req.params;

  const result = await getARecords(zoneName);
  if (result !== null) {
    logger.info(`[${getCurrentTime()}] GET /get-a-records : Status 200`);
    res.status(200).send(result.a_records);
  } else {
    logger.error(`[${getCurrentTime()}] GET /get-a-records : Status 404`);
    res.status(404).send({
      status: `Zone '${zoneName}' not found`,
    });
  }
};

const DnsController = (app, logger) => {
  app.put("/zone", (req, res) => createZoneHandler(req, res, logger));
  app.post("/a-record", (req, res) => addARecordHandler(req, res, logger));
  app.get("/a-records/:zoneName", (req, res) =>
    getARecordsHandler(req, res, logger)
  );
};

export default DnsController;
