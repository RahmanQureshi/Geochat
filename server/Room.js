function Room(lat, lon, name) {
	this.center = {};
	this.center.lat = lat;
	this.center.lon = lon;
	this.users = [];
	this.messages = [];
	this.name = name;
}

Room.prototype.addUser = function (user) {
	this.users.push(user);
};

Room.prototype.postMessage = function (message) {
	this.messages.push(message);
};

Room.prototype.toString = function () {
	var users = "";
	for ( var i = 0; i < users.length; i++) users += JSON.stringify(users[i]) + ";";
	return(this.name + "with" + users + " at " + this.position.latitude + " ; " + this.position.longitude);
};