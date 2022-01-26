const db = require("./db");

exports.version = "0.1.0";

exports.all_invoices = (callback) => {
    db.invoices.find().toArray(callback)
};
