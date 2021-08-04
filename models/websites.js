const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const websitesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = Mongoose.model("Websites", websitesSchema);
