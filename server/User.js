function User(name, position, socket) {
	// probably won't collide...
	var t = Date.now();
	this.uid = 'u'+Math.round(Math.random()*10000)+'t'+t;
	this.name = name || "user_"+this.uid
	this.rid = '';
	this.socket = socket;
	this.position = {};
	this.position.latitude = position.latitude;
	this.position.longitude = position.longitude;
	this.last_updated = t;
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