const userService = require("../services/userService");

async function listUsers(req, res) {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const result = await userService.listUsers({ page, limit, search });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createUser(req, res) {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.status(200).json(user);
  } catch (error) {
    if (error.message === "Usuário não encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(400).json({ message: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    await userService.deleteUser(req.params.id);
    return res.status(200).json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    if (error.message === "Usuário não encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
};