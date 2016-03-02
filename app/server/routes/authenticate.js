'use strict';

var express = require('express')
	, authenticateRouter = express.Router()
	, User = require('../model/user')
	, jwt = require('jsonwebtoken')
	, jwtSecret = require('../services/tokenService').secret;


//
// Router bindings.
// ==============================================
authenticateRouter.route('/')
	.post(authenticate);


/**
 * Authenticate user.
 *
 * @param object req HTTP request
 * @param object res HTTP response
 */
function authenticate(req, res) {
	User
		.findOne({
			email: req.body.email
		})
		.select('email username password')
		.exec(function (err, user) {
			if (err) {
				res.status(500);
				res.json({
					success: false,
					error: err
				});
			} else {
				if (user && req.body.password) {
					var validPassword = user.comparePassword(req.body.password);
					console.log('validPassword:', validPassword);
					if (validPassword) {
						var token = jwt.sign({
							email: user.email,
							username: user.username,
							id: user._id
						}, jwtSecret, {
							expiresInMinutes: 1440
						});

						res.json({
							success: true,
							token: token
						});
					} else {
						sendAuthenticationFailure(res);
					}
				} else {
					sendAuthenticationFailure(res);
				}
			}
		});
}

/**
 * Send an authentification failure response.
 *
 * @param object res HTTP response
 */
function sendAuthenticationFailure(res) {
	res.status(401);
	res.json({
		success: false,
		error: 'Authentication failed.'
	});
}


module.exports = exports = authenticateRouter;