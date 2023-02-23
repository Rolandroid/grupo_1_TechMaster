const fs = require('fs')
const path = require('path')
const products = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/products.json"), 'utf-8'));

module.exports = {
    home : (req , res) => {
        return res.render('home')
    },
    carrito : (req , res) => {
        return res.render('carrito')
    },
    detalle : (req , res) => {
        return res.render('detalle')
    },
    resultados : (req , res) => {
        return res.render('resultados')
    },

    search: (req, res) => { 
        const {keywords, category} = req.query;
        if(keywords.trim() !== ''){
            let resultSearch = products.filter(product => 
                (product.name.toLowerCase().includes(keywords.toLowerCase().trim()) ||  
                product.description.toLowerCase().includes(keywords.toLowerCase().trim())) && 
                (category === '' || product.category === category)
            );
            res.render('results',{
                resultSearch,
                keywords: req.query.keywords,
            })
        }else{
            res.redirect('/')
        }
    },
    navBar : (req, res) => {
       let products = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/products.json"), 'utf-8'));
       let {category} = req.params
       products = products.filter(product => product.category === category)
       console.log(products)
       return res.render('products/list',{products})
    }
   
}