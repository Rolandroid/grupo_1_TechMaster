const express = require('express');
const router = express.Router();

const {list, detail} = require('../../controllers/api/userApiController');

//api/users
router
.get('/',list)
.post('/:id',detail)



module.exports = router;
