import { getCurrentTime } from "../../utils/date-utils.js";
import { sendRespone } from "../../utils/response-utils.js";
import { addARecord, addZone, getARecords } from "./dns-dao.js";

const createZoneHandler = async (req, res, logger) => {
  const zoneObj = req.body;

  sendRespone(req, res, logger, "info", result);
};

const addARecordHandler = async (req, res, logger) => {
  const zoneName = req.body.zoneName;
  const aName = req.body.aName;
  const ip = req.body.ip;

  const result = await addARecord(zoneName, aName, ip);
  if (result !== null) {
    sendRespone(req, res, logger, "info", 200, result);
  } else {
    sendRespone(req, res, logger, "error", 406, {
      status: `Zone '${zoneName}' not found or A name '${aName}' is already added!`,
    });
  }
};

const getARecordsHandler = async (req, res, logger) => {
  const { zoneName } = req.params;

  const result = await getARecords(zoneName);
  if (result !== null) {
    sendRespone(req, res, logger, "info", 200, result.a_records);
  } else {
    sendRespone(req, res, logger, "error", 404, {
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
