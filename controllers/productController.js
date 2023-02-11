const fs = require('fs')
const path = require('path')
const products = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/products.json"), 'utf-8'));




module.exports = {


    detalle : (req , res) => {
        const products = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/products.json"), 'utf-8'));
        const {id} = req.params
        const product = products.find(product => product.id === +id)
        console.log(product)
        return res.render('products/detalle', {...product})

        
                

    },
    list : (req , res) => {
        return res.render('products/list',{
            products,
        })

    },

    creacion: (req, res) => {
        return res.render('products/creacion')
    },

    create : (req , res) => {
        
        const {name, image, description, discount, price, category} = req.body;

        const newProduct = {
            id: products[products.length - 1].id + 1,
            name: name.trim(),
            price: +price,
            description: description.trim(),
            image: null,
            discount: +discount,
            category: category.trim()
        };

        products.push(newProduct);

        fs.writeFileSync('./data/products.json',JSON.stringify(products, null, 3), 'utf-8')

        return res.redirect('/products/list')




    },
    edicion : (req , res) => {
        const {id} = req.params;
        const product = products.find(product => product.id === +id)
        return res.render('products/edicion',{
            ...product
        })
    },

    update : (req,res) => {
        const {name, image, description, discount, price, category} = req.body;
        const id = +req.params.id
        const product = products.find(product => product.id === +id)
        const productUpdate = {
            id,
            name: name.trim(),
            price: +price,
            description: description.trim(),
            image: product.image,
            discount: +discount,
            category: category.trim()
        };

        const productModified = products.map(product => {
            if(product.id === id) {
                return productUpdate
            }

            return product;

        })

        fs.writeFileSync('./data/products.json',JSON.stringify(productModified, null, 3), 'utf-8')
        return res.redirect(`/products/detalle/${id}`)

    }
};
