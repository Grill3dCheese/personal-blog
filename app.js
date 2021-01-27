require("dotenv").config();

const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  port = 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/blog");
});

app.listen(port, () => {
  console.log(`*DING!!* Service your app LIVE at localhost:${port}`);
});
