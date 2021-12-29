const cors = require("cors");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require('path');

const siteName = "Client Portal - "

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')))
app.options("*", cors());
app.set("view engine", "pug");
app.locals.basedir = path.join(__dirname, 'public');

app.get("/", (req, res) => {
  res.render("index", { title: siteName + "Home" });
});

app.get("/pricing", (req, res) => {
  res.render("pricing", { title: siteName + "Pricing" });
});

app.get("/faqs", (req, res) => {
  res.render("faqs", { title: siteName + "FAQs" });
});

app.get("/features", (req, res) => {
  res.render("features", { title: siteName + "Features" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: siteName + "About" });
});

app.get("/account", (req, res) => {
  res.render("account", { title: siteName + "Account Home" });
});

app.get("/account/details", (req, res) => {
  res.render("accountDetails", { title: siteName + "Account Details" });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
