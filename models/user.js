const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		unique: true
	},
	email: {
		type: String,
		unique: true,
	},
	image: {
		path: {type: String, default:'/images/default-profile.jpg'},
		filename: String
	},
	score: {
		type: Number,
		default: 0
	},
	wins: {
		type: Number,
		default:0
	}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
