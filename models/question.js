const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema= new Schema ({
  text: String,
  correctAnswer: String,
  options: [String]
});

module.exports=mongoose.model('Question', QuestionSchema);
