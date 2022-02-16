const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
require("dotenv").config();

//
// ROUTES
//

require("./routes")(app);

// 
// GO 
// 

app.listen(PORT, () => console.log("runnin"));

// cleaned this up with help from https://farhan.dev/tutorial/rock-solid-express-application-architecture/
