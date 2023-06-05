const express = require('express');
const router = express.Router();
const { uploadProductImages } = require('../../middlewares/upload');

const {list, detail, create, update, remove, listWithPaginate, getAllProducts} = require('../../controllers/api/productApiController');

/* /api/products */
router
.get('/',getAllProducts)
.get('/paginate',listWithPaginate)
.get('/:id',detail)
.post('/create',uploadProductImages, create)
.put('/update/:id',uploadProductImages, update)
.delete('/:id',remove)


module.exports = router;
