const MongoClient = require("mongodb").MongoClient,
    async = require("async"),
    local = require("../../local.config.json");

let db;
const dbName = local.config.db_config.dbName;

exports.init = (callback) => {
    async.waterfall(
        [
            (cb) => {
                console.log(`\n** Connecting to db...`);
                const url = local.config.db_config.host_url;

                MongoClient.connect(url, (err, dbase) => {
                    if (err) return cb(err);
                    console.log("** ...Success! Connected to server");
                    db = dbase.db(dbName);
                    cb(null);
                });
            },
            (cb) => {
                // is collection initialized
                const invoice_coll = db.collection("invoices");
                invoice_coll.count((err, count) => {
                    if (err) cb(err);
                    cb(null, count ? null : invoice_coll);
                });
            },
            (invoice_coll, cb) => {
                if (!invoice_coll) return cb(null);
                invoice_coll.insertOne(
                    { _id: "0000", amount: 0 },
                    (err, invoice) => {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null);
                        }
                    }
                );
            },
            (cb) => {
                const user_coll = db.collection("users");
                user_coll.count((err, count) => {
                    if (err) cb(err);
                    cb(null, count ? null : user_coll);
                });
            },
            (user_coll, cb) => {
                if (!user_coll) return cb(null);
                user_coll.insertOne(
                    { _id: 1, username: "admin", password: "admin123" },
                    (err, user) => {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null);
                        }
                    }
                );
            },
        ],
        callback
    );
};
