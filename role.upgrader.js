var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

    	if(Game.time%30 == 0)
		{
			if(creep.ticksToLive < 90 && creep.memory.inQueue == false)
			{
                creep.memory.inQueue = true
				Game.rooms[creep.memory.home].memory.spawnQueue += ("UP,");
			}
		}

        if(creep.memory.upgrading && creep.carry.energy == 0 || creep.memory.upgrading == undefined) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            const startCPU = Game.cpu.getUsed()
            if(creep.pos.inRangeTo(creep.room.controller, 3))
            {
                // console.log("running upgrade")
                creep.upgradeController(creep.room.controller)
            }
            else
            {
                // console.log("pathing")
                creep.travelTo(creep.room.controller);
                // console.log("Upgrading branch using " + (Game.cpu.getUsed() - startCPU) + " cpu time")
            }
            // if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            // }
            // console.log("Upgrading branch using " + (Game.cpu.getUsed() - startCPU) + " cpu time")
        }
        else {
            const startCPU = Game.cpu.getUsed()
            var energyCont = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (cont) => {
                    return (/*cont.structureType == STRUCTURE_EXTENSION ||*/
                            //cont.structureType == STRUCTURE_CONTAINER ||
                            cont.structureType == STRUCTURE_STORAGE
                    )// && cont.store[RESOURCE_ENERGY] > 0;
                }
            });
            if(energyCont == null || energyCont == undefined)
            {
                energyCont = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (cont) => {
                        return (
                                cont.structureType == STRUCTURE_CONTAINER
                        ) && cont.store[RESOURCE_ENERGY] > 0;
                    }
                });
            }
            // The above checks to see if there are storage or containers with energy stored
            //   below, check if they exist at all. If they don't then you can take from sources.
            //   but if they exist, then wait for them to be given energy as to not crowd the sources
            var energyStoresInRoom = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (cont) => {
                    return (
                        cont.structureType == STRUCTURE_CONTAINER ||
                        cont.structureType == STRUCTURE_STORAGE
                    )
                }
            });
            if(energyStoresInRoom == null || energyStoresInRoom == undefined)
            {
                var sources = creep.pos.findClosestByRange(FIND_SOURCES);
                if(creep.pos.inRangeTo(sources, 1))
                {
                    creep.harvest(sources)
                }
                else
                {
                    reep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                // if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                //     creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
                // }
            }
            // this else is if there are energy stores in the room, then use them
            else
            {
                if(creep.pos.inRangeTo(energyCont, 1))
                {
                    creep.withdraw(energyCont, RESOURCE_ENERGY)
                }
                else
                {
                    creep.moveTo(energyCont)
                }
                // if(creep.withdraw(energyCont, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                //     creep.moveTo(energyCont)
                // }
            }
            

            // I don't remember what this nearStorage and the following if do
            var nearStorage = (creeps) => {
                if(creeps == undefined || creeps.length == 0)
                {
                    return false
                }
                for(var i = 0; i < creeps.length; i++)
                {
                    if(creeps[i].creep.memory.role == 'baseManager')
                    {
                        return true
                    }
                }
                return false
            }
            if(creep.room.storage && !nearStorage(creep.room.lookForAtArea(LOOK_CREEPS, creep.room.storage.pos.y-1, creep.room.storage.pos.x-1, creep.room.storage.pos.y+1, creep.room.storage.pos.x+1, true)))
            {
                if(energyCont == null)
                {
                    energyCont = creep.room.find(FIND_SOURCES);
                    for(var i = 0; i < energyCont.length; i++)
                    {
                        if(creep.pos.getRangeTo(energyCont[i]) > 1 && creep.room.lookAtArea(energyCont[i].pos.y-1, energyCont[i].pos.x-1, energyCont[i].pos.y+1, energyCont[i].pos.x+1, true).length >= 10)
                        {
                            energyCont.shift()
                        }
                    }
                    if(creep.pos.inRangeTo(energyCont[0], 1))
                    {
                        creep.harvest(energyCont[0])
                    }
                    else
                    {
                        creep.travelTo(energyCont[0])
                    }
                    // if(creep.harvest(energyCont[0]) == ERR_NOT_IN_RANGE)
                    // {
                    //     creep.travelTo(energyCont[0]);
                    // }
                }



                if(creep.pos.inRangeTo(energyCont, 1))
                {
                    creep.withdraw(energyCont, RESOURCE_ENERGY)
                }
                else
                {
                    creep.travelTo(energyCont, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                // if(creep.withdraw(energyCont, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                //     creep.travelTo(energyCont, {visualizePathStyle: {stroke: '#ffaa00'}});
                // }
            }
            // console.log("Getting energy is using " + (Game.cpu.getUsed() - startCPU) + " cpu time")
        }
    }
};

module.exports = roleUpgrader;