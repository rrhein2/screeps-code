var claimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(Game.time > creep.memory.spawnTime + 100 && creep.memory.inQueue == false)
        {
            for(var i = 0; i < 4; i++)
            {
                Game.rooms[creep.memory.home].memory.spawnQueue += "CO"+creep.memory.colonyRoom+","
            }
            creep.memory.inQueue = true
        }

        if(creep.room.name != creep.memory.colonyRoom)
        {
            // If not in room go to room
            creep.travelTo(new RoomObject(25, 25, creep.memory.colonyRoom))
        }
        else
        {
            // If in the room, move toward controller until you can claim it
            resolveEdges(creep)
            if(!creep.room.controller.my)
            {
                if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE)
                {
                    creep.travelTo(creep.room.controller)
                }
            }
            else if(!creep.memory.hasPlacedFlags)
            {
                // var center = creep.room.find(FIND_FLAGS, {
                //     filter: (flag) => {
                //         return (flag.name == "center-marker")
                //     }
                // })
                // creep.room.createConstructionSite(center.x+1, center.y-1, STRUCTURE_SPAWN, creep.room.name + "-Spawn1")
                var flagLoc = creep.room.memory.idealCenter
                creep.room.createFlag(flagLoc.x, flagLoc.y, creep.room.name + "-center")
                creep.room.createConstructionSite(flagLoc.x, flagLoc.y-1, STRUCTURE_SPAWN, creep.room.name + "-Spawn1")
                
                // Set up the room's memory structure
                creep.room.setupMemory()
                // creep.room.memory.status = "mine"
                // creep.room.memory.spawnQueue = ""
                // creep.room.memory.repairQueue = ""
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


module.exports = claimer;