
const {validationResult} = require('express-validator')
const {readJSON, writeJSON} = require('../data')
const {hashSync} = require('bcryptjs') 
const fs = require('fs');
const path = require('path');
const db = require('../database/models')


module.exports = {
    register : (req , res) => {
   
        return res.render('users/register')
    },

    processRegister : (req, res) => {
        const errors = validationResult(req);
        if(errors.isEmpty()){
        const {name, surname, email, password } = req.body;

        db.User.create({
            name : name.trim(),
            surname : surname.trim(),
            email : email.trim(),
            password : hashSync(password,12),
            avatar: null,
            rolId:2,
            locationId: null
        }).then(user =>{
            return res.redirect('/users/login')
        })
    
        }else{
            return res.render('users/register',{
                errors : errors.mapped(),
                old : req.body
            })
        }
    },


    login : (req , res) => {
        return res.render('users/login')
    },

    processLogin: (req , res) => {
        const errors = validationResult(req);

       if(errors.isEmpty()){

        db.User.findOne({
            where : {
                email : req.body.email
            }
        })
        .then( ({id, name, rolId}) => {

            req.session.userLogin = {
                id,
                name,
                rol : rolId
            };

            if(req.body.remember){
                res.cookie('TechMaster',req.session.userLogin,{maxAge: 1000*60} )
           }

            return res.redirect('/')
        })
        .catch(error => console.log(error))

    }else{
        return res.render('users/login',{
            errors : errors.mapped()
        })
    }
    },

    profile : (req,res) => {
       const id = req.session.userLogin.id
       console.log(id);
       let user = readJSON('users.json').find(user => user.id === id);
       console.log(user);
        return res.render('users/profile',{
            title : "perfil de sesión",
            user

        })
    },
    processProfile : (req,res) => {
       
        const id = req.session.userLogin.id
        const users =  readJSON('users.json').map(user => {
            if(user.id === id){
                return {
                    ...user,
                    avatar: req.file ? req.file.filename : "default.png"
                }
            }
            return user;
        }) 
        writeJSON('users.json', users);
        return res.redirect('/users/profile')
        
    },

    newPassword : (req , res) => {
        return res.render('users/newPassword')
    },
    
    logout : (req,res) =>{
        req.session.destroy();
        res.clearCookie('userTechMaster');
        return res.redirect('/')
    }
    
}