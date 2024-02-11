const express = require('express')
const router = express.Router()
const fs = require('node:fs')
const path = require('path')

const upload = require('../middlewares/upload')

// Import the middlewares
const {how} = require('../middlewares/middle')
const checkSession = require('../middlewares/check-session')


// Take the json file path.
const teachersFilePath = path.join(__dirname, '../../public/data/data.json');
const usersFilePath = path.join(__dirname, '../../public/data/users.json');

function readData(filePath){
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}


router.get('/', checkSession, (req, res) => {

    // Make sure to add a default value in the case jsonData comes empty
    const professorsData = readData(teachersFilePath).professors || []

    res.render('home', {
        title: "Home",
        professors: professorsData,
        user: req.session.user
    })
})

// Create new
router.get('/teacher-form', checkSession, (req, res) => {
    res.render('teacher-form', {
        title: "Teacher form",
        name: null,
        description: null,
        id: null,
        user: req.session.user
    })
})


// Create new teacher
router.post('/teacher-form/create', checkSession, upload.single('avatar'), (req, res) => {
    const data = readData(teachersFilePath)

    if(!req.body.name || !req.body.description){
        res.send(400).send('Entries must have a prof name and description')
    }

    // Verify that the file string is not null
    let imagePath = req.file ? req.file.path : '';

    // Delete the "public" word
    if (imagePath != '')
        imagePath = imagePath.replace(/^public\\/, '');

    let newProfessor = {
        id: generateUniqueId(),
        name: req.body.name,
        description: req.body.description,
        imagePath: imagePath
    }

    if(data != null){
        // Add the new professor to the data.json file
        data.professors.push(newProfessor)

        writeData(data, teachersFilePath)
        res.redirect('/')
    }
})

router.get('/teacher-form/:id/edit', checkSession, (req, res) => {
    const data = readData(teachersFilePath)

    // Find the element
    data.professors.forEach(teacher=> {
        if(teacher.id == req.params.id){
            res.render('teacher-form', {
                title: "Teacher Form",
                name: teacher.name,
                description: teacher.description,
                id: teacher.id,
                user: req.session.user
            })
        }
    });
    
})

// Modify an already existing teacher
router.put('/teacher-form/:id/edit', checkSession, upload.single('avatar'), (req, res) => {
    const data = readData(teachersFilePath)

    if(!req.body.name || !req.body.description){
        res.send(400).send('Entries must have a prof name and description')
    }

    // Look for the element in the db and update it
    data.professors.forEach(teacher => {
        if( teacher.id == req.params.id ){
            teacher.name = req.body.name
            teacher.description = req.body.description

            // Modify the teacher imagePath only if it is not null
            if (req.file != null){

                // Delete previous image------

                //Find and delete the previous file
                const filePath = path.join(__dirname, `../../public/${teacher.imagePath}`)

                // Delete the image file
                fs.unlink(filePath, (err) => {
                    if (err) {
                    console.error(`Error deleting file: ${err.message}`);
                    } else {
                    console.log(`File deleted successfully`);
                    }
                });

                // Upload new image------

                // Verify that the file string is not null
                let imagePath = req.file.path

                // Delete the "public" word
                imagePath = imagePath.replace(/^public\\/, '');

                teacher.imagePath = imagePath
            }
        }
    });

    writeData(data, teachersFilePath)
    res.redirect('/')
})

router.delete('/teacher-form/:id/delete', checkSession, (req, res) => {
    const data = readData(teachersFilePath)

    // Delete the teacher in the array
    const teacherIndex = data.professors.findIndex((teacher) => teacher.id == req.params.id)

    // Take the file path to delete the file
    const filePath = path.join(__dirname, `../../public/${data.professors[teacherIndex].imagePath}`) 

    // Delete the image file
    fs.unlink(filePath, (err) => {
        if (err) {
        console.error(`Error deleting file: ${err.message}`);
        } else {
        console.log(`File deleted successfully`);
        }
    });

    // Delete from the array
    data.professors.splice(teacherIndex, 1)

    // Update the json file
    writeData(data, teachersFilePath)
    res.redirect('/')
})

router.get('/login-form', (req, res ) => {
    res.render('login-form',
    {
        title: 'login-form'
    })
})

router.get('/log-out', (req, res ) => {
    // Delete the session
    delete req.session.email
    res.render('login-form',
    {
        title: 'login-form'
    })
})

router.delete('/delete-account/:id', (req, res ) => {
    const data = readData(usersFilePath)

    // Delete the teacher in the array
    const userIndex = data.users.findIndex((user) => user.id == req.params.id)

    // Delete from the array
    data.users.splice(userIndex, 1)

    // Update the json file
    writeData(data, usersFilePath)
    res.redirect('/login-form')
})

router.post('/login', (req, res) => {
    const data = readData(usersFilePath)

    if(data.users.length > 0){
        data.users.forEach( user => {
            if(req.body.email == user.email){
                if(req.body.password == user.password){
                    req.session.user = user
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
    
})

router.get('/register-form', (req, res ) => {
    res.render('register-form',
    {
        title: 'register-form'
    })
})

router.post('/register-form/create', (req, res ) => {
    const data = readData(usersFilePath)

    if(!req.body.email || !req.body.password){
        res.send(400).send('Entries must have an email and description')
    }

    let newUser = {
        id: generateUniqueId(),
        email: req.body.email,
        password: req.body.password,
    }

    // Create a session variable
    req.session.user = newUser

    if(data != null){
        
        // Add the new professor to the data.json file
        data.users.push(newUser)

        writeData(data, usersFilePath)

        res.redirect('/')
    }
})

function writeData(data, filePath){
    // Convert the updated data back to JSON
    const updatedJsonDataString = JSON.stringify(data, null, 2);

    // Write the updated data back to the JSON file
    fs.writeFile(filePath, updatedJsonDataString, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }

        console.log('Data added to the JSON file successfully.');
    });
}

function generateUniqueId() {
    const timestamp = new Date().getTime();
    const randomPart = Math.floor(Math.random() * 1000); // Add randomness for uniqueness
  
    return `${timestamp}-${randomPart}`;
  }

// Using cjs in this case
module.exports = router