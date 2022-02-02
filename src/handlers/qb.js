const express = require("express"),
    router = express.Router(),
    OAuthClient = require("intuit-oauth");

//
// QB SETUP
//

const oauthClient = new OAuthClient({
    clientId: process.env.QB_CLIENT_ID, // enter the apps `clientId`
    clientSecret: process.env.QB_CLIENT_SECRET, // enter the apps `clientSecret`
    environment: "sandbox", // enter either `sandbox` or `production`
    redirectUri: "http://localhost:3000/qbcallback", // enter the redirectUri
    logging: true, // by default the value is `false`
});

router.get("/qbauth", (req, res) => {
    const authUri = oauthClient.authorizeUri({
        scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
        state: "testState",
    });

    res.redirect(authUri);
});

router.get("/qbcallback", (req, res) => {
    // Parse the redirect URL for authCode and exchange them for tokens
    const parseRedirect = req.url;

    // Exchange the auth code retrieved from the **req.url** on the redirectUri
    oauthClient
        .createToken(parseRedirect)
        .then(function (authResponse) {
            console.log(
                "The Token is  " + JSON.stringify(authResponse.getJson())
            );
        })
        .catch(function (e) {
            console.error("The error message is :" + e.originalMessage);
            console.error(e.intuit_tid);
        });
});

module.exports = router
