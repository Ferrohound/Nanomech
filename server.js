//console.log("Testing, testing");
//run by ________________________
var http =  require("http");

var gameport = process.env.PORT || 4004,
	io = require('socket.io'),
	express = require('express'),
	//Universally Unique IDentifier
	UUID = require('node-uuid'),
	verbose = false,
	app = express.createServer(),
	//create a socket.io instance using the express server
	sio = io.listen(app);
	

//tell the server to listen for incoming connections
app.listen(gameport);

console.log('\t :: Express :: Listening on port ' + gameport);

app.get('/',function(req, res){
	res.sendfile(__dirname + '/index.html');
});

//handler to listen for requests on /*, any file from the root of the server
app.get('/*', function(req, res, next){
	var file = req.params[0];
	
	if(verbose) console.log('\t :: Express :: file requested : ' + file);
	res.sendfile(__dirname + '/' + file);
});


sio.configure(function(){
	sio.set('log level',0);
	sio.set('authorization', function(handshakeData, callback){
		callback(null, true);
	});
});


sio.sockets.on('connection', function(client){
	//generate a new UUID and store their socket/connection
	client.userid = UUID();
	client.emit('onconnected', {id:client.userid});
	console.log('\t socket.io:: player ' + client.userid + 'connected');
	
	client.on('disconnect', function(){
		console.log('\t socket.io:: client disconnected ' + client.userid);
	});
});