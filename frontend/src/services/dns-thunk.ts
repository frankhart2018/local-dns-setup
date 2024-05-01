import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { REACT_APP_API_BASE } from "../utils/constants";
import {
  AddARecordPayload,
  AddZonePayload,
  DeleteARecordPayload,
  DeployChangesPayload,
  GetARecordsPayload,
  PingUrlPayload,
} from "./request-payload";

type RequestBody = object | null;

const callEndpoint = async (
  endpoint: string,
  method: Function,
  body: RequestBody = null
) => {
  const response = await method(`${REACT_APP_API_BASE}/${endpoint}`, body);
  return response;
};

const callServiceOrReturnError = async (
  endpoint: string,
  method: Function,
  body: RequestBody = null
) => {
  try {
    const response = await callEndpoint(endpoint, method, body);
    return response;
  } catch (e) {
    return e;
  }
};

export const getZonesThunk = createAsyncThunk(
  "dns/getZones",
  async () => await callServiceOrReturnError("zones", axios.get)
);

export const getARecordsThunk = createAsyncThunk(
  "dns/getARecords",
  async (payload: GetARecordsPayload) =>
    await callServiceOrReturnError(`a-records/${payload.zoneName}`, axios.get)
);

export const deleteARecordThunk = createAsyncThunk(
  "dns/deleteARecord",
  async (payload: DeleteARecordPayload) =>
    await callServiceOrReturnError(
      `a-record/${payload.zoneName}`,
      axios.delete,
      {
        data: { aName: payload.aName },
      }
    )
);

export const addARecordThunk = createAsyncThunk(
  "dns/addARecord",
  async (payload: AddARecordPayload) =>
    await callServiceOrReturnError("a-record", axios.post, {
      zoneName: payload.zoneName,
      aName: payload.aName,
      ip: payload.ip,
    })
);

export const addZoneThunk = createAsyncThunk(
  "dns/addZone",
  async (payload: AddZonePayload) =>
    await callServiceOrReturnError("zone", axios.put, payload)
);

export const deleteZoneThunk = createAsyncThunk(
  "dns/deleteZone",
  async (payload: DeleteARecordPayload) =>
    await callServiceOrReturnError(`zone/${payload.zoneName}`, axios.delete)
);

export const pingUrlThunk = createAsyncThunk(
  "dns/pingUrl",
  async (payload: PingUrlPayload) =>
    await callServiceOrReturnError(`ping/${payload.url}`, axios.get)
);

export const deployChangesThunk = createAsyncThunk(
  "dns/deployChanges",
  async (payload: DeployChangesPayload) =>
    await callServiceOrReturnError("deploy-changes", axios.post, {
      serverPassword: payload.serverPassword,
    })
);
