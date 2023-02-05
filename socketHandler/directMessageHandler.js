const Message = require('../model/messageModel');
const Conversation = require('../model/conversationModel');
const chatUpdate= require('./updates/chat');

module.exports=directMessageHandler=(socket,data)=>{
    try {
            const userId=socket.user.user_id;
            const recevierId=data.recevierId;
            const content=data.content;

            const msg = new Message(userId,content,'DIRECT');
            msg.save().then(result=>{
                Conversation.findUsers(userId,recevierId).then(conversation=>{
                    //console.log(result);
                    if(conversation)
                    {
                        const previousMsg=conversation.Message;
                        previousMsg.push(result.insertedId);
                        Conversation.updateMsg(conversation._id,previousMsg).then(update=>{
                            if(update)
                            {
                                chatUpdate.updateChatHistory(conversation._id,null);
                            }
                        }).catch(err=>{throw err});
                    }
                    else
                    {
                        const msgArray=[result.insertedId]
                        const conv= new Conversation(userId,recevierId,msgArray);
                        conv.save().then(save=>{
                            if(save)
                            {
                                chatUpdate.updateChatHistory(save.insertedId,null);
                            }
                        }).catch(err=>{throw err});
                    }         
                }).catch(err=>{throw err});                
            }).catch(err=>{
                throw err;
            })
    }catch(error){
        
    }
}


