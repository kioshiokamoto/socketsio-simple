const express = require('express') 
const path = require('path');
const app = express() 

const host = 'localhost' 
const port = 8000 

//Creacion de servidor http desde express para trabajar con socket.io
const http = require('http').Server(app); 

// Inicializacion de sockets
const io = require('socket.io')(http,{
    //Especificando cors
    cors: {
        origin: "*",
    }
})

app.use(express.urlencoded({ extended: true }))

// Creating object of Socket
const liveData = io.of("/liveData") 

// Socket event
liveData.on("user-connected",(username)=>{
    console.log(`Receiver ${username} connected..`) // Logging when user is connected
});

// Get request on home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/sender.html'));
})

app.get('/realtime', (req, res) => {
    res.sendFile(path.join(__dirname + '/receiver.html'));
})




// Post request on home page
app.post('/',(req, res) => {
    liveData.emit("new-data",req.body.message) // Emitting event.
})

// Listening on Host and Port
http.listen(port, host, () => console.log(`Listening on http://${host}:${port}/`))