const cors = require("cors");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require('path');

dotenv.config();
const port = process.env.PORT;

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')))
app.options("*", cors());
app.set("view engine", "pug");
app.locals.basedir = path.join(__dirname, 'public');

app.get("/", (req, res) => {
  res.render("index", { title: "Client Portal - Home" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
