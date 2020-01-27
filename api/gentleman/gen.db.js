var loki = require('lokijs');
var db = new loki('./gentleman.json');

function loadCollection(collName, callback){
    db.loadDatabase({}, function(){
        var _collection = db.getCollection(collName);
        if (!_collection){
            console.log("Collection %s does not exist. Creating...", collName);
            _collection = db.addCollection(collName);            
        }
        callback(_collection);
    });
}

function isDup(_collection, userId){
    //var _collection = db.getCollection('users');
    if (!_collection){
        console.log('collection not exists... so not dup')
        return false;
    }
    
    console.log(userId + ' : checking if dupulicated....');
    var target = _collection.find( {'userId':userId} );
    console.log('target :' + JSON.stringify(target));
    if (target.length > 0){
        console.log('dup!!!!')
        return true;
    }else{
        console.log('not dup')
        return false;
    }
}

// function saveDatabase(){
//     db.saveDatabase();
// }

module.exports = {db, loadCollection, isDup};