angular.module('geoChatApp', ['ngRoute'])

    .config(function ($routeProvider, $compileProvider) {

    	console.log('configuring');

    	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

	    $routeProvider
	    .when('/', {
	        templateUrl: 'partials/main.html',
	        controller: 'MainCtrl'
	    })
        .when('/board', {
        templateUrl: 'partials/board.html',
        controller: 'BoardCtrl'
	    })
	    .otherwise({ redirectTo: '/'});

	    console.log()
	});