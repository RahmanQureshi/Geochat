function Message(user, body, room) {
	// probably won't collide...
	var t = Date.now()
	this.mid = 'm'+Math.round(Math.random()*10000)+'t'+t;
	this.timestamp = t;
	this.sender = user.name;
	this.body = body;
	this.rid = room.rid;
}

module.exports = Message;