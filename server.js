const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8000;
const server = app.listen(8000, () =>
console.log("Listen on port 8000"));
const io = require('socket.io').listen(server);

var users = [];
var connections = [];

app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static(path.join(__dirname, "./static")));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');




app.get('/', function(req, res) {
    res.render("index");
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

socket.on('disconnect',function(data){
     users.splice(users.indexOf(socket.username),1);
     updateUsernames();
     connections.splice(connections.indexOf(socket),1);
     console.log('Disconnected: %s sockets conected', connections.length);
});

socket.on('send message', function(data){
     console.log(data)
     io.sockets.emit('new message',{msg: data, user: socket.username});
    });

socket.on('new user', function(data,callback){
     callback(true);
     socket.username = data;
     users.push(socket.username);
     updateUsernames();
    });

function updateUsernames(){
     io.sockets.emit('get users', users)
    }
});﻿
