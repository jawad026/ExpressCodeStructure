const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: String,
    },
    origan: {
      type: String,
    },
    User: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
