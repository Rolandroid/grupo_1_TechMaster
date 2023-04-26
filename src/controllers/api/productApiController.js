const db = require('../../database/models')

module.exports = {
    list: async (req, res) => {

        try {
            const products = await db.Product.findAll({ include: ['category'] })
            const categories = await db.Category.findAll({include:['products']})

            const countByCategory = categories.reduce((obj,category) => {
                obj[category.name] = category.products.length
                return obj
            },{})
            //console.log(countByCategory)

            let respuesta = {
                meta: {
                    status: 200,
                    total: products.length,
                    countByCategory,
                    url: 'api/products',
                    products: products
                },
            };
            res.json(respuesta);
            // let categories = 


            /*  db.Product.findAll({ include: ['category'] })
                 .then(products => {
                     products = products.map(product => {
                         return {
                             id: product.id,
                             name: product.name,
                             description: product.description,
                             detail: "api/products/" + product.id
                         };
 
                         // let categories = 
                     }); */
            /* 
● api/products/
○ Deberá devolver un objeto literal con la siguiente estructura:
■ count → cantidad total de productos en la base.
■ countByCategory → objeto literal con una propiedad por categoría
con el total de productos.
 
{
    pc: 5,
    teclados: 10,
    monitor: 2
}
 
■ products → array con la colección de productos, cada uno con:
● id
● name
● description
● un array con principal relación de uno a muchos (ej:
categories).
● detail → URL para obtener el detalle. */


        } catch (error) {
            console.log(error)
        }
    },

    detail: (req, res) => {
        db.product.findByPk(req.params.id)
            .then(product => {
                let usuario = {
                    name: product.name,
                    surname: product.surname,
                    email: product.email,
                    avatar: `http://localhost:3000/Images/products/${product.avatar}`,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt
                }

                let respuesta = {
                    meta: {
                        status: 200,
                        total: product.length,
                        url: '/api/actor/:id'
                    },
                    data: product
                }
                res.json(usuario);
            }).catch(error => {
                console.log(error);
            });
    },


}