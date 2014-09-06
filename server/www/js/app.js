angular.module('geoChatApp', ['ngRoute'])

    .config(function ($routeProvider) {

    $routeProvider.when('/', {
        templateUrl: '/partials/main.html',
        controller: 'MainCtrl'
    })
        .when('/board', {
        templateUrl: '/partials/board.html',
        controller: 'BoardCtrl'
    });


});