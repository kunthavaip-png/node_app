const mongoose = require("mongoose");
const Role = require("../models/Role");
const Menu = require("../models/Menu");
const RoleMenuMapping = require("../models/RoleMenuMapping");
const connectDB = require("../config/db");

connectDB().then(async () => {
  try {
    // Clear previous mappings
    await RoleMenuMapping.deleteMany({});

    // Fetch roles and menus
    const roles = await Role.find({});
    const menus = await Menu.find({});

    const mappings = [];

    // Example: assign all menus to admin role, and only Dashboard+Reports to editor
    for (let role of roles) {
      if (role.name === "admin") {
        for (let menu of menus) {
          mappings.push({ roleId: role._id, menuId: menu._id });
        }
      } else if (role.name === "HR") {
        const allowedMenus = menus.filter(m => m.name === "Dashboard" || m.name === "Reports");
        allowedMenus.forEach(m => mappings.push({ roleId: role._id, menuId: m._id }));
      }
    }

    const createdMappings = await RoleMenuMapping.insertMany(mappings);
    console.log("Role-Menu mappings seeded:", createdMappings);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});