var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
    	if(Game.time%30 == 0)
		{
			if(creep.ticksToLive < 90 && creep.memory.inQueue == false)
			{
                creep.memory.inQueue = true;
				Game.rooms[creep.memory.home].memory.spawnQueue += ("HA,");
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


    	if(creep.memory.working)
    	{
    		if(creep.room.energyAvailable == creep.room.energyCapacityAvailable)
    		{
    			if(creep.room.find(FIND_CONSTRUCTION_SITES).length > 0)
    			{
    				creep.runOtherRole('builder');
    			}
    			else
    			{
    				creep.runOtherRole('upgrader');
    			}
    		}
    		else
    		{
    			var targets = creep.room.find(FIND_STRUCTURES, {
                	filter: (structure) => {
                    	return (structure.structureType == STRUCTURE_EXTENSION ||
                        	structure.structureType == STRUCTURE_SPAWN) && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY);
                	}
            	});
                if(targets.length == 0)
                {
                    targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER ||
                                structure.structureType == STRUCTURE_STORAGE) && structure.store.getUsedCapacity() < structure.store.getCapacity()
                        }
                    })
                }
            	if(targets.length > 0) {
                	if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    	creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                	}
             	}
    		}
    	}
    	else
    	{
            // I need the filter to prevent THE COUNCIL
            var source2 = creep.pos.findClosestByRange(FIND_SOURCES)
			var source = creep.pos.findClosestByRange(FIND_SOURCES, {
                filter: (src) => {
                    return (src.room.name == creep.memory.home)
                }
            });
            if(creep.pos.inRangeTo(source, 1))
            {
                creep.harvest(source)
            }
            else
            {
                creep.travelTo(source)
                // creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}})
            }
            // if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            // }
    	}
    }
}

module.exports = roleHarvester;