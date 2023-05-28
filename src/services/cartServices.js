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
                through:{
                    attributes:['quantity']
                },
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
    
     await mtd.getCart({orderId:order.id,productId}) //productId lo traigo del mismo metodo createProductinCart
    //si no existe el cart me lo agrega y si existe no pasa nada

     const orderReload = await order.reload({include: {all:true} })
     order.total = mtd.calcularTotal(orderReload);
     await order.save()
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
    },
    moreQuantityFromProduct: async({userId,productId}) =>{
        if (!userId || !productId) {// se evalue que vengan estos dos valores:userId y productId, ambos tienen que existir
            throw{
                ok:false,
                message:"Debes ingresar el userId y productId"
            }
        }
        const order = await mtd.getOrder({userId})//obtengo la orden que corresponda al userId y desde esta orden elimino un carrito
        
        const [cart, isCreated] = await mtd.getCart({orderId:order.id,productId})

        if (!isCreated) {//si no fue creado se modifica la cantidad
        cart.quantity++;
        await cart.save(); 
        }
        
        //console.log(order.cart[0].Carts.quantity);//para ver el contenido 

        //una vez que aumentamos la cantidad, tmb tenemos q calcular el total
        //reduce acumula cada valor de cada product y con esos valores hago la siguiente cuenta
        
        const orderReload = await order.reload({include:{all:true}})
        
        order.total = mtd.calcularTotal(orderReload)
        //console.log(order.total)
        await order.save();

        return order;
    },
    createCart: ({orderId,productId}) => {// se reemplaza por getCart
        return db.Cart.create({orderId,productId})
    },
    removeCart: ({orderId,productId}) => {
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
    getCart: ({orderId,productId}) =>{
        return db.Cart.findOrCreate({// retorna un [cart,isCreated] array con cart y si se creo
            where:{
                [Op.and]:[
                    {
                        orderId
                    },
                    {
                        productId
                    }
                ]
            },
            defaults:{
                orderId,
                productId
            }
        })
    },
    calcularTotal: ({cart}) => {
       return cart.reduce((acum,{price, Cart, discount})=>{

        const priceTotal = discount ? price - (price * discount / 100) : price;
            acum += price * Cart.quantity
            return acum;
        },0);
    }
}