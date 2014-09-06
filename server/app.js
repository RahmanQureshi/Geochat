var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var User = require('./www/js/klass/User.js');
var Room = require('./www/js/klass/Room.js');
var Message = require('./www/js/klass/Message.js');

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
  socket.on('client:handshake', function (data) {
    console.log("client made connection handshake request thing\n");
    // user
    var newUser = new User(data.name, data.position, socket);
    users.push(newUser);
    socket.emit('server:handshake', newUser.uid);
  });

  socket.on('client:get_rooms', function (uid) {
    var user = find_user(uid);
    local_rooms = [];
    rooms.forEach(function (r) {
      if (dist_km(user.position, r.center) < r.radius) {
        local_rooms.push(r.rid);
      }
    })
    socket.emit('server:rooms', local_rooms);
  });

  socket.on('client:join_room', function (data) {
    var uid = data.uid;
    var user = find_user(uid);
    var rid = data.rid;
    var room = find_room(rid);
    var resp = validate(room, user);
    var msgs = [];
    if (resp == 1) {
      console.log('join: ', user.name, ' to ', rid);
      room.users.push(user);
      user.rid = rid;
      // socket.join(room.id);
      msgs = room.messages.slice(0,100);
    }
    socket.emit('server:join_room_result', {resp:resp, messages:msgs});
  });

  socket.on('client:add_msg', function (data) {
    var uid = data.uid;
    var user = find_user(uid);[]
    if (Date.now() - user.timestamp > CLIENT_TIMEOUT) {
      
      // if the user has not updated location in a while,
      // emit msg added failed, display view to alert not sent
      socket.emit('server:add_msg_result', 0);
    }
    var msg = new Message(uid, data.msg)
    if (user.rid != '') {
      var room = find_room(rid);
      room.messages.push(msg);
      // notify all room members
      room.users.forEach(function (u) {
        u.socket.emit('server:board_updated', msg);
      });
    } else {
      var fuck = 'fuck'; // TODO
    }
  });

  socket.on('client:add_room', function (data) {
    var name = data.name;
    var center = data.location;
    var radius = data.radius;
    var room = new Room(name, center, radius)
    rooms.push(room);
    socket.emit('server:add_room_result', 1);
  });

  socket.on('client:heartbeat', function (data) {
    var uid = data.uid;
    var user = find_user(uid);
    user.position = data.position;
    user.last_updated = Date.now();
  });

  socket.on('disconnect', function () {
    // io.sockets.emit('user disconnected');
  });
});


/******************/

function validate(r,u){
  if (dist_km(r.position, u.position) <= r.radius) {
    return 1;
  } else {
    return -1;
  }
}

function find_user(uid) {
  users.forEach(function (u) {
    if (u.uid == uid) {
      return u;
    }
  });
}

function find_room(rid) {
  rooms.forEach(function (r) {
    if (r.rid == rid) {
      return r;
    }
  });
}

function dist_km(p1, p2) {
  var lat1 = p1.latitude;
  var lon1 = p1.longitude;
  var lat2 = p2.latitude;
  var lon2 = p2.longitude;
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
