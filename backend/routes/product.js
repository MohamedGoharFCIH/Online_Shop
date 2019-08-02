const express = require('express');


const productController = require('../controllers/product');

const check_auth = require("../middleware/check-auth");
const check_role = require("../middleware/check-role");
const file = require("../middleware/file");

const router = express.Router();

router.post("/add", file.extractFile, check_role.checkUser, productController.createProduct);

router.put("/edit/:id", file.extractFile, productController.updateProduct);

router.get("/products", check_role.checkUser, productController.getProducts('user'));

router.get("", productController.getProducts('guest'));

router.get("/productsmonitor", check_role.checkAdmin, productController.getProducts());

router.get("/purchases", check_role.checkUser, productController.getProducts('purchases'));

router.get("/:id", check_role.checkUser, productController.getProduct);

router.delete("/:id", check_role.checkAdmin, productController.deleteProduct);

router.put("/buy/:id", check_role.checkUser, productController.buyProduct);

module.exports = router;
