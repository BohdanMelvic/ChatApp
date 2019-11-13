const socket = io();
const messageForm = document.querySelector('#messageForm');
const sendLocationBtn = document.querySelector('#sendLocationBtn');
const messages = document.querySelector('#messages');


// Templates
const messageTemplate = document.querySelector('#messageTemplate').innerHTML;
const locationeTemplate = document.querySelector('#locationeTemplate').innerHTML;

// Options 
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true }); // using qs library, which takes url address and creat object with data from my join-form

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, { 
        message: message.text,
        createdAt: moment(message.createdAt).format('H:mm')
     }); // generate messageTemplate from script on index.html page and provided it by variable message 
    messages.insertAdjacentHTML('beforeend', html)
});

socket.on('locationMessage', (url) => {
    const html = Mustache.render(locationeTemplate, { 
        url: url.location,
        createdAt: moment(url.createdAt).format('H:mm')
     }); // generate messageTemplate from script on index.html page and provided it by variable message 
    messages.insertAdjacentHTML('beforeend', html)
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

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});