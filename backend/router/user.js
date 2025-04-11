const express = require("express");
const router = express.Router();
const userController = require("../controller/user");

router.post("/create", userController.createUser);
router.post("/update/:id", userController.updateUser);
router.post("/delete/:id", userController.deleteUser);
router.post("/list", userController.allUser);
router.post("/get/:id", userController.getUserById);

module.exports = router;