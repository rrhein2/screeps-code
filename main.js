//var roleHarvester = require('role.harvester');
//var roleUpgrader = require('role.upgrader');
//var roleBuilder = require('role.builder');

require('prototype.creep');
require('prototype.tower');
require('prototype.source');
require('prototype.spawn');
require('prototype.room');
require('Traveler')

function setupCoreMemory()
{
    Memory.cpuUsage = {}
    Memory.cpuUsage.creeps = []
    Memory.cpuUsage.creeps['harvester'] = 0
    Memory.cpuUsage.creeps['harvesterCount'] = 0
    Memory.cpuUsage.creeps['stationedHarvester'] = 0
    Memory.cpuUsage.creeps['stationedHarvesterCount'] = 0
    Memory.cpuUsage.creeps['ferry'] = 0
    Memory.cpuUsage.creeps['ferryCount'] = 0
    Memory.cpuUsage.creeps['builder'] = 0
    Memory.cpuUsage.creeps['builderCount'] = 0
    Memory.cpuUsage.creeps['upgrader'] = 0
    Memory.cpuUsage.creeps['upgraderCount'] = 0
    Memory.cpuUsage.creeps['cartographer'] = 0
    Memory.cpuUsage.creeps['cartographerCount'] = 0
    Memory.cpuUsage.creeps['defender'] = 0
    Memory.cpuUsage.creeps['defenderCount'] = 0
    Memory.cpuUsage.creeps['rohanian'] = 0
    Memory.cpuUsage.creeps['rohanianCount'] = 0
    Memory.cpuUsage.creeps['wallE'] = 0
    Memory.cpuUsage.creeps['wallECount'] = 0
    Memory.cpuUsage.creeps['basicRemoteHarv'] = 0
    Memory.cpuUsage.creeps['basicRemoteHarvCount'] = 0
    Memory.cpuUsage.creeps['colonizer'] = 0
    Memory.cpuUsage.creeps['colonizerCount'] = 0
    Memory.cpuUsage.creeps['baseManager'] = 0
    Memory.cpuUsage.creeps['baseManagerCount'] = 0
    Memory.cpuUsage.creeps['claimer'] = 0
    Memory.cpuUsage.creeps['claimerCount'] = 0
    Memory.cpuUsage.creeps['graverobber'] = 0
    Memory.cpuUsage.creeps['graverobberCount'] = 0
    Memory.cpuUsage.creeps['carePackage'] = 0
    Memory.cpuUsage.creeps['carePackageCount'] = 0

    Memory.coreMemorySetup = true
}

function runBackupStats()
{
    for(var r in Game.rooms)
    {
        var poll = {"HA":0, "BU":0, "UP":0, "FE-1":0,  "SH-1":0, "DF":0, "WE":0, "BM":0};
        rm = Game.rooms[r]
        var c = rm.find(FIND_MY_CREEPS);
        if(c.length > 4)
        {
            for(var i = 0; i < c.length; i++)
            {
                if(c[i].memory.role == "harvester")
                {
                    poll["HA"]++
                }
                else if(c[i].memory.role == "builder")
                {
                    poll["BU"]++
                }
                else if(c[i].memory.role == "upgrader")
                {
                    poll["UP"]++
                }
                else if(c[i].memory.role == "ferry")
                {
                    poll["FE-1"]++
                }
                else if(c[i].memory.role == "stHarv")
                {
                    poll["SH-1"]++
                }
                else if(c[i].memory.role == "prot")
                {
                    poll["DF"]++
                }
                else if(c[i].memory.role == "wallE")
                {
                    poll["WE"]++
                }
                else if(c[i].memory.role == "baseManager")
                {
                    poll['BM']++
                }
            }
            rm.memory.backup = poll;
        }
        else
        {
            rm.memory.recentlyAttacked = true
        }
    }
}

function roomDist(roomName1, roomName2, diagonal){
    if( roomName1 == roomName2 ) return 0;
    let posA = roomName1.split(/([N,E,S,W])/);
    let posB = roomName2.split(/([N,E,S,W])/);
    let xDif = posA[1] == posB[1] ? Math.abs(parseInt(posA[2], 10)-parseInt(posB[2], 10)) : parseInt(posA[2], 10)+parseInt(posB[2], 10)+1;
    let yDif = posA[3] == posB[3] ? Math.abs(parseInt(posA[4], 10)-parseInt(posB[4],10)) : parseInt(posA[4], 10)+parseInt(posB[4], 10)+1;
    if( diagonal ) return Math.max(xDif, yDif); // count diagonal as 1 
    return xDif + yDif; // count diagonal as 2 
}

function switchCard(card)
{
    if(card == "N") return "S"
    if(card == "S") return "N"
    if(card == "W") return "E"
    if(card == "E") return "W"
}

function roomsInRange(roomName, range, pastZero = true)
{
    let pos = roomName.split(/([N,E,S,W])/)
    let xLoc = parseInt(pos[2], 10)
    let yLoc = parseInt(pos[4], 10)
    var roomList = []
    for(var i = xLoc - range; i <= xLoc + range; i++)
    {
        if(i < 0)
        {
            if(pastZero) roomName2 = (switchCard(pos[1]) + Math.abs(i))
            else continue
        }
        else if(i > Game.map.getWorldSize() - 2) continue
        else
        {
            roomName2 = pos[1] + Math.abs(i)
        }

        for(var j = yLoc - range; j <= yLoc + range; j++)
        {
            roomName2 = roomName2.substring(0, 2)
            if(j < 0)
            {
                if(pastZero) roomName2 += (switchCard(pos[3]) + Math.abs(j))
                else continue
            }
            else if(j > Game.map.getWorldSize() - 2) continue
            else
            {
                roomName2 += pos[3] + Math.abs(j)
            }
            if(roomDist(roomName, roomName2) <= range)
            {
                roomList.push(roomName2)
            }
        }
    }

    return roomList
}

function runTowers()
{
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    for(let tower of towers)
    {
        try
        {
            tower.runRole();
        }
        catch(error)
        {
            console.log('tower: ' + tower.room.name + '; ' + tower.pos.x + ', ' + tower.pos.y + ' errored: '  + error);
        }
    }
}

function runRoomUpdates(room)
{
    try
    {
        if(room.memory.level == undefined)
        {
            room.memory.level = -1
        }
        if(room.controller.level  > room.memory.level)
        {
            room.memory.level = room.controller.level
            room.update()
        }
    }
    catch
    {
        console.log(room.name + " is throwing undefined level")
    }
}

function removeHarvesters(room)
{
    console.log("inside removeHarvesters")
    try
    {
        var harvesters = room.find(FIND_MY_CREEPS, {
            filter: (crp) => {
                return (crp.memory.role == "stHarv")
            }
        })
        var conts = room.find(FIND_MY_STRUCTURES, {
            filter: (struc) => {
                return (struc.structureType == STRUCTURE_CONTAINER)
            }
        })
        var sources = room.find(FIND_SOURCES)
        // There are enough stHarvs to match the sources AND they both have completed containers, get rid of the normal harvesters
        console.log(harvesters.length)
        console.log(sources.length)
        console.log(harvesters.length == sources.length && conts.length == sources.length)
        if(harvesters.length == sources.length && conts.length == sources.length)
        {
            var harvs = room.find(FIND_MY_CREEPS, {
                filter: (crp) => {
                    return (crp.memory.role == "harvester")
                }
            })
            for(var harv of harvs)
            {
                harv.suicide()
            }
        }
    }
    catch
    {
        console.log("Error removing the normal harvesters")
    }
}

function spawnCartographer(room)
{
    try
    {
        // This should spawn a cartographer every ~2 hours (7500 ticks) in rooms level 3 and higher
        if(Game.time % 2500 == 0 && room.memory.level >= 3)
        {
            room.memory.spawnQueue += "CT-1,"
        }
    }
    catch 
    {
        console.log("FAILED TO SPAWN CARTOGRAPHER IN ROOM " + room.name)
    }
}

function bestNearbyRoomForColonization(room, max, bestRoom, spawnRoom)
{
    try
    {
        var count = 0
        for(var rm in Game.rooms)
        {
            if(Game.rooms[rm].memory.status == "mine") count++
        }

        if(Game.gcl.level > count && room.controller.level >= 5 && room.energyAvailable > 1000)
        {
            var accessible = roomsInRange(rm, 4)
            if(accessible.length)
            {
            }
            for(var roomName of accessible)
            {
                if(Memory.rooms[roomName] == undefined)
                {
                    continue
                }
                if(Memory.rooms[roomName].status == "mine")
                {
                    continue
                }
                if(Memory.rooms[roomName])
                {
                    if(Memory.rooms[roomName].colonizationScore == undefined)
                    {
                    }
                    var score = Memory.rooms[roomName].colonizationScore
                    if(score > max)
                    {
                        max = score
                        bestRoom = roomName
                        spawnRoom = room
                    }
                }
            }
        }
        return {"max": max, "bestRoom":bestRoom, "spawnRoom": spawnRoom}
    }
    catch
    {
        console.log("Error occured trying to calculate the best room to colonize")
    }
}

function runRooms()
{
    var max = -9999
    var bestRoom = ""
    var spawnRoom = ""
    for(var rm in Game.rooms)
    {
        // Run updates on rooms and their levels
        var room = Game.rooms[rm]

        runRoomUpdates(room)

        removeHarvesters(room)

        spawnCartographer(room)

        room.balanceCreepEnergy()

        returnVal = bestNearbyRoomForColonization(room, max, bestRoom, spawnRoom)
        max = returnVal["max"]
        bestRoom = returnVal["bestRoom"]
        spawnRoom = returnVal["spawnRoom"]
    }

    // Finalize the spawning of a claimer, if a room was found
    if(bestRoom != "")
    {
        console.log("Best room is: " + bestRoom)
        // spawnRoom.memory.spawnQueue += "CL" + bestRoom + ","
    }
    else
    {
        console.log("no best room found")
    }
}

function runCreeps()
{
    for(var name in Game.creeps)
    {
        const startCPU = Game.cpu.getUsed()

        var creep = Game.creeps[name];
        creep.runRole();

        const used = Game.cpu.getUsed() - startCPU
        // if(used > 2)
        // {
        //     console.log(creep.memory.role + " is using more than 2 CPU")
        // }
        const prevAvg = Memory.cpuUsage.creeps[creep.memory.role]
        const count = Memory.cpuUsage.creeps[creep.memory.role + "Count"]

        Memory.cpuUsage.creeps[creep.memory.role] = prevAvg + ((used - prevAvg) / (count + 1))
        Memory.cpuUsage.creeps[creep.memory.role + "Count"] = count+1
    }
}

function runSpawns(spawnName)
{
    const startCPU = Game.cpu.getUsed()
    var spawn = Game.spawns[spawnName];
    try
    {
        spawn.spawner();
    }
    catch
    {
        console.log('here')
        if(Memory.rooms[spawn.room.name].memoryHasSetup == undefined)
        {
            spawn.room.setupMemory()
            Memory.rooms[spawn.room.name].memoryHasSetup = 1
        }
    }
    const used = Game.cpu.getUsed() - startCPU
    if(used > 1.5)
    {
        console.log(spawn.room + " has a spawner taking up more than 1.5 cpu")
    }
}

function runRoadCalcs()
{
    const startCPU = Game.cpu.getUsed()
    for(var rm in Game.rooms)
    {
        var room = Game.rooms[rm]
        var roads = room.find(FIND_STRUCTURES, {
            filter: (struct) => {
                return (struct.structureType == STRUCTURE_ROAD)
            }
        })
        for(rd in roads)
        {
            var road = roads[rd]
            if(road.hits <= road.hitsMax * .6 && !room.memory.repairQueue.includes(road.id))
            {
                console.log(road.id)
                room.memory.repairQueue += road.id + ","
            }
        }
    }
    const used = Game.cpu.getUsed() - startCPU
    if(used > 1.5)
    {
        console.log("Road calcs are taking more than 1.5 cpu to run")
    }
}


module.exports.loop = function () 
{
    if(Memory.coreMemorySetup == undefined)
    {
        setupCoreMemory()
    }

    if(!Memory.myCreeps)
    {
        Memory.myCreeps = ""
    }
    for(var i in Memory.creeps) 
    {
        if(!Game.creeps[i]) {
            Memory.myCreeps = Memory.myCreeps.replace(i + ",", "")
            delete Memory.creeps[i];
        }
    }

    for(var i of Memory.myCreeps.split(","))
    {
        if(i == "")
        {
            continue
        }
        if(!Game.creeps[i])
        {
            // console.log(i)
        }
    }
    // console.log()

    // Run every 300 ticks
    if(Game.time%300 == 0)
    {
    	runBackupStats()

        for(var s in Game.spawns)
        {
            spwn = Game.spawns[s]
            if(spwn.room.memory.level == undefined)
            {
                spwn.room.memory.level = -1
            }
        }

        runRooms()
    }

    // Approx. 13 creep generations
    if(Game.time % 20000 == 0)
    {
        // Every 20,000 ticks, reset the cpuUsage stats, so that the averages don't become so large that they can't be affected by changes
        for(var val in Memory.cpuUsage.creeps)
        {
            Memory.cpuUsage.creeps[val] = 0
        }

        // Reset the energyEffeciency stats so that they don't become so large that small changes stop affecting them
        for(var rm in Game.rooms)
        {
            var room = Game.rooms[rm]
            room.resetEnergyEffeciency()
        }
    }

  
    var  cart = 0;


    //====================================
    //       RUN ROLES EVERY TICK
    //====================================
    runTowers()

    runCreeps()
    

    for(var s in Game.spawns)
    {
        runSpawns(s)
    }

    


    //====================================
    //   RUN ROAD CALS EVEY 5000 TICKS
    //====================================
    if(Game.time % 5000 == 0)
    {
        runRoadCalcs()
    }
    // for (var s in Game.structures)
    // {
    //     var structure = Game.structures[s]
    //     if(structure.structureType == STRUCTURE_ROAD)
    //     {
    //         structure.runRole()
    //     }
    // }
    // console.log(Game.cpu.getUsed())
}