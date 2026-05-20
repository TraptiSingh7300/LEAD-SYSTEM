import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  serviceType: { type: String, required: true },
  description: { type: String },
  assignedProviders: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Provider" },
  ],
  createdAt: { type: Date, default: Date.now },
});

LeadSchema.index({ phone: 1, serviceType: 1 }, { unique: true });

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
