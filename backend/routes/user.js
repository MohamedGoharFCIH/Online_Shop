const express = require('express');

const userController = require('../controllers/user');

const check_auth = require("../middleware/check-auth");
const check_role = require("../middleware/check-role");
const router = express.Router();    

const User = require('../models/user');


router.post('/signup', userController.createUser);

router.post('/login', userController.userLogin);

router.get('/users', userController.getUsers);

router.get('/:id', userController.getUser);

router.delete('/:id', userController.deleteUser);

router.put('/:id', userController.editUser);


module.exports = router;