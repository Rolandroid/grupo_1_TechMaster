const express = require('express');
const router = express.Router();

const {login,register, newPassword, processRegister,processLogin} = require('../controllers/userController');
const loginUserValidator = require('../validations/loginUserValidator');
const registerUserValidation = require('../validations/registerUserValidation');

router
.get('/register',register)
.post('/register',registerUserValidation,processRegister)
.get('/login',login)
.post('/login',loginUserValidator,processLogin)
.get('/newPassword',newPassword)



module.exports = router;
