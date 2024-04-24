import axios from "axios";

import { REACT_APP_API_BASE } from "../utils/constants";

export const getZones = async () => {
  const response = await axios.get(`${REACT_APP_API_BASE}/zones`);
  return response;
};

export const getARecords = async (zoneName) => {
  const response = await axios.get(
    `${REACT_APP_API_BASE}/a-records/${zoneName}`
  );
  return response;
};

export const deleteARecord = async (zoneName, aName) => {
  const response = await axios.delete(
    `${REACT_APP_API_BASE}/a-record/${zoneName}`,
    {
      data: { aName },
    }
  );
  return response;
};

export const addARecord = async (zoneName, aName, ip) => {
  const response = await axios.post(`${REACT_APP_API_BASE}/a-record`, {
    zoneName,
    aName,
    ip,
  });
  return response;
};

export const addZone = async (zoneObj) => {
  const response = await axios.put(`${REACT_APP_API_BASE}/zone`, zoneObj);
  return response;
};

export const deleteZone = async (zoneName) => {
  const response = await axios.delete(`${REACT_APP_API_BASE}/zone/${zoneName}`);
  return response;
};

export const pingUrl = async (url) => {
  const response = await axios.get(`${REACT_APP_API_BASE}/ping/${url}`);
  return response;
};

export const deployChangesHandler = async (serverPassword) => {
  const response = await axios.post(`${REACT_APP_API_BASE}/deploy-changes`, {
    serverPassword,
  });
  return response;
};
