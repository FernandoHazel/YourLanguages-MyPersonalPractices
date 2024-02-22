const bcrypt = require('bcryptjs');
const path = require('path')

const usersFilePath = path.join(__dirname, '../../public/data/users.json')
const { validationResult } = require('express-validator')
const {readData, writeData, generateUniqueId} = require('./dataController')

 const authController = {
    goToLogin: (req, res ) => {
        res.render('login-form',
        {
            title: 'login-form'
        })
    },
    logOut: (req, res ) => {
        // Delete the session
        delete req.session.user
        res.render('login-form',
        {
            title: 'login-form'
        })
    },
    deleteUserById: (req, res ) => {
        const data = readData(usersFilePath)
    
        // Delete the teacher in the array
        const userIndex = data.users.findIndex((user) => user.id == req.params.id)
    
        // Delete from the array
        data.users.splice(userIndex, 1)
    
        // Update the json file
        writeData(data, usersFilePath)
        res.redirect('/login-form')
    },
    login: (req, res) => {
        const data = readData(usersFilePath)
        let errors = validationResult(req)
    
        // If there are no erros login normally
        if(errors.isEmpty()){
            // If the db is not empty
            if(data.users.length > 0){
    
                data.users.forEach( user => {
                    // Look for the user email and compare with the one inserted in the login form
                    if(req.body.email == user.email){
    
                        // Check hash
                        let check = bcrypt.compareSync(req.body.password, user.password); //true false
    
                        // User and password are correct
                        if(check){
                            req.session.user = user
    
                            // Create cookie if checkbox is checked
                            console.log('remember -> value: '+req.body.remember)
                            if(req.body.remember){
                                res.cookie('MyCookie', user.email, {
                                    maxAge: 1000 * 60 * 60,
                                    //expires: new Date("2024-12-01"),
                                    //httpOnly: true, //can't be accessed through the browser, can't see it in the dev tools
                                    //secure: true //only accessed by https (activate when deploy)
                                })
                            }
    
                            //To delete a cookie use this code
                            //res.clearCookie('MyCookie')
    
                            res.redirect('/')
                        }else{
                            res.send('User or password is incorrect')
                        }
                    }else{
                        res.send('User or password is incorrect')
                    }
                })
            }else{
                res.send("User doesn't exist")
            }
        // If we have errors in the login render de form with the errors
        } else {
            console.log(errors)
            res.render('login-form',
                {
                    title: 'login-form',
                    errors: errors.mapped(),
                    old: req.body
                }
            )
        }   
    },
    goToSingUpForm: (req, res) => {
        res.render('register-form',
        {
            title: 'register-form'
        })
    },
    singUp: (req, res) => {
        const data = readData(usersFilePath)
        let errors = validationResult(req)
    
        // If there are no erros sing up normally
        console.log(errors)
        if(errors.isEmpty()){
            // hash password
            let hash = bcrypt.hashSync(req.body.password, 10);
    
            const newUser = {
                id: generateUniqueId(),
                email: req.body.email,
                password: hash,
            }
    
            if(data != null){
                
                // Add the new professor to the data.json file
                data.users.push(newUser)
    
                writeData(data, usersFilePath)
    
                // Create a session variable
                req.session.user = newUser
                res.redirect('/')
            }
        // If the validation has errors return to the login with the errors
        } else {
            res.render('register-form',
                { 
                    title: 'register-form',
                    errors: errors.mapped(),
                    old: req.body
                }
            )
        }
    
        
    }
}

module.exports = authController