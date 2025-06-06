const mongoose = require("mongoose");

const connectionString = "mongodb+srv://Team4:1234@cluster0.pdc2xzl.mongodb.net/TM-T4?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB Atlas.");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
