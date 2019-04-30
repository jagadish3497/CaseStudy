 var mongoose = require('mongoose');
 var User = require('../app')
//var Schema = mongoose.Schema;

//db = mongoose.createConnection('mongodb://localhost/chat');


/* mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
});
mongoose.connection.on('error', function (err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});
*/
//mongoose.connect('mongodb://localhost/chat'); 

/* module.exports.user=mongoose.model(({
    name: String,
    username: String,
    email: String,
    number: String,
    password: String,
    friends:[]
},{strict: false}));
module.exports.online=mongoose.model('online',({
    name: String,
    connection_id: String
}));  */
module.exports.messages=mongoose.model('message',({
    message : String,
    sender  : String,
    reciever: String,
    date    : Date
}));