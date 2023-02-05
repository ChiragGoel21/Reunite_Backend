const serverStore = require('../serverStore');
const roomUpdates= require('../socketHandler/updates/room');

const roomCreateHandler=(socket)=>{
    const socketId=socket.id;
    const userId=socket.user.user_id;

    const roomDetail=serverStore.addNewActiveRoom(userId,socketId);

    socket.emit('room-created',{
        roomDetail,
    });
    roomUpdates.updateRoom();
}
module.exports=roomCreateHandler