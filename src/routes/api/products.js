const express = require('express');
const router = express.Router();
const { uploadProductImages } = require('../../middlewares/upload');

const {list, detail, create, update} = require('../../controllers/api/productApiController');

/* /api/products */
router
.get('/',list)
.get('/:id',detail)
.post('/create',uploadProductImages.array("images"), create)
.put('/update/:id',uploadProductImages.array("images"), update)



module.exports = router;
