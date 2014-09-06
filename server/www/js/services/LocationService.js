app.module('geoChatApp')
    .factory('LocationService', function LocationService($q) {
    return {
        getLocation: function () {
            return {
                coords: {
                    longitude: 5,
                    latitude: 5
                }
            };
            /*
            var deferred = $q.defer();
            navigator.geolocation.watchPosition(function (position) {
                deferred.resolve(position);
            }, function () {
                deferred.reject('Timeout'); // is it $q.reject?
            }, {
                timeout: 5000
            });
            return deferred.promise;
            */
        }
    };

});