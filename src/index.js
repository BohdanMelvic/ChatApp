const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocation } = require('./utils/messages');
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
// socket.join(room) - method which automatically join user to exactly this room
// io.to(room).emit - send data to ALL users in specific room
// socket.broadcast.to(room).emit - send data to all users except current user in specific room

io.on('connection', (socket) => {
    console.log('New WebSocket connection'); 

    socket.on('join', ({ username, room }) => {
        socket.join(room); 

        socket.emit('message', generateMessage('Welcome!'));
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined.`));
    });

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        io.to(room).emit('message', generateMessage(message));
        callback('Delivired!');
    });

    socket.on('sendLocation', (location, callback) => { 
        io.to(room).emit('locationMessage', generateLocation(location));
        callback();
    });

    socket.on('disconnect', () => {
        io.to(room).emit('message', generateMessage(`${username} has leaved the chat.`));
    });
}); 

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});