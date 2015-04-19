var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer= require('multer');
var routes = require('./routes/index');
var users = require('./routes/users');
var xmlreader = require('xmlreader');
var Client = require('node-wolfram');
var Wolfram = new Client('TRR8TK-XJTTAVAGXU');
var http =require('http');
var client = require('twilio')('ACf51020ab431c2cbe8b7d19b258eea85e', '3249463d4994caed325189180c9cb4dc');
	
var message;//for response message
var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/test', function(req, res) {
	console.log('query', req.query)
	console.log('body', req.body)
	res.json(req.query || 'nothing')
});

app.get('/', function(req, res) {
	var ques = req.query.Body;
	console.log(ques);
	message = '';
	Wolfram.query(ques, function(err, result) {
		if(err) {
			console.log(err);
			message = "Sorry, your query didn't turn up any results.";
		}
		else {
			for(var a=0; a<result.queryresult.pod.length; a++){
				var pod = result.queryresult.pod[a];
				if(pod.subpod[0].plaintext[0]!=''){
					message = message + pod.$.title+": ";
					//console.log("In loop ", message);
					for(var b=0; b<pod.subpod.length; b++){
						var subpod = pod.subpod[b];
						for(var c=0; c<subpod.plaintext.length; c++){
						    var text = subpod.plaintext[c];
						    message = message + text +" ";
						}
					}
				}
			}
		}
		console.log(message);
		sendMessage(message);
	});
	var sendMessage = function(msg){
		console.log("In send message ",req.query.From," ",req.query.To);
		var To=req.query.From;
		var From=req.query.To;
		client.messages.create({
			to:To,
			from:From,
			body:message
			}, function(err, text) {
				console.log( JSON.stringify(err, null, 4));
		});
	};
/*	var options = {
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
	  	message='';
	  	console.log("got data ",chunk);
	  	xmlreader.read(chunk, function (err, res){
    		if(err) return console.log(err);
    		if(res.queryresult.attributes().success=='false'){
    			message="Sorry, your query turned up no result.";
    		}else {
    			res.queryresult.pod.each(function(i,pod){
					if(pod.subpod.plaintext.text()!="")
						message = message + pod.attributes().title+": "+pod.subpod.plaintext.text()+"\n";
				});
			}
    	});
    	//console.log(message);
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
