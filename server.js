const express = require("express");
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.render("home");
});
// assets
app.use(express.static("public"));

// set template engine
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");
app.use(expressLayout);

app.listen(PORT, () => {
  console.log(`listing to port ${PORT}`);
});
