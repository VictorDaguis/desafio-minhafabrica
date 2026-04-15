const User = require("../models/User");

async function findByEmail(email) {
  return User.findOne({ email });
}

async function findAllPaginated({ page = 1, limit = 10, search = "" }) {
  const skip = (page - 1) * limit;
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      }
    : {};

  const [users, total] = await Promise.all([
    User.find(query).skip(skip).limit(limit).select("-password").sort({ createdAt: -1 }),
    User.countDocuments(query)
  ]);

  return {
    data: users,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit)
  };
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
  findAllPaginated,
  findById,
  create,
  updateById,
  deleteById,
  countUsers,
};