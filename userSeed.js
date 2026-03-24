require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const { hashPassword } = require("./utils/passwordUtils");
const connectDB = require("./config/db");

const seed = async () => {
  try {
    await connectDB();

    const hashed = await hashPassword("1234");    

    await User.create([
      {
        username: "admin",
        password: hashed,
        role_ids: [
          new mongoose.Types.ObjectId("69c10daed9c6d8ed1228942a"),
          new mongoose.Types.ObjectId("69c10e16d9c6d8ed1228942e")
        ],
         deleted_at: null
      },
      {
        username: "HR",
        password: hashed,
        role_ids: [
          new mongoose.Types.ObjectId("69c10e0cd9c6d8ed1228942c"),
          new mongoose.Types.ObjectId("69c10e16d9c6d8ed1228942e")
        ],
         deleted_at: null
      }
    ]);

    console.log("Users inserted successfully ✅");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();