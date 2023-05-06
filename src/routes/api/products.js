const express = require('express');
const router = express.Router();
const { uploadProductImages } = require('../../middlewares/upload');

const {list, detail, create} = require('../../controllers/api/productApiController');


router
.get('/',list)
.get('/:id',detail)
.post('/create',uploadProductImages.array("images"), create)



module.exports = router;
