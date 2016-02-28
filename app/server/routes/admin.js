'use strict';

var express = require('express')
	, adminRouter = express.Router();

adminRouter.get('/', function (req, res) {
	res.send('/ called');
});

adminRouter.get('/users', function (req, res) {
	res.send('/users called');
});


// Users resources
adminRouter.get('/users/:userId', function (req, res) {
	res.send('/users/' + req.params.userId + ' called');
});

// User name validation
adminRouter.param('userId', function (req, res, next, name) {
	console.log('Doing name validations on', name);
	req.name = name;
	next();
});

module.exports = exports = adminRouter;
