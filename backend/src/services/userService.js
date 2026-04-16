const userRepository = require("../repositories/userRepository");
const { hashPassword } = require("../utils/hash");

async function listUsers({ page, limit, search }) {
  return userRepository.findAllPaginated({ page, limit, search });
}

async function createUser({ name, email, password, role }) {
  if (!name || !email || !password) {
    throw new Error("Nome, e-mail e senha são obrigatórios");
  }

  const existingEmail = await userRepository.findByEmail(email);
  if (existingEmail) {
    throw new Error("Já existe um usuário com este e-mail");
  }

  // ✅ VALIDAÇÃO: nome único
  const existingName = await userRepository.findByName(name);
  if (existingName) {
    throw new Error("Já existe um usuário com este nome");
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

  // Verifica se o novo nome já existe em OUTRO usuário
  if (name && name !== existingUser.name) {
    const nameExists = await userRepository.findByName(name);
    if (nameExists && nameExists._id.toString() !== id) {
      throw new Error("Já existe outro usuário com este nome");
    }
  }

  // Verifica se o novo email já existe em OUTRO usuário
  if (email && email !== existingUser.email) {
    const emailExists = await userRepository.findByEmail(email);
    if (emailExists && emailExists._id.toString() !== id) {
      throw new Error("Já existe outro usuário com este e-mail");
    }
  }

  const dataToUpdate = {};
  if (name) dataToUpdate.name = name;
  if (email) dataToUpdate.email = email;
  if (role) dataToUpdate.role = role;
  if (password) dataToUpdate.password = await hashPassword(password);

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