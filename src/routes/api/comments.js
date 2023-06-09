const express = require('express');
const router = express.Router();

const {all, one, create, edit, erase} = require('../../controllers/api/commentApiController');

/* /api/comments */
router
.get('/',all)
.get('/:id',one)
.post('/',create)
.put('/:id',edit)
.delete('/:id',erase)


module.exports = router;
