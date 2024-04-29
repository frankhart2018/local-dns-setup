import mongoose from "mongoose";
import { SOA } from "../../model/data/soa.js";
import { IP } from "../../model/data/ip.js";
import { ARecord } from "../../model/data/a-record.js";
import { Zone } from "../../model/data/zone.js";

const SOA = new mongoose.Schema<SOA>({
  admin_email: String,
  serial: String,
  refresh: String,
  update_retry: String,
  expire: String,
  min_TTL: String,
});

const IP = new mongoose.Schema<IP>({
  part_0: Number,
  part_1: Number,
  part_2: Number,
  part_3: Number,
});

const A_record = new mongoose.Schema<ARecord>({
  name: String,
  ip: IP,
});

const schema = new mongoose.Schema<Zone>(
  {
    name: { type: String, unique: true },
    type: String,
    soa: SOA,
    ip: IP,
    a_records: [A_record],
  },
  {
    collection: "zones",
  }
);

export default schema;
