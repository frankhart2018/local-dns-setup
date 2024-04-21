import { getCurrentTime } from "../../utils/date-utils.js";
import { sendRespone } from "../../utils/response-utils.js";
import { addARecord, addZone, deleteARecord, getARecords } from "./dns-dao.js";

const createZoneHandler = async (req, res, logger) => {
  const zoneObj = req.body;

  const result = addZone(zoneObj);
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

const deleteARecordHandler = async (req, res, logger) => {
  console.log(req);

  const zoneName = req.params.zoneName;
  const aName = req.body.aName;

  const result = await deleteARecord(zoneName, aName);
  if (result !== null) {
    sendRespone(req, res, logger, "info", 200, result);
  } else {
    sendRespone(req, res, logger, "error", 406, {
      status: `Zone '${zoneName}' not found!`,
    })
  }
};

const DnsController = (app, logger) => {
  //////////////////////////////////////////
  // ZONE
  //////////////////////////////////////////
  app.put("/zone", (req, res) => createZoneHandler(req, res, logger));

  //////////////////////////////////////////
  // A RECORD
  //////////////////////////////////////////
  app.get("/a-records/:zoneName", (req, res) =>
    getARecordsHandler(req, res, logger)
  );
  app.post("/a-record", (req, res) => addARecordHandler(req, res, logger));
  app.delete("/a-record/:zoneName", (req, res) =>
    deleteARecordHandler(req, res, logger)
  );
};

export default DnsController;
