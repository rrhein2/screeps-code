var colonizer = {

    /** @param {Creep} creep **/
    run: function(creep) {

    	if(Game.time%30 == 0)
		{
			if(creep.ticksToLive < 90 && creep.memory.inQueue == false)
			{
                creep.memory.inQueue = true;
				Game.rooms[creep.memory.home].memory.spawnQueue += ("CO"+creep.memory.colonyRoom+",");
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

        var home = Game.rooms[creep.memory.home]
    	if(creep.memory.working)
    	{
            var spawns = creep.room.find(FIND_STRUCTURES, {
                filter: (spawn) => {
                    return(spawn.structureType == STRUCTURE_SPAWN)
                }
            })
            // This is for building the spawn
            if(spawns.length < 1 && creep.memory.site == undefined)
            {
                // If there is no spawn, build constructins ite
                var site = creep.room.find(FIND_CONSTRUCTION_SITES)
                creep.memory.site = site[0].id

            }
            else if(spawns.length < 1 && creep.memory.site)
            {
                // else if no spawn but there is a construction site in memory
                var site = Game.getObjectById(creep.memory.site)
                if(creep.build(site) == ERR_NOT_IN_RANGE)
                {
                    creep.travelTo(site)
                }
            }
            else
            {
                // There is a spawn
                creep.memory.inQueue = true;
                resolveEdges(creep);
    			var targets = creep.room.find(FIND_STRUCTURES, {
                	filter: (structure) => {
                    	return (structure.structureType == STRUCTURE_SPAWN) && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY);
                	}
            	});
            	if(targets.length > 0) {
                	if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    	creep.travelTo(targets[0]);
                	}
             	}
            }
    	}
    	else
    	{

            // Else, you are supposed to be getting energy
            var colonyRoom = creep.memory.colonyRoom
            if(creep.room.name != colonyRoom)
            {
                creep.travelTo(new RoomPosition(25,25, colonyRoom))
            }
            else
            {
                resolveEdges(creep)
    			var sources = creep.room.find(FIND_SOURCES);
                for(var i = 0; i < sources.length; i++)
                {
                    if(creep.pos.getRangeTo(sources[i]) > 1 && creep.room.lookAtArea(sources[i].pos.y-1, sources[i].pos.x-1, sources[i].pos.y+1, sources[i].pos.x+1, true).length >= 10)
                    {
                        sources.shift()
                    }
                }
                if(sources.length >= 1)
                {
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(sources[0]);
                    }
                }
            }
    	}
    }
}

function resolveEdges(creep)
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
}


module.exports = colonizer;