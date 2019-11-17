const socket = io();

const roomsList = document.querySelector('#rooms');
const roomsListTemplate = document.querySelector('#roomsListTemplate').innerHTML;

socket.on('roomsList', ({room, rooms}) => {
    const html = Mustache.render(sidebarTemplate, { room, rooms });

    document.querySelector('#roomsList').innerHTML = html;
});

