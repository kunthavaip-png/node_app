const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);


roleSchema.statics.findActive = function (filter = {}) {
  return this.find({
    ...filter,
    deletedAt: null
  });
};


roleSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

module.exports = mongoose.model("Role", roleSchema);