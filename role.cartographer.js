var roleCartographer =
{
	run: function(creep)
	{
		// if(Game.time%30 == 0)
		// {
		// 	if(creep.ticksToLive < 90 && !creep.memory.inSpawnQueue)
		// 	{
		// 		Game.rooms[creep.memory.home].memory.spawnQueue += ("CT,");
		// 		creep.memory.inSpawnQueue = true;
		// 	}
		// }
		// else if(creep.room.memory.status == 'enemy' && !creep.memory.inSpawnQueue)
		// {
		// 	Game.rooms[creep.memory.home].memory.spawnQueue += ("CT,");
		// 	creep.memory.inSpawnQueue = true;
		// }
		var start = Game.cpu.getUsed()
		// If I don't have a destination room, or I am in it, then generate a new one
		if(creep.memory.destination == undefined)
		{
			creep.memory.destination = getDestination(creep);
			creep.memory.exitCoords = undefined;
		}
		else if(creep.room.name == creep.memory.destination)
		{
			creep.moveTo(25,25,creep.room.name);
			creep.room.explore();
			if(creep.room.memory.idealCenter == undefined)
			{
				creep.room.findCenter();
			}
			creep.room.scoreRoom()
			creep.memory.destination = getDestination(creep);
			creep.memory.exitCoords = undefined;
		}
		else
		{
			var start2 = Game.cpu.getUsed()
			if(creep.memory.exitCoords == undefined)
			{
				var coords = creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.destination))
				creep.memory.exitCoords = [coords.x, coords.y]
			}
			else if(creep.pos.x != creep.memory.exitCoords[0] || creep.pos.y != creep.memory.exitCoords[1])
			{
				creep.moveTo(creep.memory.exitCoords[0], creep.memory.exitCoords[1])
			}
			else
			{
				if(creep.pos.x == 0)
				{
					creep.move(LEFT)
				}	
				else if(creep.pos.x == 49)
				{
					creep.move(RIGHT)
				}
				else if(creep.pos.y == 0)
				{
					creep.move(TOP)
				}	
				else if(creep.pos.y == 49)
				{
					creep.move(BOTTOM)
				}
			}
		}



	}
}

// function formPath()

function getDestination(creep)
	{
		// Currently using greedy algorithm that allows for unknown rooms
		// to have the highest search value, and visited rooms are given
		// a search value based on the last time they were visited and
		// if they were or were not an enemy room
		var nextRoom = '';
		var highScore = -9999999;
		var tempScore = 0;
		var exits = Game.map.describeExits(creep.room.name);
		for(exit in exits)
		{

			// Reset temp score for each room
			tempScore = 0;
			if(Memory.rooms[exits[exit]] == undefined)
			{
				tempScore += 2000;
			}
			else
			{
				if(Memory.rooms[exits[exit]].status == 'mine')
				{
					tempScore += 0;
				}
				else if(Memory.rooms[exits[exit]].status == "explored")
				{
					tempScore -= 150
				}
				else
				{
					tempScore += 1900 - ((Memory.rooms[exits[exit]].searchTime - Game.time) >= 0 ? (Memory.rooms[exits[exit]].searchTime - Game.time) : 0);
					if(Memory.rooms[exits[exit]].status == 'enemy')
					{
						tempScore -= 300;
					}
				}
			}
			if(Game.map.getRoomStatus(exits[exit]).status != "normal")
			{
				tempScore = -3000;
			}
			if(tempScore > highScore)
			{
				nextRoom = exits[exit];
				highScore = tempScore;
			}
		}
		return nextRoom;
	}

module.exports = roleCartographer;

