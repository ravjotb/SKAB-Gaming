const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    chatID: {
        type: String
    },
    username: {
        type: String
      },

    message: {
      type: String
    },

    timestamp: { 
      type: Date 
    }

  }
);


chatSchema.pre('save', function(next) {
  this.timestamp = Date.now();
  next();
});


exports.Chat = mongoose.model("Chat", chatSchema);
