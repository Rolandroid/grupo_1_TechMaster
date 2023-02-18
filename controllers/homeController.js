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
    }
   
}