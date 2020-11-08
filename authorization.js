const User = require('./Users.js');
const bcrypt = require('bcryptjs');
const jsonweb = require('jsonwebtoken');
const express = require('express');

const mongoose = require('mongoose');
const { compare } = require('semver');
mongoose.connect('mongodb://localhost:27017/ProjectIteration', { useNewUrlParser: true });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connection.once('open', function () {
    console.log('Connection has been made');
}).on('error', function (error) {
    console.log('error is:', error)
});


const app = express();
app.listen(3000);

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/login', (req, res) => {
    res.render('login.ejs')
})


app.post('/login', (req, res) => {
    var loginuserid = req.body.name
    var loginpassword = req.body.password

    console.log(loginuserid)
    console.log(loginpassword)


    User.findOne({ userid: loginuserid })
        .then(user => {
            if (user) {
                if (user.password == loginpassword) {
                    console.log('Login successfull!!!!!!')
                }


            } else {
                console.log('Login unsuccessful!!!')
            }
        })





});


app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {
    //  try {
    // const hashedPassword = await bcrypt.hash(req.body.password, 10)
    //console.log('User password hashed')
    //console.log(hashedPassword)

    //} catch{

    //}
    let user = new User({
        userid: req.body.name,
        password: req.body.password
    })
    user.save().then(user => {
        res.json({
            message: 'User added!!!!!!!!!!'
        })
    }).catch(error => {
        res.json({
            message: 'Error occured'
        }
        )
    })


})

console.log('whats going on')