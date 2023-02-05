

const roomInitializeConnectionHandler=(socket,data)=>{
    const conectedUserSocketId=data.connectedUserSocketId;
    const initData= {conectedUserSocketId:socket.id};
    socket.to(conectedUserSocketId).emit('conn-init',initData);
}
module.exports=roomInitializeConnectionHandler;