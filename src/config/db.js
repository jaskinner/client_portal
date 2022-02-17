module.exports = {
    db_host: process.env.DB_URI || "mongodb://127.0.0.1:27017",
    db_name: process.env.DB_NAME || "localtest",
};
