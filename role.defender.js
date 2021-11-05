var defender = {
	run: function(creep)
	{

		if(Game.time%30 == 0)
		{
			if(creep.ticksToLive < 90 && !creep.memory.inQueue)
			{
				Game.rooms[creep.memory.home].memory.spawnQueue += "DF,";
				creep.memory.inQueue = true;
			}
		}
		if(creep.hits < creep.hitsMax &&  !creep.memory.inQueue)
		{
			Game.rooms[creep.memory.home].memory.spawnQueue += "DF,";
			creep.memory.inQueue = true;
		}

		if(creep.memory.selector == -1)
		{
			creep.memory.patrolPoints = [];

			// first get the top exits
			var exits = creep.room.find(FIND_EXIT_TOP);
			var vals = 0;
			var placeHolder = 0;
			for(var i = 0; i < exits.length; i++)
			{
				if(i+1 < exits.length && exits[i].x+1 == exits[i+1].x)
				{
					vals += exits[i].x;
				}
				else
				{
					vals += exits[i].x;
					vals /= i+1 - placeHolder;
					placeHolder = i+1;
					creep.memory.patrolPoints.push({x:Math.floor(vals), y:1});
					vals = 0;
				}
			}

			exits = creep.room.find(FIND_EXIT_RIGHT);
			vals = 0;
			placeHolder = 0;
			for(var i = 0; i < exits.length; i++)
			{
				if(i+1 < exits.length && exits[i].y+1 == exits[i+1].y)
				{
					vals += exits[i].y;
				}
				else
				{
					vals += exits[i].y;
					vals /= i+1 - placeHolder;
					placeHolder = i+1;
					creep.memory.patrolPoints.push({x:48, y:Math.floor(vals)});
					vals = 0;
				}
			}

			exits = creep.room.find(FIND_EXIT_BOTTOM);
			vals = 0;
			placeHolder = 0;
			for(var i = 0; i < exits.length; i++)
			{
				if(i+1 < exits.length && exits[i].x+1 == exits[i+1].x)
				{
					vals += exits[i].x;
				}
				else
				{
					vals += exits[i].x;
					vals /= i+1 - placeHolder;
					placeHolder = i+1;
					creep.memory.patrolPoints.push({x:Math.floor(vals), y:48});
					vals = 0;
				}
			}

			exits = creep.room.find(FIND_EXIT_LEFT);
			vals = 0;
			placeHolder = 0;
			for(var i = 0; i < exits.length; i++)
			{
				if(i+1 < exits.length && exits[i].y+1 == exits[i+1].y)
				{
					vals += exits[i].y;
				}
				else
				{
					vals += exits[i].y;
					vals /= i+1 - placeHolder;
					placeHolder = i+1;
					creep.memory.patrolPoints.push({x:1, y:Math.floor(vals)});
					vals = 0;
				}
			}

			creep.memory.selector = 0;
		}

		// If there are enemy creeps, then defend the room
		var enemies = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if(enemies != null)
		{
			// Switch room's attacked state to true
			creep.room.memory.recentlyAttacked = true
			if(creep.attack(enemies) == ERR_NOT_IN_RANGE)
			{
				creep.travelTo(enemies);
			}
		}
		// If there are no enemy creeps, patrol
		else
		{
			var curX = creep.memory.patrolPoints[creep.memory.selector].x;
			var curY = creep.memory.patrolPoints[creep.memory.selector].y;
			// If the defender is at the next patrol point, change the patrol point
			if(creep.pos.x == curX && creep.pos.y == curY)
			{
				if(creep.memory.selector+1 == creep.memory.patrolPoints.length)
				{
					creep.memory.selector = 0;
				}
				else
				{
					creep.memory.selector++;
				}
			}
			// Otherwise, continue moving to the next patrol point
			else
			{
				creep.travelTo(new RoomPosition(curX, curY, creep.memory.home));
			}
		}
	}
};

module.exports = defender;

const whitelist = ["Ed_"];