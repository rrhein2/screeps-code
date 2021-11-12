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

        if(creep.room.name == creep.memory.home && creep.store.energy != creep.store.getCapacity())
        {

            var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (cont) => {
                    return (cont.structureType == STRUCTURE_STORAGE)
                }
            });
            if(creep.pos.inRangeTo(storage, 1))
            {
                creep.withdraw(storage, RESOURCE_ENERGY)
            }
            else
            {
                creep.travelTo(storage)
            }
            return
        }

    	if((creep.memory.working && creep.store.energy == 0) || creep.room.name != creep.memory.colonyRoom)
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
                // If there is no spawn, find construction site to build
                var site = creep.room.find(FIND_CONSTRUCTION_SITES)
                creep.memory.site = site[0].id

            }
            else if(spawns.length < 1 && creep.memory.site)
            {
                // else if no spawn but there is a construction site in memory and build it
                var site = Game.getObjectById(creep.memory.site)
                if(creep.pos.inRangeTo(site, 1))
                {
                    creep.build(site)
                }
                else
                {
                    creep.travelTo(site)
                }
                // if(creep.build(site) == ERR_NOT_IN_RANGE)
                // {
                //     creep.travelTo(site)
                // }
            }
            else
            {
                // There is a spawn
                creep.memory.inQueue = true;
                if(creep.room.memory.spawnQueue == "")
                {
                    creep.room.memory.spawnQueue = "HA,HA,BU,BU,UP,UP,"
                }
                resolveEdges(creep);
    			var targets = creep.room.find(FIND_STRUCTURES, {
                	filter: (structure) => {
                    	return (structure.structureType == STRUCTURE_SPAWN) && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY);
                	}
            	});
            	if(targets.length > 0) {
                    if(creep.pos.inRangeTo(targets[0], 1))
                    {
                        creep.transfer(targets[0], RESOURCE_ENERGY)

                        // There's probably a better way of handling this, but that's for later me
                        creep.suicide()
                    }
                    else
                    {
                        creep.travelTo(targets[0])
                    }
                	// if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                 //    	creep.travelTo(targets[0]);
                	// }
             	}
                // If the spawn is full of energy, go build a construction site that may have popped up
                else
                {
                    var site = creep.room.find(FIND_CONSTRUCTION_SITES)
                    if(site.pos == undefined)
                    {
                        return
                    }
                    if(creep.pos.inRangeTo(site, 1))
                    {
                        creep.build(site)
                    }
                    else
                    {
                        creep.travelTo(site)
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
                // for(var i = 0; i < sources.length; i++)
                // {
                //     if(creep.pos.getRangeTo(sources[i]) > 1 && creep.room.lookAtArea(sources[i].pos.y-1, sources[i].pos.x-1, sources[i].pos.y+1, sources[i].pos.x+1, true).length >= 10)
                //     {
                //         sources.shift()
                //     }
                // }
                if(sources.length >= 1)
                {
                    var min = 9999
                    var index = -1

                    for(var source in sources)
                    {
                        var x = sources[source].pos.x
                        var y = sources[source].pos.y
                        var surroundings = sources[source].room.lookAtArea(y-1, x-1, y+1, x+1, true)
                        var score = 0
                        for(obj of surroundings)
                        {
                            if(obj['type'] == "creep") score++
                            if(obj['type'] == "terrain" && obj["terrain"] == "wall") score++
                        }

                        // console.log(sources[source].id)
                        // console.log(score)
                        if(score < min)
                        {
                            min = score
                            index = source
                        }


                        // var creeps = sources[source].pos.findInRange(FIND_CREEPS, 1)
                        // var walls = sources[source].pos.findInRange()
                        // if(creeps.length < min)
                        // {
                        //     min = creeps.length
                        //     index = source
                        // }
                    }

                    if(creep.pos.inRangeTo(sources[index], 1))
                    {
                        creep.harvest(sources[index])
                    }
                    else
                    {
                        creep.travelTo(sources[index])
                    }
                    // if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    //     creep.travelTo(sources[0]);
                    // }
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