import "dotenv/config";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

const ProviderSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  services: [{ type: String }],
  remainingQuota: { type: Number, default: 10 },
  leadsReceivedCount: { type: Number, default: 0 },
  lastAssignedAt: { type: Date, default: null },
});

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

const Provider =
  mongoose.models.Provider ||
  mongoose.model("Provider", ProviderSchema, "providers");
const Lead =
  mongoose.models.Lead || mongoose.model("Lead", LeadSchema, "leads");

async function runSeed() {
  try {
    console.log("⏳ Connecting to MongoDB directly...");

    if (!MONGO_URI) {
      throw new Error(
        "MONGODB_URI is undefined. Check your .env file placement.",
      );
    }

    await mongoose.connect(MONGO_URI);
    console.log("✅ Database connected perfectly!");

    console.log("🧹 Clearing old data...");
    await Provider.deleteMany({});
    await Lead.deleteMany({});

    const initialProviders = [
      {
        id: 1,
        name: "Provider 1",
        services: ["Service 1", "Service 3"],
        remainingQuota: 10,
        leadsReceivedCount: 0,
        lastAssignedAt: null,
      },
      {
        id: 2,
        name: "Provider 2",
        services: ["Service 1", "Service 2"],
        remainingQuota: 10,
        leadsReceivedCount: 0,
        lastAssignedAt: null,
      },
      {
        id: 3,
        name: "Provider 3",
        services: ["Service 1", "Service 3"],
        remainingQuota: 10,
        leadsReceivedCount: 0,
        lastAssignedAt: null,
      },
      {
        id: 4,
        name: "Provider 4",
        services: ["Service 1", "Service 2"],
        remainingQuota: 10,
        leadsReceivedCount: 0,
        lastAssignedAt: null,
      },
      {
        id: 5,
        name: "Provider 5",
        services: ["Service 1", "Service 3"],
        remainingQuota: 10,
        leadsReceivedCount: 0,
        lastAssignedAt: null,
      },
      {
        id: 6,
        name: "Provider 6",
        services: ["Service 1", "Service 2"],
        remainingQuota: 10,
        leadsReceivedCount: 0,
        lastAssignedAt: null,
      },
      {
        id: 7,
        name: "Provider 7",
        services: ["Service 2", "Service 3"],
        remainingQuota: 10,
        leadsReceivedCount: 0,
        lastAssignedAt: null,
      },
      {
        id: 8,
        name: "Provider 8",
        services: ["Service 2", "Service 3"],
        remainingQuota: 10,
        leadsReceivedCount: 0,
        lastAssignedAt: null,
      },
    ];

    console.log("🚀 Inserting 8 balanced providers into database...");
    await Provider.insertMany(initialProviders);

    console.log("🎉 Database seeded successfully with 8 providers!");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed cleanly.");
    process.exit(0);
  }
}

runSeed();
