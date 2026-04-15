const express = require("express");
const dns = require('dns');
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

// Conecta ao MongoDB (a função internamente usa process.env.MONGO_URI ou MONGODB_URI - verifique)
connectDatabase();

// ✅ CONFIGURAÇÃO DE CORS PARA PRODUÇÃO
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://desafio-minhafabrica.vercel.app',   // Seu frontend na Vercel
      // Adicione outros domínios se necessário
    ]
  : ['http://localhost:3000'];                     // Desenvolvimento local

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (ex: Postman, apps mobile, ou chamadas de servidor)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
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

// Rotas da API
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);

// Middleware de tratamento de erros (adicional, mas recomendado)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erro interno no servidor" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});