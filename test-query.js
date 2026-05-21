import "dotenv/config";
import mongoose from "mongoose";

async function diagnostic() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not defined in your environment variables!",
      );
    }

    console.log("⏳ Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to DB safely...");

    const rawProviders = await mongoose.connection.db
      .collection("providers")
      .find({})
      .toArray();

    console.log(`\n📊 Found ${rawProviders.length} providers in the database.`);

    if (rawProviders.length > 0) {
      console.log("💎 Sample Provider Document from DB:");
      console.dir(rawProviders[0], { depth: null });
    } else {
      console.log(
        "❌ The providers collection is completely EMPTY! Your seed data didn't stick or went to a different database.",
      );
    }
  } catch (err) {
    console.error("💥 Diagnostic Failure:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed cleanly.");
  }
}

diagnostic();
