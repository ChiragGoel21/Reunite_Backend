
const chatUpdate= require('./updates/chat');
const conversation=require('../model/conversationModel');
const directChatHistoryHandler=async(socket,data)=>{
    try{
        const userId=socket.user.user_id;
        const recevierId=data.recevierId;

        conversation.findUsers(userId,recevierId).then(conve=>{
                if(conve)
                {
                    chatUpdate.updateChatHistory(conve._id,socket.id)
                }
        }).catch(err=>{throw err});
    }catch(error){

    }
}
module.exports=directChatHistoryHandler;