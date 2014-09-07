function Room(name, position, radius) {
	// probably won't collide...
	this.rid = 'r'+Math.round(Math.random()*10000)+'t'+Date.now();
	this.radius = radius;
	this.name = name || 'room_'+this.rid;
	this.position = position;
	this.messages = [];
	this.users=[];
}

module.exports = Room;