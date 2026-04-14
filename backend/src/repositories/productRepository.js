const Product = require("../models/Product");

async function findAll() {
  return Product.find();
}

async function findById(id) {
  return Product.findById(id);
}

async function create(productData) {
  return Product.create(productData);
}

async function updateById(id, productData) {
  return Product.findByIdAndUpdate(id, productData, {
    new: true,
    runValidators: true,
  });
}

async function deleteById(id) {
  return Product.findByIdAndDelete(id);
}

async function countProducts() {
  return Product.countDocuments();
}

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
  countProducts,
};