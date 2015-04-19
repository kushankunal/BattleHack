var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer= require('multer');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.post('/', function(req, res) {
	console.log("inside");
  var http =require('http');
	var query = '/v2/query?appid=TRR8TK-XJTTAVAGXU&input=';
	var ques = req.body.body;
	console.log(ques+" from "+ req.body.from);
	//ques= encodeURIComponent(ques);
	//console.log(ques);
	
	/*
	var client = require('twilio')('PN65ae80d78ebe8deeb91222b10c6d89c8', 'ACf51020ab431c2cbe8b7d19b258eea85e');
	client.sms.messages.post({
		to:req.body.from,
		from:'+2813774461',
		body:'word to your mother.'
	}, function(err, text) {
		console.log('You sent: '+ text.body);
		console.log('Current status of this text message is: '+ text.status);
	});


	var options = {
	  host: 'api.wolframalpha.com',
	  port: 80,
	  path: query+ques,
	  method: 'GET'
	};
	var req = http.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
		console.log('BODY: ' + chunk);
	  });
	});
	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
	req.end();
	*/
});
app.listen(process.env.PORT || 8080);
/*
//Wolfram Integration 
var http =require('http');
var query = '/v2/query?appid=TRR8TK-XJTTAVAGXU&input=';
var ques = 'polio';
var options = {
  host: 'api.wolframalpha.com',
  port: 80,
  path: query+ques,
  method: 'GET'
};
console.log("Entering req");
var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
req.end();
*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;