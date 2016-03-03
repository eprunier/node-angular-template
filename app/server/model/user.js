'use strict';

var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		index: {unique: true}
	},
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: false,
		select: false
	}
});

// 
// Hash user's password before saving.
// 
UserSchema.pre('save', function (next) {
	var user = this;
	
	if (!user.isModified('password')) {
		return next();
	} else {
		bcrypt.hash(user.password, null, null, function (err, hash) {
			if (err) {
				return next(err);
			} else {
				user.password = hash;
				next();
			}
		});
	}
});

//
// Password comparison method.
//
UserSchema.methods.comparePassword = function (password) {
	var user = this;
	return bcrypt.compareSync(password, user.password);
};

module.exports = exports = mongoose.model('User', UserSchema);
