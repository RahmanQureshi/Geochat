angular.module('geoChatApp')
    .factory('UserService', function UserService() {

    var user = {};

    return {
        setName: function (name) {
            user.name = name;
        },
        getName: function () {
            return user.name;
        },
        setUid: function (uid) {
            user.uid = uid;
        },
        getUid: function () {
            return user.uid;
        }
    };

});