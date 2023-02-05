const mongodb= require('mongodb');
const { getDB } = require('../util/database');

class Conversation{
    constructor(user1Id, user2Id, Message)
    {
        this.participants=[
            mongodb.ObjectId(user1Id),
            mongodb.ObjectId(user2Id)
        ];
        this.Message=Message
    }
    save()
    {
        const db=getDB();
        return db.collection('conversation').insertOne(this).then(res=>{
            return res;
        }).catch(err=>{return err});
    }

    static findUsers(user1,user2){
        const db=getDB();
        return db.collection('conversation')
            .find({participants:{$all:[mongodb.ObjectId(user1),mongodb.ObjectId(user2)]}}).next().then(result=>{
                return result;
            }).catch(err=>{return err});
    }

    static updateMsg(id,message){
        const db=getDB();
        return db.collection('conversation').updateOne({_id:mongodb.ObjectId(id)},{$set:{Message:message}}).then(res=>{
                return res;
        }).catch(err=>{
            return err;
        })
    }

    static findChatofUser(id)
    {
        const db=getDB();
        return db.collection('conversation').aggregate(
            [
                {
                  '$match': {
                    '_id': mongodb.ObjectId(id)
                  }
                }, {
                  '$lookup': {
                    'from': 'messages', 
                    'localField': 'Message', 
                    'foreignField': '_id', 
                    'as': 'MessageDetails'
                  }
                }
              ]
        ).toArray().then(result=>{
            return result;
        }).catch(err=>{return err});
    }
}

module.exports=Conversation;