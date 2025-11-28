const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbUri = process.env.DATABASE;
    console.log("process.env.NODE_ENV");
    console.log("process.env.DATABASE");
    console.log(process.env.NODE_ENV);
    console.log(process.env.DATABASE);

    await mongoose.connect(dbUri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
