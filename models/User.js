const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true
      }
    ],

    

    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);


userSchema.statics.findActive = function (filter = {}) {
  return this.find({
    ...filter,
    
    deletedAt: null
  });
};


userSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

module.exports = mongoose.model("User", userSchema);