const users = [];
const rooms =[];

 const addUser = ({id, username, room}) => {
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
      if (!rooms.includes(room)) {
         rooms.push(room);
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

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getRooms
}