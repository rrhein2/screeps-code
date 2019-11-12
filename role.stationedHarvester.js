var stationedHarvester = {
	run: function(creep)
	{
		// Every 50 ticks, check if the ttl is < 50, if it is then queue a new spawn
		if(Game.time%50 == 0)
		{
			if(creep.ticksToLive <= 70)
			{
				creep.room.memory.spawnQueue += ("SH"+creep.memory.srcID+",");
			}
		}

		// If the stationedHarvester does not have a source to go to,
		// find some
		if(creep.memory.srcID == -1 || creep.memory.srcID == undefined)
		{
			var sources = creep.room.find(FIND_SOURCES);
			var creeps = creep.room.find(FIND_MY_CREEPS, {
				filter: (cp) =>
				{
					return (cp.memory.role == "stHarv");
				}
			});
			var used = false;
			for(var i = 0; i < sources.length; i++)
			{
				for(var j = 0; j < creeps.length; j++)
				{
					// Check every statHarv to see if they are using this source
					if(creeps[j].memory.srcID == sources[i].id)
					{
						used = true;
						break;
					}
				}
				// If no statHarv is using the source, then assign this statHarv the source ID
				if(!used)
				{
					creep.memory.srcID = sources[i].id;
					break
				}
			}
		}

		// Create shortcut for source object
		var source = Game.getObjectById(creep.memory.srcID);
		


		if(creep.memory.working && creep.store.energy == 0)
    	{
    		creep.memory.working = false;
    	}
    	else if(!creep.memory.working && creep.store.energy == creep.store.getCapacity())
    	{
    		creep.memory.working = true;
    	}

		// Else it has the coordinates and can start moving there
		if(creep.memory.working)
		{
			// Get containers within 1 of the source
			var containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
				filter: (container) =>
				{
					return (container.structureType == STRUCTURE_CONTAINER);
				}
			});
			// If no container exists within 1 of source, create one where you are
			if(containers.length <= 0)
			{
				// TODO
				// Need to find a way to move it one away so that it can build its own container
				creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
				var cs = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 1);
				creep.build(cs);
			}
			// Else, put energy into container
			else
			{
				if(containers[0].hits < containers[0].hitsMax)
				{
					creep.repair(containers[0]);
				}
				else
				{
					if(creep.pos.x == containers[0].pos.x && creep.pos.y == containers[0].pos.y)
					{
						creep.transfer(containers[0], RESOURCE_ENERGY);
					}
					else
					{

						creep.travelTo(containers[0]);
					}
					// if(creep.transfer(containers[0], RESOURCE_ENERGY) != 0)
					// {
					// 	creep.travelTo(containers[0]);
					// }
				}
			}
		}
		else
		{
			if(creep.harvest(source) == ERR_NOT_IN_RANGE)
			{
				creep.travelTo(source);
			}
		}

	}
}

module.exports = stationedHarvester;