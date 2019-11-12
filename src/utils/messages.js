const generateMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    };
};

const generateLocation = (location) => {
    return {
        location: `https://google.com/maps?q=${location.latitude},${location.longitude}`,
        createdAt: new Date().getTime()
    };
};

module.exports = {
    generateMessage,
    generateLocation
};