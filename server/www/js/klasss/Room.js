function Room(name, position, radius, socket) {
	// probably won't collide...
	this.rid = 'r'+Math.round(Math.random()*10000)+'t'+Date.now();
	this.name = name || 'room_'+this.rid;
	this.socket = socket;
	this.position = {};
	this.position.latitude = position.latitude;
	this.position.longitude = position.longitude;
	this.messages = [];
}

module.exports = Room;