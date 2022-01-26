const db = require("./db");

exports.version = "0.1.0";

exports.all_users = (callback) => {
    db.users.find().toArray(callback)
};
