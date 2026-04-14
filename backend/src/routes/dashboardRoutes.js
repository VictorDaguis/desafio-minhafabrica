const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const userRepository = require("../repositories/userRepository");
const productRepository = require("../repositories/productRepository");

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const totalUsers = await userRepository.countUsers();
    const totalProducts = await productRepository.countProducts();

    return res.status(200).json({
      message: "Dashboard carregado com sucesso",
      totalUsers,
      totalProducts,
      loggedUser: req.user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;