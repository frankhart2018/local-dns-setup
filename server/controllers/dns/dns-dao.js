import dnsModel from "./dns-model.js";

export const addZone = (zoneObj) => {
  const query = { name: zoneObj.name };
  const update = {
    $set: zoneObj,
  };
  const options = { upsert: true, new: true };
  return dnsModel.findOneAndUpdate(query, update, options);
};
