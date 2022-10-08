var creepBuilds = function(spawn, next)
{
	return {	"HA": 	{
						minThreshold: 300,
						minBody: [MOVE, WORK, CARRY],
						maxThreshold: 300,
						maxBody: [MOVE, MOVE, WORK, CARRY],
						maxCount: 12,
						memorySetup: {memory:{role:'harvester', home:spawn.room.name, inQueue:false}},
						name: "Harv_Mk-",
						sendToBack: false
					},
			"SH": 	{
						minThreshold: 550,
						minBody: [MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY],
						maxThreshold: 750,
						maxBody: [MOVE,MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY],
						maxCount: 1,
						memorySetup: {memory:{role:'stHarv', srcID:next.substring(2), home:spawn.room.name, inQueue:false}},
						name: "StHarv_Mk-",
						sendToBack: true
					},
			"FE": 	{
						minThreshold: 200,
						minBody: [MOVE, CARRY, CARRY],
						maxThreshold: 200,
						maxBody: [MOVE, CARRY, CARRY],
						maxCount: 16,
						memorySetup: {memory:{role:'ferry', contID:next.substring(2), home:spawn.room.name, inQueue:false}},
						name: "Ferry_Mk-",
						sendToBack: false
					},
			"BU": 	{
						minThreshold: 300,
						minBody: [MOVE, WORK, CARRY],
						maxThreshold: 300,
						maxBody: [MOVE, WORK, CARRY],
						maxCount: 16,
						memorySetup: {memory:{role:'builder', home:spawn.room.name, inQueue:false}},
						name: "Builder_Mk-",
						sendToBack: false
					},
			"UP": 	{
						minThreshold: 300,
						minBody: [MOVE, WORK, CARRY],
						maxThreshold: 300,
						maxBody: [MOVE, WORK, CARRY],
						maxCount: 16,
						memorySetup: {memory:{role:'upgrader', home:spawn.room.name, inQueue:false}},
						name: "Upgrader_Mk-",
						sendToBack: false
					},
			"CT": 	{
						minThreshold: 0,
						minBody: [MOVE],
						maxThreshold: 0,
						maxBody: [MOVE],
						maxCount: 1,
						memorySetup: {memory:{role:'cart', home:spawn.room.name, inSpawnQueue:false}},
						name: "Cartographer",
						sendToBack: false
					},
			"DF": 	{
						minThreshold: 300,
						minBody: [TOUGH, MOVE, MOVE, ATTACK],
						maxThreshold: 300,
						maxBody: [TOUGH, MOVE, MOVE, ATTACK],
						maxCount: 12,
						memorySetup: {memory:{role:'prot', selector:-1, home:spawn.room.name}},
						name: "Prot_Mk-",
						sendToBack: false
					},
			"RO": 	{
						minThreshold: 300,
						minBody: [TOUGH, MOVE, MOVE, ATTACK],
						maxThreshold: 300,
						maxBody: [TOUGH, MOVE, MOVE, ATTACK],
						maxCount: 12,
						memorySetup: {memory:{role:'rohanian', selector:-1, home:next.substring(2), spawner:spawn.room.name}},
						name: "Rohanian_Mk-",
						sendToBack: false
					},
			"RH": 	{
						minThreshold: 400,
						minBody: [MOVE, MOVE, WORK, CARRY, CARRY, CARRY],
						maxThreshold: 400,
						maxBody: [MOVE, MOVE, WORK, CARRY, CARRY, CARRY],
						maxCount: 8,
						memorySetup: {memory:{role:'basicRemoteHarv', home:spawn.room.name, inQueue:false, harvestRoom:next.substring(2), transfers:0, spawnCost:0}},
						name: "RemoteHarv_Mk-",
						sendToBack: false
					},
			"CO": 	{
						minThreshold: 500,
						minBody: [MOVE, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY],
						maxThreshold: 500,
						maxBody: [MOVE, MOVE, WORK, CARRY, CARRY, CARRY],
						maxCount: 6,
						memorySetup: {memory:{role:'colonizer', home:spawn.room.name, inQueue:false, colonyRoom:next.substring(2)}},
						name: "Colonizer_Mk-",
						sendToBack: true
					},
			"BM": 	{
						minThreshold: 200,
						minBody: [MOVE, CARRY, CARRY],
						maxThreshold: 200,
						maxBody: [MOVE, CARRY, CARRY],
						maxCount: 16,
						memorySetup: {memory:{role:'baseManager', home:spawn.room.name, inQueue:false, storID:next.substring(2), target:null}},
						name: "BaseManager_Mk-",
						sendToBack: false
					},
			"CL": 	{
						minThreshold: 1000,
						minBody: [MOVE, MOVE, CLAIM],
						maxThreshold: 1000,
						maxBody: [MOVE, MOVE, CLAIM],
						maxCount: 1,
						memorySetup: {memory:{role:"claimer", home:spawn.room.name, inQueue:false, spawnTime:Game.time, colonyRoom:next.substring(2)}},
						name: "Claimer-",
						sendToBack: true
					},
			"CP": 	{
						minThreshold: 200,
						minBody: [MOVE, CARRY, CARRY],
						maxThreshold: 200,
						maxBody: [MOVE, CARRY, CARRY],
						maxCount: 16,
						memorySetup: {memory:{role:'carePackage', home:spawn.room.name, storID:"", destRoom:next.substring(2)}},
						name: "CarePackage_Mk-",
						sendToBack: false
					},
		}
}

var memFunc = function(next, memorySetup)
{
	return memorySetup
}

var calculateCost =
	function(parts)
	{
		var BODYPART_COST = { "move": 50, "work": 100, "attack": 80, "carry": 50, "heal": 250, "ranged_attack": 150, "tough": 10, "claim": 600 }
		var cost = 0
		for(var part of parts)
		{
			cost += BODYPART_COST[part]
		}
		return cost
	}

var spawnACreep =
	function(spawner, queue, next, body, name, memory, sendToBack = false)
	{
		memory.memory.energyTallied = false
		memory.memory.netEnergy = 0 - calculateCost(body)
		if(spawner.spawnCreep(body, name, memory) == 0)
        {
        	// If the creep is baseManager, put it in the front of the myCreeps queue so that it runs before other creeps
            if(memory.memory.role == "baseManager")
            {
            	Memory.myCreeps = (name + ",") + Memory.myCreeps
            }
            // Else just throw it in, I can add more order later on if I really want to or need to
            else
            {
            	Memory.myCreeps += name + ","
            }

            // if it was spawned, remove from queue
            spawner.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
            fail = false
        }
        else if(sendToBack)
        {
        	// IF the stationary harvester fails to spawn, send him to the end of the queue
        	spawner.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1) + next + ","
        }	
	}

var spawnCreep =
	function(spawn, queue)
	{
		var next = queue.substring(0, queue.indexOf(','));
		var nextCreepID = next.substring(0, 2)
		var body = []
		var mkCount = 0
		var creepData = creepBuilds(spawn, next)[nextCreepID]

		// Room maxes data
		var maxCounts = spawn.room.memory.creepMaxes.split(",")
		var roomMax = 9999
		for(var maxCount of maxCounts)
		{
			var creepID = maxCount.substring(0, 2)
			var count = parseInt(maxCount.substring(2))
			if(creepID == nextCreepID)
			{
				roomMax = count
			}
		}
		// console.log(creepData.memorySetup.memory.role)

		// console.log(spawn.room.energyAvailable)
		// console.log(creepData.maxThreshold)
		// console.log()
		if(spawn.room.energyAvailable >= creepData.minThreshold && spawn.room.energyAvailable <= creepData.maxThreshold)
    	{
    		body = creepData.minBody
    	}
    	else if(spawn.room.energyAvailable >= creepData.maxThreshold)
    	{
    		var maxBody = creepData.maxBody
    		for(var i = Math.min(Math.floor(spawn.room.energyAvailable/creepData.maxThreshold), creepData.maxCount, roomMax); i > 0; i--)
    		{
    			mkCount++
    			for(var j = 0; j < maxBody.length; j++)
    			{
    				body.push(maxBody[j])
    			}
    		}	
    	}
    	const name = creepData.name + mkCount + "_" + Game.time
    	spawnACreep(spawn, queue, next, body, name, creepData.memorySetup, creepData.sendToBack)
	}


StructureSpawn.prototype.spawner =
	function()
	{

		var fail = true
		if(this.room.memory.spawnQueue == "" && this.room.find(FIND_MY_CREEPS).length > 0)
		{
			this.room.memory.lastFail = -1
		}
		if(this.room.memory.lastFail != -1)
		{
			// console.log(this.room.name + " is failing spawns")
		}
		if(this.room.memory.lastFail == undefined)
		{
			this.room.memory.lastFail = -1
		}
		// IF I have way too much energy and  still am  not max level, spawn some more upgraders
		if(this.room.storage != undefined)
		{
			var count = (str) => {
						const reg = /UP/g
						return ((str || '').match(reg) || []).length
					}
				var upgraderCount = this.room.find(FIND_MY_CREEPS, {
					filter: (crp) => {
						return(crp.memory.role == 'upgrader')
					}
				}).length + count(this.room.memory.spawnQueue)
			// if(this.room.storage.store[RESOURCE_ENERGY] > this.room.storage.store.getCapacity(RESOURCE_ENERGY)*.7 && this.room.controller.level < 8)
			// {
			// 	var optimalUpgraders = Math.floor((this.room.storage.store[RESOURCE_ENERGY]/(this.room.storage.store.getCapacity(RESOURCE_ENERGY)))*10)
			// 	if(upgraderCount < optimalUpgraders)
			// 	{
			// 		for(var i = 0; i < optimalUpgraders - upgraderCount; i++)
			// 		{
			// 			this.room.memory.spawnQueue += "UP,"
			// 		}
			// 	}
			// }
			// else if(this.room.storage.store[RESOURCE_ENERGY] <= this.room.storage.store.getCapacity(RESOURCE_ENERGY)/2 || this.room.controller.level == 8)
			// {
			// 	if(upgraderCount > 2)
			// 	{
			// 		var upgr = this.room.find(FIND_MY_CREEPS, {
			// 			filter: (crp) => {
			// 				return (crp.memory.role == 'upgrader')
			// 			}
			// 		})
			// 		for(var i = 0; i  < upgr.length-2; i++)
			// 		{
			// 			upgr[i].suicide()
			// 		}
			// 	}
			// }
		}
		if(this.room.controller.level == 8)
		{
			//  If I am level 8, mark the upgraders, except 1, for suicide
			var upgraders = this.room.find(FIND_MY_CREEPS, {
				filter: (creep) => {
					return (creep.memory.role == 'upgrader')
				}
			})
			for(var i = 0; i < upgraders.length-1; i++)
			{
				upgraders[i].suicide()
			}
		}
		// This should be the job of a room keeper that i will implement later
		// if(this.room.memory.recentlyAttacked)
		// {
		// 	if(this.room.find(FIND_HOSTILE_CREEPS).length == 0)
		// 	{
		// 		var rm = this.room
		// 		poll = this.room.memory.backup
		// 		var c = rm.find(FIND_MY_CREEPS);
		// 		for(var i = 0; i < c.length; i++)
  //   			{
	 //    			if(c[i].memory.role == "harvester")
	 //    			{
	 //    				poll["HA"]--
	 //    			}
	 //    			else if(c[i].memory.role == "builder")
	 //    			{
	 //    				poll["BU"]--
	 //    			}
	 //    			else if(c[i].memory.role == "upgrader")
	 //    			{
	 //    				poll["UP"]--
	 //    			}
	 //    			else if(c[i].memory.role == "ferry")
	 //    			{
	 //    				poll["FE-1"]--
	 //    			}
	 //    			else if(c[i].memory.role == "stHarv")
	 //    			{
	 //    				poll["SH-1"]--
	 //    			}
	 //                else if(c[i].memory.role == "prot")
	 //                {
	 //                    poll["DF"]--
	 //                }
	 //                else if(c[i].memory.role == "wallE")
	 //                {
	 //                    poll["WE"]--
	 //                }
	 //                else if(c[i].memory.role == 'baseManager')
	 //                {
	 //                	poll['BM']--
	 //                }
  //   			}
  //   			for(type in poll)
  //   			{
  //   				for(var i = 0; i < poll[type]; i++)
  //   				{
  //   					if(this.room.memory.wasEmergencyCalled == undefined)
  //   					{
  //   						this.room.wasEmergencyCalled = true
  //   					}
  //   					// this.room.memory.spawnQueue += (type + ",")
  //   				}
  //   			}
		// 	}
		// 	this.room.memory.recentlyAttacked = false
		// }
		if(this.room.memory.spawnQueue == undefined)
		{
			this.room.memory.spawnQueue = "";
		}
		if(this.room.memory.spawnQueue.length > 1 && this.spawning == null)
		{
			var body = [];
			var queue = this.room.memory.spawnQueue;
	        var next = queue.substring(0, queue.indexOf(','));
	        spawnCreep(this, queue)
	        if(fail)
	        {
	        	if(this.room.memory.lastFail == -1)
	        	{
	        		this.room.memory.lastFail = Game.time
	        	}
	        	else if(Game.time - this.room.memory.lastFail >= 800)
	        	{
	        		if(this.room.memory.attemptedFailRecovery == undefined || this.room.memory.attemptedFailRecovery == null)
	        		{
	        			this.room.memory.attemptedFailRecovery == 1
	        		}
	        		else
	        		{
	        			this.room.memory.attemptedFailRecovery++
	        		}
	        		// this.room.memory.spawnQueue = "HA,HA," + this.room.memory.spawnQueue
	        		this.room.memory.lastFail = -1
	        	}
	        }
	        else
	        {
	        	this.room.memory.lastFail = -1
	        }
		}
	}
