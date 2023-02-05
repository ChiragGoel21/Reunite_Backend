const User = require('../../model/userModel');
const friendInvitationModel= require('../../model/friendInvitationModel');
const serverStore= require('../../serverStore');

const updateFriendPendingInvitations=async(userId)=>{
    try{
        let pendingInvitations;
        friendInvitationModel.find(userId).then(result=>{
            if(result)
            {
                pendingInvitations=result;

                const receiverList=serverStore.getActiveUsers(userId);
                const io=serverStore.getSocketInstance();

                receiverList.forEach(socketId=>{
                    io.to(socketId).emit('friends-invitations',{
                        pendingInvitations:result
                    })
                });
            }
        }).catch(err=>{throw err});
    }catch(error){
        
    }
}

const updateFriendsList=async(userId)=>{
    try{
        let pendingInvitations;

        User.sendUserFriend(userId).then(result=>{
           // console.log(result);
            if(result)
            {
                pendingInvitations=result;

                const receiverList=serverStore.getActiveUsers(userId);
                const io=serverStore.getSocketInstance();

                receiverList.forEach(socketId=>{
                    io.to(socketId).emit('friends-list',{
                        friendsList:result
                    })
                });
            }
        });
    }catch(error){
        
    }
}

module.exports={
    updateFriendPendingInvitations, updateFriendsList
}