const express = require('express');
const router = express.Router();

const {home,detalle,carrito,resultados} = require('../controllers/homeController')

router
.get('/',home)
.get('/detalle',detalle)
.get('/carrito',carrito)


module.exports = router;
