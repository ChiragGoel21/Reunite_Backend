const jwt= require('jsonwebtoken');
module.exports=(req,res,next)=>{
    const authHeader=req.get('Authorization');
    if(!authHeader)
    {
        //console.log('ss');
        const err=new Error('Not Authenticated');
        err.statusCode=401;
        throw err;
    }
    const token=req.get('Authorization').split(' ')[1];
    //console.log(token);
    let decoder;
    try{
        decoder=jwt.verify(token,'reunitesecretkey(@Reunite0207)withTeamLeaderDeepanshuKamboj')
    }catch(err)
    {
        throw err;
    }

    if(!decoder)
    {
        const err= new Error('Not Authenticate');
        err.statusCode=401;
        throw err;
    }
    req.userId=decoder.user_id;
    req.userEmail=decoder.email;
    next();
}