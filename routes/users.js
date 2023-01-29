const express = require('express');
const router = express.Router();

const {login,register} = require('../controllers/userController')

router
.get('/login',login)
.get('/register',register)



module.exports = router;
