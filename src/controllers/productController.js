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
          categories,
        })
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
  edicion: (req, res) => {
    const { id } = req.params;
    return db.Product.findByPk(id, {
      include : ['images','category'],
    })
    .then((product) => {
      return db.Category.findAll({
        order: [["name"]],
        attributes: ["name", "id"],
      })
      .then((categories) => {
        return res.render("products/edicion", { product, categories});
      })
    })
    .catch(error => console.log(error))    
  },

  update: (req, res) => {
    const { name, image, description, discount, price, category, visible } =
    req.body;

    const id = +req.params.id

  db.Product.update(
    {
      name: name.trim(),
      price,
      description: description.trim(),
      discount,
      categoryId: category,
      visible : visible
    },
    {
      where : {
        id,
      }  
    }
  ).then(() => {
    req.files.forEach((image) => {
      db.Image.update({
        name: image.filename,
        productId: product.id,
      });
    });

    return res.redirect(`/products/detalle/` +id);
  }).catch((error) => console.log(error));
/* 
    const { name, image, description, discount, price, category, color } =
      req.body;
    const id = +req.params.id;
    const product = products.find((product) => product.id === +id);
    const objetoNull = null;

    const productUpdate = {
      id,
      name: name.trim(),
      price: +price,
      description: description.trim(),
      image: req.files.length
        ? req.files.map((file) => file.filename)
        : product.image || null,
      discount: +discount,
      category: category.trim(),
      color: color, // Utilizamos el valor seleccionado del elemento select
    };

    const productModified = products.map((product) => {
      if (product.id === id) {
        return productUpdate;
      }

      return product;
    });*/

    /* fs.writeFileSync('../data/products.json',JSON.stringify(productModified, null, 3), 'utf-8') */
   /*  writeJSON("products.json", productModified); */
     
  },

  remove: (req, res) => {
    const id = req.params.id;
    const productModified = products.filter((product) => product.id !== +id);

    writeJSON("products.json", productModified);
    return res.redirect(`/products/list`);
  },
};
