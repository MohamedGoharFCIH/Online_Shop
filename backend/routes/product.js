const express = require('express');


const productController = require('../controllers/product');

const check_auth = require("../middleware/check-auth");
const check_role = require("../middleware/check-role");
const file = require("../middleware/file");

const router = express.Router();

router.post("/add", check_role.checkUser, file.extractFile, productController.createProduct);

router.put("/edit/:id", check_auth.checkAuth, file.extractFile, productController.updateProduct);

router.get("", productController.getProducts);

router.get("/product/:id", productController.getProduct);

router.delete("product/:id", check_auth.checkAuth, productController.deleteProduct);

router.post("/buy/:id", check_role.checkUser, productController.buyProduct);

module.exports = router;
