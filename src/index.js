const express = require("express"),
    morgan = require("morgan"),
    path = require("path"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    bodyParser = require("body-parser"),
    local = require("../local.config.json"),
    db = require("./data/db"),
    auth = require("./auth");

const app = express().use(morgan("dev"));

const session_configuration = {
    secret: "something super secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
};

session_configuration.cookie.secure = false;

app.use(session(session_configuration));
app.use(cookieParser("something super secret"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

auth.init(app, (err, data) => {
    if(err){
        console.error("** FATAL ERROR WITH AUTH")
        console.error(err);
        process.exit(-1);
    }
})

// set up pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname + local.config.views_dir));

app.locals.basedir = path.join(__dirname, local.config.static_content);
app.use(express.static(app.locals.basedir));

app.get("/", (req, res) => res.render("index"));

app.get("/login", (req, res) => {
    res.render("login", { title: "login" });
});

app.post("/login", auth.authenticate_route);

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

function authPassed(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

db.init((err, results) => {
    if (err) {
        console.error("** FATAL ERROR ON STARTUP");
        console.error(err);
        process.exit(-1);
    }

    console.log(`** Database initialized, listening on port ${PORT}`);
    app.listen(PORT);
});
