const fs = require('fs')
const path = require('path')
const products = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/products.json"), 'utf-8'));
const db = require("../database/models")
const { Op } = require("sequelize")
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

module.exports = {
  home: async (req, res) => {
    try{
      const products = await db.Product.findAll({
      include: ['category','images'],
    })
    return res.render('home', {
      products
    })}
    catch{(error)=>{console.log(error)}}
    
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
  contact: (req, res) => {
    return res.render('contact')
    
 },

  search: async (req, res) => {
    const { keywords, category } = req.query;

    try {
      if(category){const resultSearch = await db.Product.findAll({
          include: ['category','images'],
          where: {
            [Op.and]: [{
              [Op.or]: [{ name: { [Op.substring]: keywords } }, { description: { [Op.substring]: keywords } },{ '$category.name$': { [Op.substring]: keywords } }]
            },
            { '$category.name$': category },
            { visible: true }]
          }
        }

        );

        res.render('results', {
          resultSearch,
          keywords,
          toThousand
        });}
        else{const resultSearch = await db.Product.findAll({
          include: ['category','images'],
          where: {
            [Op.and]: [{
              [Op.or]: [{ name: { [Op.substring]: keywords } }, { description: { [Op.substring]: keywords } },{ '$category.name$': { [Op.substring]: keywords } }]
            },
            { visible: true }]
          }
        }

        );
 
        res.render('results', {
          resultSearch,
          keywords,
          toThousand
        });

        }
        
      } catch (error) {
        console.log(error)
      }
    
  },
  navBar: async (req, res) => {
    let { category } = req.params
    try {
      if (category === "discount") {
        let resultSearch = await db.Product.findAll({
          where: {
            discount: { [Op.gte]: 1 }
          },
          include: ['images']
        })
        return res.render('results', { resultSearch, keywords: category,toThousand })
      }
      else {
        let resultSearch = await db.Product.findAll({
         
          include: ['category','images'],
          where: {
            '$category.name$': category
          }
        }

        )
        console.log(resultSearch.product)
        res.render('results', { resultSearch, keywords: category,toThousand })

      }
    } catch (error) {
      console.log(error)
    }
  },
  dashboard: async (req, res) => {
    try {
      const products  = await db.Product.findAll({
        include: ['category','images']
        })
      const users  = await db.User.findAll()
      const comments = await db.Comment.findAll()
      return res.render('dashboard', {products, users,comments});
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
