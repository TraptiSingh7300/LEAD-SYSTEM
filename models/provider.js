import mongoose from "mongoose";

const ProviderSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  services: [{ type: String }],
  remainingQuota: { type: Number, default: 10 },
  leadsReceivedCount: { type: Number, default: 0 },
  lastAssignedAt: { type: Date, default: null },
});

export default mongoose.models.Provider ||
  mongoose.model("Provider", ProviderSchema);
