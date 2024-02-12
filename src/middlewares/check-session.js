const checkSession = (req, res, next) => {
    // If the user is not logged go to the login form
    if(req.session.user){
        next()
    }else{
        res.redirect('/login-form')
    }
}

module.exports = checkSession