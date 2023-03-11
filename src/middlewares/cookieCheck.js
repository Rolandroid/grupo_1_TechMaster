module.exports = (req,res,next) => {
    if(req.cookies.userTechMaster){
        req.session.userLogin = req.cookies.userTechMaster
    }

    next()
}
