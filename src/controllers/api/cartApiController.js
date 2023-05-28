/* const { Op } = require('sequelize');
const db = require('../../database/models')
 */
const sendErrorResponse = require('../../helpers/sendErrorResponse');
const sendSuccessResponse = require('../../helpers/sendSuccessResponse');
const {getOrder, createProductInCart, removeProductFromCart} = require('../../services/cartServices')
module.exports = {
    //obtengo la orden pendiente / la info de la misma / su estado 
    getOrderPending: async (req,res) =>{
        try {
            //extraigo el id del user desde el servidor, de la session obtengo al user logueado
            const {id} = req.session.userLogin; 
            //const {userId : id} = req.body;
            
            const order = await getOrder({userId : id})// el userId:es el valor que espera mi servicio, id:es el valor q le asigno en la linea 9
            sendSuccessResponse(res,{data:order})
            
        } catch (error) {
            sendErrorResponse(res,error)
        }

    },
    //agrego el producto al carrito
    addProduct: async (req,res) =>{
        try {
            const {productId} = req.body;
            const {id} = req.session.userLogin 
            //const {productId, userId} = req.body;
            //const user = req.session.userLogin
            await createProductInCart({userId:id,productId}) //el id de user lo obtengo de la session(linea26), el id del product del body (linea25)
            //{userId:user?.id || userId,productId} si esxite el user de la session que traiga el id || que traiga userId del body (todo esto para crear por thunder)
            sendSuccessResponse(res)
            
        } catch (error) {
            sendErrorResponse(res,error)

        }
    },
    //elimino el producto del carrito
    removeProduct: async(req,res) =>{
        try {
            //const {productId,userId} = req.body;
            //const user = req.session.userLogin 
            //await removeProductFromCart({userId:user?.id ||userId,productId}) 
            const {productId} = req.body;
            const {id} = req.session.userLogin 
            await removeProductFromCart({userId:id ,productId}) 
            sendSuccessResponse(res)
            
        } catch (error) {
            sendErrorResponse(res,error)

        }
    },
    //aumento la cantidad del producto
    moreQuantity: (req,res) =>{

    },
    //disminuyo la cantidad del producto
    lessQuantity:(req,res) =>{

    },
    //vaciar el carrito, elimino todos los productos del mismo/ sigue pendiente pero vacio la orden
    clearCart: (req,res) =>{

    },
    //cambio el estado en el que esta la orden de pendiente a completado
    statusOrder: (req,res) =>{

    }

}