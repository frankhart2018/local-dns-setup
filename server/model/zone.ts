import { SOA } from './soa.js';
import { IP } from './ip.js';
import { ARecord } from './a-record.js';

interface Zone {
  name: string;
  type: String;
  soa: SOA;
  ip: IP;
  a_records: [ARecord];
}

export { Zone };