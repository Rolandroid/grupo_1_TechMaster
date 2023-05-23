const {check, body} = require('express-validator');
const db = require('../database/models')


module.exports = [
    check('name')
        .notEmpty().withMessage('El nombre es obligatorio').bail()
        .isLength({min: 5, max: 100}).withMessage('Mínimo dos letras').bail(),

        check('price')
        .notEmpty().withMessage('El precio es obligatorio ').bail()
        .isInt({min:1}).withMessage('Solo números positivos'),

        check('category')
        .notEmpty().withMessage('La categoría es obligatorio'),

        check('description')
        .notEmpty().withMessage('La description es obligatorio ').bail()
        .isLength({min:20,  max: 500}).withMessage('mínimo 20 letras'),

        check('discount')
        .isInt({min:0,  max: 100}).withMessage('El descuento debe ser mínimo 0 a 100'),


    ]