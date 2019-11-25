const users = [];
const rooms =[];
const avatars = [];

 const addUser = ({id, username, room, avatar}) => {
     // Cleaning data
     username = username.trim().toLowerCase();
     room = room.trim();

     // Validate data
     if (!username || !room) {
        return {
            error: 'Username and room are required.'
        }
     }

     // Check for existing user
     const existingUser = users.find( (user) => {
        return user.room === room && user.username === username;
     });

     // Validate username
     if (existingUser) {
         return {
            error: 'This username has already used.'
         }
     }

    // Store room 
    let roomIs = true;
    rooms.forEach( (obj) => {
    if( obj.room === room) {
        roomIs = false;
    }
    });

    if (roomIs) {
        rooms.push({room: room});
    }

     // Store user
     const user = { id, username, room };
     users.push(user);
     return { user };
 };

 const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id;
    });

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
 };

 const getUser = (id) => {
    return users.find( (user) => user.id === id);
 };

 const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room);
};

const getRooms = () => {
    return rooms;
}

const removeRoom = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id;
    });

    if (index !== -1) {
        const roomName = users[index].room;

        const roomIndex = rooms.findIndex((room) => {
            return room.room === roomName;
        });
    
        if (roomIndex !== -1) {
            return rooms.splice(roomIndex, 1)[0];
        }
    }
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getRooms,
    removeRoom
}