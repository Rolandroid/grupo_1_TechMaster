const express = require('express');
const router = express.Router();

const {home,carrito,search,navBar,dashboard,aboutUs,comments,contact} = require('../controllers/homeController')

router
.get('/',home)
.get('/search',search)
.get('/carrito',carrito)
.get('/products/list/:category',navBar)
.get('/dashboard',dashboard)
.get('/aboutUs',aboutUs)
.post('/aboutUs',comments)
.get('/contact',contact)

module.exports = router;
