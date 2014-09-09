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
            // document.cookie="uid="+uid;
        },
        getUid: function () {
            return user.uid;
            // var spl = document.cookie.split(';')[0].split('=');
            // if (spl[0] == 'uid') {
            //     var uid = spl[1];
            //     return uid;
            // } else {
            //     return false;
            // }
        }
    };

});