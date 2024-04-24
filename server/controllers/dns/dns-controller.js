import { CommandExecutor, PipeExecuteStrategy } from "command-executor-lib";

import { sendRespone } from "../../utils/response-utils.js";
import {
  addARecord,
  addZone,
  deleteARecord,
  deleteZone,
  getARecords,
  getAllZones,
} from "./dns-dao.js";
import { createDeploymentConfigs } from "../../utils/config-generator-utils.js";
import { DNS_CONFIG_DIR, PIPE_COMM_DIR, PIPE_PATH } from "../../utils/path-utils.js";

const createZoneHandler = async (req, res, logger) => {
  const zoneObj = req.body;

  const result = await addZone(zoneObj);
  sendRespone(req, res, logger, "info", 200, result);
};

const deleteZoneHandler = async (req, res, logger) => {
  const { zoneName } = req.params;

  const result = await deleteZone(zoneName);
  if (result !== null) {
    sendRespone(req, res, logger, "info", 200, result);
  } else {
    sendRespone(req, res, logger, "error", 404, {
      error: `Zone '${zoneName}' not found`,
    });
  }
};

const getAllZonesHandler = async (req, res, logger) => {
  const result = await getAllZones();
  sendRespone(req, res, logger, "info", 200, result);
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
      error: `Zone '${zoneName}' not found or A name '${aName}' is already added!`,
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
      error: `Zone '${zoneName}' not found`,
    });
  }
};

const deleteARecordHandler = async (req, res, logger) => {
  const zoneName = req.params.zoneName;
  const aName = req.body.aName;

  const result = await deleteARecord(zoneName, aName);
  if (result !== null) {
    sendRespone(req, res, logger, "info", 200, result);
  } else {
    sendRespone(req, res, logger, "error", 406, {
      error: `Zone '${zoneName}' not found!`,
    });
  }
};

const pingUrlHandler = async (req, res, logger) => {
  const { url } = req.params;

  const executorStrategy = PipeExecuteStrategy.builder()
    .withPipePath(PIPE_PATH)
    .withCache(false)
    .withOutputPath(PIPE_COMM_DIR + "/output.txt")
    .build();
  const command = `dig +short ${url}`;
  const commandExecutor = new CommandExecutor(command, executorStrategy);
  const result = commandExecutor.execute();

  if (result.type === 0) {
    sendRespone(req, res, logger, "info", 200, {
      resolved: result.value.trim().length > 0,
    });
  } else {
    sendRespone(req, res, logger, "error", 500, {
      error: result.value.trim(),
    });
  }
};

const deployChangesHandler = async (req, res, logger) => {
  const serverPassword = req.body.serverPassword;
  const result = await getAllZones();

  createDeploymentConfigs(result);

  const pipeExecuteStrategy = PipeExecuteStrategy.builder()
    .withPipePath(PIPE_PATH)
    .withCache(false)
    .withOutputPath(PIPE_COMM_DIR + "/output.txt")
    .build();
  const command = `cd ${DNS_CONFIG_DIR} && echo '${serverPassword}' | sudo -S docker-compose up -d --build --force-recreate`;
  const commandExecutor = new CommandExecutor(command, pipeExecuteStrategy);
  let executionResult = commandExecutor.execute();

  if (executionResult.type === 0) {
    sendRespone(req, res, logger, "info", 200, {
      status: executionResult.value.trim(),
    });
  } else {
    sendRespone(req, res, logger, "error", 500, {
      error: executionResult.value.trim(),
    });
  }
};

const DnsController = (app, logger) => {
  //////////////////////////////////////////
  // ZONE
  //////////////////////////////////////////
  app.put("/zone", (req, res) => createZoneHandler(req, res, logger));
  app.delete("/zone/:zoneName", (req, res) =>
    deleteZoneHandler(req, res, logger)
  );
  app.get("/zones", (req, res) => getAllZonesHandler(req, res, logger));

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

  //////////////////////////////////////////
  // TEST AND DEPLOY
  //////////////////////////////////////////
  app.get("/ping/:url", (req, res) => pingUrlHandler(req, res, logger));
  app.post("/deploy-changes", (req, res) =>
    deployChangesHandler(req, res, logger)
  );
};

export default DnsController;
