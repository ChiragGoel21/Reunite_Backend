const getdb=require('../util/database').getDB;
const mongodb=require('mongodb');

class FriendInvitation{
    constructor(senderId, recevierId)
    {
        this.senderId=mongodb.ObjectId(senderId),
        this.recevierId=mongodb.ObjectId(recevierId);
    }

    save(){
        const db=getdb();
       return db.collection('friendInvitations').insertOne(this).then(insert=>{
            return insert;
        }).catch(err=>{
            return err;
        });
    }

    static InvitationExist(senderId, recieverId){
        const db=getdb();
        return db.collection('friendInvitations').find({senderId: mongodb.ObjectId(senderId),recevierId:mongodb.ObjectId((recieverId))})
                                                  .next().then(res=>{
                return res;
            }).catch(err=>{
                return err;
            })
    }
    
    static find(recevierId){
        const db=getdb();
        return db.collection('friendInvitations').aggregate([
            { $match: { "recevierId": mongodb.ObjectId(recevierId) } },
            {
                $lookup:{
                    from: 'users',
                    localField:'senderId',
                    foreignField: '_id',
                    as: "Sender_details"
                }
            }
        ]).toArray().then(result=>{
               // console.log(result);
                return result;
            }).catch(err=>{
                return err;
            })
    }

    static deleteRequest(id){
        const db=getdb();
        return db.collection('friendInvitations').deleteOne({_id:mongodb.ObjectId(id)}).then(result=>{
            return result;
        }).catch(err=>{
            return err;
        })
    }
}
module.exports= FriendInvitation;