const express = require('express');
const router = express.Router();

const {login,register, newPassword} = require('../controllers/userController')

router
.get('/login',login)
.get('/register',register)
.get('/newPassword',newPassword)



module.exports = router;
