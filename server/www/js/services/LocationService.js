angular.module('geoChatApp')
    .factory('LocationService', function LocationService($q, $timeout) {
    return {
        getLocation: function () {
            var deferred = $q.defer();
            navigator.geolocation.getCurrentPosition(function (position) {
                deferred.resolve(position);
            });
            return deferred.promise;
        }
    };

});