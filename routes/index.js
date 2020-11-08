var express = require('express');
var router = express.Router();
const Question= require('../models/question');
const Game= require('../models/game');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SKAB' });
});

router.get('/create-game', function(req, res, next){
  res.render('creategame', { });
});

router.post('/created', async function(req, res, next){
  try{
    var newGame= await Game.create({
      category: req.body.category,
      players: req.body.players,
      timeperq: req.body.time
    });

    newGame= await Game.findById(newGame._id).populate('questions').exec();

    for(var i=0; i<req.body.questions.length; i++){
      let fourChoices= new Array(4);
      for(var j=i; j< i+4; j++){
         fourChoices[j]=req.body.options[j];
      }
      var newQuestion= await Question.create({
        text: req.body.questions[i],
        correctAnswer: req.body.correctanswer[i],
        options: fourChoices
      });
      newGame.questions.push(newQuestion);
    }
      newGame.save();
      res.send('Game Created!')
    }
    catch(error){
      console.log(error);
    }

});

module.exports = router;
