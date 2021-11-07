var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

    	if(Game.time%30 == 0)
		{
			if(creep.ticksToLive < 90 && creep.memory.inQueue == false)
			{
                creep.memory.inQueue = true;
				Game.rooms[creep.memory.home].memory.spawnQueue += ("BU,");
			}
		}

        if((creep.memory.building && creep.carry.energy == 0) || creep.memory.building == undefined) {
            // Add reset for target after upgrading here because it wasn't working in the upgrading branch on bottom, this catches the energy == 0 before 
            //   the branch could
            if(creep.memory.mode == "u")
            {
                creep.memory.target = undefined
            }
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        
        if(creep.memory.building) 
        {
            var target
            if(creep.memory.target == undefined || creep.memory.target == null)
            {
                if(creep.room.memory.repairQueue.length > 0)
                {
                    target = creep.room.memory.repairQueue.substring(0, queue.indexOf(','))
                    creep.memory.mode = "r"
                }
                else
                {
                    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                    // If there are construction sites, then grab one to start building
                    if(targets.length)
                    {
                        target = targets[0].id
                        creep.memory.mode = "b"
                    }
                    // If there are no constructions ites, find a structure to repair
                    else
                    {
                        targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (conts) => {
                                return (conts.structureType == STRUCTURE_CONTAINER ||
                                        conts.structureType == STRUCTURE_EXTENSION ||
                                        conts.structureType == STRUCTURE_TOWER //||
                                        // conts.structureType == STRUCTURE_ROAD
                                    ) && conts.hits < conts.hitsMax;
                            }
                        });
                        // If there are structures to repair, use that as the target
                        if(targets.length)
                        {
                            target = targets[0].id
                            creep.memory.mode = "r"
                        }
                        // IF there are no repairs to be done, upgrade the controller
                        else
                        {
                            target = creep.room.controller.id
                            creep.memory.mode = "u"
                        }
                    }
                }
                creep.memory.target = target
            }
            else
            {
                target = creep.memory.target
            }

            var mode = creep.memory.mode
            var targetObj = Game.getObjectById(target)
            // If the mode is upgrade, move within 3 and upgrade the controller. Once the creep runs out of energy, unassign the target
            //   to reassess construction sites and repairs
            if(mode == "u")
            {
                if(creep.pos.inRangeTo(targetObj, 3))
                {
                    creep.upgradeController(targetObj)
                }
                else
                {
                    creep.travelTo(targetObj)
                }
            }
            // If the mode is repair or build, move to within 1 of the target, and then either repair or build the target
            else
            {
                // This is needed for the build mode. For some reason, putting the check inside the mode == 'b' case doesn't work
                if(targetObj == null || targetObj == undefined)
                {
                    creep.memory.target = undefined
                }
                else
                {
                    if(creep.pos.inRangeTo(targetObj, 1))
                    {
                        if(mode == 'r')
                        {
                            creep.repair(targetObj)
                            // If the target is repaired, find a new target
                            if(targetObj.hits == targetObj.hitsMax)
                            {
                                creep.memory.target = undefined
                            }
                        }
                        if(mode == 'b')
                        {
                            creep.build(targetObj)
                        }
                    }
                    else
                    {
                        creep.travelTo(targetObj)
                    }
                }
            }





            
            // var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            // var structures = creep.room.find(FIND_STRUCTURES, {
            //     filter: (conts) => {
            //         return (conts.structureType == STRUCTURE_CONTAINER ||
            //                 conts.structureType == STRUCTURE_EXTENSION ||
            //                 conts.structureType == STRUCTURE_TOWER //||
            //                 // conts.structureType == STRUCTURE_ROAD
            //             ) && conts.hits < conts.hitsMax;
            //     }
            // });
            // if(targets.length) {
            //     if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            //     }
            // }
            // // If not building, then repairing
            // else if(structures.length)
            // {
            //     if(creep.repair(structures[0]) == ERR_NOT_IN_RANGE)
            //     {
            //         creep.travelTo(structures[0]);
            //     }
            // }
            // // If not building, then upgrading
            // // else if(creep.room.find(FIND_TOMBSTONES).length > 0)
            // // {
            // //     creep.runOtherRole('graverobber')
            // // }
            // else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            // }
        }
        else {
            var energyCont = creep.pos.findClosestByRange(FIND_STRUCTURES, {
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
                if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            // this else is if there are energy stores in the room, then use them
            else
            {
                if(creep.withdraw(energyCont, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energyCont)
                }
            }


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
            // I don't remember what this does
            if(creep.room.storage && !nearStorage(creep.room.lookForAtArea(LOOK_CREEPS, creep.room.storage.pos.y-1, creep.room.storage.pos.x-1, creep.room.storage.pos.y+1, creep.room.storage.pos.x+1, true)))
            {
                if(creep.withdraw(energyCont, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energyCont, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                else if(energyCont == null)
                {
                    energyCont = creep.room.find(FIND_SOURCES);
                    for(var i = 0; i < energyCont.length; i++)
                    {
                        if(creep.pos.getRangeTo(energyCont[i]) > 1 && creep.room.lookAtArea(energyCont[i].pos.y-1, energyCont[i].pos.x-1, energyCont[i].pos.y+1, energyCont[i].pos.x+1, true).length >= 10)
                        {
                            energyCont.shift()
                        }
                    }
                    if(energyCont.length >= 1)
                    {
                        if(creep.harvest(energyCont[0]) == ERR_NOT_IN_RANGE)
                        {
                            creep.travelTo(energyCont[0]);
                        }
                    }
                    else
                    {
                        creep.travelTo(creep.room.controller)
                    }
                }
            }
        }
    }
};

module.exports = roleBuilder;