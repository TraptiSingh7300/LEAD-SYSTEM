import connectDB from "../../../lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

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

const Lead =
  mongoose.models.Lead || mongoose.model("Lead", LeadSchema, "leads");
const Provider =
  mongoose.models.Provider ||
  mongoose.model("Provider", ProviderSchema, "providers");

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, phone, city, serviceType, description } = body;

    const existingLead = await Lead.findOne({ phone, serviceType });
    if (existingLead) {
      return NextResponse.json(
        {
          message: `A lead with this phone number already exists for ${serviceType}.`,
        },
        { status: 400 },
      );
    }

    const cleanServiceType = serviceType.trim();
    const eligibleProviders = await Provider.find({
      services: {
        $elemMatch: {
          $regex: new RegExp(`^\\s*${cleanServiceType}\\s*$`, "i"),
        },
      },
      remainingQuota: { $gt: 0 },
    });

    if (eligibleProviders.length === 0) {
      return NextResponse.json(
        {
          message: `No matching providers are currently available for ${serviceType}.`,
        },
        { status: 404 },
      );
    }

    const sortedProviders = eligibleProviders.sort((a, b) => {
      if (b.remainingQuota !== a.remainingQuota) {
        return b.remainingQuota - a.remainingQuota;
      }

      const dateA = a.lastAssignedAt ? new Date(a.lastAssignedAt).getTime() : 0;
      const dateB = b.lastAssignedAt ? new Date(b.lastAssignedAt).getTime() : 0;
      return dateA - dateB;
    });

    const chosenProviders = sortedProviders.slice(0, 3);
    const chosenIds = chosenProviders.map((p) => p._id);

    const now = Date.now();
    await Promise.all(
      chosenProviders.map((provider, index) => {
        return Provider.updateOne(
          { _id: provider._id },
          {
            $inc: { remainingQuota: -1, leadsReceivedCount: 1 },

            $set: { lastAssignedAt: new Date(now + index) },
          },
        );
      }),
    );

    const newLead = await Lead.create({
      name,
      phone,
      city,
      serviceType,
      description,
      assignedProviders: chosenIds,
    });

    return NextResponse.json(
      {
        message: "Lead distributed cleanly!",
        assignedProvider: chosenProviders.map((p) => p.name).join(", "),
        leadId: newLead._id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}
