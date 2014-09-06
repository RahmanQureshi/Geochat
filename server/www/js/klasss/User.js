function User(name, position, socket) {
	// probably won't collide...
	this.uid = 'u'+Math.round(Math.random()*10000)+'t'+Date.now();
	this.name = name || "user_"+this.uid;
	this.socket = socket;
	this.position = {};
	this.position.latitude = position.latitude;
	this.position.longitude = position.longitude;
}

User.prototype.setRoom = function (room) {
	this.room = room;
};

User.prototype.setPosition = function (lat, lon) {
	this.position.latitude = lat;
	this.position.longitude = lon;
}

module.exports = User;