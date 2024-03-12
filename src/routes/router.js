const express = require('express')
const router = express.Router()

// Route middlewares
const checkSession = require('../middlewares/check-session')
const { loginValidations, singUpValidations } = require('../middlewares/validations')
const upload = require('../middlewares/upload')

// Controllers
const authController = require('../controllers/authController')
const teacherController = require('../controllers/teacherController')

// Teacher routes
router.get('/', teacherController.goToHome)
router.get('/teacher-form',  teacherController.goToTeacherForm)
router.post('/teacher-form/create', upload.single('avatar'), teacherController.createTeacher)
router.get('/teacher-form/:id/edit', teacherController.goToEditForm)
router.put('/teacher-form/:id/edit', upload.single('avatar'), teacherController.editTeacherById)
router.delete('/teacher-form/:id/delete', teacherController.deleteTeacher)

// Auth routes
router.get('/login-form', authController.goToLogin)
router.get('/log-out', authController.logOut)
router.delete('/delete-account/:id', authController.deleteUserById)
router.post('/login', loginValidations, authController.login)
router.get('/register-form', authController.goToSingUpForm)
router.post('/register-form/create', upload.single('avatar'), singUpValidations, authController.singUp)
//singUpValidations,
module.exports = router