function Message(sender, body) {
	// probably won't collide...
	var t = Date.now()
	this.mid = 'm'+Math.round(Math.random()*10000)+'t'+t;
	this.timestamp = t;
	this.sender = sender;
	this.body = body;
}

module.exports = Message;