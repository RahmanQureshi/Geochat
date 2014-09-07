angular.module('geoChatApp')
    .controller('BoardCtrl', function ($scope, SocketService, UserService, LocationService) {

    var socket = SocketService.get('server');
    $scope.message = '';
    $scope.messages = [];
    var users = [];

    $scope.addMsg = function () {
        socket.emit('client:add_msg', {
            'message': $scope.message,
            uid: UserService.getUid()
        });
        $scope.message = '';
    };

    LocationService.getLocation().then(function (position) {
	    socket.emit('client:message_history', {
            uid:UserService.getUid(),
            position:{longitude:position.coords.longitude, latitude:position.coords.latitude} });
    });

    socket.on('server:message_history', function (data) {
        if ( data.resp > 0 )
    	   $scope.messages = data.messages;
        return;
        alert('Error retrieving messages');
    });

    socket.on('server:board_updated', function (message) {
        $scope.messages.push(message);
    });

});