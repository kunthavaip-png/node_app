const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    path: { type: String, required: true }, // e.g., "/dashboard"
    icon: { type: String }, // optional icon
    parent_menu_id: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", default: null }, // optional for nested menus
    deletedAt: {type: Date,default: null},
  },
    {timestamps: true},
);

module.exports = mongoose.model("Menu", menuSchema);