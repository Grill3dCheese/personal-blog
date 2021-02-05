const express = require("express"),
  router = express.Router(),
  Blog = require("../models/blog"),
  middleware = require("../middleware");

// index of blogs
router.get("/", function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render("blogs/index", { blogs: blogs, page: "blogs" });
    }
  });
});

module.exports = router;
