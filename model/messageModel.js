const mongodb= require('mongodb');
const { getDB } = require('../util/database');
//d.getDate() + '/' + d.getMonth()+1 + '/' +d.getFullYear()
//
class Message{
    constructor(authorId, content, type)
    {
        this.authorId=mongodb.ObjectId(authorId);
        this.content=content;
        this.type=type;
        var d= new Date();
        this.date= d;
        this.time=`${(d.getHours)!=0 ? ((d.getHours() > 12)? (d.getHours())%12 : d.getHours()):12}:${(d.getMinutes() < 10) ? '0' + d.getMinutes(): d.getMinutes()}${d.getHours()>=12 ? 'pm' : 'am'}`;
    }
    save()
    {
        const db=getDB();
        return db.collection('messages').insertOne(this).then(res=>{
            return res;
        }).catch(err=>{return err});
    }
}

module.exports=Message;