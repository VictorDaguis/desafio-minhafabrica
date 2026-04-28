const express = require("express");
const authController = require("../controllers/authController");
//Define quais URLs existem e quem responde cada uma, Por exemplo: POST /api/v1/auth/login chama o authController.login. Também aplica o middleware de autenticação nas rotas protegidas.
const router = express.Router();

router.post("/login", authController.login);
router.post("/seed", authController.seed);

module.exports = router;
