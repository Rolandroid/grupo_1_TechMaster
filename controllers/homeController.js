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
        const {keywords} = req.query;
        if(req.query.keywords.trim() !== ''){
             let resultSearch = products.filter(product => product.name.toLowerCase().includes(keywords.toLowerCase()) ||  product.description.toLowerCase().includes(keywords.toLowerCase().trim()));
            res.render('results',{
                resultSearch,
                keywords: req.query.keywords,
            })
        }else{
            res.redirect('/')
        }
    }
   
}