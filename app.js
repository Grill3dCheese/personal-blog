require("dotenv").config();

const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  bodyParser = require("body-parser"),
  dayjs = require("dayjs"),
  Blog = require("./models/blog"),
  port = 3000,
  blogRoute = require("./routes/blogs");

  let now = dayjs().isBefore(dayjs("2021-02-12"));

  console.log(now);

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost:27017/personal_blog", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Database connected`))
  .catch((err) => console.log(`Database connection error: ${err.message}`));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use("/blog", blogRoute);

app.listen(port, () => {
  console.log(`Now serving your blog app on localhost:${port}`);
});
