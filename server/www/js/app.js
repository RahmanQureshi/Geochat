app.module('geoChatApp', [])
   
    .config(function ($routeProvider, SocketServiceProvider) {

        $routeProvider
        .when('/', {
            templateUrl:'/www/partials/main.html',
            controller:'MainCtrl'
        })
        .when('/board', {
            templateUrl:'/www/partials/board.html',
            controller:'BoardCtrl'
        });

        SocketServiceProvider.newConnection('server', 'http://hbar.ca:8080');

    });