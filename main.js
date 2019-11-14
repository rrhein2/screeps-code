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

    // if(Game.time%2000 != 0)
    // {
    //     for(var r in Game.rooms)
    //     {
    //         var room = Game.rooms[r];
    //         if(room.memory.area == undefined)
    //         {
    //             room.memory.area = [];
    //             var center = room.name;
    //             var WE = center[0];
    //             var NS = "";
    //             var WENum = -1;
    //             var NSNum = -1;
    //             for(var i = 1; i < center.length; i++)
    //             {
    //                 if(center.charCodeAt(i) >= 65 && center.charCodeAt(i) <= 122)
    //                 {
    //                     NS = center[i];
    //                     WENum = parseInt(center.substring(1, i),10);
    //                     NSNum = parseInt(center.substring(i+1, center.length),10);
    //                 }
    //             }
    //             WENum -= 5;
    //             NSNum -= 5;
    //             for(var i = 0; i < 11; i++)
    //             {
    //                 for(var j = 0; j < 11; j++)
    //                 {
    //                     if((WE+WENum+NS+NSNum).includes('-'))
    //                     {
    //                         continue;
    //                     }
    //                     room.memory.area.push(WE+WENum+NS+NSNum);
    //                     WENum++;
    //                 }
    //                 NSNum++;
    //                 WENum = 0;
    //             }
    //         }
    //     }
    // }

    // This went horribly wrong and kept adding tons of stationary harvesters.  Revisit later maybe,
    // but for now I'm swapping to the occasional polling and then refreshing to last polled state down below
    /*if(Game.time%100)
    {
    	// Check if every source has a statHarv, if not then add one to the spawn queue with that source ID
    	for(var r in  Memory.rooms)
    	{
    		for(var s in r.sources)
    		{
    			var stHarvs = r.find(FIND_MY_CREEPS, {
    				filter: (crp) => {
    					return (crp.memory.role == 'stHarv');
    				}
    			});
    			var used = false;
    			for(var c in stHarvs)
    			{
    				if(s.id == c.memory.srcID)
    				{
    					used = true;
    					break
    				}
    			}
    			if(!used)
    			{
    				r.memory.spawnQueue += "SH"+s.id+",";
    			}
    		}
    	}
    }*/

    // Poll the room to see what creeps are there and then store it in room memory
    if(Game.time%300 == 0)
    {
    	var poll = "";
    	for(var r in Game.rooms)
    	{
    		//console.log(Game.rooms[r].find(FIND_MY_CREEPS));
    		var c = Game.rooms[r].find(FIND_MY_CREEPS);
    		for(var i = 0; i < c.length; i++)
    		{
    			if(c[i].memory.role == "harvester")
    			{
    				poll += "H,";
    			}
    			else if(c[i].memory.role == "builder")
    			{
    				poll += "B,";
    			}
    			else if(c[i].memory.role == "upgrader")
    			{
    				poll += "U,";
    			}
    			else if(c[i].memory.role == "ferry")
    			{
    				poll += "F,";
    			}
    			else if(c[i].memory.role == "stHarv")
    			{
    				poll += "SH,";
    			}
    		}
    		Game.rooms[r].memory.backup = poll;
    		poll = "";
    	}
    }





  
    var  harvs = 0, upgrs = 0; buildrs = 0;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            //roleHarvester.run(creep);
            harvs = harvs+1;
        }
        if(creep.memory.role == 'upgrader') {
            //roleUpgrader.run(creep);
            upgrs = upgrs+1;
        }
        if(creep.memory.role == 'builder') {
            //roleBuilder.run(creep);
            buildrs = buildrs+1;
        }
        creep.runRole();
    }
    /*
    if(harvs < 1)
    {
        Game.spawns['Spawn1'].spawnCreep([MOVE, WORK,WORK, CARRY,CARRY], "harv"+Game.time, {memory:{role:'harvester'}})
    }
    if(Game.spawns['Spawn1'].room.memory.spawnQueue.length > 1)
    {
        var queue = Game.spawns['Spawn1'].room.memory.spawnQueue;
        var next = queue.substring(0, queue.indexOf(','));
        if(next.substring(0, 2) == "SH")
        {
            if(Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY], "stHarv"+Game.time, {memory:{role:'stHarv', srcID:next.substring(2)}}) == 0)
            {
                // if it was spawned, remove from queue
                Game.spawns['Spawn1'].room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
            }
        }
        else if(next.substring(0, 2) == 'FE')
        {
            if(Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], "ferry"+Game.time, {memory:{role:'ferry', contID:next.substring(2)}}) == 0)
            {
                // if it was spawned, remove from queue
                Game.spawns['Spawn1'].room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
            }
        }
    }
    if(upgrs < 2)
    {
        Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE,MOVE,MOVE,MOVE, WORK, WORK,WORK,WORK, CARRY, CARRY,CARRY,CARRY,CARRY,CARRY], "upgr"+Game.time, {memory:{role:'upgrader'}})
    }
    if(buildrs<2)
    {
        Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE, WORK,WORK, CARRY,CARRY], "buil"+Game.time, {memory:{role:'builder'}})
    }
    */
    for(var s in Game.spawns)
    {
    	var spawn = Game.spawns[s];
    	spawn.spawner();
    }
}