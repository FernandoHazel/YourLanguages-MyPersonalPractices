const express = require('express')
const router = express.Router()

// Route middlewares
const checkSession = require('../middlewares/check-session')
const { loginValidations, singUpValidations } = require('../middlewares/validations')
const upload = require('../middlewares/upload')

// Controllers
const authController = require('../controllers/authController')

// Auth routes
router.get('/', authController.goToHome)
router.get('/login-form', authController.goToLogin)
router.get('/log-out', authController.logOut)
router.delete('/delete-account/:id', authController.deleteUserById)
router.post('/login', loginValidations, authController.login)
router.get('/register-form', authController.goToSingUpForm)
router.post('/register-form/create', upload.single('avatar'), singUpValidations, authController.singUp)
//singUpValidations,
module.exports = router