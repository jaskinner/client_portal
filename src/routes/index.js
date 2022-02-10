const express = require("express"),
    router = express.Router();

const secured = (req, res, next) => {
    if (req.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
};

router.get("/", (req, res) => res.render("index"));

router.get("/profile", secured, (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    console.log(userProfile);
    res.render("profile", { title: "Profile", userProfile: userProfile });
});

router.get("/test", (req, res) => {
    res.send("done");
});

router.get("*", (req, res) => res.render("404"));

module.exports = router;
