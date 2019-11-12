var roleCartographer =
{
	run: function(creep)
	{
		// Add to spawn queue of home room
		if(Game.time%30 == 0)
		{
			if(creep.ticksToLive < 30)
			{
				Game.rooms[creep.memory.home].memory.spawnQueue += ("CT,");
			}
		}

		// Randomly choose an adjacent room if you don't have a destination
		if(creep.memory.destination == undefined || creep.memory.destination == creep.room.name)
		{
			var direction = Math.floor(Math.random()*4);
			creep.memory.destination = (direction == 0 ? "1" : (direction == 1 ? "3" : (direction == 2 ? "5" : (direction == 3 ? "7" : "-1"))));
		}
		if(creep.room.memory.searchTime == undefined || creep.room.memory.searchTime <= Game.time)
		{
			creep.room.explore();
		}
		else
		{
			creep.travelTo(creep.pos.findClosestByPath(creep.memory.destination));
		}

	}
}