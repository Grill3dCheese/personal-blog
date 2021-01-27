require("dotenv").config();

const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  port = 3000,
  blogRoute = require("./routes/blogs");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/blog", blogRoute);

app.listen(port, () => {
  console.log(`Now serving your blog app on localhost:${port}`);
});
