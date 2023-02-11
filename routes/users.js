const express = require('express');
const router = express.Router();

const {login,register,recovery,profile} = require('../controllers/userController')

router
.get('/login',login)
.get('/register',register)
.get('recovery',recovery)
.get('/profile',profile)



module.exports = router;
