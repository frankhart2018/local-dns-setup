import dnsModel from "./dns-model.js";

export const addZone = (zoneObj) => {
  const query = { name: zoneObj.name };
  const update = {
    $set: zoneObj,
  };
  const options = { upsert: true, new: true };
  return dnsModel.findOneAndUpdate(query, update, options);
};

export const addARecord = (zoneName, aName, ip) => {
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

export const getARecords = (zoneName) => {
  return dnsModel.findOne({ name: zoneName });
};

export const deleteARecord = (zoneName, aName) => {
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
