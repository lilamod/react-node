const express = require("express");
const router = express.Router();
const jobController = require("../controller/job");

router.post("/create", jobController.createJob);
router.post("/update/:id", jobController.updateJob);
router.post("/delete/:id", jobController.deleteJob);
router.post("/list", jobController.listOfJob);
router.post("/listByGroup", jobController.groupByStatus)
router.post("/get/:id", jobController.getJobById)

module.exports = router;