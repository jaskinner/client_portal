const express = require("express");
const morgan = require("morgan");
const path = require("path");


const app = express().use(morgan("dev"));

const PORT = process.env.PORT || 3000;

app.set("view engine", "pug");
app.use(express.static(__dirname + "/../public"));

app.locals.basedir = path.join(__dirname, "/../public");

app.get("/", (req, res) => res.render("index"));

app.get("/login", (req, res) => {
  res.render("login", { title: "login" });
});

app.post("/login", (req, res) => {
    
})

// generic route not found
// TODO: replace with better function
app.get("*", (req, res) => res.end("404: Route not found"));

app.listen(3000);
