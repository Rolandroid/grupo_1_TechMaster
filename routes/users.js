const express = require('express');
const router = express.Router();

const {login,register,recovery} = require('../controllers/userController')

router
.get('/login',login)
.get('/register',register)
.get('recovery',recovery)



module.exports = router;
