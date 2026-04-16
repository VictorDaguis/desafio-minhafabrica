const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../middlewares/upload");
const productController = require("../controllers/productController");

const router = express.Router();

// Listagem (com paginação e filtro)
router.get("/", verifyToken, productController.listProducts);

// Criação com upload de imagem (campo do form: "image")
router.post("/", verifyToken, upload.single("image"), productController.createProduct);

// Atualização com upload de imagem (opcional)
router.put("/:id", verifyToken, upload.single("image"), productController.updateProduct);

// Exclusão
router.delete("/:id", verifyToken, productController.deleteProduct);

// NOVA ROTA: serve a imagem de um produto (pública, sem token para facilitar exibição)
router.get("/:id/image", productController.getProductImage);

module.exports = router;