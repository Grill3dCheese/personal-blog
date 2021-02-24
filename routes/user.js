const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  middleware = require("../middleware"),
  User = require("../models/user"),
  Post = require("../models/blog"),
  async = require("async"),
  nodemailer = require("nodemailer"),
  crypto = require("crypto");

// show register form
router.get("/register", (req, res) => {
  res.render("users/register", { page: "register" });
});

// post register logic
router.post("/register", (req, res) => {
  const { username, name, email, avatar } = req.body;
  const newUser = new User({
    username: username,
    name: name,
    email: email,
    avatar: avatar,
  });

  if (req.body.adminCode === process.env.SECRETCODE) {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register", { error: err.message });
    }
    passport.authenticate("local")(req, res, () => {
      req.flash(
        "success",
        "Hiya, " +
          user.name +
          "! Thanks for creating a new account. Welcome to the blog!"
      );
      res.redirect("/blog");
    });
  });
});

// show login form
router.get("/login", function (req, res) {
  res.render("login", { page: "login" });
});

// login post route logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/blog",
    successFlash: "Hey there! Welcome back! 👋",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

// logout route
router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "You've been logged out successfully! See you soon.");
  res.redirect("/blog");
});

module.exports = router;
