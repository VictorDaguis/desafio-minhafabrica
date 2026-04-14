const authService = require("../services/authService");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
    }

    const result = await authService.login(email, password);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}

async function seed(req, res) {
  try {
    const admin = await authService.seedAdmin();

    return res.status(201).json({
      message: "Usuário admin pronto para uso",
      user: {
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  login,
  seed,
};