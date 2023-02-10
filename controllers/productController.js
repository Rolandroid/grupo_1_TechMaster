const fs = require('fs')
const path = require('path')
const products = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/products.json"), 'utf-8'));


module.exports = {
    detalle : (req , res) => {
        return res.render('products/detalle')
    },
    list : (req , res) => {
        return res.render('products/list',{
            products,
        })

    },
    creacion : (req , res) => {
        return res.render('products/creacion')
    },
    edicion : (req , res) => {
        return res.render('products/edicion')
    }
};
