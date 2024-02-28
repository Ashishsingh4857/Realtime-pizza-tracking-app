require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");

const MongoDBStore = require("connect-mongodb-session")(session);

const PORT = process.env.PORT || 3000;
// database connection
mongoose.connect(process.env.MONGO_CONNECTION_URL);

// session store
let mongoStore = new MongoDBStore({
  uri: process.env.MONGO_CONNECTION_URL,
  databaseName: "pizza",
  collection: "sessions",
});

// session config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hour
    // cookie: { maxAge: 1000 * 10 }, // 10 sec
  })
);

app.use(express.json());
app.use(flash());
// assets
app.use(express.static("public"));

// global middleware function
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
// set template engine
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");
app.use(expressLayout);

// router
const route = require("./routes/web");
route(app);

app.listen(PORT, () => {
  console.log(`listing to port ${PORT}`);
});
