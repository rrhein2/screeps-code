//var roleHarvester = require('role.harvester');
//var roleUpgrader = require('role.upgrader');
//var roleBuilder = require('role.builder');

require('prototype.creep');
require('prototype.tower');
require('prototype.source');
require('prototype.spawn');
require('prototype.room');
require('Traveler')


module.exports.loop = function () {
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

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


    // Poll the room to see what creeps are there and then store it in room memory
    // also see if rcl  has upgraded
    if(Game.time%300 == 0)
    {
    	for(var r in Game.rooms)
    	{
            var poll = {"HA":0, "BU":0, "UP":0, "FE-1":0,  "SH-1":0, "DF":0, "WE":0, "BM":0};
            rm = Game.rooms[r]
    		var c = rm.find(FIND_MY_CREEPS);
    		// if(rm.controller.my && c.length <= 3)
    		// {
    		//     rm.memory.spawnQueue = "HA,HA,UP,BU,BM-1,"
      //           rm.memory.recentlyAttacked = false
    		// }
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

        for(var s in Game.spawns)
        {
            spwn = Game.spawns[s]
            if(spwn.room.memory.level == undefined)
            {
                spwn.room.memory.level = -1
            }
            // if(spwn.room.controller.level > spwn.room.memory.level)
            // {
            //     spwn.room.memory.level = spwn.room.controller.level;
            //     spwn.room.update();
            // }
        }
        for(var rm in Game.rooms)
        {
            var room = Game.rooms[rm]
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

            try
            {
                // This should spawn a cartographer every ~2 hours (7500 ticks) in rooms level 3 and higher
                if(Game.tiem % 2500 == 0 && room.memory.level >= 3)
                {
                    room.memory.spawnQueue += "CT-1,"
                }
            }
            catch 
            {
                console.log("FAILED TO SPAWN CARTOGRAPHER IN ROOM " + room.name)
            }
        }
    }

    // Every 20,000 ticks, reset the cpuUsage stats, so that the averages don't become so large that they can't be affected by changes
    if(Game.time % 20000 == 0)
    {
        for(var val in Memory.cpuUsage.creeps)
        {
            Memory.cpuUsage.creeps[val] = 0
        }
    }



  
    var  cart = 0;

    for(var name in Game.creeps) {
        const startCPU = Game.cpu.getUsed()

        var creep = Game.creeps[name];
        if(creep.memory.role == 'cart') {
            cart += 1;
        }
        creep.runRole();

        const used = Game.cpu.getUsed() - startCPU
        const prevAvg = Memory.cpuUsage.creeps[creep.memory.role]
        const count = Memory.cpuUsage.creeps[creep.memory.role + "Count"]

        Memory.cpuUsage.creeps[creep.memory.role] = prevAvg + ((used - prevAvg) / (count + 1))
        Memory.cpuUsage.creeps[creep.memory.role + "Count"] = count+1
    }
    

    for(var s in Game.spawns)
    {
    	var spawn = Game.spawns[s];
    	spawn.spawner();
    }

    const st = Game.cpu.getUsed()
    for (var s in Game.structures)
    {
        var structure = Game.structures[s]
        if(structure.structureType == STRUCTURE_ROAD)
        {
            structure.runRole()
        }
    }
    console.log(Game.cpu.getUsed())
}