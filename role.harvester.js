var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

    	if(Game.time%30 == 0)
		{
			if(creep.ticksToLive < 30)
			{
				creep.room.memory.spawnQueue += ("H0,");
			}
		}

        //console.log(!creep.memory.working + " and " + (creep.store.energy == creep.store.getCapacity()));
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
                        	structure.structureType == STRUCTURE_SPAWN ||
                        	structure.structureType == STRUCTURE_TOWER) && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY);
                	}
            	});
            	if(targets.length > 0) {
                	if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    	creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                	}
             	}
    		}
    	}
    	else
    	{
			var sources = creep.pos.findClosestByRange(FIND_SOURCES);
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
    	}
    }
}










/*
        if(creep.carry.energy < creep.carryCapacity && !creep.memory.full) {
            var sources = creep.pos.findClosestByRange(FIND_SOURCES);
            //console.log(sources);
            //var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            if(creep.carry.energy == creep.carryCapacity)
            {
                creep.memory.full = true;
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if(creep.carry.energy == 0)
                {
                    creep.memory.full = false;
                }
            }
            // Temporary code to convert to construction worker until I figure out a better way
            else// if(targets = creep.room.find(FIND_CONSTRUCTION_SITES) && targets.length)
            {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else
                {
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                if(creep.carry.energy == 0)
                {
                    creep.memory.full = false;
                }
            }
        }
    }
};
*/

module.exports = roleHarvester;