var ferry = {
	run: function(creep)
	{
		// Every 50 ticks check to see if the creep will die soon
		// If it will, then add it to the spawnQueue
		if(Game.time%50 == 0)
		{
			if(creep.ticksToLive <= 50)
			{
				creep.room.memory.spawnQueue += ("FE"+creep.memory.contID+",");
			}
		}

		if(creep.memory.contID == "-1" || creep.memory.contID == undefined)
		{
			var stHarv = creep.room.find(FIND_MY_CREEPS, {
				filter: (harvs) => {
					return(harvs.memory.role == "stHarv");
				}
			});
			var ferrys = creep.room.find(FIND_MY_CREEPS, {
				filter: (myCS) => {
					return (myCS.memory.role == "ferry");
				}
			});
			var used = false;

			for(var i = 0;  i < stHarv.length; i++)
			{
				for(var j = 0; j < ferrys.length; i++)
				{
					if(ferrys[j].memory.contID == stHarv[i].pos.findClosestByRange(FIND_MY_STRUCTURES, {
						filter: (conts) => {
							return (conts.structureType == STRUCTURE_CONTAINER);
						}
					}).id)
					{
						used = true;
						break;
					}
				}
				if(!used)
				{
					creep.memory.contID = stHarv[i].pos.findClosestByRange(FIND_MY_STRUCTURES, {
						filter: (conts) => {
							return (conts.structureType == STRUCTURE_CONTAINER);
						}
					}).id;
					break;
				}
			}
		}

		var cont = Game.getObjectById(creep.memory.contID);

		if(!creep.memory.toCont  && creep.store.energy == 0)
		{
			creep.memory.toCont = true;
		}
		else if(creep.memory.toCont && creep.store.energy == creep.store.getCapacity())
		{
			creep.memory.toCont = false;
		}

		if(creep.memory.toCont)
		{
			if(creep.withdraw(cont, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
			{
				creep.travelTo(cont)
			}
		}
		else
		{
			var targets = creep.room.find(FIND_STRUCTURES, {
                	filter: (structure) => {
                    	return (structure.structureType == STRUCTURE_EXTENSION ||
                        	structure.structureType == STRUCTURE_SPAWN ||
                        	structure.structureType == STRUCTURE_TOWER ||
                        	structure.structureType  == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY);
                }
            });
        	if(targets.length > 0) {
            	if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                	creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            	}
         	}
		}

	}
};

module.exports = ferry;