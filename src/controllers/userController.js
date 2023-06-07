
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

            db.User.create({
                name: name.trim(),
                surname: surname.trim(),
                email: email.trim(),
                password: hashSync(password, 12),
                avatar: null,
                rolId: 2,
            }).then(user => {
                db.Location.create({
                    userId: user.id
                })
                    .then(location => {
                        console.log(user, location)
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
        db.User.findOne({
            where: {
                id: req.session.userLogin.id
            },
        }).then((user) => {

            db.Location.findOne({
                where: { userId: user.id }
            }).then((location) => {
                console.log(user, location)
                return res.render('users/profile', { user, location })
            })

        }).catch((error) => console.log(error))
    },

    processProfile: (req, res) => {
        const { name, surname, password, address, city, province, zipCode, rolId } =
            req.body;
        const id = req.session.userLogin.id;
        const removeImagesBefore = req.query.removeImageBefore;
        db.User.findByPk(id)
            .then(user => {
                const userUpdate = db.User.update({
                    name: name.trim(),
                    surname: surname.trim(),
                    avatar: req.file ? req.file.filename : user.avatar
                }, {
                    where: {
                        id
                    }
                });
    
                const locationUpdate = db.Location.update(
                    {
                        address: address ? address.trim() : null,
                        province: province ? province.trim() : null,
                        city: city ? city.trim() : null,
                        zipCode: zipCode ? zipCode : null
                    },
                    {
                        where: { Userid: id }
                    }
                );
    
                Promise.all([locationUpdate, userUpdate])
                    .then(() => {
                        (req.file &&
                            fs.existsSync('public/images/users/' + user.image))
                            && fs.unlinkSync('public/images/users/' + user.image);
                        return res.redirect('/users/profile');
                    });
            })
            .catch(error => console.log(error));
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