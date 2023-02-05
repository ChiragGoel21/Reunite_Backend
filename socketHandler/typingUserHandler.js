const serverStore = require('../serverStore');
const typingUserHandler=(data)=>{
    const recevierId=data.recevierId;
    const senderId=data.senderId;

    const onlineUser=serverStore.getOnlineUser();
    const userTyping=onlineUser.filter(data=> data.userId===recevierId);
    if(userTyping.length === 0)return;
    const io=serverStore.getSocketInstance();
    userTyping.forEach(user=>{
            io.to(user.socketId).emit('usertyping',{
            senderId:senderId,
            typing:data.typing
        });
    })
}
module.exports=typingUserHandler;