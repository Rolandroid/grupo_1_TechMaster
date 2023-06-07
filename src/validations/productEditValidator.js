const {check, body} = require('express-validator');
const db = require('../database/models')


module.exports = [
    check('name')
        .notEmpty().withMessage('El nombre es obligatorio').bail()
        .isLength({min: 5, max: 100}).withMessage('Mínimo dos letras').bail(),

        check('price')
        .notEmpty().withMessage('El precio es obligatorio ').bail()
        .isInt({min:1}).withMessage('El precio tiene que ser mayor a 0'),

        check('category')
        .notEmpty().withMessage('La categoría es obligatoria'),

        check('description')
        .notEmpty().withMessage('La description es obligatoria').bail()
        .isLength({min:20,  max: 500}).withMessage('mínimo 20 letras'),

        check('discount')
        .isInt({min:0,  max: 100}).withMessage('El descuento tiene que ser entre 0 y 100'),


    ]