interface GetARecordsPayload {
  zoneName: string;
}

interface DeleteARecordPayload {
  zoneName: string;
  aName: string;
}

interface AddARecordPayload {
  zoneName: string;
  aName: string;
  ip: string;
}

type AddZonePayload = object;

interface DeleteZonePayload {
  zoneName: string;
}

interface PingUrlPayload {
  url: string;
}

interface DeployChangesPayload {
  serverPassword: string;
}

export {
  GetARecordsPayload,
  DeleteARecordPayload,
  AddARecordPayload,
  AddZonePayload,
  DeleteZonePayload,
  PingUrlPayload,
  DeployChangesPayload,
};
