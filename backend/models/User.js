const Mongoose = require("../db/conn");
const { Schema } = Mongoose;

const User = Mongoose.model(
  "User",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      img: {
        type: String,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = User;
