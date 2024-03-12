const bcrypt = require('bcryptjs');
const path = require('path')

const usersFilePath = path.join(__dirname, '../../public/data/users.json')
const { validationResult } = require('express-validator')
const {readData, writeData, generateUniqueId} = require('./dataController')

//Require the model for the server
const User = require('../../public/data/userModel')
//Require the model for the database

const authController = {
    goToHome: (req, res) => {

        console.log("Session value (/)-> "+req.session.user)

        //If we have a cookie create a session
        if(req.cookies.MyCookie){
            req.session.user = {email: req.cookies.MyCookie}
        }
        
        // Make sure to add a default value in the case jsonData comes empty
        const users = readData(usersFilePath).users || []

        res.render('home', {
            title: "Home",
            users: users,
            user:  req.session.user ? req.session.user : {email: ""}
        })
    
    },
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

        delete req.session.user
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
                        console.log(user.email)
                        // Check hash
                        let check = bcrypt.compareSync(req.body.password, user.hashedPassword); //true false
    
                        // User and password are correct
                        if(check){
                            req.session.user = user
    
                            // Create cookie if checkbox is checked
                            console.log('remember -> value: '+req.body.remember)
                            if(req.body.remember){
                                res.cookie('MyCookie', user.email, {
                                    maxAge: 1000 * 60 * 60,
                                })
                            }
    
                            res.redirect('/')
                        }else{
                            res.send('User or password is incorrect')
                        }
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

            // Verify that the file string is not null
            let imagePath = req.file ? req.file.path : '';
        
            // Delete the "public" word
            if (imagePath != '')
                imagePath = imagePath.replace(/^public\\/, '');
    
            //Using the model instead of declaring the variable
            const newUser = new User(
                generateUniqueId(),
                req.body.name,
                req.body.lastName,
                req.body.email,
                req.body.gender,
                req.body.userType,
                hash,
                imagePath
            )
    
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