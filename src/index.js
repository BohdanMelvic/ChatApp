const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

// socket.emit - send data only one user which connected by 'someChannelName'
// io.emit - send data to ALL users which connected by 'someChannelName'
// socket.broadcast - send data to all users except current user whichs connected by 'someChannelName'
// socket.on - received data from user which connected by 'someChannelName'

io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    
    socket.emit('message', 'Welcome!');
    socket.broadcast.emit('message', "A new user has joined"); 

    socket.on('sendMessage', (message, callback) => { 
        io.emit('message', message);
        callback('Delivired!');
    });

    socket.on('sendLocation', (location) => { 
        socket.broadcast.emit('message', `https://google.com/maps?q=${location.latitude},${location.longitude}`);
    });

    socket.on('disconnect', () => {
        io.emit('message', 'User has leaved a chat!');
    });
}); 

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});