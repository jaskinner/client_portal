const express = require("express"),
    morgan = require("morgan"),
    path = require("path"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    bodyParser = require("body-parser"),
    flash = require("express-flash"),
    MongoClient = require("mongodb").MongoClient;

const app = express().use(morgan("dev"));

const url = "mongodb://127.0.0.1:27017/sc_db";
const db = "";
MongoClient.connect(url, (err, dbase) => {
    if (err) return cb(err);
    console.log("connected to server");
    db = dbase;
});

const session_configuration = {
    secret: "something super secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
};

session_configuration.cookie.secure = false;

app.use(flash());
app.use(session(session_configuration));
app.use(cookieParser("something super secret"));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

var users = {
    id123456: { id: 123456, username: "jonskin", password: "boo" },
    id1: { id: 1, username: "admin", password: "admin" },
};

passport.use(
    new LocalStrategy((username, password, done) => {
        for (let userid in users) {
            const user = users[userid];
            if (user.username.toLowerCase() === username.toLowerCase()) {
                if (user.password === password) {
                    return done(null, user);
                }
            }
        }
    })
);

passport.serializeUser((user, done) => {
    if (users["id" + user.id]) {
        done(null, "id" + user.id);
    } else {
        done(new Error("CANT_SERIALIZE_INVALID_USER"));
    }
});

passport.deserializeUser((userid, done) => {
    if (users[userid]) {
        done(null, users[userid]);
    } else {
        done(new Error("CANT_FIND_USER_TO_SERIALIZE"));
    }
});

const PORT = process.env.PORT || 3000;

app.set("view engine", "pug");
app.use(express.static(__dirname + "/../public"));

app.locals.basedir = path.join(__dirname, "/../public");

app.get("/", (req, res) => res.render("index"));

app.get("/login", (req, res) => {
    res.render("login", { title: "login" });
});

app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/account",
        failureRedirect: "/login",
        successFlash: { message: "Welcome back!" },
        failureFlash: true,
    })
);

app.get("/account", authPassed, (req, res) => {
    res.render("account");
});

// generic route not found
// TODO: replace with better function
app.get("*", (req, res) => res.end("404: Route not found"));

app.use((err, req, res, next) => {
    res.status(500);
    res.end(err + "\n");
});

app.listen(PORT);

function authPassed(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}
