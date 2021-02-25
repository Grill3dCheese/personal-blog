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
  const { title, entry, image, tags } = req.body;
  const author = {
    id: req.user._id,
    name: req.user.name,
  };
  const newBlog = {
    title: title,
    entry: entry,
    image: image,
    tags: tags,
    author: author,
  };
  // Create a new post and save to the DB
  Blog.create(newBlog, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // redirect user back to blog index page
      req.flash("success", "✅ SHABLAM! A new blog entry has been created!");
      res.redirect("/blog");
    }
  });
});

// path to form to create new post
router.get("/new", (req, res) => {
  res.render("blogs/new");
});

// show blog route
router.get("/:id", (req, res) => {
  Blog.findById(req.params.id).exec((err, foundBlog) => {
    if (err || !foundBlog) {
      console.log(err);
      res.redirect("/blog");
    } else {
      res.render("blogs/show", { blog: foundBlog });
    }
  });
});

// edit post route
router.get("/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err || !foundBlog) {
      req.flash("error", "Apologies, that entry was not found!");
      res.redirect("back");
    } else {
      res.render("blogs/edit", { blog: foundBlog });
    }
  });
});

// update post route
router.put("/:id", (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, blog) => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      req.flash("success", "This entry has been successfully updated!");
      res.redirect("/blog/" + blog._id);
    }
  });
});

// destroy post route
router.delete("/:id", (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      req.flash(
        "error",
        "Hmmm, something went wrong. That entry was not deleted."
      );
      res.redirect("/blog");
    } else {
      req.flash("success", "BOOM! Success! Entry successfully deleted!");
      res.redirect("/blog");
    }
  });
});

module.exports = router;
