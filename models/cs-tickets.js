const { string } = require("joi");
const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const ticketsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  website: {
    type: Schema.Types.ObjectId,
    ref: "Websites",
  },
  issue: {
    type: String,
    required: true,
  },
  img: String,
  datesl: String,
  dateau: String,
});

module.exports = Mongoose.model("Tickets", ticketsSchema);
