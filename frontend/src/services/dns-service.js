import axios from "axios";

import { REACT_APP_API_BASE } from "../utils/constants";

export const getZones = async () => {
  const response = await axios.get(`${REACT_APP_API_BASE}/zones`);
  return response;
};

export const getARecords = async (zoneName) => {
  const response = await axios.get(
    `${REACT_APP_API_BASE}/a-records/${zoneName}`,
  );
  return response;
};
