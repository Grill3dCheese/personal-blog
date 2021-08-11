const Blog = require("../models/blog"),
      Comment = require("../models/comment"),
      User = require("../models/user");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkBlogOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Blog.findById(req.params.id, (err, foundBlog) => {
      if (err || !foundBlog) {
        console.log(err);
        req.flash(
          "error",
          "Sorry, we're not able to locate that entry. Please try again."
        );
        res.redirect("/blog");
      } else {
        //does user own the post?
        if (foundBlog.author.id.equals(req.user._id) || req.user.isAdmin) {
          req.post = foundBlog;
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("/blog");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to perform that action.");
    res.redirect("/blog/user/login");
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        console.log(err);
        req.flash("error", "Comment not found!");
        res.redirect("back");
      } else {
        //does user own the comment?
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          req.comment = foundComment;
          next();
        } else {
          req.flash(
            "error",
            "Apologies, you don't have permission to do that."
          );
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that.");
  res.redirect("/blog/user/login");
};

middlewareObj.isUserAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  req.flash("error", "Apologies, you don't have permission to do that.");
  res.redirect("/blog");
};

module.exports = middlewareObj;
