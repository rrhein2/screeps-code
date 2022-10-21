var defender = {
	run: function(creep)
	{

		// General Respawn Code
		if(Game.time%30 == 0)
		{
			if(creep.ticksToLive < 90 && !creep.memory.inQueue)
			{
				Game.rooms[creep.memory.home].memory.spawnQueue += "RO"+creep.memory.defendRoom+",";
				creep.memory.inQueue = true;
			}
		}
		// If creep is damaged, queue it for respawn
		if(creep.hits < creep.hitsMax && !creep.memory.inQueue)
		{
			Game.rooms[creep.memory.home].memory.spawnQueue += (creep.memory.defendRoom+",");
			creep.memory.inQueue = true;
		}

		// If Rohanian is in the room it should be defending, start defense code
		if(creep.room.name == creep.memory.defendRoom)
		{
			// If creep is on edges, move clsoer to the center (helps prevent mapping/movement errors)
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

			// If no patrol points have been generated, generate them
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
			// TODO
			// find better CPU saver than only targeting something new every 150 ticks
			// TODO 
			// probably need target persistance as well, this might try and constantly retarget new targets during combat
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
		}
		else
		{
			creep.travelTo(new RoomPosition(25,25, creep.memory.defendRoom));
		}
	}
};

module.exports = defender;

const whitelist = ["Ed_"];