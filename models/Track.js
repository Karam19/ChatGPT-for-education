const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema({
  title: String,
  link: String,
  contents: Array,
});

module.exports = mongoose.models.Track || mongoose.model("Track", TrackSchema);
