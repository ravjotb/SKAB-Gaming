const socket_io= require('socket.io');
var io= socket_io();
var socketAPI= {};
const Question= require('./models/question');
const Game= require('./models/game');
const User= require('./models/user');

var manager = io.of("/room").on('connection', function (socket) {
   socket.on("join", async function(game){
     try{
       var gameSession= await Game.findById(game.id);
       socket.playerid=game.playerid;
       socket.gameid=game.id;
       socket.playerusername=game.playerusername;
       socket.join(game.id);
       var data={};
       data.playerid=game.playerid;
       data.playerusername=game.playerusername;
       data.gameid=game.id;
       for(var i=0; i<gameSession.activePlayers.length; i++){
         if(game.playerid==gameSession.activePlayers[i]._id){
           gameSession= await Game.findById(game.id).populate('creator').populate('activePlayers').populate('questions').populate('winner').exec();
           data.gameSession=gameSession;
           manager.to(game.id).emit('confirmation',data);
           return;
         }
       }
       gameSession.activePlayers.push(game.playerid);
       await gameSession.save();
       gameSession=await Game.findById(game.id).populate('creator').populate('activePlayers').populate('questions').populate('winner').exec();
       data.gameSession=gameSession;
       manager.to(game.id).emit('confirmation', data);
     }
     catch(error){
       console.log(error);
     }
   });

   socket.on("startGame", async function(game){
    try{
     var index=0;
     var gameSession= await Game.findById(game.id);
     gameSession.started=true;
     await gameSession.save();
     manager.to(game.id).emit('gameStarted', index)
    }
    catch(err){
      console.log(err);
    }
   });

   socket.on("disconnect", async function(){
     try{
       var gameSession= await Game.findById(socket.gameid);
       gameSession.activePlayers.pull({_id: socket.playerid});
       await gameSession.save()
       socket.gameSession=gameSession
       var data={};
       data.gameSession=gameSession;
       data.playerid=socket.playerid;
       data.gameid=socket.gameid;
       data.playerusername=socket.playerusername;
       manager.to(socket.gameid).emit('playerDisconnected',data);
     }
     catch(err){
       console.log(err);
     }
   });
})

socketAPI.io=io;
module.exports=socketAPI;
