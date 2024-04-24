import { createAsyncThunk } from "@reduxjs/toolkit";

import * as dnsService from "./dns-service";

const callServiceOrReturnError = async (serviceFn, args = null) => {
  try {
    const response =
      args === null ? await serviceFn() : await serviceFn(...args);
    return response;
  } catch (e) {
    return e;
  }
};

export const getZonesThunk = createAsyncThunk("dns/getZones", async () => {
  return await callServiceOrReturnError(dnsService.getZones);
});

export const getARecordsThunk = createAsyncThunk(
  "dns/getARecords",
  async (payload) => {
    return await callServiceOrReturnError(dnsService.getARecords, [
      payload.zoneName,
    ]);
  }
);

export const deleteARecordThunk = createAsyncThunk(
  "dns/deleteARecord",
  async (payload) => {
    return await callServiceOrReturnError(dnsService.deleteARecord, [
      payload.zoneName,
      payload.aName,
    ]);
  }
);

export const addARecordThunk = createAsyncThunk(
  "dns/addARecord",
  async (payload) => {
    return await callServiceOrReturnError(dnsService.addARecord, [
      payload.zoneName,
      payload.aName,
      payload.ip,
    ]);
  }
);

export const addZoneThunk = createAsyncThunk("dns/addZone", async (payload) => {
  return await callServiceOrReturnError(dnsService.addZone, [payload]);
});

export const deleteZoneThunk = createAsyncThunk(
  "dns/deleteZone",
  async (payload) => {
    return await callServiceOrReturnError(dnsService.deleteZone, [
      payload.zoneName,
    ]);
  }
);

export const pingUrlThunk = createAsyncThunk("dns/pingUrl", async (payload) => {
  return await callServiceOrReturnError(dnsService.pingUrl, [payload.url]);
});

export const deployChangesThunk = createAsyncThunk(
  "dns/deployChanges",
  async (payload) => {
    return await callServiceOrReturnError(dnsService.deployChangesHandler, [
      payload.serverPassword,
    ]);
  }
);
