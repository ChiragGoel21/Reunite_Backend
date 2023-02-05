const express= require('express');
const app=express();
const http=require('http');
const bodyParse= require('body-parser');
const mongoConnect=require('./util/database').mongoConnect;
const path= require('path');
const socketServer = require('./socketServer');
app.use(bodyParse.json());



app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('view engine', 'ejs');
app.use('/profile',express.static(path.join(__dirname + '/profileImage')));
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','https://reunite.onrender.com/');
    res.setHeader('Access-Control-Allow-Methods','PUT, GET, POST, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type , Authorization');
    next();
})
const authRoute=require('./routes/auth');
const friendInviteRoute=require('./routes/friendInvitation');
const FriendInvitation = require('./model/friendInvitationModel');


app.use('/auth',authRoute);
app.use('/friend',friendInviteRoute);

app.use('/get',(req,res,next)=>{ 
    FriendInvitation.find('63bdab52520575cd1434c527').then(result=>{
        res.json({
            name:'hello',
            result:result
        });
    }).catch(Err=>{throw Err});
    
})

app.use((error, req, res, next)=>{
    //console.log(error);
    const status=error.statusCode || 500;
    const message=error.message || 'Server Error';

    res.status(status).json({
        status:status,
        message:message
    })
});

const server=http.createServer(app);
socketServer.registerSocketServer(server);
mongoConnect(()=>{
    server.listen(process.env.PORT || 5002);
})