const socket = io();


// Rooms List

const roomsList = document.querySelector('#inputBox');
const roomsListTemplate = document.querySelector('#roomsListTemplate').innerHTML;

socket.on('roomsList', ({ rooms }) => {
    const html = Mustache.render(roomsListTemplate, {rooms});

    roomsList.innerHTML = html;
    console.log(rooms);
});

