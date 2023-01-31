const express = require('express');
const router = express.Router();

const {detalle,resultados,creacion,edicion} = require('../controllers/productController')

router
.get('/detalle',detalle)
.get('/resultados',resultados)
.get('/creacion',creacion)
.get('/edicion',edicion)



module.exports = router;
