const cookieParse = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://skinner-consulting-portal-default-rtdb.firebaseio.com/",
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

app.get("/login", (req, res) => {
  res.render("login", { title: "login" });
});

app.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get("/account", (req, res) => {
  const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then(() => {
      res.render("account");
    })
    .catch((error) => {
      res.redirect("/login");
    });
});

app.get("/logout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/login");
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

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
