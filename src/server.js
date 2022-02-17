const express = require("express");
const logger = require("morgan");
const { join } = require("path");
const rfs = require("rotating-file-stream");
const config = require("./config");
const app = express();

const { port } = config.app;

app.set("port", port);

app.use(logger("common"));
app.use(
    logger("combined", {
        stream: rfs.createStream(
            `SC-${new Date()
                .toISOString()
                .replace(/T.*/, "")
                .split("-")
                .reverse()
                .join("-")}.log`,
            {
                interval: "1d",
                path: join(__dirname, "../log"),
            }
        ),
    })
);

//
// ROUTES
//

require("./routes")(app);

//
// GO
//

app.listen(port, () => console.log(`runnin on port ${port}`));

// cleaned this up with help from https://farhan.dev/tutorial/rock-solid-express-application-architecture/
