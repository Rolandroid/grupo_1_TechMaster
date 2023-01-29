module.exports = {
    detalle : (req , res) => {
        return res.render('products/detalle')
    },
    resultados : (req , res) => {
        return res.render('products/resultados')
    }
}