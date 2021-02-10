const mongoose = require("mongoose");

// schema setup
let blogSchema = new mongoose.Schema({
  title: String,
  entry: String,
  image: String,
  tags: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Blog", blogSchema);
