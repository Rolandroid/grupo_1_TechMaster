const express = require('express');
const router = express.Router();

const {list, detail, verifyEmail} = require('../../controllers/api/userApiController');

//api/users
router
.get('/',list)
.get('/:id',detail)
.post('/verify-email',verifyEmail)



module.exports = router;


   
