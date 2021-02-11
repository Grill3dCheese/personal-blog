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

// create blog
router.post("/", (req, res) => {
  // get data from blog form and add to blog array
  const { title, entry, image, tags, category } = req.body;
  // const author = {
  //   id: req.user._id,
  //   username: req.user.username
  // };
  const newBlog = {title: title, entry: entry, image: image, tags: tags, category: category};
  // Create a new post and save to the DB
  Blog.create(newBlog, (err, newlyCreated) => {
    if(err){
      console.log(err);
    } else {
      // redirect user back to blog index page
      console.log(newlyCreated);
      res.redirect("/blog");
    }
  });
});

// path to form to create new post
router.get("/new", (req, res) => {
  res.render("blogs/new");
});

module.exports = router;
