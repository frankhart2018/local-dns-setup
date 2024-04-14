import mongoose from "mongoose";

import dnsSchema from "./dns-schema.js";

const dnsModel = mongoose.model("DNSModel", dnsSchema);

export default dnsModel;
