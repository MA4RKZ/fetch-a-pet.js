const Mongoose = require("../db/conn");
const { Schema } = Mongoose;

const Pet = Mongoose.model(
  "Pet",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      weight: {
        type: String,
        required: true,
      },
      img: {
        type: Array,
        required: true,
      },
      avaible: {
        type: Boolean,
      },
      user: Object,
      adopter: Object,
    },
    { timestamps: true }
  )
);

module.exports = Pet;
