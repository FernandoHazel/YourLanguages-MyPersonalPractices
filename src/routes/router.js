const express = require('express')
const router = express.Router()
const fs = require('node:fs')
const path = require('path')

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

router.get('/teacher-form', how, (req, res) => {
    res.render('teacher-form', {
        title: "Teacher form",
        name: null,
        description: null,
        id: null
    })
})


// Create new teacher
router.post('/teacher-form/create', (req, res) => {
    const data = readData()

    if(!req.body.name || !req.body.description){
        res.send(400).send('Entries must have a prof name and description')
    }

    let newProfessor = {
        id: generateUniqueId(),
        name: req.body.name,
        description: req.body.description
    }

    if(data != null){
        // Add the new professor to the data.json file
        data.professors.push(newProfessor)

        writeData(data)
        res.redirect('/')
    }
})

router.get('/teacher-form/:id/edit', (req, res) => {
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
router.put('/teacher-form/:id/edit', (req, res) => {
    const data = readData()

    if(!req.body.name || !req.body.description){
        res.send(400).send('Entries must have a prof name and description')
    }

    // Look for the element in the db and update it
    data.professors.forEach(teacher => {
        if( teacher.id == req.params.id ){
            teacher.name = req.body.name
            teacher.description = req.body.description
        }
    });

    writeData(data)
    res.redirect('/')
})

router.delete('/teacher-form/:id/delete', (req, res) => {
    const data = readData()
    console.log(req.params.id)
    const teacherIndex = data.professors.findIndex((teacher) => teacher.id == req.params.id)
    data.professors.splice(teacherIndex, 1)
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