role = stationedHarvester = {
	run:  function(creep)
	{

		// Every 50 ticks, check if the ttl is < 50, if it is then queue a new spawn
		if(Game.time%50 == 0)
		{
			if(creep.ticksToLive <= 50)
			{
				creep.room.memory.spawnQueue += ("SH"+creep.memory.harvX+creep.memory.harvY+",");
			}
		}

		// If the stationedHarvester does not have preset coordinates to go to,
		// find some
		if(creep.memory.harvX != -1 && creep.memory.harvY != -1)
		{
			var sources = creep.room.find(FIND_SOURCES, {
				filter: (source) =>
				{
					return (source.memory.hasHarvester == false);
				}
			});

			if(var.length != 0)
			{
				creep.memory.harvX = sources[0].pos.x;
				creep.memory.harvY = sources[0].pos.y;
				sources[0].memory.hasharvester = true;
			}
			else
			{
				// TODO
				// code to find a source that has a container but no harvester
				// and go to the harvester
			}
		}

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
			// This could probably be made more effecient
			var container = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
				filter(structure) =>
				{
					return (structure.structureType == STRUCTURE_CONTAINER);
				}
			});
			if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
			{
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
            }
		}
		else
		{
			if(creep.harvest.(creep.room.lookAt(creep.memory.harvX, creep.memory.harvY)[0]) == ERR_NOT_IN_RANGE)
			{
				creep.travelTo(creep.room.getPositionAt(creep.memory.harvX, creep.memory.harvY));
			}
		}

	}
}

module.exports stationedHarvester;