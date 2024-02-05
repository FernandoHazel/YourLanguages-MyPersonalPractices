const sup = (req, res, next) => {
    console.log("Application Middleware")

    next()
}

const how = (req, res, next) => {
    console.log("Route middleware")

    // go to create route
    res.redirect('/teacher-form')


    next()
}

module.exports = {sup, how}