module.exports = {
    login : (req , res) => {
        return res.render('users/login')
    },
    register : (req , res) => {
        return res.render('users/register')
    },
    newPassword : (req , res) => {
        return res.render('users/newPassword')
    },
}