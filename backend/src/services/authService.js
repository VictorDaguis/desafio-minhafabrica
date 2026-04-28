const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const { comparePassword, hashPassword } = require("../utils/hash");
//faz o processo de autenticação em 3 etapas: Busca o usuário pelo email no banco — se não achar, lança erro genérico "Credenciais inválidas" (proposital — não diz se foi o email ou a senha que errou, por segurança)
//Compara a senha digitada com o hash salvo no banco usando bcrypt
//Se tudo ok, gera um JWT token assinado com o JWT_SECRET que expira em 1 dia, contendo id, email e role do usuário
//seedAdmin() — cria o usuário admin inicial. Primeiro verifica se já existe — se existir, retorna ele sem criar de novo. Isso evita duplicatas se a rota /seed for chamada mais de uma vez.

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
