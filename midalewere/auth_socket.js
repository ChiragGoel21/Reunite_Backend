const jwt = require('jsonwebtoken');
module.exports=(socket,next)=>{
    const token=socket.handshake.auth?.token;
    try{
        const decoded=jwt.verify(token,'reunitesecretkey(@Reunite0207)withTeamLeaderDeepanshuKamboj');
        socket.user=decoded;
    }catch(err){
        const error= new Error('Not Authrozid');
        console.log(error);
        return next(error);
    }
    next();
}