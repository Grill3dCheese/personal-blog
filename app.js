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
  Blog = require("./models/blog"),
  User = require("./models/user"),
  port = 3000,
  blogRoute = require("./routes/blogs"),
  userRoute = require("./routes/user");

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost:27017/personal_blog", {
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
app.use((req, res, next) => {
  res.locals.dayjs = dayjs;
  next();
});

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
  next();
});

app.use("/blog", blogRoute);
app.use("/blog/user", userRoute);

app.listen(port, () => {
  console.log(`Now serving your blog app on localhost:${port}`);
});
