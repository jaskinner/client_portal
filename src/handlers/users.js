const users_data = require("../data/users"),
    helpers = require("./helpers");

exports.version = "0.1.0";

exports.list_users = (req, res) => {
    console.log("** Fetching users")
    users_data.all_users((err, results) => {
        if (err) {
            helpers.send_failure(res, "fail", err);
        } else {
            helpers.send_success(res, { users: results });
        }
    });
};
