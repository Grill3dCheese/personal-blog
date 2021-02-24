const mongoose = require("mongoose");

// schema setup
const blogSchema = new mongoose.Schema({
  title: String,
  entry: String,
  image: String,
  tags: String,
  createdAt: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Blog", blogSchema);
