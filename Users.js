const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
	userid: {
		type: String
	},
	password: {
		type: String
	}


}, { timestamps: true })

const User = mongoose.model("User", userSchema);
module.exports = User;


console.log('Doing something mayb');
