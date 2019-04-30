//var models = require('../model/model.js');
var models=require('../app.js')
var path = require('path');
var bodyParser = require('body-parser');



module.exports = function (app,io){
    app.use( bodyParser.json() );
    app.use(bodyParser.urlencoded({     
        extended: true
    }));
    
    /* app.get('/',function(req,res){
        res.sendFile(path.resolve(__dirname+"/../views/index.html"));
    }); */
    
    app.get('/index1', function(req, res) {
        res.render('index1', {
          user:req.user
        });
         }); 


    io.on('connection',function(socket){
        console.log("Connection :User is connected  "+name);
        console.log("Connection : " +socket.id);
        io.to(socket.id).emit('name', name);
        users[name]=socket.id;
        keys[socket.id]=name;
        console.log("Users list : "+users);
        console.log("keys list : "+keys);
        models.user.find({"name" : name},{friends:1,_id:0},function(err,doc){
            if(err){res.json(err);}
            else{
                friends=[];
                pending=[];
                all_friends=[];
                console.log("friends list: "+doc);
                list=doc[0].friends.slice();
                console.log(list);
                
                for(var i in list){
                    if(list[i].status=="Friend"){
                        friends.push(list[i].name);
                    }
                    else if (list[i].status=="Pending"){
                        pending.push(list[i].name);
                    }
                    else{
                        continue;
                    }
                }
                console.log("pending list: "+pending);
                console.log("friends list: "+friends);
                io.to(socket.id).emit('friend_list', friends);
                io.to(socket.id).emit('pending_list', pending);
                io.emit('users',users);
            }
        });
        
        
        socket.on('group message',function(msg){
            console.log(msg);
            io.emit('group',msg);
        });
        
        socket.on('private message',function(msg){
            console.log('message  :'+msg.split("#*@")[0]);
            models.messages.create({
                "message":msg.split("#*@")[1],
                "sender" :msg.split("#*@")[2],
                "reciever":msg.split("#*@")[0],
                "date" : new Date()});
            io.to(users[msg.split("#*@")[0]]).emit('private message', msg);
        });
        
        socket.on('disconnect', function(){
            delete users[keys[socket.id]];
            delete keys[socket.id];
            io.emit('users',users);
            console.log(users);
        });
    });
    
    app.post('/friend_request',function(req,res){
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Method","'GET, POST, OPTIONS, PUT, PATCH, DELETE'");
        friend=true;
        models.user.find({"name" : req.body.my_name,"friends.name":req.body.friend_name},function(err,doc){
            if(err){res.json(err);}
            else if(doc.length!=0){
                console.log("Friend request : "+doc.length);
                console.log("Friend request : friend request already sent "+doc);
                res.send("Friend request already sent ");
            }
            else{
                console.log("Friend request : "+doc.length);
                models.user.update({
                    name:req.body.my_name
                },{
                    $push:{
                        friends:{
                            name: req.body.friend_name,
                            status: "Pending"
                        }
                    }
                },{
                    upsert:true
                },function(err,doc){
                    if(err){res.json(err);}
                    //            else{
                    //                console.log(doc);
                    //            }
                });
                io.to(users[req.body.friend_name]).emit('message', req.body);
            }
        });
    });
    
    app.post('/friend_request/confirmed',function(req,res){
        console.log("friend request confirmed : "+req.body);
        if(req.body.confirm=="Yes"){
            models.user.find({
                "name" : req.body.friend_name,
                "friends.name":req.body.my_name
            },function(err,doc){
                if(err){
                    res.json(err);
                }
                else if(doc.length!=0){
                    console.log("Friend request confirmed : "+doc.length);
                    console.log("Friend request confirmed : friend request already sent "+doc);
                    res.send("Friend request already accepted");
                }
                else{
                    models.user.update({
                        "name":req.body.my_name,
                        "friends.name":req.body.friend_name
                    },{
                        '$set':{
                            "friends.$.status":"Friend"
                        }
                    },function(err,doc){
                        if(err){res.json(err);}
                        else{

                            console.log("friend request confirmed : Inside yes confirmed");
                            io.to(users[req.body.friend_name]).emit('friend', req.body.my_name);
                            io.to(users[req.body.my_name]).emit('friend', req.body.friend_name);
                        }
                    });
                    models.user.update({
                        name:req.body.friend_name
                    },{
                        $push:{
                            friends:{
                                name: req.body.my_name,
                                status: "Friend"
                            }
                        }
                    },{upsert:true},function(err,doc){
                        if(err){res.json(err);}
                        
                    });
                }
            });
        }
        else{
            
            console.log("friend request confirmed : Inside No confirmed");
            models.user.update({
                "name":req.body.my_name
            },{
                '$pull':{
                    'friends':{
                        "name":req.body.friend_name,
                    }
                }
            },function(err,doc){
            if(err){res.json(err);}
            else{
                console.log("No");
            }
        });
        }
    });
    
}