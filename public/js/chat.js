const socket = io();
const messageForm = document.querySelector('#messageForm');
const sendLocationBtn = document.querySelector('#sendLocationBtn');

socket.on('message', (message) => {
    console.log(message);
});

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.querySelector('.inputText').value;

    socket.emit('sendMessage', message, (textFormServer) => {
        console.log('Message delivired.', textFormServer);
    });
});

sendLocationBtn.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition( (position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude:  position.coords.longitude
        });
    });
});