import { createSlice } from "@reduxjs/toolkit";

import { getZonesThunk } from "../services/dns-thunk";

const initialState = {
  zones: null,
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
  },
});

export default dnsSlice.reducer;
