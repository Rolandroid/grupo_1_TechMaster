const express = require('express');
const router = express.Router();

const {detalle,todos,creacion,edicion} = require('../controllers/productController')

router
.get('/detalle',detalle)
.get('/todos',todos)
.get('/creacion',creacion)
.get('/edicion',edicion)



module.exports = router;
