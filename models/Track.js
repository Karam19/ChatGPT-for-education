const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    unique: true,
    trim: true,
    maxLength: [40, "Title cannot be more than 40 characters"],
  },
  link: {
    type: String,
    required: [true, "Please add a title"],
    maxLength: [100, "Link cannot be more than 100 characters"],
  },
  contents: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "content",
  },
});

module.exports = mongoose.models.Track || mongoose.model("Track", TrackSchema);
