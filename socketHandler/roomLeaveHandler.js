const serverStore = require('../serverStore');
const roomUpdates= require('./updates/room');
const roomLeaveHandler=(socket,data)=>{
    const roomId=data.roomId;
    const room = serverStore.getActiveRoom(roomId);
    if(room)
    {
        serverStore.leaveActiveRoom(roomId,socket.id);

        const updatedActiveRoom=serverStore.getActiveRoom(roomId);
        if(updatedActiveRoom)
        {
            updatedActiveRoom.participants.forEach(parti=>{
                socket.to(parti.socketId).emit('room-participants-left',{
                    connectedUserSocketId:socket.id
                })
            })
        }
        roomUpdates.updateRoom();
    }
}
module.exports=roomLeaveHandler;