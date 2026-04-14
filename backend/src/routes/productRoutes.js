const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/", verifyToken, productController.listProducts);
router.post("/", verifyToken, productController.createProduct);
router.put("/:id", verifyToken, productController.updateProduct);
router.delete("/:id", verifyToken, productController.deleteProduct);

module.exports = router;