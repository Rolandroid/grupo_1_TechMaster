const fs = require("fs");
const path = require("path");
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/products.json"), "utf-8")
);
/* const { writeJSON, readJSON } = require("../data/index"); */
const db = require("../database/models");
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

    db.Product.findByPk(id, {
      include: [
        {
          association : "images",
          attributes : "name"
        }
      ]
    }).then((product) => {
      db.Product.findAll({
        where : {
            visible : true
        },
        include : ['images'],
    }).then((product,products) => {
      const product = products.find((product) => product.id === +id);
      console.log(product);
      return res.render("products/detalle", { ...product, products });
    })
    })

  },


  creacion: (req, res) => {
    return res.render("products/creacion");
  },

  create: (req, res) => {
    const { name, image, description, discount, price, category, color } =
      req.body;

    const newProduct = {
      id: products[products.length - 1].id + 1,
      name: name.trim(),
      price: +price,
      description: description.trim(),
      image: req.files.length ? req.files.map((file) => file.filename) : null,
      discount: +discount,
      category: category.trim(),
      color: color,
    };

    products.push(newProduct);

    writeJSON("products.json", products);

    // return res.send(req.file)
    return res.redirect("/products/list");
  },
  edicion: (req, res) => {
    const { id } = req.params;
    const product = products.find((product) => product.id === +id);
    return res.render("products/edicion", {
      ...product,
    });
  },

  update: (req, res) => {
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
    });

    /* fs.writeFileSync('../data/products.json',JSON.stringify(productModified, null, 3), 'utf-8') */
    writeJSON("products.json", productModified);
    return res.redirect(`/products/detalle/${id}`);
  },

  remove: (req, res) => {
    const id = req.params.id;
    const productModified = products.filter((product) => product.id !== +id);

    writeJSON("products.json", productModified);
    return res.redirect(`/products/list`);
  },
};
