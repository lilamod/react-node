const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/user", require("./user"));
router.use("/job", require("./job"));

module.exports = router;