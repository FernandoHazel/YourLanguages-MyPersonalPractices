// We will create it with node for now, latter we will do it with express
// Note we are using a native node module called http
const http = require('node:http')

// A server recieves a request and return a response
const server = http.createServer((req, res) => {
    // Remember a callback only executes when a task is finished so
    // in this case this callback only executes until the server recieved a request
    console.log('request recieved')
    res.end('sending a response')
})

// The server must listen in a port
server.listen(3000, () => {
    console.log(`server listening on port ${3000}`)
})