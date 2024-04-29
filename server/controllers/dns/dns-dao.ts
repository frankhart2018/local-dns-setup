import { IP } from "../../model/data/ip.js";
import { Zone } from "../../model/data/zone.js";
import dnsModel from "./dns-model.js";

export const addZone = (zoneObj: Zone): Promise<Zone | null> => {
  const query = { name: zoneObj.name };
  const update = {
    $set: zoneObj,
  };
  const options = { upsert: true, new: true };
  return dnsModel.findOneAndUpdate(query, update, options);
};

export const deleteZone = (zoneName: string): Promise<any> => {
  return dnsModel.findOneAndDelete({
    name: zoneName,
  });
};

export const getAllZones = (): Promise<Zone[]> => {
  return dnsModel.find({}, { a_records: 0 });
};

export const addARecord = (
  zoneName: string,
  aName: string,
  ip: IP,
): Promise<Zone | null> => {
  const query = { name: zoneName, "a_records.name": { $ne: aName } };
  const update = {
    $push: {
      a_records: {
        name: aName,
        ip,
      },
    },
  };
  const options = { new: true };
  return dnsModel.findOneAndUpdate(query, update, options);
};

export const getARecords = (zoneName: string): Promise<Zone | null> => {
  return dnsModel.findOne({ name: zoneName });
};

export const deleteARecord = (
  zoneName: string,
  aName: string,
): Promise<Zone | null> => {
  const query = { name: zoneName };
  const update = {
    $pull: {
      a_records: {
        name: aName,
      },
    },
  };
  const options = { new: true };
  return dnsModel.findOneAndUpdate(query, update, options);
};
