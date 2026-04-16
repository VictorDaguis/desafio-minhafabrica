const productRepository = require("../repositories/productRepository");

async function listProducts({ page, limit, search }) {
  return productRepository.findAllPaginated({ page, limit, search });
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

  // ✅ VALIDAÇÃO: nome único
  const existingProduct = await productRepository.findByName(name);
  if (existingProduct) {
    throw new Error("Já existe um produto com este nome");
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

  // Verifica se o novo nome já existe em OUTRO produto
  if (data.name && data.name !== product.name) {
    const nameExists = await productRepository.findByName(data.name);
    if (nameExists && nameExists._id.toString() !== id) {
      throw new Error("Já existe outro produto com este nome");
    }
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