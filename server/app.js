var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var User = require('./User.js');

http.listen(8080);


app.use('/js', express.static('www/js'));
app.use('/css', express.static('www/css'));
app.use('/img', express.static('www/img'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/www/index.html');
});

/* OBJECTS

room = {name:string, users:[], messages:[], center:{}, radius:number}

user = {name:string, last_location:{}, timestamp:number, room_id:number}

*/

// SOCKETS

// kick clients that don't update their location
var CLIENT_TIMEOUT = 100000;

var rooms = [];

var users = [];

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
  console.log("con'c't'd");
  // socket.emit('server:')

  // wait for user to provide location
  socket.on('client:connection', function (data) {
    var name = data.name;
    var latitude  = data.latitude;
    var longitude = data.longitude;
    console.log('connect: ', name, ' at ', latitude + ";" + longitude);
    var newUser = new User(name, latitude, longitude);
    users.push(newUser);
    socket.emit('server:rooms', [{},{},{}]);
  });

  // socket.on('client:join', function (name, location, room_id) {
  //   console.log('join: ', name, ' to ', room_id);
  //   socket.emit('server:recent_messages', [{},{},{}]);
  // });

  // socket.on('client:add_msg', function (name, msg) {
  //   console.log('add_msg: ', name, ' says: ', msg);
  //   socket.emit('server:add_msg','success');
  //   the_room = room_of(name);
  //   the_room.users.forEach(function (u) {
  //   	u.socket.emit('server:new_msg', msg);
  //   });
  // });

  socket.on('disconnect', function () {
    // io.sockets.emit('user disconnected');
  });
});


/******************/

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
