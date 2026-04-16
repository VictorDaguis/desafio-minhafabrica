const productRepository = require("../repositories/productRepository");

async function listProducts({ page, limit, search }) {
  return productRepository.findAllPaginated({ page, limit, search });
}

async function createProduct(body, imageData) {
  const { name, description, price, stock, category } = body;

  if (!name || price === undefined) {
    throw new Error("Nome e preço são obrigatórios");
  }

  if (price < 0) {
    throw new Error("Preço deve ser positivo");
  }

  if (stock < 0) {
    throw new Error("Estoque não pode ser negativo");
  }

  const existingProduct = await productRepository.findByName(name);
  if (existingProduct) {
    throw new Error("Já existe um produto com este nome");
  }

  const productData = {
    name,
    description,
    price,
    stock: stock || 0,
    category,
  };

  if (imageData) {
    productData.image = imageData;
  }

  return productRepository.create(productData);
}

async function updateProduct(id, body, imageData) {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new Error("Produto não encontrado");
  }

  if (body.name && body.name !== product.name) {
    const nameExists = await productRepository.findByName(body.name);
    if (nameExists && nameExists._id.toString() !== id) {
      throw new Error("Já existe outro produto com este nome");
    }
  }

  const updateData = { ...body };
  delete updateData.removeImage; // campo de controle, não vai para o banco

  if (imageData) {
    updateData.image = imageData;
  }

  // Se solicitou remoção da imagem, usa método especial com $unset
  if (body.removeImage === "true") {
    return productRepository.updateByIdAndUnsetImage(id, updateData);
  }

  return productRepository.updateById(id, updateData);
}

async function deleteProduct(id) {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new Error("Produto não encontrado");
  }
  await productRepository.deleteById(id);
}

async function getProductImage(id) {
  const product = await productRepository.findById(id);
  if (!product) return null;
  return { image: product.image };
}

module.exports = {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductImage,
};