module.exports = {
    login : (req , res) => {
        return res.render('users/login')
    },
    register : (req , res) => {
        return res.render('users/register')
    },
    recovery : (req , res) => {
        return res.render('users/recovery')
    },
    profile : (req , res) => {
        return res.render('users/profile')
    }
}