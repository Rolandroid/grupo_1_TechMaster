
const {validationResult} = require('express-validator')
const {readJSON, writeJSON} = require('../data')
const {hashSync} = require('bcryptjs') 
const fs = require('fs');
const path = require('path');



module.exports = {
    register : (req , res) => {
        return res.render('users/register')
    },

    processRegister : (req, res) => {
        const errors = validationResult(req);

        if(errors.isEmpty()){
            const users = readJSON('users.json')
            const {name, surname, email, password } = req.body;

            const newUser = {
                id : users.length ? users[users.length - 1].id + 1 : 1,
                name : name.trim(),
                surname : surname.trim(),
                email : email.trim(),
                password : hashSync(password,12),
                avatar: "",
                rol:"user"
            }
            
            users.push(newUser);
            writeJSON('users.json', users);
            return res.redirect('/users/login');
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
        const {id , name , rol} = readJSON('users.json').find(user => user.email === req.body.email);

        req.session.userLogin = {
            id,
            name,
            rol
        }
        
        if(req.body.remember){
            res.cookie('userTechMaster', req.session.userLogin,{maxAge: 1000 * 60 * 60 * 12}) // 12 horas
          }
          

        return res.redirect('/')

       }else{
        return res.render('users/login',{
            errors: errors.mapped()
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
       
        const fs = require('fs');
        const path = require('path');

        const id = req.session.userLogin.id
        let user = readJSON('users.json').find(user => user.id === id);
        user.avatar = req.file ?  req.file: null
        let users = readJSON('users.json')
        users.push(user);

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