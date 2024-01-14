// This is the native file system module of nodejs
const fs = require('node:fs')

const stats = fs.statSync('./src/native-modules/file.txt')

console.log(
    stats.isFile(),
    stats.isDirectory(),
    stats.size + " bytes"
    // there are many more stats
    // ...
)

const text = fs.readFileSync('./src/native-modules/file.txt', 'utf-8')

console.log(text)

// A callback is a function executed when a task is finished.
// This way is not necessary to storage the result in a constant
fs.readFile(
'./src/native-modules/file.txt',
 'utf-8', 
 (err, text) => {
    console.log(text + '--> this is text1')
})

console.log("doing thing while reading the file")

fs.readFile(
    './src/native-modules/file2.txt',
     'utf-8', 
     (err, text) => {
        console.log(text + '--> this is text2')
})

// The rest of the code runs normaly event if the task is not finished yet
// When it is done the call back will execute