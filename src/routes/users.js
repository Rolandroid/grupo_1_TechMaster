const express = require('express');
const router = express.Router();

const {login,register, newPassword, processRegister,processLogin, logout, profile,processProfile} = require('../controllers/userController');
const checkUser = require('../middlewares/checkUser');
const checkUserLogin = require('../middlewares/checkUserLogin');
const loginUserValidator = require('../validations/loginUserValidator');
const registerUserValidation = require('../validations/registerUserValidation');
const { uploadImageUser } = require('../middlewares/uploadUsers');

router
.get('/register',checkUser,register)
.post('/register',registerUserValidation,processRegister)
.get('/login',checkUser,login)
.post('/login',loginUserValidator,processLogin)
.get('/newPassword',newPassword)
.get('/logout',checkUserLogin,logout)
.get('/profile', checkUserLogin, profile)
.put('/profile',uploadImageUser.single("avatar"), processProfile)



module.exports = router;
