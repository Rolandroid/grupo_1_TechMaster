const fs = require("fs");
const path = require("path");
/* const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/products.json"), "utf-8")
); */
/* const { writeJSON, readJSON } = require("../data/index"); */
const db = require("../database/models");
const product = require("../database/models/product");
module.exports = {
    
  list: (req, res) => {
    db.Product.findAll({
        where : {
            visible : true
        },
        include : ['images'],
    }).then((products) => {
        return res.render("products/list", {
            products,
          });
    }).catch(error => console.log(error))
  },

  detalle: (req, res) => {
    const { id } = req.params;
      db.Product.findAll({
        where : {
            visible : true
        },
        include : ['images'],
    }).then((products) => {
      let product = products.find((product) => product.id === +id);
      return res.render("products/detalle", { ...product, products });
    }).catch(error => console.log(error))

  },


  creacion: (req, res) => {


    const categories = db.Category.findAll({
      order: [["name"]],
      attributes: ["name", "id"],
    })
      .then((categories) => {
        return res.render("products/creacion", {
          categories}
          )
      }).catch((error) => console.log(error));
  },

  create: (req, res) => {
    const { name, image, description, discount, price, category, visible } =
      req.body;

    db.Product.create ({
      name: name.trim(),
      price,
      description: description.trim(),
      discount,
      categoryId: category,
      visible : visible
    }).then((product) => {
      req.files.forEach((image) => {
        db.Image.create({
          name: image.filename,
          productId: product.id,
        });
      });

      return res.redirect("/products/list");
    }).catch((error) => console.log(error));

  },
  edicion: async (req, res) => {
    const { id } = req.params;
    try {
      const product =await db.Product.findByPk(id, {include : ['images','category']})
      const categories =await db.Category.findAll({order: [["name"]], attributes: ["name", "id"]})
      console.log(product.dataValues)
       return res.render("products/edicion", { product, categories});
    } catch (error) {
      console.log(error)
    }  
  },
  
  update: async (req, res) => {

    try {
      
  
    const { name, image, description, discount, price, category, visible} = req.body;

    const id = +req.params.id
    const removeImagesBefore = req.query.removeImageBefore
    const product = await db.Product.findByPk(id, { include: ['images'] })

    product.name = name.trim();
    product.price = +price;
    product.description = description.trim();
    product.discount = +discount;
    product.categoryId = category;
    product.visible = visible;

    await product.save()

    if (req.files) {

      const images = req.files.map(image => {
        return {
          name: image.filename,
          productId: id
        }
      })

      if (removeImagesBefore) {
        
        product.images.forEach(image => {
          if(/_products_/.test(image.name)){
            
          fs.existsSync(path.join(__dirname, `../../public/images/products/${image.name}`)) &&
            fs.unlinkSync(path.join(__dirname, `../../public/images/products/${image.name}`))
          }
        })

        db.Image.destroy({
          where: { productId: id }
        })
      }

      db.Image.bulkCreate(images)
    }

    return res.redirect(`/products/detalle/` + id);
  } catch (error) {
      console.log(error)
  }

  },
  
     
  

  remove: async(req, res) => {
    const id = req.params.id;
      
    try {
      const product = await db.Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      const images = await db.Image.findAll({ where: { productId: product.id } });
      await Promise.all(images.map(image => image.destroy()));
  
      product.destroy();
      
      return res.redirect('/products/list')
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al eliminar el producto' });
    }
  }
  ,
};
