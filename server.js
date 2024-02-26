const express = require("express");
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");

const PORT = process.env.PORT || 3000;

// assets
app.use(express.static("public"));

// set template engine
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");
app.use(expressLayout);

// route
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/cart", (req, res) => {
  res.render("customers/cart");
});

app.listen(PORT, () => {
  console.log(`listing to port ${PORT}`);
});
