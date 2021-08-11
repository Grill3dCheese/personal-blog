const express = require("express"),
  router = express.Router(),
  Blog = require("../models/blog"),
  middleware = require("../middleware"),
  multer = require("multer"),
  cloudinary = require("cloudinary").v2,
  { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_CLOUD_KEY,
  api_secret: process.env.API_CLOUD_SECRET,
});
var storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "personalBlog",
  allowedFormats: ["jpg", "jpeg", "png"],
});
var parser = multer({ storage: storage });

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
router.post("/", middleware.isLoggedIn, parser.single("image"), (req, res) => {
  // get data from blog form and add to blog array
  const { title, entry, tags } = req.body;
  const author = {
    id: req.user._id,
    name: req.user.name,
  };
  const newBlog = {
    title: title,
    entry: entry,
    tags: tags,
    author: author,
    image: req.file.path,
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
router.get("/new", middleware.isUserAdmin, (req, res) => {
  res.render("blogs/new");
});

// show blog route
router.get("/:id", (req, res) => {
  Blog.findById(req.params.id)
    .populate("comments")
    .exec((err, foundBlog) => {
      if (err || !foundBlog) {
        console.log(err);
        req.flash(
          "error",
          "Sorry, that particular entry does not exist. Please try again."
        );
        res.redirect("/blog");
      } else {
        res.render("blogs/show", { blog: foundBlog });
      }
    });
});

// edit post route
router.get("/:id/edit", middleware.checkBlogOwnership, (req, res) => {
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
router.put("/:id", middleware.checkBlogOwnership, (req, res) => {
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
router.delete("/:id", middleware.checkBlogOwnership, (req, res) => {
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
