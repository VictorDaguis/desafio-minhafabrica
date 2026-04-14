const userRepository = require("../repositories/userRepository");
const { hashPassword } = require("../utils/hash");

async function listUsers() {
  return userRepository.findAll();
}

async function createUser({ name, email, password, role }) {
  if (!name || !email || !password) {
    throw new Error("Nome, e-mail e senha são obrigatórios");
  }

  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new Error("Já existe um usuário com este e-mail");
  }

  const hashedPassword = await hashPassword(password);

  const user = await userRepository.create({
    name,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function updateUser(id, { name, email, password, role }) {
  const existingUser = await userRepository.findById(id);

  if (!existingUser) {
    throw new Error("Usuário não encontrado");
  }

  const dataToUpdate = {};

  if (name) dataToUpdate.name = name;
  if (email) dataToUpdate.email = email;
  if (role) dataToUpdate.role = role;

  if (password) {
    dataToUpdate.password = await hashPassword(password);
  }

  return userRepository.updateById(id, dataToUpdate);
}

async function deleteUser(id) {
  const existingUser = await userRepository.findById(id);

  if (!existingUser) {
    throw new Error("Usuário não encontrado");
  }

  await userRepository.deleteById(id);
}

module.exports = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
};