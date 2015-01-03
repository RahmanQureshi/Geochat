angular.module('geoChatApp')

    .controller('MainCtrl', function ($scope, SocketService, LocationService, UserService, $interval, $location, $window) {

    $scope.noRoomsYet = true;
    $scope.rooms = [];
    var socket;

    function init() {
        console.log('initializing');
        SocketService.newConnection('server', '/'); // switched from configuration to here because                                                                                                                                                                                                                                                                              we providers were not behaving
        socket = SocketService.get('server');
        // if (!UserService.getUid()) {
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
                getRooms(); // get rooms once you are a verified user
            });
        // } else {
            // getRooms();
        // }
    }
    init();

    //$interval(function () {
     //   sendLocation();
    //}, 5000);

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

    $scope.joinRoom = function (room) {
        var rid = room.rid;
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
    };

    $scope.addRoom = function () {
        $scope.noRoomsYet = false;
        var name = prompt('Please enter the room name');
        var radius = prompt('Please enter a radius');
        LocationService.getLocation().then(function (position) {
            var obj = {
                name:name,
                position:{
                    latitude:position.coords.latitude,
                    longitude:position.coords.longitude
                },
                radius:radius
            };
            socket.emit('client:add_room', obj);
        });
    };

    $scope.takePicture = function () {
        alert('here');
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 60,
            correctOrientation: true,
            mediaType: 0, //picture
            sourceType: 1, //camera - eventually expand to in-memory pictures
            encodingType: 0, //jpeg
            destinationType: 0, //binary
            cameraDirection: 0, //back
            targetWidth: 75,
            targetHeight: 100,
            saveToPhotoAlbum: false
        });

        function onSuccess(imageData) {
            var image = document.getElementById('myImage');
            image.src = "data:image/jpeg;base64," + imageData;
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    };

    socket.on('server:add_room_result', function (room) {
        if (room.resp == -1) {
            alert('Failed to create Room; -1');
        } else {
            // $scope.joinRoom(room.rid);
        }
    });

    socket.on('server:new_room', function (room) {
        $scope.$apply( function () {
            $scope.rooms.push(room);
        });
    });

    socket.on('server:handshake', function (uid) {
        UserService.setUid(uid);
    });

    socket.on('server:rooms', function (roomArray) {
        console.log('server:rooms');
        console.log(roomArray);
        $scope.$apply(function () {
            $scope.rooms = JSON.parse(roomArray);
        });
    });
    socket.on('server:join_room_result', function (data) {
        if (data.resp < 1) {
            alert(' Failed to join room ');
        } else {
            $scope.$apply( function () {
                $location.path('/board');
            });
        }
    });

    function getRooms() {
        LocationService.getLocation().then(function (position) {
            socket.emit('client:get_rooms', {
                uid: UserService.getUid(),
                position: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            });
        });
    };

});