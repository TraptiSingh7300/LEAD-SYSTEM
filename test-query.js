const mongoose = require("mongoose");

async function diagnostic() {
  try {
    await mongoose.connect("mongodb://localhost:27017/lead-system_db");
    console.log("Connected to DB...");

    const rawProviders = await mongoose.connection.db
      .collection("providers")
      .find({})
      .toArray();

    console.log(`\nFound ${rawProviders.length} providers in the database.`);
    if (rawProviders.length > 0) {
      console.log("Sample Provider Document from DB:");
      console.dir(rawProviders[0], { depth: null });
    } else {
      console.log(
        "❌ The providers collection is completely EMPTY! Your seed data didn't stick or went to a different collection name.",
      );
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}

diagnostic();
