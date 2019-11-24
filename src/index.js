const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocation } = require('./utils/messages');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { addUser, removeUser, getUser, getUsersInRoom, getRooms, removeRoom } = require('./utils/users');

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

    io.emit('roomsList', {
        rooms: getRooms()
    });

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });

        if (error) {
            return callback(error);
        }
        socket.join(user.room); 

        socket.emit('message', generateMessage('Chat App', 'Welcome!'));
        socket.broadcast.to(room).emit('message', generateMessage('Chat App', `${username} has joined.`));
        io.to(user.room).emit('usersInRoom', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback();
    });

    socket.on('sendLocation', (location, callback) => { 
        const user = getUser(socket.id);

        io.to(user.room).emit('locationMessage', generateLocation(user.username, location));
        callback();
    });

    socket.on('disconnect', () => {
        const roomD = removeRoom(socket.id);
        const user = removeUser(socket.id);
       

        if (user) {
            io.to(user.room).emit('message', generateMessage('Chat App',`${user.username} has left the chat.`));
            io.to(user.room).emit('usersInRoom', {
                room: user.room,
                users: getUsersInRoom(user.room)  
            });
        };
    });
}); 

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});