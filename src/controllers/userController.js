
const { validationResult } = require('express-validator')
const { readJSON, writeJSON } = require('../data')
const { hashSync } = require('bcryptjs')
const fs = require('fs');
const path = require('path');
const db = require('../database/models')


module.exports = {
    register: (req, res) => {

        return res.render('users/register')
    },

    processRegister: (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const { name, surname, email, password } = req.body;
            db.Location.create()
                .then(location => {
                    db.User.create({
                        name: name.trim(),
                        surname: surname.trim(),
                        email: email.trim(),
                        password: hashSync(password, 12),
                        avatar: null,
                        rolId: 2,
                        locationId: location.id
                    }).then(user => {
                        console.log(user)
                        return res.redirect('/users/login')
                    })
                }).catch(error => console.log(error))

        } else {
            return res.render('users/register', {
                errors: errors.mapped(),
                old: req.body
            })
        }
    },


    login: (req, res) => {
        return res.render('users/login')
    },

    processLogin: (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {

            const user = db.User.findOne({
                where: {
                    email: req.body.email
                },
                include: ['location']
            })
                .then(({ id, rolId, name }) => {

                    req.session.userLogin = {
                        rol: rolId,
                        id,
                        name,
                    };

                    if (req.body.remember) {
                        res.cookie('TechMaster', req.session.userLogin, { maxAge: 1000 * 120 })
                    }

                    return res.redirect('/')
                })
                .catch(error => console.log(error))

        } else {
            return res.render('users/login', {
                errors: errors.mapped()
            })
        }
    },

    profile: (req, res) => {
        user = db.User.findOne({
            where: {
                id: req.session.userLogin.id
            },
            include: ['location']
        }).then((user) => {
            console.log(user)
            return res.render('users/profile', { user })
        }).catch((error) => console.log(error))
    },

    processProfile: (req, res) => {
        const { name, surname, email, password, address, city, province, zipCode, rolId } =
            req.body;
        const id = req.session.userLogin.id
        const removeImagesBefore = req.query.removeImageBefore
        db.User.findByPk(id)
            .then(user => {
                const locationUpdate = db.Location.update(
                    {
                    address: address ? address.trim() : null,
                    province: province ? province.trim() : null,
                    city: city ? city.trim() : null,
                    zipCode: zipCode ? zipCode : null
                }, 
                {
                    where: { id: user.locationId }
                }
                )
            
        const userUpdate = db.User.update({
            name : name.trim(),
            surname : surname.trim(),
            email : email.trim(),
            avatar : req.file ? req.file.filename : user.avatar
        }, {
            where: {
                id
            }
        })
        Promise.all(([locationUpdate, userUpdate]))
            .then(() => {
                (req.file &&
                    fs.existsSync('public/images/users/' + user.image))
                    && fs.unlinkSync('public/images/users/' + user.image)
                return res.redirect('/users/profile')
            })

        }).catch(error => console.log(error))

    
},

newPassword: (req, res) => {
    return res.render('users/newPassword')
},

    logout: (req, res) => {
        req.session.destroy();
        res.clearCookie('TechMaster');
        return res.redirect('/')
    }

}