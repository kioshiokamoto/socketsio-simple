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

// Crear objeto para socketio
const liveData = io.of("/liveData") 


// Enviar mensaje en tiempo real
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/sender.html'));
})
//Recibir mensaje en tiempo real
app.get('/realtime', (req, res) => {
    res.sendFile(path.join(__dirname + '/receiver.html'));
})


// Envio de mensaje
app.post('/',(req, res) => {
    liveData.emit("new-data",req.body.message) // Emitting event.
})
// Evento de socketio
liveData.on("user-connected",(username)=>{
    console.log(username);
    console.log(`Receiver ${username} connected..`) // Logging when user is connected
});


//Inicializar servidor.
http.listen(port, host, () => console.log(`Listening on http://${host}:${port}/`))