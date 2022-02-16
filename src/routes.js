module.exports = (app) => {
    app.get("/", (req, res) => {
        res.status(200).json({
            error: false,
            message: "sup dudes",
        });
    });

    app.use("/", require("./auth/api"));

    app.get("*", (req, res) => {
        res.status(404).json({
            error: true,
            message: "Route not found"
        });
    });
};
