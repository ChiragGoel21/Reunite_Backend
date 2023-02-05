const express= require('express');
const router=express.Router();
const FriendControler= require('../controlers/friendControler');
const isauth= require('../midalewere/is_auth');


router.post('/invite-friend',isauth,FriendControler.postFriendInvitaion);

router.post('/reject-invitation',isauth,FriendControler.postRejectInvitation);

router.post('/accept-invitation',isauth,FriendControler.postAcceptInvitation);



module.exports=router;

