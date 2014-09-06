app.module('geoChatApp')

	.controller('MainCtrl', function ($scope, SocketService, LocationService, UserService, $interval) {
		
		$scope.name = 'hello, world!';
		$scope.rooms = [];
		var socket = SocketService.get('server');

		$scope.register = function (name) {
			UserService.setName(name);
			LocationService.getLocation().then(position) {
				socket.emit('client:handshake', {'name':name, latitude: position.coords.latitude, longitude: position.coords.longitude });
			};
		};
		$interval(function () {
			$scope.register(UserService.getName());
		}, 25000);

		$scope.joinRoom = function (rid) {
			socket.emit('client:join_room', { uid: UserService.getUid, rid:rid });
		};

		$scope.addRoom = function (name, radius) {
			var position = LocationService.getLocation();
			socket.emit('client:add_room', {name: name, latitude:position.coords.latitude, longitude:position.coords.longitude, radius:radius });
		};

		socket.on('server:add_room_result', function (room) {
			if ( typeof room == int && room == -1 ) {
				alert ( 'Failed to create Room' );
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

		(function getRooms() {
			socket.emit('client:get_rooms', { uid:UserService.getUid() });
		})();


	});