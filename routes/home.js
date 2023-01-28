const express = require('express');
const router = express.Router();

const {home} = require('../controllers/homeController')
/* / */
router
.get('/',home)


/* router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); */

module.exports = router;
