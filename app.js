require("dotenv").config();

const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  bodyParser = require("body-parser"),
  dayjs = require("dayjs"),
  relativeTime = require("dayjs/plugin/relativeTime"),
  Blog = require("./models/blog"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  port = 3000,
  blogRoute = require("./routes/blogs"),
  commentRoute = require("./routes/comments"),
  userRoute = require("./routes/user");

dayjs.extend(relativeTime);

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://127.0.0.1/personal_blog", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log(`Database connected`))
  .catch((err) => console.log(`Database connection error: ${err.message}`));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());

// Passport Configuration
app.use(
  require("express-session")({
    secret: process.env.XTRA_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.dayjs = dayjs;
  next();
});

app.use("/blog", blogRoute);
app.use("/blog/:id/comments", commentRoute);
app.use("/blog/user", userRoute);

app.listen(port, () => {
  console.log(`Now serving your blog app on localhost:${port}`);
});
