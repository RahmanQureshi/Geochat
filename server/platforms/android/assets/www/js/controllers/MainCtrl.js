angular.module('geoChatApp')

    .controller('MainCtrl', function ($scope, SocketService, LocationService, UserService, $interval, $location, $window) {

    $scope.name = "Hello, World";
    $scope.rooms = [];
    var socket;

    console.log('mainCtrl');

    function init() {
        SocketService.newConnection('server', 'http://hbar.ca:8080'); // switched from configuration to here because we providers were not behaving
        socket = SocketService.get('server');
        var name = $window.prompt('Please enter your name');
        UserService.setName(name);
        LocationService.getLocation().then(function (position) {
            socket.emit('client:handshake', {
                name: name,
                position: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            });
        });
    }
    init();

    $interval(function () {
        sendLocation();
    }, 5000);

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
        console.log("#### : " + rid);
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

    $scope.addRoom = function () {
        var name = prompt('Please enter your name');
        var radius = prompt('Please enter a radius');
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

    socket.on('server:update_rooms', function (roomsArray) {
        $scope.rooms = roomsArray;
    });

    socket.on('server:handshake', function (uid) {
        UserService.setUid(uid);
        getRooms();
        console.log("1st: " + uid);
    });
    socket.on('server:rooms', function (roomArray) {
        $scope.rooms = roomArray;
    });
    socket.on('server:join_room_result', function (data) {
        if (data.resp < 1) {
            alert(' Failed to join room ');
        } else {

            $location.path('/board');
        }
    });

    function getRooms() {
        console.log("2nd : " + UserService.getUid());
        socket.emit('client:get_rooms', {
            uid: UserService.getUid()
        });
    };

});