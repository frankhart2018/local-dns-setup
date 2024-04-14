import { addZone } from "./dns-dao.js";

const createZoneHandler = async (req, res, logger) => {
  let zoneObj = req.body;
  res.status(200).send(await addZone(zoneObj));
};

const DnsController = (app, logger) => {
  app.post("/create-zone", (req, res) => createZoneHandler(req, res, logger));
};

export default DnsController;
