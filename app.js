require("dotenv").config();

const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  port = 3000,
  postRoute = require("./routes/posts");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`*DING!!* Your app is now LIVE at localhost:${port}`);
});
