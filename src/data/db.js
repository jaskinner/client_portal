const MongoClient = require("mongodb").MongoClient,
    async = require("async"),
    local = require("../../local.config.json");

let db;
const dbName = local.config.db_config.dbName;

exports.init = (cb) => {
    console.log(`\n** Connecting to db...`);
    const url = local.config.db_config.host_url;

    MongoClient.connect(url, (err, dbase) => {
        if (err) return cb(err);
        console.log("** ...Success! Connected to server");
        db = dbase.db(dbName);
        cb(null);
    });
};
