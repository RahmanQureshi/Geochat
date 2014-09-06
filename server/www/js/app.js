app.module('geoChatApp', [])
   
    .config(function ($routeProvider, SocketServiceProvider) {

        $routeProvider.when('/', {
            templateUrl:'/www/partials/main.html',
            controller:'MainCtrl'
        });

        SocketServiceProvider.newConnection('server', 'http://hbar.ca:8080');

    });