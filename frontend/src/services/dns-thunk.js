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
