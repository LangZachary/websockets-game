var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var Game = require('./controller/game');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.set('port', (process.env.PORT || 5000));
var server = http.Server(app);
var socket = socketio(server);
var game = new Game();

app.get('/', function(request, response) {
  response.render('pages/index');
});

server.listen(app.get('port'), function(){
  console.log('Node app running on port ', app.get('port'));
});

setInterval(function() {
  game.step();
}, 1000/160);

setInterval(function() {
  socket.volatile.emit('state', game.state());
}, 1000/60);

socket.on('connection', function(socket){ // Listen for connections
  console.log('Connection ', socket.id); // DEBUG
  socket.emit('initialize', {
    id: socket.id,
    bounds: game.bounds
  });

  socket.on('disconnect', function(){ // Listen for disconnections
    console.log('Disconnection ', socket.id); // DEBUG
    game.removeId(socket.id);
  });

  socket.on('addPlayer', function(avatar){
    game.addId(socket.id, avatar);
  });

  socket.on('updatePlayerAcceleration', function(x, y){
    game.acceleratePlayer(socket.id, x, y);
  });

  socket.on('shootProjectile', function(x, y){
    game.shootProjectile(socket.id, x, y);
  });
});
