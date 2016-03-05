'use strict';

var express = require('express')
	, apiRouter = express.Router()
	, User = require('../model/user')
	, jwt = require('jsonwebtoken')
	, jwtSecret = 'qsdf548qs3daze21fdsg49sd8fgz6er1s4q98';


//
// Router bindings and middlewares.
// ==============================================

// public routes
apiRouter.route('/users')
	.post(addUser);


// authenticated routes
apiRouter.use(checkToken);

apiRouter.route('/users')
	.get(getUsers);

apiRouter.route('/users/:user_id')
	.get(getUser)
	.put(updateUser)
	.delete(deleteUser);

apiRouter.route('/me')
	.get(me);


/**
 * Add new user.
 *
 * @param object req HTTP request
 * @param object res HTTP response
 */
function addUser(req, res) {
	var user = new User();

	user.email = req.body.email;
	user.username = req.body.username;
	user.password = req.body.password;

	user.save(function (err) {
		if (err) {
			if (err.code === 11000) {
				res.status(400);
				res.json({
					success: false,
					error: 'Username already exists'
				});
			} else {
				res.status(500);
				res.json({
					success: false,
					error: err
				});
			}			
		} else {
			res.status(201);
			res.json({
				success: true,
				message: 'User created'
			});
		}
	});
}

/**
 * Check token middleware.
 *
 * @param object   req HTTP request
 * @param object   res HTTP response
 * @param function next continuation function 
 */
function checkToken(req, res, next) {
	getDecodedToken(req)
		.then(function (token) {
			req.token = token;
			next();
		})
		.catch(function () {
			sendAccessForbidden(res);
		});
}

/**
 * Extract decoded token from request.
 *
 * @param  object  req HTTP request
 * @return promise     decoded token
 */
function getDecodedToken(req) {
	return new Promise(function (resolve, reject) {
		var token; 

		var authorizationHeader = req.headers.authorization;
		if (authorizationHeader) {
			token = authorizationHeader.split(' ')[1];
		}

		if (token) {
			jwt.verify(token, jwtSecret, function (err, decodedToken) {
				if (err) {
					reject(err);
				} else {
					resolve(decodedToken);
				}
			});
		} else {
			reject();
		}
	});
}

/**
 * Send an authentification failure response.
 *
 * @param object res HTTP response
 */
function sendAccessForbidden(res) {
	res.status(403);
	res.json({
		success: false,
		error: 'Authentication failed.'
	});
}

/**
 * Get informations about me.
 *
 * @param object   req HTTP request
 * @param object   res HTTP response
 */
function me(req, res) {
	res.json({
		token: req.token
	});
}

/**
 * Get all users.
 *
 * @param object req HTTP request
 * @param object res HTTP response
 */
function getUsers(req, res) {
	User.find(function (err, users) {
		res.json(users);
	});
}

/**
 * Get a user.
 *
 * @param object req HTTP request
 * @param object res HTTP response
 */
function getUser(req, res) {
	User.findById(req.params.user_id, function (err, user) {
		if (err) {
			res.status(500);
			res.json({
				success: false,
				error: err
			});
		} else {
			if (user) {
				res.json(user);
			} else {
				res.status(404);
				res.json({
					success: false,
					error: 'User not found'
				});
			}
		}
	});
}

/**
 * Update existing user.
 *
 * @param object req HTTP request
 * @param object res HTTP response
 */
function updateUser(req, res) {
	var userId = req.params.user_id;
	getDecodedToken(req).then(function (token) {
		if (token.id === userId) {
			User.findById(req.params.user_id, function (err, user) {
				if (err) {
					res.status(500);
					res.send(err);
				} else {
					if (user) {
						user.username = req.body.username || user.username;

						var password = req.body.password;
						if (password) {
							user.password = password;
						}

						user.save(function (err) {
							if (err) {
								res.status(500);
								res.json({
									success: false,
									error: err
								});
							} else {
								res.json({
									success: true,
									message: 'User updated'
								});
							}
						});
					} else {
						res.status(404);
						res.json({
							success: false,
							error: 'User not found'
						});
					}
				}
			});
		}
	});

}

/**
 * Delete a user.
 *
 * @param object req HTTP request
 * @param object res HTTP response
 */
function deleteUser(req, res) {
	User.remove({_id: req.params.user_id}, function (err, mongo) {
		if (err) {
			res.status(500);
			res.json({
				success: false,
				error: err
			});
		} else {
			if (mongo.result.n > 0) {
				res.json({
					success: true,
					message: 'User deleted'
				});
			} else {
				res.status(404);
				res.json({
					success: false,
					error: 'User not found.'
				});
			}
		}
	});
}


module.exports = exports = apiRouter;