const mongodb= require('mongodb');
const MongoSclient= mongodb.MongoClient;

let _db;
const mongoConnect=(callback)=>{
    MongoSclient.connect('mongodb+srv://deep:hcmvkN0wp4Wp2bZK@reunite.bmfuhyc.mongodb.net/Reunite?retryWrites=true&w=majority')
    .then(client=>{
        _db=client.db();
        callback();
    }).catch(err=>{
        console.log(err);
    })
}

const getDB=()=>{
    if(_db)
    {
        return _db;
    }
    return "No Database persent";
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;