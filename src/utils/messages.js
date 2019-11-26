const generateMessage = (avatar, username, text) => {
    return {
        avatar,
        username,
        text,
        createdAt: new Date().getTime()
    };
};

const generateLocation = (avatar, username, location) => {
    return {
        avatar,
        username,
        location: `https://google.com/maps?q=${location.latitude},${location.longitude}`,
        createdAt: new Date().getTime()
    };
};

module.exports = {
    generateMessage,
    generateLocation
};