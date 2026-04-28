const Product = require("../models/Product");
//Camada que faz as queries direto no banco, funções como findAll(), findById(), create(), deleteById(), só se comunica com os models
async function findAllPaginated({ page = 1, limit = 10, search = "" }) {
  const skip = (page - 1) * limit;
  const query = search ? { name: { $regex: search, $options: "i" } } : {};

  const [products, total] = await Promise.all([
    Product.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Product.countDocuments(query),
  ]);

  return {
    data: products,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
  };
}

async function findById(id) {
  return Product.findById(id);
}

async function findByName(name) {
  return Product.findOne({ name });
}

async function create(productData) {
  return Product.create(productData);
}

async function updateById(id, productData) {
  return Product.findByIdAndUpdate(id, productData, {
    returnDocument: "after", // ✅ corrigido
    runValidators: true,
  });
}

async function updateByIdAndUnsetImage(id, productData) {
  return Product.findByIdAndUpdate(
    id,
    { ...productData, $unset: { image: 1 } },
    { returnDocument: "after", runValidators: true } // ✅ corrigido
  );
}

async function deleteById(id) {
  return Product.findByIdAndDelete(id);
}

async function countProducts() {
  return Product.countDocuments();
}

module.exports = {
  findAllPaginated,
  findById,
  findByName,
  create,
  updateById,
  updateByIdAndUnsetImage,
  deleteById,
  countProducts,
};
