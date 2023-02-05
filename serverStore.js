const {v4:uuidv4} = require('uuid');

const connectUser=new Map();
let activeRoom=[];

let io;
const setSocketInstance=(ioInstance)=>{
    io=ioInstance;
}
const getSocketInstance=()=>{
    return io
}
const addNewConnectedUser=({socketId, userId})=>{
    connectUser.set(socketId,{userId});
    console.log(connectUser);
};

const removeConnectedUser=(socketId)=>{
    if(connectUser.has(socketId)){
        connectUser.delete(socketId);
        console.log(connectUser);
    }
}

const getActiveUsers=(userId)=>{
    const activeConnection=[];
    connectUser.forEach((value,key)=>{
        if(value.userId===userId)
        {
            activeConnection.push(key);
        }
    });
    //console.log(activeConnection);
    return activeConnection;
}
const getOnlineUser=()=>{
    const onlineUsers=[];
    connectUser.forEach((value,key)=>{
        onlineUsers.push({socketId:key, userId:value.userId});
    })
    return onlineUsers;
}

//Room

const addNewActiveRoom=(userId,socketId)=>{
    const newActiveRoom={
        roomCreater:{
            userId,
            socketId
        },
        participants:[
            {
                userId,
                socketId
            }
        ],
        roomId:uuidv4(),
    };
    activeRoom.push(newActiveRoom);
    return newActiveRoom;
}

const getActiveRooms=()=>{
    return [...activeRoom];
}

const getActiveRoom=(roomId)=>{
    const room=activeRoom.find(f=> f.roomId===roomId);
    if(room)
    {
        return {...room};
    }else{
        return null;
    }
}

const joinActiveRoom=(roomId,newParticipants)=>{
    const room=activeRoom.find(f=> f.roomId===roomId);
    activeRoom=activeRoom.filter(f=>f.roomId!==roomId);

    const upDatedRoom={
        ...room,
        participants:[...room.participants, newParticipants]
    }
    activeRoom.push(upDatedRoom);
}

const leaveActiveRoom=(roomId, participantsSocketId)=>{
    const room=activeRoom.find(r=> r.roomId===roomId);
    
    if(room)
    {
        const copyOfRoom={...room};
        copyOfRoom.participants = copyOfRoom.participants.filter(f=> f.socketId!==participantsSocketId);

        activeRoom=activeRoom.filter(f=>f.roomId!==roomId);
        
        if(copyOfRoom.participants.length > 0)
        {
            activeRoom.push(copyOfRoom);
        }
    }
}
module.exports={addNewConnectedUser, removeConnectedUser, getActiveUsers, setSocketInstance
                ,getSocketInstance, getOnlineUser,
            addNewActiveRoom,getActiveRooms, getActiveRoom, joinActiveRoom, leaveActiveRoom};