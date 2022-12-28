const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  topics: {
    type: String,
    required: [true, "Please add topics"],
    trim: true,
    maxLength: [200, "Topics cannot be more than 200 characters"],
  },
  link: {
    type: String,
    required: [true, "Please attach a link"],
    maxLength: [100, "Link cannot be more than 100 characters"],
  },
  answer: {
    type: String,
  },
});

module.exports =
  mongoose.models.Content || mongoose.model("Content", ContentSchema);
