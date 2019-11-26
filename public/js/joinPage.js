const socket = io();


// Rooms List

const roomsList = document.querySelector('#inputBox');
const roomsListTemplate = document.querySelector('#roomsListTemplate').innerHTML;

socket.on('roomsList', ({ rooms }) => {
    const html = Mustache.render(roomsListTemplate, {rooms});

    roomsList.innerHTML = html;
});

// Avatar 

const selectAvatar = function(element) {
    const avatarPicture = jQuery(element);
    const allAvatars = jQuery(".avatarSelection");
    for (let i = 0; i < allAvatars.length; i += 1) {
      jQuery(allAvatars[i]).removeClass("avatar-active");
    }
    avatarPicture.addClass("avatar-active");
    avatarPicture.find('input').prop("checked", true);
  };