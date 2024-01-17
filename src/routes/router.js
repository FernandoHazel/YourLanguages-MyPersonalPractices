const express = require('express')
const router = express.Router()
const fs = require('node:fs')
const path = require('path')

// Take the json file path.
const jsonFilePath = path.join(__dirname, '../../public/data/data.json');

// Read the json file.
const jsonString = fs.readFileSync(jsonFilePath, 'utf-8')

// Parse json data
jsonData = JSON.parse(jsonString)
console.log(jsonData.professors)

router.get('/', (req, res) => {

    // Make sure to add a default value in the case jsonData comes empty
    const professorsData = jsonData.professors || []
    res.render('home', {
        title: "Home",
        professors: professorsData
    })
})

router.get('/new-professor', (req, res) => {
    res.render('new-professor', {
        title: "Create/Modify teacher",
        name: req.query.name,
        description: req.query.description
    })
})

router.post('/new-professor', (req, res) => {
    if(!req.body.name || !req.body.description){
        res.send(400).send('Entries must have a prof name and description')
    }

    let newProfessor = {
        name: req.body.name,
        description: req.body.description
    }

    if(jsonData != null){
        // Add the new professor to the data.json file
        jsonData.professors.push(newProfessor)

        // Convert the updated data back to JSON
        const updatedJsonData = JSON.stringify(jsonData, null, 2);

        // Write the updated data back to the JSON file
        fs.writeFile(jsonFilePath, updatedJsonData, 'utf8', (err) => {
            if (err) {
            console.error('Error writing file:', err);
            return;
            }

            console.log('Data added to the JSON file successfully.');
            res.redirect('/')
        });
    }
})

router.delete('/', (req, res) => {
    // Obtain the desired professor.

    // Remove it from json.

    // Redirect to main route.
})

// Using cjs in this case
module.exports = router