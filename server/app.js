var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var User = require('./www/js/classes/User.js');
var Room = require('./www/js/classes/Room.js');
var Message = require('./www/js/classes/Message.js');

http.listen(8080);


app.use('/js', express.static('www/js'));
app.use('/css', express.static('www/css'));
app.use('/img', express.static('www/img'));
app.use('/partials', express.static('www/partials'));
app.use('/bower_components', express.static('www/bower_components'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/www/index.html');
});

/******** SOCKETS **********/

// kick clients that don't update their location
var CLIENT_TIMEOUT = 100000;

var rooms = [];

var users = [];

function room_of(name) {
  for (var i=0; i<rooms.length; i++) {
	  var r = rooms[i];
		for (var j=0; j<r.users.length; j++){
      var u = r.users[j];
			if (u.name == name) {
				return u;
			}
		}
	}
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

  socket.on('client:get_rooms', function (data) {
    var uid = data.uid;
    var user = find_user(uid);
    local_rooms = [];
    for (var i=0; i<rooms.length; i++){
      var r = rooms[i];
      if (dist_km(user.position, r.position) < r.radius) {
        local_rooms.push({rid:r.rid, name:r.name});
      }
    }
    socket.emit('server:rooms', local_rooms);
  });

  socket.on('client:join_room', function (data) {
    console.log('--- client joined ---###');
    console.log(JSON.stringify(data));
    console.log('---------------------###');
    var uid = data.uid;
    var user = find_user(uid);
    update_posn(user, data.position);
    var rid = data.rid;
    var room = find_room(rid);
    var resp = validate(room, user);
    var msgs = [];
    if (resp == 1) {
      console.log('join: ', user.name, ' to ', rid);
      room.users.push(user);
      user.rid = rid;
    }
    socket.emit('server:join_room_result', {resp:resp});
  });

  socket.on('client:message_history', function (data) {
    var uid = data.uid;
    var user = find_user(uid);
    update_posn(user, data.position);
    if (user.rid != '') {
      var rid = user.rid;
      var room = find_room(rid);
      var resp = validate(room, user);
      var msgs = [];
      if (resp == 1) {
        user.rid = rid;
        msgs = room.messages;
      }
      socket.emit('server:message_history', {resp:1, messages:msgs});
    } else {
      socket.emit('server:message_history', {resp:-1});
    }    
  });

  socket.on('client:add_msg', function (data) {
    var uid = data.uid;
    var user = find_user(uid);
    if (Date.now() - user.timestamp > CLIENT_TIMEOUT) {
      
      // if the user has not updated location in a while,
      // emit msg added failed, display view to alert not sent
      socket.emit('server:add_msg_result', 0);
    } else {
      var msg = new Message(user.name, data.message)
      if (user.rid != '') {
        var room = find_room(user.rid);
        room.messages.push(msg);
        // notify all room members
        for (var i=0; i<room.users.length; i++){
          var u = room.users[i];
          u.socket.emit('server:board_updated', msg);
        }
      } else {
        var fuck = 'fuck'; // TODO
      }
    }
  });

  socket.on('client:add_room', function (data) {
    var name = data.name;
    var center = data.position;
    var radius = parseInt(data.radius);
    var room = new Room(name, center, radius)
    console.log('===================');
    console.log(room);
    console.log('===================');
    rooms.push(room);
    trimmed_rooms = [];
    for (var i=0; i<rooms.length; i++) {
      var r = rooms[i];
      trimmed_rooms.push({name:r.name, rid:r.rid});
    }
    // let others' know about room change
    for (var i=0; i<users.length; i++) {
      var u = users[i];
      u.socket.emit('server:update_rooms', trimmed_rooms);
    }
    // respond to poster
    socket.emit('server:add_room_result', {resp:1, rid:room.rid});
  });

  socket.on('client:heartbeat', function (data) {
    var uid = data.uid;
    var user = find_user(uid);
    if (user) {
      user.position = data.position;
      user.last_updated = Date.now();
    }
  });

  socket.on('disconnect', function () {
    // loop through rooms, check emptiness, delete if empty
  });
});


/******** HELPERS **********/

function validate(r,u){
  var d = dist_km(r.position, u.position);
  if (d <= r.radius) {
    return 1;
  } else {
    return -1;
  }
}

function update_posn (u, posn) {
  u.position = posn;
  u.last_updated = Date.now();
}

function find_user(uid) {
  for (var i=0; i<users.length; i++){
    var u = users[i];
    if (u.uid == uid) {
      return u;
    }
  }
  console.log('===================');
  console.log("DIDN'T FIND USER : "+uid);
  console.log('===================');
}

function find_room(rid) {
  for (var i=0; i<rooms.length; i++){
    var r = rooms[i];
    if (r.rid == rid) {
      return r;
    }
  }
  console.log('===================');
  console.log("DIDN'T FIND ROOM : "+rid);
  console.log('===================');
}

function dist_km(p1, p2) {
  console.log('--------dist_km-------');
  console.log("### p1: " + p1+ "   p2: " + p2);
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
  console.log('d = '+d);
  console.log('---------------');
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
