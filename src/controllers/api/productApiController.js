const { name } = require('ejs')
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

            const detalleProducto = products.map((product)=>{
               return {
                id: product.id,
                name: product.name,
                description: product.description,
                category: product.category.name,
                detailUrl:'http://localhost:3000/api/products/' + product.id
                }
            })
           // console.log(detalleProducto);
            let respuesta = {
                meta: {
                    status: 200,
                    total: products.length,
                    countByCategory,
                    url: 'api/products',
                    products: detalleProducto
                },
            };
            res.json(respuesta);
            
        } catch (error) {
            console.log(error)
        }
    },

    detail: async (req, res) => {
       const product = await db.Product.findByPk(req.params.id,{
        include : ['images','category']
       })
       try {
       const arrayImages = product.images.map(image => {
           return  `http://localhost:3000/Images/products/${image.name}`
        });
        let producto = {
            id : product.id,
            name: product.name,
            description : product.description,
            price: product.price,
            discount: product.discount,
            images: arrayImages,
            category : product.category.name,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }

        /* let respuesta = {
            meta: {
                status: 200,
                total: product.length,
                url: '/api/actor/:id'
            },
            data: producto
        } */
        res.json(producto);
       } catch (error) {
        
            console.log(error);
       }
            
    }


}