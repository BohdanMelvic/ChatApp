const socket = io();
const messageForm = document.querySelector('#messageForm');
const sendLocationBtn = document.querySelector('#sendLocationBtn');

socket.on('message', (message) => {
    console.log(message);
});

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const inputText = document.querySelector('.inputText');
    const messageFormBtn = document.querySelector('.messageFormBtn');
    const message = e.target.elements.message.value;

    messageFormBtn.setAttribute('disabled', 'disabled'); // disabled btn after sending message - you can't send two times the same message

    socket.emit('sendMessage', message, (error) => {
        messageFormBtn.removeAttribute('disabled', 'disabled');
        inputText.value = '';
        inputText.focus();
        if (error) {
            return console.log(error);
        }
        console.log('Message delivired.');
    });
});

sendLocationBtn.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    sendLocationBtn.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition( (position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude:  position.coords.longitude
        }, () => {
            sendLocationBtn.removeAttribute('disabled', 'disabled');
            console.log('Your Position delivired.');
        });
    });
});