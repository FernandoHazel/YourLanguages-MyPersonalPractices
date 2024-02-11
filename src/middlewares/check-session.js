const checkSession = (req, res, next) => {
    if(req.session.user){
        next()
    }else{
        res.redirect('/login-form')
    }
}

module.exports = checkSession