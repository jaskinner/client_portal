const cors = require("cors");
const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();
const port = process.env.PORT;

app.use(cors());
app.use(express.static("public"));
app.options("*", cors());
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index", { title: "hey there" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
