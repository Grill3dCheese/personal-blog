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
          req.flash(
            "error",
            "Sorry, for some reason that didn't work. Please try again!"
          );
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.email;
          // save comment
          comment.save();
          blog.comments.push(comment);
          blog.save();
          req.flash("success", "Successfully added your comment! Thanks!");
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
    Blog.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: req.comment.id,
        },
      },
      function (err) {
        if (err) {
          console.log(err);
          req.flash("error", err.message);
          res.redirect("back");
        }
        req.flash("success", "Comment deleted successfully!");
        res.redirect("/blog/" + req.params.id);
      }
    );
  }
);

module.exports = router;
