const express = require('express');
const router = express.Router();

const {login,register, newPassword, processRegister} = require('../controllers/userController');
const registerUserValidation = require('../validations/registerUserValidation');

router
.get('/register',register)
.post('/register',registerUserValidation,processRegister)
.get('/login',login)
.get('/newPassword',newPassword)



module.exports = router;
