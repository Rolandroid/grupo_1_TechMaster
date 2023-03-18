const express = require('express');
const router = express.Router();

const {home,detalle,carrito,search,navBar,dashboard} = require('../controllers/homeController')

router
.get('/',home)
.get('/detalle',detalle)
.get('/carrito',carrito)
.get('/search',search)
.get('/products/list/:category',navBar)
.get('/dashboard',dashboard)


module.exports = router;
