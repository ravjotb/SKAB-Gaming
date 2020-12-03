var socket= io("/room");
var game= {};
game.id=gameID;
game.playerid=currentPlayer;
game.creator=gameCreator;
game.playerusername=playerUsername;

socket.emit("join", game)

socket.on('confirmation', function(data) {
  console.log("Connected to room", data.gameSession._id);
  if(game.playerid==game.creator) {
    var startButton= document.getElementById('start');
    startButton.addEventListener('click', startGame);
  }
  var parentElement= document.getElementById('current-players');
  if(game.playerid!=data.gameSession.activePlayers[data.gameSession.activePlayers.length-1]._id) {
    var newPlayerElement=document.createElement('li');
    newPlayerElement.innerHTML='<big>'+ data.gameSession.activePlayers[data.gameSession.activePlayers.length-1].username +' has joined</big>';
    newPlayerElement.setAttribute('id', data.playerusername);
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

var leaveButton=document.getElementById('leave');
leaveButton.addEventListener('click', function(){
  window.location.href="http://localhost:3000/";
});

var timeLimit = timeperq;
let timePassed = 0;
let timeLeft = timeLimit;
let timerInterval = null;

function hide(elementID){
  let x= document.getElementById(elementID);
  x.style.display="none"
}

function unhide(elementID){
  let x= document.getElementById(elementID);
  x.style.display="block"
}

//creator clicked start button
function startGame(){
  socket.emit("startGame", game);
}

function gameStarted(index){
  var seconds=6;
  setTimeout(function(){
    hide('lobby-page');
    unhide('question-page');
    startTimer();
  }, 6000);

  var delay= setInterval(function(){
    seconds= seconds-1;
    document.getElementById("starting").innerHTML= 'Game starting in '+seconds.toString();
    if(seconds==0) clearInterval(delay);
  }, 1000);

}

function formatTimeLeft(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function startTimer() {
  timerInterval = setInterval(() => {

    timePassed = timePassed += 1;
    timeLeft = timeLimit - timePassed;
    if (timeLeft === 0) {
      clearInterval(timerInterval)
    }

    document.getElementById("base-timer-label").innerHTML = formatTimeLeft(timeLeft);
  }, 1000);
}

function playerDisconnected(data){
  console.log("Player disconnected",data.playerid);
  hide(data.playerusername);
  var waitingFor= document.getElementById('waiting-for');
  waitingFor.innerHTML=`Joined: ${data.gameSession.activePlayers.length}/${data.gameSession.players}`;
}
