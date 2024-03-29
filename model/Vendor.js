const mongoose = require("mongoose");

const venderSch = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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
    firm: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Firm",
      },
    ],
  },
  { timestamps: true }
);

const Vender = mongoose.model("Vender", venderSch);

module.exports = Vender;
