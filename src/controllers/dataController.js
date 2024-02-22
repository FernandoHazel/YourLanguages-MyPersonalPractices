const fs = require('node:fs')
const path = require('path')

function readData(filePath){
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}
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

module.exports = {readData, writeData, generateUniqueId}