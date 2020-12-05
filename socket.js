const socket_io= require('socket.io');
var io= socket_io();
var socketAPI= {};
const Question= require('./models/question');
const Game= require('./models/game');
const User= require('./models/user');

var manager = io.of("/room").on('connection', function (socket) {
   socket.on("join", async function(game){
     try{
       var user= await User.findById(game.playerid);
       user.score=0;
       await user.save();
       var gameSession= await Game.findById(game.id).populate('creator');
       if(game.playerusername==gameSession.creator.username){
         socket.emit("owner");
       }
       if(gameSession.started){
         socket.emit("alreadyStarted");
       }
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
       if(gameSession.activePlayers.length>gameSession.players){
         console.log("This is true");
         socket.emit("game-full")
       }
       data.gameSession=gameSession;
       if(game.playerusername!=gameSession.creator.username) manager.to(game.id).emit('confirmation', data);
     }
     catch(error){
       console.log(error);
     }
   });

   socket.on("startGame", async function(game){
    try{
     var gameSession= await Game.findById(game.id);
     gameSession.started=true;
     await gameSession.save();
     gameSession= await Game.findById(game.id).populate('questions').populate('activePlayers').exec();
     manager.to(game.id).emit('gameStarted', gameSession);
    }
    catch(err){
      console.log(err);
    }
   });

   socket.on("endTimer", async function(game){
     try{
       var data={}
       var gameSession= await Game.findById(game.id).populate('activePlayers').populate('questions').exec();
       var user= await User.findById(game.playerid);
         if(game.playeranswer===gameSession.questions[game.i].correctAnswer.toUpperCase()){
         var currentScore= user.score;
         user.score= currentScore+1;
         await user.save();
         data.correct=true;
       }
       else{
         data.correct=false;
       }
       await gameSession.save();
       data.gameSession=gameSession;
       data.i=game.i+1;
       socket.emit("nextQuestion", data);
     }
     catch(err){
       console.log(err);
     }
   });

   socket.on('endGame', async function(game){
     try{
       var data={};
       var gameSession= await Game.findById(game.id).populate('activePlayers').populate('questions').exec();
       let playersGame=await Game.findById(game.id).populate({
         path:'activePlayers',
         options: {sort: {'score': -1}}
       });
       if(!playersGame.winner.length)
        gameSession.winner.push(playersGame.activePlayers[0]._id);
       if(gameSession.activePlayers.length>1){
         var i=1;
         while(i<gameSession.questions.length && playersGame.activePlayers[i].score==playersGame.activePlayers[0].score){
           gameSession.winner.push(playersGame.activePlayers[i]._id);
           i++;
         }
       }
       for(var j=0; j<gameSession.winner.length; j++){
         var user= await User.findById(gameSession.winner[j]);
         user.wins+=1;
         await user.save();
       }
       await gameSession.save();
       data.gameSession=gameSession
       manager.to(game.id).emit("gameOver", data);
    }
    catch(err){
      console.log(err);
    }
   })

   socket.on("disconnect", async function(){
     try{
       var gameSession= await Game.findById(socket.gameid);
       gameSession.activePlayers.pull({_id: socket.playerid});
       await gameSession.save()
       gameSession= await Game.findById(socket.gameid).populate('activePlayers').exec();
       var data={};
       data.gameSession=gameSession;
       data.playerid=socket.playerid;
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
