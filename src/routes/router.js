const express = require('express')
const router = express.Router()
const fs = require('node:fs')
const path = require('path')

const upload = require('../middlewares/upload')

// Import the middlewares
const {how} = require('../middlewares/middle')


// Take the json file path.
const jsonFilePath = path.join(__dirname, '../../public/data/data.json');

function readData(){
    return JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))
}

router.get('/', (req, res) => {

    // Make sure to add a default value in the case jsonData comes empty
    const professorsData = readData().professors || []

    res.render('home', {
        title: "Home",
        professors: professorsData
    })
})

// Create new
router.get('/teacher-form', (req, res) => {
    res.render('teacher-form', {
        title: "Teacher form",
        name: null,
        description: null,
        id: null
    })
})


// Create new teacher
router.post('/teacher-form/create', upload.single('avatar'), (req, res) => {
    const data = readData()

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

        writeData(data)
        res.redirect('/')
    }
})

router.get('/teacher-form/:id/edit',  (req, res) => {
    const data = readData()
    //console.log('data: ' + JSON.stringify(data, null, 2))

    // Find the element
    data.professors.forEach(teacher=> {
        if(teacher.id == req.params.id){
            res.render('teacher-form', {
                title: "Teacher Form",
                name: teacher.name,
                description: teacher.description,
                id: teacher.id
            })
        }
    });
    
})

// Modify an already existing teacher
router.put('/teacher-form/:id/edit', upload.single('avatar'), (req, res) => {
    const data = readData()

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

    writeData(data)
    res.redirect('/')
})

router.delete('/teacher-form/:id/delete', (req, res) => {
    const data = readData()

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
    writeData(data)
    res.redirect('/')
})

function writeData(data){
    // Convert the updated data back to JSON
    const updatedJsonDataString = JSON.stringify(data, null, 2);

    // Write the updated data back to the JSON file
    fs.writeFile(jsonFilePath, updatedJsonDataString, 'utf8', (err) => {
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