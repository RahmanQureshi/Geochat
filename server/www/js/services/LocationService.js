angular.module('geoChatApp')
    .factory('LocationService', function LocationService($q, $timeout) {
    return {
        getLocation: function () {

            var deferred = $q.defer();
            navigator.geolocation.watchPosition(function (position) {
                console.log(position);
                deferred.resolve(position);
            }, function () {
                deferred.reject('Timeout'); // is it $q.reject?
            }, {
                timeout: 5000
            });
            return deferred.promise;
        }
    };

});