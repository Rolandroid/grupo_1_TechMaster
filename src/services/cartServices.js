const { Op } = require('sequelize')
const db = require('../database/models')

module.exports = mtd = {
    getOrder:async ({userId}) =>{
        
        if (!userId) {
            throw{
                ok:false,
                message:"Debes ingresar el userId"
            }
        }
        
        
        //del modelo busco el order que pertenezca al usuario, haciendo una busqueda individual
        const [order] = await db.Order.findOrCreate({//si no encuentra la coincidencia que se encuentra en el where crea otro carrito que si las tenga //DOC:https://sequelize.org/docs/v6/core-concepts/model-querying-finders/
            //const [order,isCreated] = await db.Order.findOrCreate({// elimine esta linea y el await lo recibo en el controlador
            // retorno el array [order,isCreated] cuando se cumpla el where
            // en el [ ] recibo si o si la orden y un booleano:isCreated (si se creo)
            //y esta order tiene que tener el estado en pendiente, buscado por el Op and
            where:{
                [Op.and]:[
                    {
                       userId 
                    },
                    {
                        status:'pending'
                    } 
            ]
            },
            defaults: { //order trae-> cart -> products -> images
                userId,
            },
            include: [{
                association: 'cart',
                /* attributes:{
                include:['quantity']
            }, */
                include:['images']
            }]

        })
        return order
    },
    createProductInCart: async ({userId,productId}) => {
        if (!userId || !productId) {
            throw{
                ok:false,
                message:"Debes ingresar el userId y productId"
            }
        }
       const order = await mtd.getOrder({userId}) // obtengo o recibo la orden, getOrden crea la orden vacia y le asigna el user
    // mtd (method) reemplaza al this, ya que el this no se puede usar en un arrow function, desde el mtd leo la orden
    
     await mtd.createCart({orderId:order.id,productId}) //productId lo traigo del mismo metodo createProductinCart
    },
    createCart:({orderId,productId}) => {
        return db.Cart.create({orderId,productId})
    },
    removeCart:  ( {orderId,productId} ) => {
        db.Cart.destroy({
            where:{// indicamos q tiene que coincidir con el id de la orden y del product para eliminar un solo item/product del cart
                [Op.and] :[
                    {
                        orderId
                    },
                    {
                        productId
                    }
                ]
            }
        })
    },
    removeProductFromCart: async({userId,productId}) =>{

        if (!userId || !productId) {// se evalue que vengan estos dos valores:userId y productId, ambos tienen que existir
            throw{
                ok:false,
                message:"Debes ingresar el userId y productId"
            }
        }
        const order = await mtd.getOrder({userId})//obtengo la orden que corresponda al userId y desde esta orden elimino un carrito

        return mtd.removeCart({orderId:order.id,productId})
    }
}