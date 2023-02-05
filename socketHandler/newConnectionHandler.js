const socketUser = require('../serverStore');
const friendList= require('./updates/friends');
const roomHandler= require('../socketHandler/updates/room');
const newConnectionHandler=async(socket,io)=>{
    const userDetail=socket.user;
    socketUser.addNewConnectedUser({
        socketId:socket.id,
        userId:userDetail.user_id
    });

    //update invitaion list of user

    friendList.updateFriendPendingInvitations(userDetail.user_id);

    //update friendList of user
    friendList.updateFriendsList(userDetail.user_id);

    setTimeout(()=>{
        roomHandler.updateRoom();
    },[500]);
}

module.exports={newConnectionHandler};