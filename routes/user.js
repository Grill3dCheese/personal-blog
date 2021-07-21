const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  middleware = require("../middleware"),
  User = require("../models/user"),
  Blog = require("../models/blog"),
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
      return res.render("users/register", { error: err.message });
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
router.get("/login", (req, res) => {
  res.render("users/login", { page: "login" });
});

// login post route logic
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/blog/user/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Hey, " + req.user.name + "! Welcome back 👋");
    res.redirect("/blog");
  }
);

// logout route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You've been logged out successfully! See you soon.");
  res.redirect("/blog");
});

// user profile
router.get("/:id", (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err) {
      req.flash("error", err);
      res.redirect("back");
    }
    Blog.find()
      .where("author.id")
      .equals(foundUser._id)
      .exec((err, posts) => {
        if (err) {
          req.flash("error", err);
          res.redirect("back");
        }
        res.render("users/show", { user: foundUser, posts: posts });
      });
  });
});

// forgot password
router.get("/forgot", function (req, res) {
  res.render("users/forgot");
});

router.post("/forgot", function (req, res, next) {
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.username }, function (err, user) {
          if (!user) {
            req.flash("error", "No account with that email address exists.");
            return res.redirect("/forgot");
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          host: process.env.MAILHOST,
          port: 465,
          secure: true,
          auth: {
            user: process.env.MAILUN,
            pass: process.env.MAILEPW,
          },
        });
        var mailOptions = {
          to: user.email,
          from: "hello@keithmckenna.com",
          subject: "Blog Password Reset",
          text:
            "You are receiving this email because you, or someone on your behalf, has requested to reset the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.headers.host +
            "/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          console.log("mail sent");
          req.flash(
            "success",
            "An e-mail has been sent to " +
              user.email +
              " with further instructions."
          );
          done(err, "done");
        });
      },
    ],
    function (err) {
      if (err) return next(err);
      res.redirect("/forgot");
    }
  );
});

router.get("/reset/:token", function (req, res) {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    function (err, user) {
      if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/forgot");
      }
      res.render("reset", { token: req.params.token });
    }
  );
});

router.post("/reset/:token", function (req, res) {
  async.waterfall(
    [
      function (done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
          },
          function (err, user) {
            if (!user) {
              req.flash(
                "error",
                "Password reset token is invalid or has expired."
              );
              return res.redirect("back");
            }
            if (req.body.password === req.body.confirm) {
              user.setPassword(req.body.password, function (err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function (err) {
                  req.logIn(user, function (err) {
                    done(err, user);
                  });
                });
              });
            } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect("back");
            }
          }
        );
      },
      function (user, done) {
        var smtpTransport = nodemailer.createTransport({
          host: process.env.MAILHOST,
          port: 465,
          secure: true,
          auth: {
            user: process.env.MAILUN,
            pass: process.env.MAILEPW,
          },
        });
        var mailOptions = {
          to: user.email,
          from: "hello@keithmckenna.com",
          subject: "Your blog password has been changed",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your blog account " +
            user.email +
            " has just been changed.\n",
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          req.flash("success", "Success! Your password has been changed.");
          done(err);
        });
      },
    ],
    function (err) {
      res.redirect("/blog");
    }
  );
});

module.exports = router;
