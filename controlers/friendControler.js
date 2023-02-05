const FriendInvitation = require("../model/friendInvitationModel");
const User = require("../model/userModel");
const friendsUpdates=require('../socketHandler/updates/friends');

exports.postFriendInvitaion=(req,res,next)=>{
    const senderId=req.body.senderId;
    const recieverId=req.body.recevierId;

    User.UserFriendExist(senderId, recieverId).then(isFriend=>{
        if(isFriend)
        {
            const error= new Error('Friend already added. Please check friend list');
            error.statusCode=422;
            throw error;
        }

        FriendInvitation.InvitationExist(senderId,recieverId).then(exist=>{
           // console.log(exist);
            if(exist){
                const error= new Error('Friend invitation already sended');
                error.statusCode=422;
                throw error;
            }
            
            const invite=new FriendInvitation(senderId,recieverId)
            invite.save().then(sended=>{
                if(sended)
                {
                    friendsUpdates.updateFriendPendingInvitations(recieverId);
                    return res.status(200).json({
                        status:200,
                        message:'Invitation sent sucessfully'
                    })
                }
                const error= new Error('Server Error');
                throw error;

            }).catch(err=>{next(err)});

        }).catch(err=>{
            next(err);
        });
        
    }).catch(err=>{
        next(err);
    })
}


exports.postRejectInvitation=(req,res,next)=>{
    const id=req.body.id;
    FriendInvitation.deleteRequest(id).then(isdone=>{
        if(isdone)
        {
            friendsUpdates.updateFriendPendingInvitations(req.userId);
            return res.status(200).json({
                status:200,
                message:'Friend invitation rejected'
            });
        }
        const err=new Error('server error');
        throw err;
    }).catch(err=>{
        next(err);
    })
}

exports.postAcceptInvitation=(req,res,next)=>{
    const id=req.body.id;
    const senderId=req.body.senderId;
    const recevierId=req.userId;
    User.UpdateFriend(recevierId,senderId).then(send=>{
        if(send)
        {
            User.UpdateFriend(senderId,recevierId).then(send2=>{
                if(send2)
                {
                    FriendInvitation.deleteRequest(id).then(complete=>{
                        if(complete)
                        {
                            friendsUpdates.updateFriendsList(req.userId);
                            friendsUpdates.updateFriendsList(senderId);
                            friendsUpdates.updateFriendPendingInvitations(req.userId);
                            return res.status(201).json({
                                status:200,
                                message:'Friend invitation accepted'
                            });
                        }
                        const err= Error('problem occus');
                        throw err;
                    }).catch(err=>{next(err)});
                    return;
                }
                const err= Error('problem occus');
                throw err;
            }).catch(err=>{next(err)});
            return;
        }
        const err= Error('problem occus');
        throw err;
    }).catch(err=>{next(err)});

}