const express = require('express');

const userController = require('../controllers/user');

const check_auth = require("../middleware/check-auth");
const check_role = require("../middleware/check-role");
const router = express.Router();    

const User = require('../models/user');


router.post('/signup', userController.createUser);

router.post('/login', userController.userLogin);

router.get('/users', check_role.checkAdmin, userController.getUsers);

router.get('/:id', check_role.checkAdmin, userController.getUser);

router.delete('/:id', check_role.checkAdmin, userController.deleteUser);

router.put('/:id', check_role.checkAdmin, userController.editUser);


module.exports = router;