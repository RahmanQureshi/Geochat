angular.module('geoChatApp')
    .provider('SocketService', function SocketServiceProvider() {

    var connections = {};

    this.newConnection = function (name, url) {

        var socket = io.connect(url);
        connections[name] = socket;

    };

    this.$get = function SocketServiceFactory(apiToken) {

        return {
            getSocket: function (name) {
                if (name in connection) {
                    alert('Unable to retrieve socket');
                    return null;
                }
                return connections[name];
            }
        };

    };

});