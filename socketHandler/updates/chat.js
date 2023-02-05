const Conversation = require('../../model/conversationModel');
const serverStore = require('../../serverStore');

const updateChatHistory=(conversationId, toSpecifiedSocketId=null)=>{

    Conversation.findChatofUser(conversationId).then(chats=>{
        if(chats)
        {
            const io= serverStore.getSocketInstance();
           //console.log(chats);
            if(toSpecifiedSocketId)
            {
                return io.to(toSpecifiedSocketId).emit('direct-chat-history',{
                    messages:chats[0].MessageDetails,
                    participants:chats[0].participants
                });
            }

            chats[0].participants.forEach(userId=>{
                //console.log(userId);
                const activeConnection=serverStore.getActiveUsers(userId.toString());
                //console.log(activeConnection);
                activeConnection.forEach(socketId=>{
                    
                    //console.log(chats[0]);
                    io.to(socketId).emit('direct-chat-history',{
                        messages:chats[0].MessageDetails,
                        participants:chats[0].participants
                    });
                })
            })
        }
    }).catch(err=>{
        throw err;
    })
}

module.exports={
    updateChatHistory
}