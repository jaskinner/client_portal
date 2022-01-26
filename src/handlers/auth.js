const passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy;

const users = {
    id123456: { id: 123456, username: "jonskin", password: "boo" },
    id1: { id: 1, username: "admin", password: "admin" },
};

exports.init = (app, cb) => {
    app.use(passport.initialize());
    app.use(passport.session());

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
};

exports.authenticate_route = passport.authenticate("local", {
    successRedirect: "/account",
    failureRedirect: "/login",
});

exports.authPassed = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
};
