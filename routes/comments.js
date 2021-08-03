const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Blog = require("../models/blog"),
  Comment = require("../models/comment"),
  middleware = require("../middleware");

// new comment
router.get("/new", middleware.isLoggedIn, function (req, res) {
  Blog.findById(req.params.id, function (err, blog) {
    if (err || !blog) {
      console.log(err);
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      res.render("comments/new", { blog: blog });
    }
  });
});

// create comment
router.post("/", middleware.isLoggedIn, function (req, res) {
  Blog.findById(req.params.id, function (err, blog) {
    if (err || !blog) {
      console.log(err);
      req.flash("error", "Blog not found!");
      res.redirect("/blog");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err || !comment) {
          req.flash("error", "Error, something went wrong");
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          blog.comments.push(comment);
          blog.save();
          req.flash("success", "Successfully added comment");
          res.redirect("/blog/" + blog._id);
        }
      });
    }
  });
});

// comments edit route
router.get(
  "/:comment_id/edit",
  middleware.checkCommentOwnership,
  function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err || !foundComment) {
        req.flash("error", "Error, something went wrong");
        res.redirect("back");
      } else {
        req.comment_id = foundComment;
        res.render("comments/edit", {
          blog_id: req.params.id,
          comment: foundComment,
        });
      }
    });
  }
);

// comment update route
router.put(
  "/:comment_id",
  middleware.checkCommentOwnership,
  function (req, res) {
    Comment.findByIdAndUpdate(
      req.params.comment_id,
      req.body.comment,
      function (err, updatedComment) {
        if (err) {
          req.flash("error", "Error, something went wrong");
          res.redirect("back");
        } else {
          req.flash("success", "Comment updated!");
          res.redirect("/blog/" + req.params.id);
        }
      }
    );
  }
);

// delete comment route
router.delete(
  "/:comment_id",
  middleware.checkCommentOwnership,
  function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
      if (err) {
        req.flash("error", "Error, something went wrong");
        res.redirect("back");
      } else {
        req.flash("success", "Comment deleted");
        res.redirect("/blog/" + req.params.id);
      }
    });
  }
);

module.exports = router;
