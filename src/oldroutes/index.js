const { Router } = require("express");
const router = Router();

const secured = (req, res, next) => {
    if (req.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
};

router.get("/profile", secured, (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    res.render("profile", { title: "Profile", userProfile: userProfile });
});

module.exports = router;
