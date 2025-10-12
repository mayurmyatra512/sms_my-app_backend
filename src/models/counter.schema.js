import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true }, // Multi-tenant support
  name: { type: String, required: true }, // e.g. "receipt", "invoice", "order"
  seq: { type: Number, default: 0 },
}, { timestamps: true });

counterSchema.index({ tenantId: 1, name: 1 }, { unique: true }); // Unique per tenant + counter name

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;