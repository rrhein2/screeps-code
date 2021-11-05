var wallE = {
	run: function(creep)
	{
		if(Game.time % 30 == 0)
		{
			if(creep.ticksToLive < 30 && !creep.memory.inQueue)
			{
				if(creep.memory.onlyRamparts == undefined)
				{
					creep.memory.onlyRamparts = false
				}
				Game.rooms[creep.memory.home].memory.spawnQueue += "WE" + creep.memory.onlyRamparts + ",";
				creep.memory.inQueue = true;
			}
		}

		if((creep.memory.working && creep.carry.energy == 0) || creep.memory.working == undefined) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
            if(creep.memory.onlyRamparts)
            {
            	creep.memory.jobs = ""
            }
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('🚧 build');
        }

        if(creep.memory.working)
        {
        	// Here is where the creep repairs walls and ramparts

        	// add jobs to the creep's job queue
        	if(creep.memory.jobs == undefined || creep.memory.jobs == null || creep.memory.jobs == "")
        	{
        		// Queue up walls/ramparts to repair
        		creep.memory.jobs = ""
        		if(creep.memory.onlyRamparts == "false")
        		{
					var jobs = creep.room.find(FIND_STRUCTURES, {
						filter: (struct) => {
							return (struct.structureType == STRUCTURE_WALL ||
							 struct.structureType == STRUCTURE_RAMPART)
							&& struct.hits < (struct.hitsMax * Math.min(creep.memory.hitsPercent, 1));
						}
					})
					// before assigning 10, shuffle the whole arrayt to distribute jobs better
					var jobs2 = []
					var lowJobs = []
					for(var j in jobs)
					{
						jobs2.push(jobs[Math.floor(Math.random()*jobs.length)])
						if(jobs[j].hits < jobs[j].hitsMax * .002)
						{
							lowJobs.push(jobs[j])
						}
					}
					if(lowJobs.length > 0)
					{
						jobs = lowJobs
					}
					else
					{
						jobs = jobs2
					}
					for(var i = 0; i < Math.min(jobs.length, 10); i++)
					{
						creep.memory.jobs += jobs[i].id + ","
					}
				}
				else
				{
					var jobs = creep.room.find(FIND_STRUCTURES, {
						filter: (struct) => {
							return (struct.structureType == STRUCTURE_RAMPART/* &&
									struct.hits < struct.htisMax*/)
						}
					})
					var temp = null
					for(var i = 0; i < jobs.length; i++)
					{
						curLowest = i
						for(var j = i+1; j < jobs.length; j++)
						{
							if(jobs[j].hits < jobs[i].hits)
							{
								temp = jobs[j]
								jobs[j] = jobs[i]
								jobs[i] = temp
							}
						}
					}
					for(var i = 0; i < jobs.length; i++)
					{
						creep.memory.jobs += jobs[i].id + ","
					}
				}
        	}
        	else
        	{
        		// If there is no current job, or it has been completed, then get a new one
        		if(creep.memory.currentJob == undefined || creep.memory.currentJob == null || creep.memory.currentJob == "")
        		{
        			// shift top job to current job
        			creep.memory.currentJob = ""
        			creep.memory.currentJob = creep.memory.jobs.substring(0, creep.memory.jobs.indexOf(','))
        			// remove top job from queue
        			creep.memory.jobs = creep.memory.jobs.substring(creep.memory.jobs.indexOf(',')+1)
        		}
        		else
        		{
        			// If it has a current job, go repair it or move to it
        			var currentJob = Game.getObjectById(creep.memory.currentJob)
        			if(creep.repair(currentJob) == ERR_NOT_IN_RANGE)
        			{
        				creep.travelTo(currentJob)
        			}
        			if(currentJob.hits == currentJob.hitsMax)
        			{
        				currentJob = ""
        			}
        		}
        	}
        }
        else
        {
        	// wallE will only get energy from container and storage.  If neither are available, 
        	// there is a dire need for energy and walls can wait
        	var energyCont = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (cont) => {
                    return (//cont.structureType == STRUCTURE_CONTAINER ||
                            cont.structureType == STRUCTURE_STORAGE
                    	   ) && cont.store[RESOURCE_ENERGY] > creep.store.getCapacity()
                    		&& cont.store[RESOURCE_ENERGY] > 3000;
                }
            });
            if(creep.withdraw(energyCont, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.travelTo(energyCont, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
}

module.exports = wallE;