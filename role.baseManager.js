var baseManager = {
	run: function(creep)
	{
		// Every 50 ticks check to see if the creep will die soon
		// If it will, then add it to the spawnQueue
		if(Game.time%30 == 0)
		{
			if(creep.ticksToLive < 90 && creep.memory.inQueue == false)
			{
				creep.memory.inQueue = true
				// I have base managers superseed the other spawns because of how important they are for allowing other creeps to spawn. They need high
				//   priority in case something happens
				Game.rooms[creep.memory.home].memory.spawnQueue = ("BM"+creep.memory.storID+",") + Game.rooms[creep.memory.home].memory.spawnQueue;
			}
			if(creep.ticksToLive < 31 && creep.memory.energyTallied == false)
            {
                creep.addEnergyAverage()
            }
		}


		if(creep.memory.storID == undefined || creep.memory.storID == null || creep.memory.storID == -1)
		{
			var stor = creep.room.find(FIND_STRUCTURES, {
				filter: (struct) => {
					return (struct.structureType == STRUCTURE_STORAGE)
				}
			})
			creep.memory.storID = stor[0].id
		}

		stor = Game.getObjectById(creep.memory.storID)
		targ = Game.getObjectById(creep.memory.target)

		if(!creep.memory.toStor && creep.store.energy == 0)
		{
			creep.memory.toStor = true;
			creep.memory.target = null
		}
		else if(creep.memory.toStor && creep.store.energy > 0 /* creep.store.getCapacity()*/)
		{
			creep.memory.toStor = false;
		}

		if(creep.memory.toStor)
		{
			// Get energy from container to bring to base
			if(creep.withdraw(stor, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
			{
				creep.travelTo(stor)
			}
		}
		else
		{
			// disperse energy to base
			if(creep.memory.target == undefined || creep.memory.target == null)
			{
				var targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
	                	filter: (structure) => {
	                    	return (structure.structureType == STRUCTURE_EXTENSION ||
	                        		structure.structureType == STRUCTURE_SPAWN ||
	                        		(
	                        			(
	                        				structure.structureType == STRUCTURE_TOWER && 
	                        				structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY)/4
	                        			)  ||
	                        			(
	                        				(
	                        					structure.structureType == STRUCTURE_TOWER && 
	                        					creep.room.energyAvailable == creep.room.energyCapacityAvailable
	                        				)
	                        			)
	                        		)
	                        	)
	                        	&& structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY);
	                }
	            });
	            if(targets != null)
	            {
	            	creep.memory.target = targets.id
	            	targ = Game.getObjectById(targets.id)
	            }
			}
			if(targ != null && targ.store[RESOURCE_ENERGY] == targ.store.getCapacity(RESOURCE_ENERGY))
         	{
         		// If the target is full of energy, make null to reassign a target
         		creep.memory.target = null
         	}
        	else if(targ != null && creep.memory.target != undefined) 
        	{
        		// otherwise, move to the target and transfer
            	if(creep.transfer(targ, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                	creep.travelTo(targ);
            	}
         	}
		}

	}
};

module.exports = baseManager;