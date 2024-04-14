import mongoose from "mongoose";

const SOA = new mongoose.Schema({
  admin_email: String,
  serial: String,
  refresh: String,
  update_retry: String,
  expire: String,
  min_TTL: String,
});

const IP = new mongoose.Schema({
  part_0: Number,
  part_1: Number,
  part_2: Number,
  part_3: Number,
});

const A_record = new mongoose.Schema({
  name: String,
  ip: IP,
});

const schema = new mongoose.Schema(
  {
    name: String,
    type: String,
    soa: SOA,
    ip: IP,
    a_records: [A_record],
  },
  {
    collection: "zones",
  },
);

export default schema;
