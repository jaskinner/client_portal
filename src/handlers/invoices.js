const invoices_data = require("../data/invoices"),
    helpers = require("./helpers");

exports.version = "0.1.0";

exports.list_invoices = (req, res) => {
    console.log("** Fetching invoices")
    invoices_data.all_invoices((err, results) => {
        if (err) {
            helpers.send_failure(res, "fail", err);
        } else {
            helpers.send_success(res, { invoices: results });
        }
    });
};