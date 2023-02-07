module.exports = {
    detalle : (req , res) => {
        return res.render('products/detalle')
    },
    todos : (req , res) => {
        return res.render('products/todos')
    },
    creacion : (req , res) => {
        return res.render('products/creacion')
    },
    edicion : (req , res) => {
        return res.render('products/edicion')
    }
}