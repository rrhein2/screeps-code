var carePackage = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.room.name == creep.memory.destRoom && creep.store.getUsedCapacity() == 0)
        {
            creep.suicide()
        }
        else if(!creep.memory.delivered && creep.carry.getUsedCapacity() != creep.carryCapacity)
        {
            if(creep.memory.storID == undefined || creep.memory.storID == "")
            {
                var storage = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE);
                    }
                })
                creep.memory.storID = storage[0].id
            }
            else
            {
                var storage = Game.getObjectById(creep.memory.storID)
                if(creep.pos.inRangeTo(storage, 1))
                {
                    creep.withdraw(storage, RESOURCE_ENERGY)
                    creep.memory.storID = undefined
                }
                else
                {
                    creep.travelTo(storage)
                }
            }
            // Return so that it doesn't continue to the traveling code until it reaches carry capacity
            return
        }

        if(creep.room.name != creep.memory.destRoom)
        {
            // If not in room go to destination room
            creep.travelTo(new RoomObject(25, 25, creep.memory.destRoom))
        }
        else
        {
            // If in the room, find storage and deposit energy
            resolveEdges(creep)
            if(creep.memory.storID == undefined)
            {
                var storage = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY);
                    }
                })
                creep.memory.storID = storage[0].id
            }
            else
            {
                // Move to storage and deposit energy, once empty then suicide
                var storage = Game.getObjectById(creep.memory.storID)
                if(creep.pos.inRangeTo(storage, 1))
                {
                    creep.transfer(storage, _.findKey(creep.store))
                }
                else
                {
                    creep.travelTo(storage)
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
        console.log(creep.move(TOP))
    }
}


module.exports = carePackage;