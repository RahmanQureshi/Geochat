angular.module('geoChatApp', ['ngRoute'])

    .config(function ($routeProvider, socketServiceProvider) {

    $routeProvider.when('/', {
        templateUrl: '/www/partials/main.html',
        controller: 'MainCtrl'
    })
        .when('/board', {
        templateUrl: '/www/partials/board.html',
        controller: 'BoardCtrl'
    });

    SocketServiceProvider.newConnection('server', 'http://hbar.ca:8080');

});