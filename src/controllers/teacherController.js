const fs = require('node:fs')
const path = require('path')

const teachersFilePath = path.join(__dirname, '../../public/data/data.json');
const {readData, writeData, generateUniqueId} = require('./dataController')

const teacherController = {
    goToHome: (req, res) => {

        //If we have a cookie create a session
        if(req.cookies.MyCookie){
            req.session.user = {email: req.cookies.MyCookie}
        }
        /*
        cookies = {
            MyCookie: "fernandohazel1@gmail.com"
        }
        user = {
            email: "fernandohazel1@gmail.com"
        }*/
        
        // Make sure to add a default value in the case jsonData comes empty
        const professorsData = readData(teachersFilePath).professors || []
    
        res.render('home', {
            title: "Home",
            professors: professorsData,
            user: req.session.user ? req.session.user : {email: ""} //Verify if we have a user logged to show its email
        })
    
        user = {
            email: ""
        }
    
    },
    goToTeacherForm: (req, res) => {
        res.render('teacher-form', {
            title: "Teacher form",
            name: null,
            description: null,
            id: null,
            user: req.session.user
        })
    },
    createTeacher: (req, res) => {
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
    },
    goToEditForm: (req, res) => {
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
        
    },
    editTeacherById: (req, res) => {
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
    },
    deleteTeacher: (req, res) => {
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
    }
}

module.exports = teacherController