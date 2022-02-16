const { Router } = require("express");
const router = Router();

require("./routes/auth")(router);
// require("./routes/profile")(router);

module.exports = router;
