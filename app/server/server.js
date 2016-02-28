'use strict';

var express = require('express')
	, app = express()
	, bodyParser = require('body-parser')
	, morgan = require('morgan')
	, mongoose = require('mongoose')
	, adminRouter = require('./routes/admin')
	, authenticateRouter = require('./routes/authenticate')
	, apiRouter = require('./routes/api')
	, port = process.env.PORT || 3000;


// Express configuration
//==============================================
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

function enableCORS(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
	next();
}
app.use(enableCORS);

app.use('/admin', adminRouter);
app.use('/authenticate', authenticateRouter);
app.use('/api', apiRouter);
app.use(express.static(__dirname + '/../public'));

// Connect to MongoDB
//==============================================
mongoose.connect('mongodb://localhost/dollsrocks');


// Start application
//==============================================
app.listen(port);
console.log('App started on http://localhost:' + port);
