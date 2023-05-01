const express = require('express');
const router = express.Router();

const {all, one} = require('../../controllers/api/commentApiController');


router
.get('/',all)
.get('/:id',one)



module.exports = router;
