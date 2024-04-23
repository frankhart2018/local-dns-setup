import { createSlice } from "@reduxjs/toolkit";

import {
  addARecordThunk,
  getARecordsThunk,
  getZonesThunk,
} from "../services/dns-thunk";

const initialState = {
  zones: null,
  aRecords: null,
  resolutions: [],
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
        state.resolutions = [];
        state.aRecords = payload.data;
      }
    });

    builder.addCase(addARecordThunk.fulfilled, (state, action) => {
      const payload = action.payload;

      if ("data" in payload) {
        window.location.reload();
      } else {
        alert(payload.response.data.error);
      }
    });
  },
});

export default dnsSlice.reducer;
