const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const session = require("express-session");
const config = require("../../../config");
const MongoStore = require("connect-mongo");

const { env } = config.app;
const { db_host, db_name } = config.db;
const {
    auth0_domain,
    auth0_callback_url,
    auth0_client_id,
    auth0_client_secret,
    session_secret,
} = config.auth;

module.exports = (router) => {
    //
    // session config
    //

    // TODO: figure out production implementation of session storage

    const session_config = {
        secret: session_secret,
        resave: false,
        saveUninitialized: false,
        cookie: {},
        store: MongoStore.create({
            mongoUrl: `${db_host}/${db_name}`,
        }),
    };

    router.use(session(session_config));

    //
    // passport config
    //

    const strategy = new Auth0Strategy(
        {
            domain: auth0_domain,
            clientID: auth0_client_id,
            clientSecret: auth0_client_secret,
            callbackURL: auth0_callback_url,
        },
        (accessToken, refreshToken, extraParams, profile, done) => {
            return done(null, profile);
        }
    );

    passport.use(strategy);
    router.use(passport.authenticate("session"));

    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            cb(null, {
                id: user.id,
                username: user.username,
                name: user.displayName,
            });
        });
    });

    passport.deserializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user);
        });
    });

    //
    // auth
    //

    router.get("/login", passport.authenticate("auth0"));

    router.get(
        "/auth/callback",
        passport.authenticate("auth0", {
            successRedirect: "/",
            failureRedirect: "/nope",
        })
    );

    router.get("/logout", (req, res) => {
        let logout = async () => {
            req.logOut();

            let returnTo = req.protocol + "://" + req.hostname;
            const port = req.socket.localPort;

            if (port !== undefined && port !== 80 && port !== 443) {
                returnTo =
                    env === "production"
                        ? `${returnTo}/`
                        : `${returnTo}:${port}/`;
            }

            const logoutURL = new URL(`https://${auth0_domain}/v2/logout`);

            const searchString = querystring.stringify({
                client_id: auth0_client_id,
                returnTo: returnTo,
            });
            logoutURL.search = searchString;
        };
        logout()
            .then(() => {
                req.session.destroy((err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("Session is destroyed");
                    }
                });
            })
            .catch((e) => console.log(e));
    });
};
