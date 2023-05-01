const { name } = require('ejs')
const db = require('../../database/models')

module.exports = {
    all: async (req, res) => {

        try {
            const comments = await db.Comment.findAll()

            const commentsList = comments.map((comment)=>{
               return {
                id: comment.id,
                name: comment.name,
                description: comment.content,
                }
            })
           // console.log(detalleProducto);
            let respuesta = {
                meta: {
                    status: 200,
                    total: commentsList.length,
                    url: 'api/products',
                    comments: commentsList
                },
            };
            res.json(respuesta);
            
        } catch (error) {
            console.log(error)
        }
    },

    one: async (req, res) => {
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