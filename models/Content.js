const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  topics: String,
  link: String,
  answer: String,
});

module.exports =
  mongoose.models.Content || mongoose.model("Content", ContentSchema);
