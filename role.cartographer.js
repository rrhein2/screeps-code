var roleCartographer =
{
	run: function(creep)
	{
		// Add to spawn queue of home room
		// if(creep.hits < creep.hitsMax)
		// {
		// 	console.log("inside suicide pact");
		// 	Game.rooms[creep.memory.home].memory.spawnQueue += ("CT,");
		// 	creep.suicide();
		// }
		// if(Game.time%30 == 0)
		// {
		// 	if(creep.ticksToLive < 30)
		// 	{
		// 		Game.rooms[creep.memory.home].memory.spawnQueue += ("CT,");
		// 	}
		// }
		// Randomly choose an adjacent room if you don't have a destination
		if(creep.memory.destination == undefined || creep.memory.destination == creep.room.name)
		{
			creep.moveTo(25,25);
			// Memory.rooms[creep.memory.home].area.push(creep.memory.destination);
			// creep.memory.destination = Memory.rooms[creep.memory.home].area.shift();
			
			// var direction = Math.floor(Math.random()*4);
			// creep.memory.destination = (direction == 0 ? "1" : (direction == 1 ? "3" : (direction == 2 ? "5" : (direction == 3 ? "7" : "-1"))));
			// creep.memory.destination = Game.map.describeExits(creep.room.name)[creep.memory.destination];
		}
		if(creep.room.memory.searchTime == undefined || (creep.room.memory.searchTime <= Game.time && creep.room.memory.searchTime != -1))
		{
			console.log('here');
			creep.room.explore();
		}
		else
		{
			creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.destination)));
			//console.log(creep.room.findExitTo(creep.memory.destination));
		}

	}
}

module.exports = roleCartographer;