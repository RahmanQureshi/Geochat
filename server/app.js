var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var User = require('./www/js/classes/User.js');
var Room = require('./www/js/classes/Room.js');
var Message = require('./www/js/classes/Message.js');

http.listen(8080, function () {
  console.log("Listening");
});


app.use('/js', express.static('www/js'));
app.use('/css', express.static('www/css'));
app.use('/img', express.static('www/img'));
app.use('/partials', express.static('www/partials'));
app.use('/fonts', express.static('www/fonts'));
app.use('/bower_components', express.static('www/bower_components'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/www/index.html');
});

/******** SOCKETS **********/

var rooms = [];

var users = [];

/**
* Return room with given rid
*/
function find_room(rid) {
  for (var i=0; i<rooms.length; i++){
    var r = rooms[i];
    if (r.rid == rid) {
      return r;
    }
  }
  return null;
}

/**
* Finds and returns the user with the specified uid and null otherwise
*/
function find_user(uid) {
  for (var i=0; i<users.length; i++){
    var u = users[i];
    if (u.uid == uid) {
      return u;
    }
  }
  return null;
}

/**
* Returns the distance in m between position one and position two.
*/
function dist_m(p1, p2) {
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
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d * 1000;
}

/**
* Converts degrees to radians
*/
function deg2rad(deg) {
  return deg * (Math.PI/180);
}


io.on('connection', function (socket) {

  // user registration
  socket.on('client:handshake', function (data) {
    var newUser = new User(data.name, socket, data.position);
    users.push(newUser);
    socket.emit('server:handshake', newUser.uid);
    console.log("Handshake done, user pushed in." + newUser.uid + " at " + data.position.latitude + ";" + data.position.longitude);
  });

  // return list of rooms in user's area
  socket.on('client:get_rooms', function (data) {
    var uid = data.uid;
    var user = find_user(uid);
    var position = data.position;
    var local_rooms = [];
    var room;
    if ( user == null ) {
      socket.emit('server:rooms', {resp:-1});
      return;
    }
    user.position = position;
    for ( var i = 0; i < rooms.length; i++ ) {
      room = rooms[i];
      if ( dist_m(user.position, room.position) < room.radius ) {
        local_rooms.push(room);
      }
    }
    socket.emit('server:rooms', local_rooms);
  });

  // add user to chat room if within radius
  socket.on('client:join_room', function (data) {
    var uid = data.uid;
    var user = find_user(uid);
    var position = data.position;
    var rid = data.rid;
    var room = find_room(rid);
    var msgs = [];
    
    if ( user == null || room == null ) {
      socket.emit('server:join_room_result', {resp:-1});
      return;
    }

    user.position = position;

    if ( dist_m(user.position, room.position) < room.radius ) {
      var prevRoom = find_room(user.rid);
      if ( prevRoom ) {
        prevRoom.users.splice(prevRoom.users.indexof(user), 1);
      }
      room.addUser(user);
      user.rid = rid;
      socket.emit('server:join_room_result', {resp:1});
      return;
    }

    socket.emit('server:join_room_result', {resp:-1});

  });

  socket.on('client:add_msg', function (data) {
    var uid = data.uid;
    var user = find_user(uid);
    var msg = new Message(user.name, data.message);
    var rid = user.rid;
    var room = find_room(user.rid);
    var position = data.position;
    var u;

    if ( user == null || room == null ) {
      socket.emit('server:add_msg_result', -1);
      return;
    }

    if ( dist_m(user.position, room.position) < room.radius ) {
      room.messages.push(msg);
      for ( var i = 0; i < room.users.length; i++ ) {
        u = room.users[i];
        u.socket.emit('server:board_updated', msg);
      }
    } else {
      socket.emit('server:add_msg_result', -1);
    }
  });

  socket.on('client:add_room', function (data) {
    var name = data.name;
    var center = data.position;
    var radius = parseInt(data.radius);
    var room = new Room(name, center, radius);
    var u;
    var distance_u_r;

    rooms.push(room);

    // let others' know about room change, including the current user
    for ( var i = 0; i < users.length; i++ ) {
      u = users[i];
      distance_u_r = dist_m(u.position, room.position);
      if ( distance_u_r < room.radius ) {
        u.socket.emit('server:new_room', room);
      }
    }
    // respond to poster
    //socket.emit('server:add_room_result', {resp:1, rid:room.rid});
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
  var d = dist_m(r.position, u.position);
  if (d <= r.radius) {
    return 1;
  } else {
    return -1;
  }
}

function update_positionn (u, posn) {
  u.position = posn;
  u.last_updated = Date.now();
}