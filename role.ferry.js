var ferry = {
	run: function(creep)
	{
		// Every 50 ticks check to see if the creep will die soon
		// If it will, then add it to the spawnQueue
		if(Game.time%30 == 0)
		{
			if(creep.ticksToLive < 90 && creep.memory.inQueue == false)
			{
				creep.memory.inQueue = true
				Game.rooms[creep.memory.home].memory.spawnQueue += ("FE"+creep.memory.contID+",");
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
				used = false
				for(var j = 0; j < ferrys.length; j++)
				{
					if(ferrys[j].memory.contID == stHarv[i].pos.findClosestByRange(FIND_STRUCTURES, {
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
					creep.memory.contID = stHarv[i].pos.findClosestByRange(FIND_STRUCTURES, {
						filter: (conts) => {
							return (conts.structureType == STRUCTURE_CONTAINER);
						}
					}).id;
					break;
				}
			}
		}

		var cont = Game.getObjectById(creep.memory.contID);
		// if(creep.name == "ferry7777")
		// {
		// 	console.log(creep.memory.toCont)
		// }
		if(!creep.memory.toCont  && creep.store.getUsedCapacity() == 0)
		{
			creep.memory.toCont = true;
			creep.memory.target = null
		}
		else if(creep.memory.toCont && creep.store.getUsedCapacity() >= 1)
		{
			creep.memory.toCont = false;
		}
		if(creep.memory.toCont)
		{
			// Get energy from container to bring to base
			if(creep.room.find(FIND_TOMBSTONES, {filter: (tomb) => {return tomb.store.getUsedCapacity() > 0}}).length > 0)
			{
				creep.runOtherRole('graverobber')
			}
			else if(creep.withdraw(cont, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
			{
				creep.travelTo(cont)
			}
		}
		else
		{
			// disperse energy to base
			if(creep.memory.target == undefined || creep.memory.target == null)
			{
				var targets = creep.room.find(FIND_STRUCTURES, {
	                	filter: (structure) => {
	                    	return (//structure.structureType == STRUCTURE_EXTENSION ||
	                        	// structure.structureType == STRUCTURE_SPAWN ||
	                        	// structure.structureType == STRUCTURE_TOWER ||
	                        	structure.structureType  == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY);
	                }
	            });
	            if(targets.length == 0)
	            {
	            	targets = creep.room.find(FIND_STRUCTURES, {
	                	filter: (structure) => {
	                    	return (structure.structureType == STRUCTURE_EXTENSION ||
	                        	structure.structureType == STRUCTURE_SPAWN ||
	                        	structure.structureType == STRUCTURE_TOWER) && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY);
		                }
		            });
	            }
	            if(targets.length != 0)
	            {
	            	creep.memory.target = targets[0].id
	            }
	            else
	            {
	            	creep.memory.target = null
	            	return
	            }
			}
			if(Game.getObjectById(creep.memory.target).store[RESOURCE_ENERGY] == Game.getObjectById(creep.memory.target).store.getCapacity(RESOURCE_ENERGY))
         	{
         		// If the target is full of energy, make null to reassign a target
         		creep.memory.target = null
         	}
        	else if(creep.memory.target != undefined) 
        	{
        		// otherwise, move to the target and transfer
        		var targ = Game.getObjectById(creep.memory.target)
        		if(targ.structureType != STRUCTURE_STORAGE)
        		{
	            	if(creep.transfer(targ, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                	creep.travelTo(targ, {visualizePathStyle: {stroke: '#ffffff'}});
	            	}
	            }
	            else
	            {
	            	if(creep.transfer(targ, _.findKey(creep.store)) == ERR_NOT_IN_RANGE) {
	                	creep.travelTo(targ, {visualizePathStyle: {stroke: '#ffffff'}});
	            	}
	            }
         	}
         	else
         	{
         		// else,  transfer to storage
         	    targets = creep.room.find(FIND_STRUCTURES, {
         	        filter: (structure) => {
         	            return (structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY);
         	        }
         	    });
         	    if(targets.length > 0){
         	        if(creep.transfer(targets[0], _.findKey(creep.store)) == ERR_NOT_IN_RANGE){
         	            creep.travelTo(targets[0]);
         	        }
         	    }
         	}
		}

	}
};

module.exports = ferry;