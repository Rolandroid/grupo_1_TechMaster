module.exports = {
    detalle : (req , res) => {
        return res.render('products/detalle')
    },
    list : (req , res) => {
        return res.render('products/list')
    },
    creacion : (req , res) => {
        return res.render('products/creacion')
    },
    edicion : (req , res) => {
        return res.render('products/edicion')
    }
}