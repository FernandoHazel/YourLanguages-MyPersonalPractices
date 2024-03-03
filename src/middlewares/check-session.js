const checkSession = (req, res, next) => {
    // If the user is not logged go to the login form
    console.log("req.session.user = " + req.session.user)
    if(req.session.user || req.cookies.MyCookie){
        next()
    }else{
        res.redirect('/login-form')
    }
}

module.exports = checkSession