const productService = require("../services/productService");

async function listProducts(req, res) {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const result = await productService.listProducts({ page, limit, search });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createProduct(req, res) {
  try {
    // Prepara dados da imagem se existir
    let imageData = null;
    if (req.file) {
      imageData = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const product = await productService.createProduct(req.body, imageData);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function updateProduct(req, res) {
  try {
    // Prepara dados da imagem se existir
    let imageData = null;
    if (req.file) {
      imageData = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const product = await productService.updateProduct(req.params.id, req.body, imageData);
    return res.status(200).json(product);
  } catch (error) {
    if (error.message === "Produto não encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(400).json({ message: error.message });
  }
}

async function deleteProduct(req, res) {
  try {
    await productService.deleteProduct(req.params.id);
    return res.status(200).json({ message: "Produto excluído com sucesso" });
  } catch (error) {
    if (error.message === "Produto não encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(400).json({ message: error.message });
  }
}

// NOVO MÉTODO: serve a imagem do produto
async function getProductImage(req, res) {
  try {
    const product = await productService.getProductImage(req.params.id);
    if (!product || !product.image || !product.image.data) {
      return res.status(404).send("Imagem não encontrada");
    }
    res.set("Content-Type", product.image.contentType);
    res.send(product.image.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductImage,
};