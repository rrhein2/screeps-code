var calculateCost =
    function(parts)
    {
        var BODYPART_COST = { "move": 50, "work": 100, "attack": 80, "carry": 50, "heal": 250, "ranged_attack": 150, "tough": 10, "claim": 600 }
        var cost = 0
        for(var part in parts)
        {
            cost += BODYPART_COST[parts[part].type]
        }
        return cost
    }

var basicRemoteHarv = {

    /** @param {Creep} creep **/
    run: function(creep) {
    	if(Game.time%30 == 0)
		{
			if(creep.ticksToLive < 90 && creep.memory.inQueue == false)
			{
                creep.memory.inQueue = true;
                if(Game.rooms[creep.memory.home].memory.remHarv == undefined || Game.rooms[creep.memory.home].memory.remHarv == null)
                {
                    Game.rooms[creep.memory.home].memory.remHarv = {}
                }
                if(Game.rooms[creep.memory.home].memory.remHarv[creep.memory.harvestRoom] == undefined || Game.rooms[creep.memory.home].memory.remHarv[creep.memory.harvestRoom] == null)
                {
                    Game.rooms[creep.memory.home].memory.remHarv[creep.memory.harvestRoom] = 0
                }
                if(creep.memory.spawnCost == 0)
                {
                    creep.memory.spawnCost = calculateCost(creep.body)
                }
                if(creep.memory.home == "W8N6")
                {
                    console.log("Inside rem harv")
                    console.log(creep.memory.transfers)
                    console.log(creep.memory.spawnCost)
                    console.log((creep.memory.transfers / creep.memory.spawnCost))
                }
                Game.rooms[creep.memory.home].memory.remHarv[creep.memory.harvestRoom] = (creep.memory.transfers / creep.memory.spawnCost)
				Game.rooms[creep.memory.home].memory.spawnQueue += ("RH"+creep.memory.harvestRoom+",");
			}

            if(creep.ticksToLive < 31 && creep.memory.energyTallied == false)
            {
                creep.addEnergyAverage()
            }
		}
        else if(creep.room.find(FIND_HOSTILE_CREEPS).length >= 1 && creep.memory.inQueue == false)
        {
            creep.memory.inQueue = true
            Game.rooms[creep.memory.home].memory.spawnQueue += ("RH"+creep.memory.harvestRoom+",");
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
            // This is for depositing energy
            if(creep.room.name != home.name)
            {
                // If creep isn't in home room. to deposit, move there
                creep.travelTo(new RoomPosition(25,25, home.name))
            }
            else
            {
                // If you are in the home room, deposit the energy
                resolveEdges(creep);
                var targetObj = null
                // If you have a target, determine if it is still valid
                if(creep.memory.target != null && creep.memory.target != undefined)
                {
                    targetObj = Game.getObjectById(creep.memory.target)
                    if(targetObj.store[RESOURCE_ENERGY] == targetObj.store.getCapacity(RESOURCE_ENERGY))
                    {
                        creep.memory.target = null
                    }

                }
                // If you have no target, find one
                if(creep.memory.target == null)
                {
        			var targets = home.find(FIND_STRUCTURES, {
                    	filter: (structure) => {
                        	return (structure.structureType == STRUCTURE_SPAWN ||
                            	//structure.structureType == STRUCTURE_TOWER ||
                                structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY);
                    	}
                	});
                    // If there are no spawns, towers, or storages in need of energy, give it to extensions
                    if(targets.length == 0)
                    {
                        targets = home.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_EXTENSION) && 
                                structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY)
                            }
                        })
                    }
                    // If there are none of the above, use the controller as the target
                    if(targets.length > 0)
                    {
                        creep.memory.isCont = false
                        creep.memory.target = targets[0].id
                    }
                    //  Otherwise, use controller
                    else
                    {
                        creep.memory.isCont = true
                    }
                }
                // Perform action on your target
            	if(!creep.memory.isCont) {
                    targetObj = Game.getObjectById(creep.memory.target)
                    if(creep.pos.inRangeTo(targetObj, 1))
                    {
                        if(creep.transfer(targetObj, RESOURCE_ENERGY) == 0)
                        {
                            creep.memory.transfers += creep.store.getCapacity()
                            creep.memory.netEnergy += creep.store.getCapacity()
                        }
                    }
                    else
                    {
                        creep.travelTo(targetObj)
                    }
                	// if(creep.transfer(targetObj, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                 //    	creep.travelTo(targetObj);
                	// }
             	}
                // If there is nothing else available, upgrade controller
                else
                {
                    targets = home.controller
                    if(creep.upgradeController(targets) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(targets)
                    }
                }
            }
    	}
    	else
    	{

            // Else, you are supposed to be getting energy
            var harvRoom = creep.memory.harvestRoom
            if(creep.room.name != harvRoom)
            {
                creep.travelTo(new RoomPosition(25,25, harvRoom))
            }
            else
            {
                resolveEdges(creep)
    			var sources = creep.pos.findClosestByRange(FIND_SOURCES);
                if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(sources);
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


module.exports = basicRemoteHarv;