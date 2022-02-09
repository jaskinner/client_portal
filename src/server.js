const express = require("express"),
    morgan = require("morgan"),
    path = require("path"),
    session = require("express-session"),
    passport = require("passport"),
    Auth0Strategy = require("passport-auth0"),
    authRouter = require("./handlers/auth");

//
// initialize app, PORT, and env
//

require("dotenv").config();
const app = (module.exports = express().use(morgan("dev")));
const PORT = process.env.PORT || 3000;

//
// session config
//

const session_config = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {},
};

if (app.get("env") === "production") session_config.cookie.secure = true;

//
// set up pug
//

app.set("view engine", "pug");
app.set("views", path.join(__dirname + "/views"));

//
// serve static files
//

app.locals.basedir = path.join(__dirname, "../public");
app.use(express.static(app.locals.basedir));

//
// passport config
//

const strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL,
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
        return done(null, profile);
    }
);

passport.use(strategy);
app.use(session(session_config));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

//
// auth
//

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

app.use("/", authRouter);

//
// ROUTES
//

const secured = (req, res, next) => {
    if (req.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
};

app.get("/", (req, res) => res.render("index"));

app.get("/profile", secured, (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    res.render("profile", { title: "Profile", userProfile: userProfile });
});

//
// generic route not found
//

app.get("*", (req, res) => res.end("404: Route not found"));

app.use((err, req, res, next) => {
    res.status(500);
    res.end(err + "\n");
});

//
// GO
//

app.listen(PORT);
