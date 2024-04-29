import { CommandExecutor, PipeExecuteStrategy } from "command-executor-lib";
import { Request, Response } from "express";
import { Logger } from "winston";
import { Application } from "express";

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
import {
  HOST_DNS_CONFIG_DIR,
  PIPE_COMM_DIR,
  PIPE_PATH,
} from "../../utils/path-utils.js";
import {
  DeleteZoneRequestParams,
  PutCreateZoneRequestBody,
} from "../../model/requests/zone.js";
import {
  DeleteARecordRequestBody,
  DeleteARecordRequestParams,
  GetARecordsRequestParams,
} from "../../model/requests/a-record.js";
import { GetPingUrlRequestParams, PostDeployChangesRequestBody } from "../../model/requests/test-and-deploy.js";

const createZoneHandler = async (
  req: Request,
  res: Response,
  logger: Logger
) => {
  const zoneObj: PutCreateZoneRequestBody = req.body;

  const result = await addZone(zoneObj);
  sendRespone(req, res, logger, "info", 200, result);
};

const deleteZoneHandler = async (
  req: Request<DeleteZoneRequestParams>,
  res: Response,
  logger: Logger
) => {
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

const getAllZonesHandler = async (
  req: Request,
  res: Response,
  logger: Logger
) => {
  const result = await getAllZones();
  sendRespone(req, res, logger, "info", 200, result);
};

const addARecordHandler = async (
  req: Request,
  res: Response,
  logger: Logger
) => {
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

const getARecordsHandler = async (
  req: Request<GetARecordsRequestParams>,
  res: Response,
  logger: Logger
) => {
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

const deleteARecordHandler = async (
  req: Request<DeleteARecordRequestParams>,
  res: Response,
  logger: Logger
) => {
  const zoneName = req.params.zoneName;
  const body: DeleteARecordRequestBody = req.body;

  const result = await deleteARecord(zoneName, body.aName);
  if (result !== null) {
    sendRespone(req, res, logger, "info", 200, result);
  } else {
    sendRespone(req, res, logger, "error", 406, {
      error: `Zone '${zoneName}' not found!`,
    });
  }
};

const pingUrlHandler = async (
  req: Request<GetPingUrlRequestParams>,
  res: Response,
  logger: Logger
) => {
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

const deployChangesHandler = async (
  req: Request,
  res: Response,
  logger: Logger
) => {
  const body: PostDeployChangesRequestBody = req.body;
  const result = await getAllZones();

  createDeploymentConfigs(result);

  const pipeExecuteStrategy = PipeExecuteStrategy.builder()
    .withPipePath(PIPE_PATH)
    .withCache(false)
    .withOutputPath(PIPE_COMM_DIR + "/output.txt")
    .build();
  const serverPassword = body.serverPassword;
  const command = `cd ${HOST_DNS_CONFIG_DIR} && echo '${serverPassword}' | sudo -S docker-compose up -d --build --force-recreate`;
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

const DnsController = (app: Application, logger: Logger) => {
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
