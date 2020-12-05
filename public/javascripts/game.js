var socket= io("/room");
var game= {};
game.id=gameID;
game.playerid=currentPlayer;
game.creator=gameCreator;
game.playerusername=playerUsername;
game.i=0;
game.playeranswer='';

socket.emit("join", game);

socket.on('game-full', function(){
  hide('lobby-page');
  unhide('game-full');
  setTimeout(function(){
    window.location.href="http://localhost:3000/";
  }, 3000)
})

socket.on('alreadyStarted', function(){
  hide('lobby-page');
  unhide('game-started');
  setTimeout(function(){
    window.location.href="http://localhost:3000/";
  }, 3000)
})

socket.on('owner', function(){
  hide('lobby-page');
  unhide('owner');
  setTimeout(function(){
    window.location.href="http://localhost:3000/";
  }, 3000)
})

socket.on('confirmation', function(data) {
  console.log("Connected to room", data.gameSession._id);

  if(game.playerid==data.gameSession.activePlayers[0]._id && data.gameSession.activePlayers.length>1) {
    var start= document.getElementById('start-game');
    start.innerHTML="<button class='btn btn-success' id='start' type='submit' name='button'>Start</button>";
    var startButton= document.getElementById('start');
    startButton.addEventListener('click', startGame);
  }
  var parentElement= document.getElementById('current-players');
  if(game.playerid!=data.gameSession.activePlayers[data.gameSession.activePlayers.length-1]._id) {
    var newPlayerElement=document.createElement('li');
    newPlayerElement.innerHTML='<big>'+ data.gameSession.activePlayers[data.gameSession.activePlayers.length-1].username +' has joined</big>';
    newPlayerElement.setAttribute('id', data.gameSession.activePlayers[data.gameSession.activePlayers.length-1].username);
    parentElement.appendChild(newPlayerElement);
  }
  else {
    for(var i=0; i<data.gameSession.activePlayers.length; i++){
      var newPlayerElement=document.createElement('li');
      newPlayerElement.innerHTML='<big>'+ data.gameSession.activePlayers[i].username +' has joined</big>';
      newPlayerElement.setAttribute('id', data.gameSession.activePlayers[i].username);
      parentElement.appendChild(newPlayerElement);
    }
  }
  var waitingFor= document.getElementById('waiting-for');
  waitingFor.innerHTML=`Joined: ${data.gameSession.activePlayers.length}/${data.gameSession.players}`;
});

socket.on('gameStarted', function(data){
  gameStarted(data);
});

socket.on('playerDisconnected', function(data){
  playerDisconnected(data);
});

socket.on('gameOver', function(data){
  setTimeout(function(){
    window.location.href=`http://localhost:3000/${data.gameSession._id}/result`;
  }, 2000);
});

var leaveButton=document.getElementById('leave');
leaveButton.addEventListener('click', function(){
  window.location.href="http://localhost:3000/";
});

var leaveGame= document.getElementById('leave-game');
leaveGame.addEventListener('click', function(){
  window.location.href="http://localhost:3000/";
});

var optionA= document.getElementById('optiona');
var optionB= document.getElementById('optionb');
var optionC= document.getElementById('optionc');
var optionD= document.getElementById('optiond');

optionA.addEventListener('click', function(){
  optionA.className="col btn btn-secondary"
  optionB.className="col btn btn-light btn-outline-secondary";
  optionC.className="col btn btn-light btn-outline-secondary";
  optionD.className="col btn btn-light btn-outline-secondary";
  game.playeranswer="A";
});

optionB.addEventListener('click', function(){
  optionA.className="col btn btn-light btn-outline-secondary"
  optionB.className="col btn btn-secondary";
  optionC.className="col btn btn-light btn-outline-secondary";
  optionD.className="col btn btn-light btn-outline-secondary";
  game.playeranswer="B";
});

optionC.addEventListener('click', function(){
  optionA.className="col btn btn-light btn-outline-secondary"
  optionB.className="col btn btn-light btn-outline-secondary";
  optionC.className="col btn btn-secondary";
  optionD.className="col btn btn-light btn-outline-secondary";
  game.playeranswer="C";
});

optionD.addEventListener('click', function(){
  optionA.className="col btn btn-light btn-outline-secondary"
  optionB.className="col btn btn-light btn-outline-secondary";
  optionC.className="col btn btn-light btn-outline-secondary";
  optionD.className="col btn btn-secondary";
  game.playeranswer="D";
});
//timer function
function startTimer() {
  var timeLimit = timeperq;
  let timerInterval = setInterval(() => {
    timeLimit = timeLimit - 1;
    if (timeLimit === 0) {
      clearInterval(timerInterval)
      optionA.disabled=true;
      optionB.disabled=true;
      optionC.disabled=true;
      optionD.disabled=true;
      socket.emit("endTimer", game);
    }
    document.getElementById("base-timer-label").innerHTML = `${timeLimit}`;
  }, 1000);
}
//helper to hide elements
function hide(elementID){
  let x= document.getElementById(elementID);
  x.style.display="none"
}
//helper to unhide elements
function unhide(elementID){
  let x= document.getElementById(elementID);
  x.style.display="block"
}

//creator clicked start button
function startGame(){
  socket.emit("startGame", game);
}

//game start for everyone
function gameStarted(gameSession){
  var seconds=6;
  var delay= setInterval(function(){
    seconds= seconds-1;
    document.getElementById("starting").innerHTML= 'Game starting in '+seconds.toString();
    if(seconds==0) clearInterval(delay);
  }, 1000);
  setTimeout(function(){
    hide('lobby-page');
    unhide('question-page');
    startTimer();

    socket.on('nextQuestion', function(data){
      if(data.i==data.gameSession.questions.length){
        if(data.correct){
          if(game.playeranswer=='A'){
            optionA.className="col btn btn-success"
          }
          else if (game.playeranswer=='B'){
            optionB.className="col btn btn-success"
          }
          else if (game.playeranswer=='C'){
            optionC.className="col btn btn-success"
          }
          else if (game.playeranswer=='D'){
            optionD.className="col btn btn-success"
          }
        }
        else{
          if(game.playeranswer=='A'){
            optionA.className="col btn btn-danger"
          }
          else if (game.playeranswer=='B'){
            optionB.className="col btn btn-danger"
          }
          else if (game.playeranswer=='C'){
            optionC.className="col btn btn-danger"
          }
          else if (game.playeranswer=='D'){
            optionD.className="col btn btn-danger"
          }
        }
        if(game.playerid==data.gameSession.activePlayers[0]._id) //only get one player to send endGame
          socket.emit('endGame', game);
        return;
      }
      game.i+=1;
      if(data.correct){
        if(game.playeranswer=='A'){
          optionA.className="col btn btn-success"
        }
        else if (game.playeranswer=='B'){
          optionB.className="col btn btn-success"
        }
        else if (game.playeranswer=='C'){
          optionC.className="col btn btn-success"
        }
        else if (game.playeranswer=='D'){
          optionD.className="col btn btn-success"
        }
      }
      else{
        if(game.playeranswer=='A'){
          optionA.className="col btn btn-danger"
        }
        else if (game.playeranswer=='B'){
          optionB.className="col btn btn-danger"
        }
        else if (game.playeranswer=='C'){
          optionC.className="col btn btn-danger"
        }
        else if (game.playeranswer=='D'){
          optionD.className="col btn btn-danger"
        }
      }
      setTimeout(function(){
        nextQuestion(data.gameSession, data.i);
      }, 3000)

    })
  }, 6000);

}

//handler for when a player leaves
function playerDisconnected(data){
  console.log("Player disconnected",data.username);
  if(data.gameSession.activePlayers.length<2 && data.gameSession.started){
    window.location.href-`http://localhost:3000/${game.id}/result`;
  }
  hide(data.playerusername);
  var waitingFor= document.getElementById('waiting-for');
  waitingFor.innerHTML=`Joined: ${data.gameSession.activePlayers.length}/${data.gameSession.players}`;
  if(game.playerid==data.gameSession.activePlayers[0]._id) {
    var start= document.getElementById('start-game');
    start.innerHTML="<button class='btn btn-success' id='start' type='submit' name='button'>Start</button>";
    var startButton= document.getElementById('start');
    startButton.addEventListener('click', startGame);
  }
}

//handler to get the next question
function nextQuestion(gameSession, index){
  hide('question-page');
  game.playeranswer='';
  optionA.disabled=false;
  optionB.disabled=false;
  optionC.disabled=false;
  optionD.disabled=false;
  setTimeout(function(){
    var questionText= document.getElementById('question-text');
    questionText.innerHTML= gameSession.questions[index].text;

    var optiona=document.getElementById('optiona');
    optiona.innerHTML=gameSession.questions[index].options[0];

    var optionb=document.getElementById('optionb');
    optionb.innerHTML=gameSession.questions[index].options[1];

    var optionc=document.getElementById('optionc');
    optionc.innerHTML=gameSession.questions[index].options[2];

    var optiond=document.getElementById('optiond');
    optiond.innerHTML=gameSession.questions[index].options[3];

    document.getElementById("base-timer-label").innerHTML =`${gameSession.timeperq}`
    optionA.className="col btn btn-light btn-outline-secondary"
    optionB.className="col btn btn-light btn-outline-secondary";
    optionC.className="col btn btn-light btn-outline-secondary";
    optionD.className="col btn btn-light btn-outline-secondary";

    startTimer();
    unhide('question-page');
  }, 1000);

}
