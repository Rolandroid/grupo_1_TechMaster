const fs = require('fs')
const path = require('path')
const { readJSON, writeJSON } = require('../data')
const products = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/products.json"), 'utf-8'));
const db = require("../database/models")
const { Op } = require("sequelize")

module.exports = {
  home: (req, res) => {
    return res.render('home', {
      products
    })
  },
  carrito: (req, res) => {
    return res.render('carrito')
  },
  detalle: (req, res) => {
    return res.render('detalle')
  },
  resultados: (req, res) => {
    return res.render('resultados')
  },

  search: async (req, res) => {
    const { keywords, category } = req.query;

    if (keywords !== '') {
      try {
        const resultSearch = await db.Product.findAll({
          where: {
            [Op.and]: [{
              [Op.or]: [{ name: { [Op.substring]: keywords } }, { description: { [Op.substring]: keywords } }]
            },
            { categoryId: category },
            { visible: true }]
          },
          include: ['images']
        }

        );

        res.render('results', {
          resultSearch,
          keywords
        });
      } catch (error) {
        console.log(error)
      }
    } else {
      res.redirect('/');
    }
  },
  navBar: (req, res) => {
    let resultSearch = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/products.json"), 'utf-8'));
    let { category } = req.params
    if (category === "discount") {
      resultSearch = resultSearch.filter(product => product.discount > 1)
      category = "Oferta"
      return res.render('results', { resultSearch, keywords: category })
    } else {
      resultSearch = resultSearch.filter(product => product.category === category)
      return res.render('results', { resultSearch, keywords: category })
    }
  },
  dashboard: async (req, res) => {
    try {
      const products = await db.Product.findAll({
        include: ['images']
      });
      return res.render('dashboard', { products });
    } catch (error) { console.log(error) }
  },


  aboutUs: async (req, res) => {
    try {
       const comments = await db.Comment.findAll()
       console.log(comments);
    return res.render('aboutUs',{comments})
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'error en la peticion de base de datos' });
  }
},



  comments:(req, res) =>{
    const {name, content} =req.body

    db.Comment.create ({
      name: name.trim(),
      content,
      visible : true
    }).then(()=>{
    return res.redirect('/aboutUs')
  })
    .catch((error) => console.log(error));
  }
}
