const express = require('express');
const router = express.Router();

const {detalle,resultados} = require('../controllers/productController')

router
.get('/detalle',detalle)
.get('/resultados',resultados)



module.exports = router;
