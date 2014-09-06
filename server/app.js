var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

/* OBJECTS

room = {name:string, users:[], messages:[], center:{}, radius:number}

user = {name:string, last_location:{}, timestamp:number, room_id:number}

*/

// SOCKETS

// kick clients that don't update their location
var CLIENT_TIMEOUT = 100000;

var rooms = [];

function room_of(name) {
	rooms.forEach(function (r) {
		r.forEach(function (u) {
			if (u.name == name) {
				return u;
			}
		});
	});
	return;
}

io.on('connection', function (socket) {
  // io.emit('this', { will: 'be received by everyone'});
  // socket.emit('server:')

  // wait for user to provide location
  socket.on('client:connection', function (name, location) {
    console.log('connect: ', name, ' at ', location);
	socket.emit('server:rooms', [{},{},{}]);
  });

  socket.on('client:join', function (name, location, room_id) {
    console.log('join: ', name, ' to ', room_id);
    socket.emit('server:recent_messages', [{},{},{}]);
  });

  socket.on('client:add_msg', function (name, msg) {
    console.log('add_msg: ', name, ' says: ', msg);
    socket.emit('server:add_msg','success');
    the_room = room_of(name);
    the_room.users.forEach(function (u) {
    	u.socket.emit('server:new_msg', msg);
    });
  });

  socket.on('disconnect', function () {
    // io.sockets.emit('user disconnected');
  });
});