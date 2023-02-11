const express = require('express');
const router = express.Router();

const {detalle,list,creacion,edicion, create} = require('../controllers/productController')

router
.get('/detalle/:id',detalle)
.get('/list',list)
.get('/creacion',creacion)
.post('/creacion',create)
.get('/edicion',edicion)



module.exports = router;
