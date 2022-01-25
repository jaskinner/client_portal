const express = require("express"),
    morgan = require("morgan"),
    path = require("path"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    bodyParser = require("body-parser"),
    flash = require("express-flash");

const app = express().use(morgan("combined"));

const session_configuration = {
    secret: "something super secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
};

session_configuration.cookie.secure = false;

app.use(flash);
app.use(session(session_configuration));
app.use(cookieParser("something super secret"));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const users = {
    id12345: {
        id: 12345,
        username: "jaskinner",
        password: "bish",
    },
    id1: {
        id: 1,
        username: "admin",
        password: "admin123",
    },
};

passport.use(
    new LocalStrategy((username, password, done) => {
        for (userid in users) {
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
    if (users["id"] + user.id) {
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

app.post("/login", (req, res) => {
    passport.authenticate("local", {
        successRedirect: "/account",
        failureRedirect: "/login",
        successFlash: { message: "Welcome back!" },
        failureFlash: true,
    });
});

// generic route not found
// TODO: replace with better function
app.get("*", (req, res) => res.end("404: Route not found"));

app.listen(3000);
