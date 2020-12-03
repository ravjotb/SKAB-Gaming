const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const {Chat} = require('./model/chat');



const PORT = process.env.PORT || 4321;
const mongoDBURI = process.env.MONGODB_URI || 'mongodb://localhost/chat';
const PUBLIC = "public";

mongoose.connect(mongoDBURI, {useNewUrlParser: true, useUnifiedTopology: true,'useCreateIndex': true});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.static(PUBLIC));

app.get('/', (req, res) => {
      res.sendFile(PUBLIC+'/index.html', { root: __dirname });
});


app.get('/chat', (req, res) => {
    res.sendFile(PUBLIC+'/chat.html', { root: __dirname });
});


app.get('/chat/getall', async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    let data = await Chat.find({ chatID: req.query.id });
    res.json(data);
});


io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('message', (data) => {
        let message = JSON.parse(data);

        let chatMessage = new Chat(message);
        chatMessage.save();

        socket.broadcast.emit("received",JSON.stringify(chatMessage));

        
      });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
});


http.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});
