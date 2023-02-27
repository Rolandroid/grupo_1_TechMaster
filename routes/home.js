const express = require('express');
const router = express.Router();

const {home,detalle,carrito,resultados,search} = require('../controllers/homeController')

router
.get('/',home)
.get('/detalle',detalle)
.get('/carrito',carrito)
.get('/search',search)


module.exports = router;
