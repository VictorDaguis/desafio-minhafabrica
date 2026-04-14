const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const { comparePassword, hashPassword } = require("../utils/hash");

async function login(email, password) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("Credenciais inválidas");
  }

  const passwordIsValid = await comparePassword(password, user.password);

  if (!passwordIsValid) {
    throw new Error("Credenciais inválidas");
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

async function seedAdmin() {
  const adminEmail = "admin@minhafabrica.com";
  const existingAdmin = await userRepository.findByEmail(adminEmail);

  if (existingAdmin) {
    return existingAdmin;
  }

  const hashedPassword = await hashPassword("senha123");

  return userRepository.create({
    name: "Administrador",
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
  });
}

module.exports = {
  login,
  seedAdmin,
};