const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const session = require("express-session");

module.exports = (router) => {
    //
    // session config
    //

    const session_config = {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {},
    };

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
    router.use(session(session_config));
    router.use(passport.initialize());
    router.use(passport.session());

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    //
    // auth
    //

    router.use((req, res, next) => {
        res.locals.isAuthenticated = req.isAuthenticated();
        next();
    });

    router.get(
        "/login",
        passport.authenticate("auth0", {
            scope: "openid email profile",
        }),
        (req, res) => res.redirect("/")
    );

    router.get(
        "/callback",
        (req, res, next) => {
            passport.authenticate("auth0", (err, user, info) => {
                if (err) return next(err);
                if (!user) return res.redirect("/login");
                req.logIn(user, (err) => {
                    if (err) return next(err);
                    const returnTo = req.session.returnTo;
                    delete req.session.returnTo;
                    res.redirect(returnTo || "/profile");
                });
            })(req, res, next);
        },
        (req, res) => res.redirect("/")
    );

    router.get("/logout", (req, res) => {
        req.logOut();

        let returnTo = req.protocol + "://" + req.hostname;
        const port = req.socket.localPort;

        if (port !== undefined && port !== 80 && port !== 443) {
            returnTo =
                process.env.NODE_ENV === "production"
                    ? `${returnTo}/`
                    : `${returnTo}:${port}/`;
        }

        const logoutURL = new URL(
            `https://${process.env.AUTH0_DOMAIN}/v2/logout`
        );

        const searchString = querystring.stringify({
            client_id: process.env.AUTH0_CLIENT_ID,
            returnTo: returnTo,
        });
        logoutURL.search = searchString;

        res.redirect(logoutURL);
    });
};
