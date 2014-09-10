function Room(name, position, radius) {
	// probably won't collide...
	this.rid = 'r'+Math.round(Math.random()*10000)+'t'+Date.now();
	this.radius = radius;
	this.name = name || 'room_'+this.rid;
	this.position = position;
	this.messages = [];
	this.users=[];
}

Room.prototype.addUser = function (user) {
	console.log("Pushing user " + user.uid + " to room " + this.rid);
	this.users.push(user);
}

module.exports = Room;