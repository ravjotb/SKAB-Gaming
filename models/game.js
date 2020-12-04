const mongoose= require('mongoose');
const Schema= mongoose.Schema;
const Question= require('./question').schema;
const User= require('./user');

const GameSchema= new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  category: String,
  activePlayers: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  players: Number,
  timeperq: Number,
  questions: [{
    type: Schema.Types.ObjectId,
    ref: "Question"
  }],
  started: {
    type: Boolean,
    default: false
  },
  currQuestion:{
    type: Number,
    default: -1
  },
  winner: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});
module.exports=mongoose.model('Game', GameSchema);
