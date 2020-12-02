const socket_io= require('socket.io');
var io= socket_io();
var socketAPI= {};
const Question= require('./models/question');
const Game= require('./models/game');
const User= require('./models/user');

//logic...

socketAPI.io=io;
module.exports=socketAPI;
