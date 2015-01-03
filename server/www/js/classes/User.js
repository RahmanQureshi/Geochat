function User(name, position) {
	var timestamp = Date.now();
	// probably won't collide...
	this.uid = 'u'+Math.round(Math.random()*10000)+'t'+timestamp;
	this.name = name || "user_"+this.uid;
	// this.socket = socket;
	this.position = {};
	this.position.latitude = position.latitude;
	this.position.longitude = position.longitude;
	this.timestamp = timestamp;
	this.rid = '';
}

User.prototype.setRoom = function (room) {
	this.rid = room.rid;
};

User.prototype.setPosition = function (lat, lon) {
	this.position.latitude = lat;
	this.position.longitude = lon;
}

module.exports = User;