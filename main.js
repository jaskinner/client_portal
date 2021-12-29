const cookieParse = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const admin = require("firebase-admin")

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://skinner-consulting-portal-default-rtdb.firebaseio.com/"
});

const csrfMiddleware = csrf({ cookie: true });

const PORT = process.env.PORT || 3000;
const app = express();

app.set("view engine", "pug");
app.use(express.static("static"));

app.use(bodyParser.json());
app.use(cookieParse());
app.use(csrfMiddleware);

app.locals.basedir = path.join(__dirname, "static");

app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

app.get("/login", function (req, res) {
  res.render("login", { title: "login" });
});

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/pricing", (req, res) => {
  res.render("pricing", { title: "Pricing" });
});

app.get("/faqs", (req, res) => {
  res.render("faqs", { title: "FAQs" });
});

app.get("/features", (req, res) => {
  res.render("features", { title: "Features" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/account", (req, res) => {
  res.render("account", { title: "Account Home" });
});

app.get("/account/details", (req, res) => {
  res.render("accountDetails", { title: "Account Details" });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
