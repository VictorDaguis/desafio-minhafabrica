const productRepository = require("../repositories/productRepository");

async function listProducts() {
  return productRepository.findAll();
}

async function createProduct({ name, description, price, stock, category }) {
  if (!name || price === undefined) {
    throw new Error("Nome e preço são obrigatórios");
  }

  if (price < 0) {
    throw new Error("Preço deve ser positivo");
  }

  if (stock < 0) {
    throw new Error("Estoque não pode ser negativo");
  }

  return productRepository.create({
    name,
    description,
    price,
    stock: stock || 0,
    category,
  });
}

async function updateProduct(id, data) {
  const product = await productRepository.findById(id);

  if (!product) {
    throw new Error("Produto não encontrado");
  }

  return productRepository.updateById(id, data);
}

async function deleteProduct(id) {
  const product = await productRepository.findById(id);

  if (!product) {
    throw new Error("Produto não encontrado");
  }

  await productRepository.deleteById(id);
}

module.exports = {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};