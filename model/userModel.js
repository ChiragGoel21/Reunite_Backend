const getDB=require('../util/database').getDB;
const mongodb=require('mongodb');

class User{
    constructor(name,email,password)
    {
        this.name=name;
        this.email=email;
        this.password=password;
        this.profileImage='profile/default.png',
        this.loginSession=false,
        this.intrest=[];
        this.friends=[];
    }

    save()
    {
        const db= getDB();
        return db.collection('users').insertOne(this).then(result=>{
            return result;
        }).catch(err=>{
            return err;
        })
    }

    static fetchUserByEmail(email)
    {
        const db= getDB();
        return db.collection('users').find({email:email}).next().then(result=>{
            return result;
        })
        .catch(err=>{
            return err;
        })
    }

    static updateIntrest(id,arrayOfIntrest)
    {
        const db= getDB();
        return db.collection('users').updateOne({_id:mongodb.ObjectId(id)},{$set:{intrest:arrayOfIntrest}}).then(res=>{
            return true;
        }).catch(err=>{
            return err;
        })
    }

    static isUser(id)
    {
        const db=getDB();
        return db.collection('users').find({_id:mongodb.ObjectId(id)}).next().then(user=>{
            return user;
        }).catch(err=>{
            err.statuscode=500;
            return err;
        })
    }

    static startLoginSession(id)
    {
        const db=getDB();
        return db.collection('users').updateOne({_id:mongodb.ObjectId(id)},{$set:{loginSession:true}}).then(res=>{
            return res;
        }).catch(err=>{
            err.statuscode=500;
            return err;
        })
    }
    static FinishLoginSession(id)
    {
        const db=getDB();
        return db.collection('users').updateOne({_id:mongodb.ObjectId(id)},{$set:{loginSession:false}}).then(res=>{
            return res;
        }).catch(err=>{
            err.statuscode=500;
            return err;
        })
    }

    static UserFriendExist(userId,friendId)
    {
        const db=getDB();
        return db.collection('users').find({_id:mongodb.ObjectId(userId) , friends:{$in:[mongodb.ObjectId(friendId)]}}).next()
                .then(exis=>{
                    return exis;
                }).catch(err=>{
                    return err;
        })
    }

    static UpdateFriend(id, friendId)
    {
        const db=getDB();
        return db.collection('users').updateOne({_id:mongodb.ObjectId(id)},{$push:{'friends':mongodb.ObjectId(friendId)}})
            .then(result=>{
                return result;
            }).catch(err=>{return err});
    }

    static sendUserFriend(id)
    {
        const db=getDB();
        return db.collection('users').aggregate([
            {$match:{_id:mongodb.ObjectId(id)}},
            {
                $lookup:{
                    from: 'users',
                    localField: 'friends',
                    foreignField: '_id',
                    as:"friendsDetails"
                }
            }
        ]).toArray().then(result=>{
            // console.log(result);
             return result;
         }).catch(err=>{
             return err;
         })
    }

    static updateProfileImage(id, image)
    {
        const db=getDB();
        return db.collection('users').updateOne({_id:mongodb.ObjectId(id)},{$set:{profileImage:image}}).then(res=>{
            return res;
        }).catch(err=>{
            return err;
        })
    }

    static fetchUserIntrest(id)
    {
        const db=getDB();
        return db.collection('users').find({_id:mongodb.ObjectId(id)}).next().then(result=>{
            if(result)
            {
                return result.intrest;
            }
            return null;
        }).catch(err=>{return err});
    }

    static verificationToken(token, expire,id)
    {
        const db=getDB();
        return db.collection('users').updateOne({_id:mongodb.ObjectId(id)},
        {$set:{emailToken:token, emailExpiry:expire}}).then(result=>{
            return result;
        }).catch(err=>{return err});
    }

    static findUserByEmailToken(token)
    {
        const db=getDB();
        return db.collection('users').find({emailToken:token}).next().then(result=>{
            if(result)
            {
                return db.collection('users').updateOne({_id:mongodb.ObjectId(result._id)},
                {$set:{emailToken:'verified', emailExpiry:'null'}}).then(res=>{
                    return {result:res,user:result};
                })
            }
            else return result
        }).catch(err=>{return err});
    }

    static isUserEmailVerified(email)
    {
        const db=getDB();
        return db.collection('users').find({email:email}).next().then(user=>{
            if(user)
            {
                if(user.emailToken==='verified')
                {
                    return {verified:true,id:user._id};
                }
                else return {verified:false,id:user._id};
            }
            return {verified:false,id:user._id};
        }).catch(err=>{return err});
    }
}

module.exports=User;