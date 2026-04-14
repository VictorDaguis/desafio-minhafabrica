const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", verifyToken, userController.listUsers);
router.post("/", verifyToken, userController.createUser);
router.put("/:id", verifyToken, userController.updateUser);
router.delete("/:id", verifyToken, userController.deleteUser);

module.exports = router;