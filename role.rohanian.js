var defender = {
	run: function(creep)
	{

		if(Game.time%30 == 0)
		{
			if(creep.ticksToLive < 90 && !creep.memory.inQueue)
			{
				Game.rooms[creep.memory.spawner].memory.spawnQueue += "RO"+creep.memory.home+",";
				creep.memory.inQueue = true;
			}
		}
		if(creep.hits < creep.hitsMax &&  !creep.memory.inQueue)
		{
			Game.rooms[creep.memory.home].memory.spawnQueue += (creep.memory.mark+"");
			creep.memory.inQueue = true;
		}
		if(creep.room.name == creep.memory.home)
		{
			// If creep is on edges
			if(creep.pos.x == 0)
			{
				creep.move(RIGHT)
			}
			else if(creep.pos.x == 49)
			{
				creep.move(LEFT)
			}
			else if(creep.pos.y == 0)
			{
				creep.move(BOTTOM)
			}
			else if(creep.pos.y == 49)
			{
				creep.move(TOP)
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
			if(Game.time % 150 == 0 || creep.memory.target == undefined)
			{
				// If there are enemy creeps, then defend the room
				var enemies = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
					filter: (crp) => {
						for(var name of whitelist)
						{
							if(name == crp.owner.username)
							{
								return false;
							}
						}
						return true;
					}
				});
				// add enemy structures to the enemies list
				var enemySpawns = (creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS, {
					filter: (spwn) => {
						for(var name of whitelist)
						{
							if(name == spwn.owner.username)
							{
								return false;
							}
						}
						return true
					}
				}))
				// Add enemy structures
				var enemyStructs = (creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
					filter: (spwn) => {
						for(var name of whitelist)
						{
							if(name == spwn.owner)
							{
								return false;
							}
						}
						return true
					}
				}))
				if(enemySpawns != null)
				{
					creep.memory.target = enemySpawns.id
				}
				else if(enemyStructs != null)
				{
					creep.memory.target = enemyStructs.id
				}
				else if(enemies != null)
				{
					creep.memory.target = enemies.id
				}
			}

			if(creep.memory.target != null)
			{
				var targ = Game.getObjectById(creep.memory.target)
				if(creep.attack(targ) == ERR_NOT_IN_RANGE)
				{
					creep.travelTo(targ)
				}
			}
			// if(enemies != null && enemies.length > 0)
			// {
			// 	if(creep.attack(enemies) == ERR_NOT_IN_RANGE)
			// 	{
			// 		creep.travelTo(enemies);
			// 	}
			// }
			// else if(enemieSpawns != null && enemieSpawns.length > 0)
			// {
			// 	if(creep.attack(enemieSpawns) == ERR_NOT_IN_RANGE)
			// 	{
			// 		creep.travelTo(enemieSpawns);
			// 	}
			// }
			// else if(enemieStructs != null && enemieStructs.length > 0)
			// {
			// 	console.log(enemieStructs)
			// 	if(creep.attack(enemieStructs) == ERR_NOT_IN_RANGE)
			// 	{
			// 		creep.travelTo(enemieStructs);
			// 	}
			// }
			// If there are no enemy creeps, patrol
			// else
			// {
			// 	var curX = creep.memory.patrolPoints[creep.memory.selector].x;
			// 	var curY = creep.memory.patrolPoints[creep.memory.selector].y;
			// 	// If the defender is at the next patrol point, change the patrol point
			// 	if(creep.pos.x == curX && creep.pos.y == curY)
			// 	{
			// 		if(creep.memory.selector+1 == creep.memory.patrolPoints.length)
			// 		{
			// 			creep.memory.selector = 0;
			// 		}
			// 		else
			// 		{
			// 			creep.memory.selector++;
			// 		}
			// 	}
			// 	// Otherwise, continue moving to the next patrol point
			// 	else
			// 	{
			// 		creep.travelTo(new RoomPosition(curX, curY, creep.memory.home));
			// 	}
			// }
		}
		else
		{
			creep.travelTo(new RoomPosition(25,25, creep.memory.home));
		}
	}
};

module.exports = defender;

const whitelist = ["Ed_"];