const User = require("../models/User");

async function findByEmail(email) {
  return User.findOne({ email });
}

async function findAll() {
  return User.find().select("-password");
}

async function findById(id) {
  return User.findById(id);
}

async function create(userData) {
  return User.create(userData);
}

async function updateById(id, userData) {
  return User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true,
  }).select("-password");
}

async function deleteById(id) {
  return User.findByIdAndDelete(id);
}

async function countUsers() {
  return User.countDocuments();
}

module.exports = {
  findByEmail,
  findAll,
  findById,
  create,
  updateById,
  deleteById,
  countUsers,
};