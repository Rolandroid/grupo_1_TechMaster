const express = require('express');
const router = express.Router();

const {getOrderPending, addProduct, removeProduct, moreQuantity, lessQuantity, clearCart, statusOrder } = require('../../controllers/api/cartApiController');

//api/cart
router
.get('/getOrderPending',getOrderPending)
.post('/addProduct',addProduct)
.delete('/removeProduct',removeProduct)
.put('/moreQuantity',moreQuantity)
.put('/lessQuantity',lessQuantity)
.delete('/clearCart',clearCart)
.put('/statusOrder',statusOrder)




module.exports = router;
