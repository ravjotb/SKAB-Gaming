const mongoose = require('mongoose');
//const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type:String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required:true
	},
	email: {
		type: String,
		unique: true,
	},
	image: {
		path: {type: String, default:'/images/default-profile.jpg'},
		filename: String
	}
});

//UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
