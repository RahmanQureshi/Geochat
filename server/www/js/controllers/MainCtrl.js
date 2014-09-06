angular.module('geoChatApp')

    .controller('MainCtrl', function ($scope, SocketService, LocationService, UserService, $interval, $location) {

    $scope.name = "Hello, World";
    $scope.rooms = [];
    var socket = SocketService.get('server');

    function init() {
        var name = prompt('Please enter your nick name');
        UserService.setName(name);
        LocationService.getLocation().then(function (position) {
            socket.emit('client:handshake', {
                name: name,
                position: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            })
        })
    }
    init();

    $interval(function () {
        sendLocation();
    }, 25000);

    function sendLocation() {
        LocationService.getLocation().then(function (position) {
            socket.emit('client:heartbeat', {
                uid:UserService.getUid(),
                position: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            })
        })
    };

    $scope.joinRoom = function (rid) {
        LocationService.getLocation().then(function (position) {
            socket.emit('client:join_room', {
                uid: UserService.getUid(),
                rid: rid,
                position: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            });
        });
    }

    $scope.addRoom = function (name, radius) {
        LocationService.getLocation().then(function (position) {
            socket.emit('client:add_room', {
                name: name,
                position: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                },
                radius: radius
            });
        });
    };

    socket.on('server:add_room_result', function (room) {
        if (room.resp == -1) {
            alert('Failed to create Room; -1');
        } else {
            $scope.joinRoom(room.rid);
        }
    });
    socket.on('server:handshake', function (uid) {
        UserService.setUid(uid);
    });
    socket.on('server:rooms', function (roomArray) {
        $scope.rooms = roomArray;
    });
    socket.on('server:join_room_result', function (data) {
        if (data.resp == -1) {
            alert(' Failed to join room ');
        } else {
            $location.path('/board');
        }
    });

    (function getRooms() {
        socket.emit('client:get_rooms', {
            uid: UserService.getUid()
        });
    })();

});