const paginate = require('sequelize-paginate');
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

            const productosListados = products.map((product)=>{
               return {
                id: product.id,
                name: product.name,
                description: product.description,
                category: product.category.name,
                detailUrl:'http://localhost:3000/api/products/' + product.id
                }
            })
            let respuesta = {
                meta: {
                    status: 200,
                    total: products.length,
                    countByCategory,
                    url: 'api/products',
                    products: productosListados
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

         let respuesta = {
            meta: {
                status: 200,
                total: product.length,
                url: '/api/actor/:id'
            },
            data: producto
        }
        res.json(respuesta);
       } catch (error) {
        
            console.log(error);
       }
            
    },
    create: async (req, res) => {
        try {
          const { name, price, description, discount, categoryId, visible } =
            req.body;
      
          const product = await db.Product.create({
            name: name.trim(),
            price,
            description: description.trim(),
            discount,
            categoryId: categoryId,
            visible : visible
          });
      
          req.files.forEach(async (image) => {
            await db.Image.create({
              name: image.filename,
              productId: product.id,
            });
          });
      
          return res.json(product);
        } catch (error) {
          console.log(error);
          return res.status(500).json({ error: "Internal server error" });
        }
      }


}