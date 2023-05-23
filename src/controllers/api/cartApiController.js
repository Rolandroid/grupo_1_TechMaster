const { Op } = require('sequelize');
const db = require('../../database/models')

module.exports = {
    //obtengo la orden pendiente / la info de la misma / su estado 
    getOrderPending: (req,res) =>{
        try {
            //extraigo el id del user desde el servidor, de la session obtengo al user logueado
            const {} = req.session.userLogin;
            
            //del modelo busco el order que pertenezca al usuario, haciendo una busqueda individual
            db.Order.findOne({
                //y esta order tiene que tener el estado en pendiente, buscado por el Op and
                where:{
                    [Op.and]:[
                        {
                            
                        }
                    ]
                }
            })
            
        } catch (error) {
            
        }

    },
    //agrego el producto al carrito
    addProduct: (req,res) =>{

    },
    //elimino el producto del carrito
    removeProduct:(req,res) =>{

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
    //cambio el estado en el que esta la orden
    statusOrder: (req,res) =>{

    }

}