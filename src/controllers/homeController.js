const fs = require('fs')
const path = require('path')
const {readJSON, writeJSON} = require('../data')
const products = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/products.json"), 'utf-8'));

module.exports = {
    home : (req , res) => {
        return res.render('home',{
            products
        })
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
                product.category.toLowerCase().includes(keywords.toLowerCase().trim()) ||  
                product.description.toLowerCase().includes(keywords.toLowerCase().trim()))
                 && 
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
        let resultSearch = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/products.json"), 'utf-8'));
        let {category} = req.params        
        if(category==="discount"){
         resultSearch = resultSearch.filter(product => product.discount > 1)
         category = "Oferta"
        return res.render('results',{resultSearch, keywords: category})
     }else{resultSearch = resultSearch.filter(product => product.category === category)
         return res.render('results',{resultSearch, keywords: category})}
        },



    dashboard : (req, res) => {
        let products = readJSON('products.json')
        return res.render('dashboard',{products})
    }
}