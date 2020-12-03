var express = require("express");
var router = express.Router();
const Question= require('../models/question');
const Game= require('../models/game');
const User= require('../models/user');
const passport= require('passport');
const {isLoggedIn}= require('../middleware/index')
/* GET home page. */

router.get("/", async function (req, res, next) {
/*  try{
    await Question.deleteMany({})
  }
  catch(err){
    console.log(err);
  }*/
  res.render("index", { title: "SKAB-Gaming" });
});

router.get("/register", function(req, res, next){
  res.render("register");
});

router.post("/register", async function(req, res, next){
  try {
    const user = await User.register(new User(
      {username:req.body.username, email: req.body.email}), req.body.password);
    console.log('user registered!');
    req.login(user, function(err) {
  			if (err) return next(err);
  			res.redirect('/');
  		});
  } catch(err) {
    req.session.error=err.message;
    res.redirect('/register');
  }
});

router.get("/login", function(req, res, next){
  if (req.isAuthenticated()) return res.redirect('/');
  if (req.query.returnTo){
       req.session.redirectTo= req.headers.referer;
  }
  res.render("login");
})

router.post("/login", async function(req, res, next){
  const {username, password}= req.body;
  try{
    const {user} = await User.authenticate()(username, password);
    if(!user) {
      req.session.error="Incorrect username or password";
      return next()
    }
    req.login(user, function(err){
      if(err) {
        return next();
      };
      req.session.success= `Welcome back, ${username}!`;
      const redirectUrl= req.session.redirectTo ||'/';
      delete req.session.redirectTo;
      res.redirect(redirectUrl);
    });
  }
  catch(err){
    req.session.error="Incorrect username or password";
    console.log(err);
  }
});

router.get("/logout", function(req, res, next){
  req.logout();
  res.redirect('/login');
})

router.get('/create-game', isLoggedIn, function(req, res, next){
  res.render('creategame', { });
});

router.post('/created', async function(req, res, next){
  try{
    var newGame= await Game.create({
      creator: req.user._id,
      category: req.body.category,
      players: req.body.players,
      timeperq: req.body.time
    });

    newGame= await Game.findById(newGame._id);

    newGame.activePlayers.push(req.user._id);
    for(var i=0; i<req.body.questions.length; i++){
      let fourChoices= new Array(4);
      for(var j=0; j<4; j++){
        fourChoices[j]=req.body.options[j+(4*i)];
      }
      var newQuestion= await Question.create({
        text: req.body.questions[i],
        correctAnswer: req.body.correctanswer[i],
        options: fourChoices
      });
      newGame.questions.push(newQuestion);
    }
      newGame.save();
      res.redirect(`/room/${newGame._id}`);
    }
    catch(error){
      req.session.error=error.message;
      console.log(error);
    }
});

router.get('/join-game', isLoggedIn, async function(req, res, next){
  try {
    var games= await Game.find().populate('creator').exec();
    res.render('joingame', {games});

  } catch (e) {
    console.log(e);
  }
});

router.get('/room/:id', isLoggedIn, async function(req, res, next){
  try{
    var game=await Game.findById(req.params.id).populate('creator').populate('activePlayers').populate('questions').populate('winner').exec();
    if(game.started==false) res.render('room', {game: game, currentUserID:req.user._id});
    else res.render('errorStarted', {game})
  }
  catch(error){
    console.log(error);
  }
});


router.get("/play", function (req, res, next) {
  res.render("question", {
    title: "SKAB-Gaming",
    question: "What is the capital of Canada?",
    imgURL:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Canada_flag_map.svg/1000px-Canada_flag_map.svg.png",
    optionA: "Vancouver",
    optionB: "Toronto",
    optionC: "Ottawa",
    optionD: "Calgary",
  });
});
module.exports = router;
