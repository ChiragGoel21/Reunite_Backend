const serverStore = require('../../serverStore');

const updateRoom=(toSpecifiedTargetId=null)=>{
    const io=serverStore.getSocketInstance();
    const activeRooms=serverStore.getActiveRooms();

    if(toSpecifiedTargetId)
    {
        io.to(toSpecifiedTargetId).emit('active-rooms',{
            activeRooms,
        })
    }
    else
    {
        io.emit('active-rooms',{
            activeRooms,
        })
    }
}
module.exports={
    updateRoom
}