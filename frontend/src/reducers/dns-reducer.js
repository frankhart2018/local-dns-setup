import { createSlice } from "@reduxjs/toolkit";

import { getARecordsThunk, getZonesThunk } from "../services/dns-thunk";

const initialState = {
  zones: null,
  aRecords: null,
};

const dnsSlice = createSlice({
  name: "dns",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getZonesThunk.fulfilled, (state, action) => {
      const payload = action.payload;

      if ("data" in payload) {
        state.zones = payload.data;
      }
    });

    builder.addCase(getARecordsThunk.fulfilled, (state, action) => {
      const payload = action.payload;

      if ("data" in payload) {
        state.aRecords = payload.data;
      }
    });
  },
});

export default dnsSlice.reducer;
