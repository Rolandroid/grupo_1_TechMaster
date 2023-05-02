const express = require('express');
const router = express.Router();

const {list, detail, create} = require('../../controllers/api/productApiController');


router
.get('/',list)
.get('/:id',detail)
.post('/create', create)



module.exports = router;
