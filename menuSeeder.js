require("dotenv").config();
const mongoose = require("mongoose");
const Menu = require("./models/Menu");
const connectDB = require("./config/db");

const menus = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Users", path: "/users" },
  { name: "Settings", path: "/settings" },
  { name: "Reports", path: "/reports" },
];

connectDB().then(async () => {
  try {
    await Menu.deleteMany({}); // clear previous menus
    const createdMenus = await Menu.insertMany(menus);
    console.log("Menus seeded:", createdMenus);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});