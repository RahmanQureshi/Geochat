function User(name, lat, lon) {
	this.name = name || "Anonymous";
	this.position = {};
	this.position.latitude = lat;
	this.position.longitude = lon;
}

User.prototype.setRoom = function (room) {
	this.room = room;
};

User.prototype.setPosition = function (lat, lon) {
	this.position.latitude = lat;
	this.position.longitude = lon;
};

User.prototype.toString = function () {
	return(this.name + " inside " + JSON.stringify(this.room) + " at " + this.position.latitude + " ; " + this.position.longitude);
};

module.exports = User;