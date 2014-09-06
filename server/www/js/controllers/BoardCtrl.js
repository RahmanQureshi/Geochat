app.module('geoChatApp')
	.controller('BoardCtrl', function ($scope, SocketService, UserService) {

		var socket = SocketService.get('server');
		var messages = [];
		var users = [];

		$scope.addMsg = function (message) {
			socket.emit('client:add_msg', {'message': message, uid: UserService.getUid});
		};

		socket.on('server:board_updated', function (message) {
			for ( var i = 0; i < messageArray; i++ ) {
				messages.push(message);
			}
		});

});