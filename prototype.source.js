Source.prototype.memory = undefined;

for(var roomName in Game.rooms)
{
	var room = Game.rooms[roomName];
	if(!room.memory.sources)
	{
		room.memory.sources = {};
		var sources = room.find(FIND_SOURCES);
		for(var  i in sources)
		{
			var source = sources[i];
			source.memory = room.memory.sources[source.id] = {}
			source.memory.hasHarvester = false;
		}
	}
	// else
	// {
	// 	var sources = room.find(FIND_SOURCES)
	// 	for(var i in sources)
	// 	{			
	// 		var source = sources[i];
	// 		source.memory = this.memory.sources[source.id];
	// 	}
	// }
}