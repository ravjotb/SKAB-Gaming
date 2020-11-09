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
  players: Number,
  timeperq: Number,
  questions: [{
    type: Schema.Types.ObjectId,
    ref: "Question"
  }],
  connectioncode: {
    type: Number,
    default: Math.floor(1000 + Math.random() * 9000)
  }
});
module.exports=mongoose.model('Game', GameSchema);
