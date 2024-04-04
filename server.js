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
const passport = require("passport");
Emitter = require("events");

const PORT = process.env.PORT || 3000;
// database connection
mongoose.connect(process.env.MONGO_CONNECTION_URL);

// session store
let mongoStore = new MongoDBStore({
  uri: process.env.MONGO_CONNECTION_URL,
  databaseName: "pizza",
  collection: "sessions",
});

// event emitter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);
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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// passport config
const passportinit = require("./app/config/passport");
passportinit(passport);
app.use(passport.initialize());
app.use(passport.session());

// assets
app.use(express.static("public"));

// global middleware function
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});
app.use(flash());
// set template engine
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");
app.use(expressLayout);

// router
const route = require("./routes/web");
route(app);

app.use((req, res) => {
  res.status(404).render("errors/404");
});

const server = app.listen(PORT, () => {
  console.log(`listing to port ${PORT}`);
});

// socket

const io = require("socket.io")(server);
io.on("connection", (socket) => {
  // Join

  socket.on("join", (orderId) => {
    socket.join(orderId);
  });
});

eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});

eventEmitter.on("orderPlaced", (data) => {
  io.to("adminRoom").emit("orderPlaced", data);
});
