require("dotenv").config();

module.exports = {
    app: require("./app"),
    auth: require("./auth"),
    db: require("./db"),
};
