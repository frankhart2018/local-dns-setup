import { Zone } from "../data/zone.js";

type PutCreateZoneRequestBody = Zone;

interface DeleteZoneRequestParams {
  zoneName: string;
}

export { PutCreateZoneRequestBody, DeleteZoneRequestParams };
