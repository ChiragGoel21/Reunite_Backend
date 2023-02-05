const serverStore=require('../serverStore');
const roomLeaveHandler = require('../socketHandler/roomLeaveHandler');
module.exports=(socket)=>{

    const activeRoom= serverStore.getActiveRooms();
    activeRoom.forEach(room=>{
        const userInRoom=room.participants.some(p=> p.socketId===socket.id);
        if(userInRoom)
        {
            roomLeaveHandler(socket,{roomId:room.roomId});
        }
    })
    serverStore.removeConnectedUser(socket.id);

}