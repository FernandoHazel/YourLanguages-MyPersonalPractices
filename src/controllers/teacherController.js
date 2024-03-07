const fs = require('node:fs')
const path = require('path')

const teachersFilePath = path.join(__dirname, '../../public/data/data.json');
const {readData, writeData, generateUniqueId} = require('./dataController')

const teacherController = {
    goToHome: (req, res) => {

        console.log("Session value (/)-> "+req.session.user)

        //If we have a cookie create a session
        if(req.cookies.MyCookie){
            req.session.user = {email: req.cookies.MyCookie}
        }
        
        // Make sure to add a default value in the case jsonData comes empty
        const teachersData = readData(teachersFilePath).teachers || []

        res.render('home', {
            title: "Home",
            teachers: teachersData,
            user:  req.session.user ? req.session.user : {email: ""}
        })
    
    },
    goToTeacherForm: (req, res) => {

        //If we have a cookie create a session
        if(req.cookies.MyCookie){
            req.session.user = {email: req.cookies.MyCookie}
        }

        res.render('teacher-form', {
            title: "Teacher form",
            name: null,
            description: null,
            id: null,
            user: req.session.user ? req.session.user : {email: ""}
        })
    },
    createTeacher: (req, res) => {
        const data = readData(teachersFilePath)
    
        if(!req.body.name || !req.body.description){
            res.status(400).send('Entries must have a prof name and description');
        }
    
        // Verify that the file string is not null
        let imagePath = req.file ? req.file.path : '';
    
        // Delete the "public" word
        if (imagePath != '')
            imagePath = imagePath.replace(/^public\\/, '');
    
        let newTeacher = {
            id: generateUniqueId(),
            name: req.body.name,
            description: req.body.description,
            imagePath: imagePath
        }
    
        if(data != null){
            // Add the new professor to the data.json file
            data.teachers.push(newTeacher)
    
            writeData(data, teachersFilePath)

            console.log("user after creating - "+ req.session.user)

            req.session.user = {
                "id": "1708568417370-500",
                "email": "fernandohazel1@gmail.com",
                "password": "$2a$10$yPVnfGUsJvn40SoNREH9luEoIRf/3WDEMWscP/xts4ovKSuInfkba"
              }
            res.redirect('/')
        }
    },
    goToEditForm: (req, res) => {

        //If we have a cookie create a session
        if(req.cookies.MyCookie){
            req.session.user = {email: req.cookies.MyCookie}
        }

        const data = readData(teachersFilePath)

        // Find the element
        data.teachers.forEach(teacher=> {
            if(teacher.id == req.params.id){
                res.render('teacher-form', {
                    title: "Teacher Form",
                    name: teacher.name,
                    description: teacher.description,
                    id: teacher.id,
                    user: req.session.user ? req.session.user : {email: ""}
                })
            }
        });
        
    },
    editTeacherById: (req, res) => {
        const data = readData(teachersFilePath)
    
        if(!req.body.name || !req.body.description){
            res.status(400).send('Entries must have a prof name and description');
        }
    
        // Look for the element in the db and update it
        data.teachers.forEach(teacher => {
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
    },
    deleteTeacher: (req, res) => {
        const data = readData(teachersFilePath)
    
        // Delete the teacher in the array
        const teacherIndex = data.teachers.findIndex((teacher) => teacher.id == req.params.id)
    
        // Take the file path to delete the file
        const filePath = path.join(__dirname, `../../public/${data.teachers[teacherIndex].imagePath}`) 
    
        // Delete the image file
        fs.unlink(filePath, (err) => {
            if (err) {
            console.error(`Error deleting file: ${err.message}`);
            } else {
            console.log(`File deleted successfully`);
            }
        });
    
        // Delete from the array
        data.teachers.splice(teacherIndex, 1)
    
        // Update the json file
        writeData(data, teachersFilePath)

        req.session.user = {
            "id": "1708568417370-500",
            "email": "fernandohazel1@gmail.com",
            "password": "$2a$10$yPVnfGUsJvn40SoNREH9luEoIRf/3WDEMWscP/xts4ovKSuInfkba"
          }
        res.redirect('/')
    }
}

module.exports = teacherController