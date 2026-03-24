const mongoose = require("mongoose");

const roleMenuMappingSchema = new mongoose.Schema({
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
  
},{timestamps: true},);

module.exports = mongoose.model("RoleMenuMapping", roleMenuMappingSchema);