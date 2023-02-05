const authSocket= require('./midalewere/auth_socket');
const connectionHandler=require('./socketHandler/newConnectionHandler');
const disconnect=require('./socketHandler/disconnectHandler');
const serverStore=require('./serverStore');
const directMessageHandler = require('./socketHandler/directMessageHandler');
const directChatHistoryHandler =require('./socketHandler/directChatHistoryHandler');
const typingUserHandler = require('./socketHandler/typingUserHandler');
const roomCreateHandler = require('./socketHandler/roomCreateHandler');
const roomJoinHandler = require('./socketHandler/roomJoinHandler');
const roomLeaveHandler= require('./socketHandler/roomLeaveHandler');
const roomInitializeConnectionHandler = require('./socketHandler/roomInitializeConnectionHandler');
const roomSignalingHandler = require('./socketHandler/roomSignalingHandler');
const registerSocketServer=(server)=>{
    const io= require('socket.io')(server,{
        cors:{
            origin:'*',
            methods:['GET','POST']
        },
    });
    serverStore.setSocketInstance(io);
    
    io.use((socket,next)=>{
        authSocket(socket,next);
    })

    //console.log(1);
    const emitOnlineUser=()=>{
        const onlineUsers=serverStore.getOnlineUser();
        io.emit('online-users',{onlineUsers});
    }
    
    io.on("connection",(socket)=>{
        console.log('user connected');
        console.log(socket.id);
        connectionHandler.newConnectionHandler(socket,io);
        emitOnlineUser();

        socket.on('direct-message',(data)=>{
            directMessageHandler(socket,data);
        })

        socket.on('direct-chat-history',(data)=>{
            directChatHistoryHandler(socket,data);
        })

        socket.on('user-typing',(data)=>{
            typingUserHandler(data);
        })
        
        socket.on('room-created',()=>{
            roomCreateHandler(socket);
        });

        socket.on('disconnectUser',(data)=>{
            disconnect(socket);
        })
        socket.on("disconnect",(data)=>{
            console.log(data);
            disconnect(socket);
        })

        socket.on('room-join',(data)=>{
            roomJoinHandler(socket,data);
        })
        socket.on('leave-room',(data)=>{
            roomLeaveHandler(socket,data);
        })

        socket.on('conn-init',(data)=>{
            roomInitializeConnectionHandler(socket,data);
        });

        socket.on('conn-signal',(data)=>{
            roomSignalingHandler(socket,data);
        })
    });

    setInterval(()=>{
        emitOnlineUser();
    },[1000*5]);
}
module.exports={registerSocketServer};