const express = require('express');
const router = express.Router();

const {home,detalle,carrito,search,navBar} = require('../controllers/homeController')

router
.get('/',home)
.get('/detalle',detalle)
.get('/carrito',carrito)
.get('/search',search)
.get('/products/list/:category',navBar)


module.exports = router;
