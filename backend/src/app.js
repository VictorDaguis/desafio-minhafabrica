const express = require("express");
const dns = require('dns');
//força o Node.js a usar IPv4 antes de IPv6 ao resolver DNS
dns.setDefaultResultOrder('ipv4first');
const cors = require("cors");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

dotenv.config();

const app = express();

// Conecta ao MongoDB
connectDatabase();

// CONFIGURAÇÃO DE CORS (SEM CONDICIONAL - MAIS SEGURO)
const allowedOrigins = [
  'http://localhost:3000',
  'https://desafio-minhafabrica.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (ex: Postman, apps mobile)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Origem bloqueada pelo CORS: ${origin}`);
      callback(new Error('Origem não permitida pela política de CORS'));
    }
  },
  credentials: true // Permite envio de cookies e headers de autenticação
}));

app.use(express.json());

// Rota de teste
app.get("/", (req, res) => {
  res.json({ message: "API MinhaFabrica funcionando" });
});

// Rotas da API, cada grupo de rotas tem um prefixo. Então quando chega POST /api/v1/auth/login, o Express sabe que deve ir para o authRoutes e dentro dele procurar a rota /login
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);

// Middleware de tratamento de erros centralizados
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erro interno no servidor" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
