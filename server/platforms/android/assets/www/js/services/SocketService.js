angular.module('geoChatApp')
    .factory('SocketService', function SocketService() {

    var connections = {};

    var newConnection = function (name, url) {
        if ( name in connections ) {
            console.log('Connection for ' + name + ' already exists.');
        } else {
            var socket = io.connect(url);
            connections[name] = socket;
        }
    };
    var get = function (name) {
        console.log(connections);
        if ( name in Object.keys(connections) ) {
            alert('Socket not found');
            return null;
        }
        return connections[name];
    }

    return {
        newConnection: newConnection,
        get: get
    }

});