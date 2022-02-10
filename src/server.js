const express = require("express"),
    morgan = require("morgan"),
    path = require("path"),
    session = require("express-session"),
    passport = require("passport"),
    Auth0Strategy = require("passport-auth0"),
    authRouter = require("./auth"),
    appRouter = require("./routes"),
    ticketRouter = require("./data/tickets"),
    { connectToServer } = require("./data"),
    bodyParser = require("body-parser");

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(authRouter);

//
// ROUTES
//

app.use(ticketRouter);
app.use(appRouter);

app.use((err, req, res, next) => {
    res.status(500);
    res.end(err + "\n");
});

//
// GO
//

connectToServer((err) => {
    if (err) return err;
    console.log("Connecting to app");

    app.listen(PORT);
});
