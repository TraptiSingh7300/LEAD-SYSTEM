import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

const ProviderSchema =
  mongoose.models.Provider?.schema ||
  new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    services: [{ type: String }],
    remainingQuota: { type: Number, default: 10 },
    leadsReceivedCount: { type: Number, default: 0 },
    lastAssignedAt: { type: Date, default: null },
  });

const LeadSchema =
  mongoose.models.Lead?.schema ||
  new mongoose.Schema({
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

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const providers = await Provider.find({}).sort({ id: 1 });
    const totalLeads = await Lead.countDocuments({});

    const depletedProviders = providers.filter(
      (p) => p.remainingQuota === 0,
    ).length;

    return NextResponse.json(
      {
        totalLeads,
        totalProviders: providers.length,
        depletedProviders,
        providers: providers.map((p) => ({
          id: p.id,
          name: p.name,
          services: p.services,
          remainingQuota: p.remainingQuota ?? 10,
          leadsReceivedCount: p.leadsReceivedCount ?? 0,
          lastAssignedAt: p.lastAssignedAt || null,
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("ADMIN STATS FAILURE:", error);
    return NextResponse.json(
      {
        message: "Failed to compile administration metrics",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
