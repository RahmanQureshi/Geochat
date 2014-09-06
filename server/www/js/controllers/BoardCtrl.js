app.module('geoChatApp')
    .controller('BoardCtrl', function ($scope, SocketService, UserService) {

    var socket = SocketService.get('server');
    $scope.messages = [];
    var users = [];

    $scope.addMsg = function (message) {
        socket.emit('client:add_msg', {
            'message': message,
            uid: UserService.getUid
        });
    };

    socket.emit('server:message_history', {uid:UserService.getUid()});
    socket.on('client:message_history', function (messageArray) {
    	$scope.messages = messageArray;
    });

    socket.on('server:board_updated', function (message) {
        for (var i = 0; i < messageArray; i++) {
            $scope.messages.push(message);
        }
    });

});