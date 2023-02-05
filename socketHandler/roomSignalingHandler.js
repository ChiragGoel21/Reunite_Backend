
const roomSignalingHandler=(socket,data)=>{
    const conectedUserSocketId=data.conectedUserSocketId;
    const signal=data.signal;

    const signalingData={signal,conectedUserSocketId: socket.id};

    socket.to(conectedUserSocketId).emit('conn-signal', signalingData);
}
module.exports=roomSignalingHandler;