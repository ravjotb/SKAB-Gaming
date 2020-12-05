var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const User = require('./models/user');
const session= require('express-session');
const mongoose = require('mongoose');
const passport= require('passport');

var app = express();

//Set up default mongoose connection
mongoose.connect('mongodb+srv://root:root@SKAB.fpe6t.mongodb.net/SKAB?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true)
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () =>{
  console.log('we\'re connected!');
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'skab-gaming',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser= req.user;
  //set success flash message
  res.locals.success= req.session.success || '';
  delete req.session.success;
  //set error flash message
  res.locals.error= req.session.error || '';
  delete req.session.error;
  next();
})
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  req.session.error= err.message;
  res.redirect('back');
});

module.exports = app;
