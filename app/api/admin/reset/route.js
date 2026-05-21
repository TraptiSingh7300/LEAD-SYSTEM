
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const dynamic = 'force-dynamic';

const Provider = mongoose.models.Provider || mongoose.model("Provider");

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json().catch(() => ({}));
    const { providerId } = body;

    if (providerId !== undefined) {
      const result = await Provider.updateOne(
        { id: providerId },
        {
          $set: {
            remainingQuota: 10,
            leadsReceivedCount: 0,
            lastAssignedAt: null,
          },
        },
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { message: "Provider not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(
        { message: `Provider ${providerId} successfully restored to 10!` },
        { status: 200 },
      );
    } else {
      await Provider.updateMany(
        {},
        {
          $set: {
            remainingQuota: 10,
            leadsReceivedCount: 0,
            lastAssignedAt: null,
          },
        },
      );

      const Lead = mongoose.models.Lead || mongoose.model("Lead");
      await Lead.deleteMany({});

      return NextResponse.json(
        {
          message: "Global reset complete: All provider balances regenerated.",
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("ADMIN RESET SYSTEM ERROR:", error);
    return NextResponse.json(
      { message: "Failed to process reset action.", error: error.message },
      { status: 500 },
    );
  }
}
