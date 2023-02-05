const serverStore= require('../serverStore');
const updateRoom =require('./updates/room');
const roomJoinHandler=(socket,data)=>{
    const roomId=data.roomId;
    const participants={
        socketId:socket.id,
        userId:socket.user.user_id
    }
    const roomDetail=serverStore.getActiveRoom(roomId);
    serverStore.joinActiveRoom(roomId,participants);

    roomDetail.participants.forEach((partici)=>{
        if(participants.socketId !== partici.socketId)
        {
           // console.log(partici.socketId);
            socket.to(partici.socketId).emit('connection-prepare',{
                connectedUserSocketId:participants.socketId
            })
        }
    })

    updateRoom.updateRoom();
}
module.exports=roomJoinHandler;
