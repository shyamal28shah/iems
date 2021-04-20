const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
    modifiedUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
    recStatus: {
      type: String,
      default: "A",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Admin = mongoose.model("tbladmin", AdminSchema);
