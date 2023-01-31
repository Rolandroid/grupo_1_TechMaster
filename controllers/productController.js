module.exports = {
    detalle : (req , res) => {
        return res.render('products/detalle')
    },
    resultados : (req , res) => {
        return res.render('products/resultados')
    },
    creacion : (req , res) => {
        return res.render('products/creacion')
    },
    edicion : (req , res) => {
        return res.render('products/edicion')
    }
}