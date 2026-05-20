import connectDB from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json(
      { status: "Success", message: "Database connected perfectly!" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { status: "Error", message: error.message },
      { status: 500 },
    );
  }
}
