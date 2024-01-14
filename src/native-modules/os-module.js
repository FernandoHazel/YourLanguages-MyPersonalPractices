// These are native node modules

// Operative Sistem module

const os = require('node:os')
console.log('Operative Sistem Info:')
console.log('---------------------')
console.log('Name: ', os.platform())
console.log('Version: ', os.release())
console.log('Architecture: ', os.arch())
console.log('CPUs: ', os.cpus())


