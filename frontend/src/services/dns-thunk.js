import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { REACT_APP_API_BASE } from "../utils/constants";

const callEndpoint = async (endpoint, method, body = null) => {
  const response = await axios[method](
    `${REACT_APP_API_BASE}/${endpoint}`,
    body,
  );
  return response;
};

const callServiceOrReturnError = async (endpoint, method, body = null) => {
  try {
    const response = await callEndpoint(endpoint, method, body);
    return response;
  } catch (e) {
    return e;
  }
};

export const getZonesThunk = createAsyncThunk(
  "dns/getZones",
  async () => await callServiceOrReturnError("zones", "get"),
);

export const getARecordsThunk = createAsyncThunk(
  "dns/getARecords",
  async (payload) =>
    await callServiceOrReturnError(`a-records/${payload.zoneName}`, "get"),
);

export const deleteARecordThunk = createAsyncThunk(
  "dns/deleteARecord",
  async (payload) =>
    await callServiceOrReturnError(`a-record/${payload.zoneName}`, "delete", {
      data: { aName: payload.aName },
    }),
);

export const addARecordThunk = createAsyncThunk(
  "dns/addARecord",
  async (payload) =>
    await callServiceOrReturnError("a-record", "post", {
      zoneName: payload.zoneName,
      aName: payload.aName,
      ip: payload.ip,
    }),
);

export const addZoneThunk = createAsyncThunk(
  "dns/addZone",
  async (payload) => await callServiceOrReturnError("zone", "put", payload),
);

export const deleteZoneThunk = createAsyncThunk(
  "dns/deleteZone",
  async (payload) =>
    await callServiceOrReturnError(`zone/${payload.zoneName}`, "delete"),
);

export const pingUrlThunk = createAsyncThunk(
  "dns/pingUrl",
  async (payload) =>
    await callServiceOrReturnError(`ping/${payload.url}`, "get"),
);

export const deployChangesThunk = createAsyncThunk(
  "dns/deployChanges",
  async (payload) =>
    await callServiceOrReturnError("deploy-changes", "post", {
      serverPassword: payload.serverPassword,
    }),
);
