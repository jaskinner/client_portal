const db = require("./db"),
    async = require("async");

exports.create_invoice = (data, callback) => {
    let final_invoice;
    let write_succeeded = false;
    async.waterfall(
        [
            (cb) => {
                let write = JSON.parse(JSON.stringify(data));
                write._id = data.code;
                db.invoices.insert(write, { w: 1, safe: true }, cb);
            },
            (new_invoice, cb) => {
                write_succeeded = true;
                final_invoice = new_invoice[0];
                cb(null);
            },
        ],
        (err, results) => {
            if (err) {
                if (write_succeeded) {
                    db.invoices.remove({ _id: data.code }, () => {});
                } else {
                    callback(err);
                }
            } else {
                callback(err, err ? null : final_invoice);
            }
        }
    );
};
