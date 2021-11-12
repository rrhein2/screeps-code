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
		if(this.room.memory.recentlyAttacked)
		{
			if(this.room.find(FIND_HOSTILE_CREEPS).length == 0)
			{
				var rm = this.room
				poll = this.room.memory.backup
				var c = rm.find(FIND_MY_CREEPS);
				for(var i = 0; i < c.length; i++)
    			{
	    			if(c[i].memory.role == "harvester")
	    			{
	    				poll["HA"]--
	    			}
	    			else if(c[i].memory.role == "builder")
	    			{
	    				poll["BU"]--
	    			}
	    			else if(c[i].memory.role == "upgrader")
	    			{
	    				poll["UP"]--
	    			}
	    			else if(c[i].memory.role == "ferry")
	    			{
	    				poll["FE-1"]--
	    			}
	    			else if(c[i].memory.role == "stHarv")
	    			{
	    				poll["SH-1"]--
	    			}
	                else if(c[i].memory.role == "prot")
	                {
	                    poll["DF"]--
	                }
	                else if(c[i].memory.role == "wallE")
	                {
	                    poll["WE"]--
	                }
	                else if(c[i].memory.role == 'baseManager')
	                {
	                	poll['BM']--
	                }
    			}
    			for(type in poll)
    			{
    				for(var i = 0; i < poll[type]; i++)
    				{
    					this.room.memory.spawnQueue += (type + ",")
    				}
    			}
			}
			this.room.memory.recentlyAttacked = false
		}
		if(this.room.memory.spawnQueue == undefined)
		{
			this.room.memory.spawnQueue = "";
		}
		if(this.room.memory.spawnQueue.length > 1 && this.spawning == null)
		{
			var body = [];
			var queue = this.room.memory.spawnQueue;
	        var next = queue.substring(0, queue.indexOf(','));
	        if(next.substring(0, 2) == "SH")
	        {
	        	if(this.room.energyAvailable >= 550 && this.room.energyAvailable <= 750)
	        	{
	        		body = [MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY]
	        	}
	        	else if(this.room.energyAvailable >= 750)
	        	{
	        		body = [MOVE,MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY]	
	        	}
	        	// Not enough energy
	        	// else
	        	// {
	        	// 	var temp = queue.substring(queue.indexOf(',')+1)
	        	// 	this.room.memory.spawnQueue = temp + next + ","
	        	// 	return
	        	// }
	        	const name = "stHarv" + Game.time
	        	spawnACreep(this, queue, next, body, name, {memory:{role:'stHarv', srcID:next.substring(2), home:this.room.name, inQueue:false}}, true)
	            // if(this.spawnCreep(body, name, {memory:{role:'stHarv', srcID:next.substring(2), home:this.room.name, inQueue:false}}) == 0)
	            // {
	            //     // if it was spawned, remove from queue
	            //     Memory.myCreeps
	            //     this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	            //     fail = false
	            // }
	            // else
	            // {
	            // 	// IF the stationary harvester fails to spawn, send him to the end of the queue
	            // 	this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1) + next + ","
	            // }
	        }
	        else if(next.substring(0, 2) == 'FE')
	        {
	        	if(this.room.energyAvailable <= 200)
	        	{
	        		body = [MOVE, CARRY, CARRY];
	        	}
	        	else
	        	{
	        		for(var i = Math.min(Math.floor(this.room.energyAvailable/200),16); i > 0; i--)
	        		{
	        			body.push(MOVE);
	        			body.push(CARRY);
	        			body.push(CARRY);
	        		}
	        	}

	        	spawnACreep(this, queue, next, body, "ferry"+Game.time, {memory:{role:'ferry', contID:next.substring(2), home:this.room.name, inQueue:false}})
	            // if(this.spawnCreep(body, "ferry"+Game.time, {memory:{role:'ferry', contID:next.substring(2), home:this.room.name, inQueue:false}}) == 0)
	            // {
	            //     // if it was spawned, remove from queue
	            //     this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	            //     fail = false
	            // }
	        }
	        // Spawn Harvester Mark 0
	        else if(next.substring(0,  2) == "HA")
	        {
/*	        	
	        	// First, count  the number of Stationary Harvesters in the spawn queue
	        	var count = (str) => {
					const reg = /SH/g
					return ((str || '').match(reg) || []).length
				}
				var stHarvCount = 0 //count(this.room.memory.spawnQueue)
	        	// Then get the number that exist in the room
	        	var creeps = this.room.find(FIND_MY_CREEPS)
	        	for(var i = 0; i < creeps.length; i++)
	        	{
	        		if(creeps[i].role == "stHarv")
	        		{
	        			stHarvCount++;
	        		}
	        	}
	        	console.log(stHarvCount)
	        	// if there are less stharvs than sources and you have enoughe nergy to build a stHarv and a ferry
	        	// then build them
	        	if(stHarvCount < this.room.find(FIND_SOURCES).length && this.room.energyAvailable >= 550)
	        	{
	        		// Remove the harvester
	        		this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	        		// Add the stharv and ferry
	        		this.room.memory.spawnQueue = "SH-1,FE-1," + this.room.memory.spawnQueue
	        	}
	        	// If there are a correct number of stHarvs in the room, just ditch spawning the harvester
	        	else if(stHarvCount == this.room.find(FIND_SOURCES).length && this.room.energyAvailable > 300)
	        	{
	        		this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	        	}
*/	        	// Else just spawn the harvester
	        	// else
	        	// {
		        	if(this.room.energyAvailable <= 300)
		        	{
		        		body = [MOVE, WORK, CARRY];
		        	}
		        	else
		        	{
		        		for(var i = Math.min(Math.floor(this.room.energyAvailable/300), 12); i > 0; i--)
		        		{
		        			body.push(MOVE);
		        			body.push(MOVE);
		        			body.push(WORK);
		        			body.push(CARRY);
		        		}
		        	}

		        	spawnACreep(this, queue, next, body, "Harv_Mk.0-"+Game.time, {memory:{role:'harvester', home:this.room.name, inQueue:false}})
		        	// if(this.spawnCreep(body, "Harv_Mk.0-"+Game.time, {memory:{role:'harvester', home:this.room.name, inQueue:false}}) == 0)
		        	// {
		        	// 	this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
		        	// 	fail = false
		        	// }
		        // }
	        }
	        // Spawn Builder Mark 0
	        else if(next.substring(0, 2) == "BU")
	        {
	        	if(this.room.energyAvailable <= 300)
	        	{
	        		body.push(MOVE);
	        		body.push(WORK);
	        		body.push(CARRY);
	        	}
	        	else
	        	{
	        		for(var i = Math.min(Math.floor(this.room.energyAvailable/300), 16); i > 0; i--)
	        		{
	        			body.push(MOVE);
	        			body.push(WORK);
	        			body.push(CARRY);
	        			// body.push([MOVE, WORK, CARRY]);
	        		}
	        	}

	        	spawnACreep(this, queue, next, body, "Build_Mk.0-"+Game.time, {memory:{role:'builder', home:this.room.name, inQueue:false}})
	        	// if(this.spawnCreep(body, "Build_Mk.0-"+Game.time, {memory:{role:'builder', home:this.room.name, inQueue:false}}) == 0)
	        	// {
	        	// 	this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	        	// 	fail = false
	        	// }
	        }
	        else if(next.substring(0, 2) == "WE")
	        {
	        	var repairPerc = .2
	        	if(this.room.energyAvailable <= 300)
	        	{
	        		body.push(MOVE);
	        		body.push(WORK);
	        		body.push(CARRY);
	        	}
	        	else
	        	{
	        		for(var i = Math.min(Math.floor(this.room.energyAvailable/300), 16); i > 0; i--)
	        		{
	        			body.push(MOVE);
	        			body.push(WORK);
	        			body.push(CARRY);
	        			repairPerc += .1
	        			// body.push([MOVE, WORK, CARRY]);
	        		}
	        	}

	        	spawnACreep(this, queue, next, body, "WallE-"+Game.time, {memory:{role:'wallE', home:this.room.name, inQueue:false, hitsPercent:repairPerc, onlyRamparts:next.substring(2)}})
	        	// if(this.spawnCreep(body, "WallE-"+Game.time, {memory:{role:'wallE', home:this.room.name, inQueue:false, hitsPercent:repairPerc, onlyRamparts:next.substring(2)}}) == 0)
	        	// {
	        	// 	this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	        	// 	fail = false
	        	// }
	        }
	        // Spawn Upgrader Mark 0
	        else if(next.substring(0, 2) == "UP")
	        {
	        	if(this.room.energyAvailable <= 300)
	        	{
	        		body = [MOVE, WORK, CARRY];
	        	}
	        	else
	        	{
	        		for(var i = Math.min(Math.floor(this.room.energyAvailable/300), 16); i > 0; i--)
	        		{
	        			body.push(MOVE);
	        			body.push(WORK);
	        			body.push(CARRY);
	        		}
	        	}
	        	spawnACreep(this, queue, next, body, "Upgr_Mk.0-"+Game.time, {memory:{role:'upgrader', home:this.room.name, inQueue:false}})
	        	// if(this.spawnCreep(body, "Upgr_Mk.0-"+Game.time, {memory:{role:'upgrader', home:this.room.name, inQueue:false}}) == 0)
	        	// {
	        	// 	this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	        	// 	fail = false
	        	// }
	        }
	        // Spawn cartographer
	        else if(next.substring(0, 2) == "CT")
	        {

	        	spawnACreep(this, queue, next, [MOVE], "Cart-"+Game.time, {memory:{role:'cart', home:this.room.name, inSpawnQueue:false}})
	        	// if(this.spawnCreep([MOVE], "Cart-"+Game.time, {memory:{role:'cart', home:this.room.name, inSpawnQueue:false}}) == 0)
	        	// {
	        	// 	this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	        	// 	fail = false
	        	// }
	        }
	        // Spawn Defender Mark 0
	        else if(next.substring(0, 2) == "DF")
	        {
	        	if(this.room.energyAvailable <= 300)
	        	{
	        		body = [TOUGH, MOVE, MOVE, ATTACK];
	        	}
	        	else
	        	{
	        		for(var i = Math.min(Math.floor(this.room.energyAvailable/300), 12); i > 0; i--)
	        		{
	        			body.push(TOUGH);
	        			body.push(MOVE);
	        			body.push(MOVE);
	        			body.push(ATTACK);
	        		}
	        	}

	        	spawnACreep(this, queue, next, body, "Prot_Mk.0-"+Game.time, {memory:{role:'prot', selector:-1, home:this.room.name}})
	        	// if(this.spawnCreep(body, "Prot_Mk.0-"+Game.time, {memory:{role:'prot', selector:-1, home:this.room.name}}) == 0)
	        	// {
	        	// 	this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	        	// 	fail = false
	        	// }
	        }
	        else if(next.substring(0,2) == "RO")
	        {
	        	if(this.room.energyAvailable <= 300)
	        	{
	        		body = [TOUGH, MOVE, MOVE, ATTACK];
	        	}
	        	else
	        	{
	        		for(var i = Math.min(Math.floor(this.room.energyAvailable/300), 12); i > 0; i--)
	        		{
	        			body.push(TOUGH);
	        			body.push(MOVE);
	        			body.push(MOVE);
	        			body.push(ATTACK);
	        		}
	        	}

	        	spawnACreep(this, queue, next, body, "Rohanian-"+Game.time, {memory:{role:'rohanian', selector:-1, home:next.substring(2), spawner:this.room.name}})
	        	// if(this.spawnCreep(body, "Rohanian-"+Game.time, {memory:{role:'rohanian', selector:-1, home:next.substring(2), spawner:this.room.name}}) == 0)
	        	// {
	        	// 	this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	        	// 	fail = false
	        	// }
	        }
	        else if(next.substring(0, 2) == "RH")
	        {
	        	if(this.room.energyAvailable <= 400)
	        	{
	        		body = [MOVE, MOVE, WORK, CARRY, CARRY, CARRY];
	        	}
	        	else
	        	{
	        		for(var i = Math.min(Math.floor(this.room.energyAvailable/400), 8); i > 0; i--)
	        		{
	        			body.push(MOVE);
	        			body.push(MOVE)
	        			body.push(WORK);
	        			body.push(CARRY);
	        			body.push(CARRY);
	        			body.push(CARRY);
	        		}
	        	}

	        	spawnACreep(this, queue, next, body, "Rem-Hrv-Bas-"+Game.time, {memory:{role:'basicRemoteHarv', home:this.room.name, inQueue:false, harvestRoom:next.substring(2), transfers:0, spawnCost:calculateCost(body)}})
	        	// if(this.spawnCreep(body, "Rem-Hrv-Bas-"+Game.time, {memory:{role:'basicRemoteHarv', home:this.room.name, inQueue:false, harvestRoom:next.substring(2), transfers:0, spawnCost:calculateCost(body)}}) == 0)
	        	// {
	        	// 	this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	        	// 	fail = false
	        	// }
	        	// else
	        	// {
	        	// 	this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1) + next + ","
	        	// }
	        }
	        else if(next.substring(0, 2) == "CO")
	        {
	        	if(this.room.energyAvailable <= 500)
	        	{
	        		body = [MOVE, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY];
	        	}
	        	else
	        	{
	        		for(var i = Math.min(Math.floor(this.room.energyAvailable/500), 6); i > 0; i--)
	        		{
	        			body.push(MOVE);
	        			body.push(MOVE)
	        			body.push(MOVE)
	        			body.push(MOVE)
	        			body.push(WORK);
	        			body.push(CARRY);
	        			body.push(CARRY);
	        			body.push(CARRY);
	        		}
	        	}

	        	spawnACreep(this, queue, next, body, "Colonizer-"+Game.time, {memory:{role:'colonizer', home:this.room.name, inQueue:false, colonyRoom:next.substring(2)}}, true)
	    //     	if(this.spawnCreep(body, "Colonizer-"+Game.time, {memory:{role:'colonizer', home:this.room.name, inQueue:false, colonyRoom:next.substring(2)}}) == 0)
	    //     	{
	    //     		this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	    //     		fail = false
	    //     	}
	    //     	else
	    //     	{
					// this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1) + next + ","
	    //     	}
	        }
	        else if(next.substring(0, 2) == "BM")
	        {
        		for(var i = Math.min(Math.floor(this.room.energyAvailable/200), 16); i > 0; i--)
        		{
        			body.push(MOVE)
        			body.push(CARRY)
        			body.push(CARRY)

        		}

        		spawnACreep(this, queue, next, body, "BaseManager-"+Game.time, {memory:{role:'baseManager', home:this.room.name, inQueue:false, storID:next.substring(2), target:null}})
        		// if(this.spawnCreep(body, "BaseManager-"+Game.time, {memory:{role:'baseManager', home:this.room.name, inQueue:false, storID:next.substring(2), target:null}}) == 0)
        		// {
        		// 	this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1)
        		// 	fail = false
        		// }
	        }
	        else if(next.substring(0, 2) == "CL")
	        {
	        	if(this.room.energyAvailable >= 1000)
	        	{
		        	body.push(MOVE)
		        	body.push(MOVE)
		        	body.push(CLAIM)

		        	spawnACreep(this, queue, next, body, "Claimer-"+Game.time, {memory:{role:"claimer", home:this.room.name, inQueue:false, spawnTime:Game.time, colonyRoom:next.substring(2)}}, true)
		        	// if(this.spawnCreep(body, "Claimer-"+Game.time, {memory:{role:"claimer", home:this.room.name, inQueue:false, spawnTime:Game.time, colonyRoom:next.substring(2)}}) == 0)
		        	// {
		        	// 	this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1)
        			// 	fail = false
		        	// }
		        	// else
		        	// {
		        	// 	// If it fails, push it to the back of the queue to try again
		        	// 	this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1) + (next + ",")

		        	// }
		        }
	        }
	        else if(next.substring(0, 2) == "CP")
	        {
	        	for(var i = Math.min(Math.floor(this.room.energyAvailable/200), 16); i > 0; i--)
        		{
        			body.push(MOVE)
        			body.push(CARRY)
        			body.push(CARRY)

        		}

        		spawnACreep(this, queue, next, body, "CarePackage-"+Game.time, {memory:{role:'carePackage', home:this.room.name, storID:"", destRoom:next.substring(2)}})
        		// if(this.spawnCreep(body, "CarePackage-"+Game.time, {memory:{role:'carePackage', home:this.room.name, storID:"", destRoom:next.substring(2)}}) == 0)
        		// {
        		// 	this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1)
        		// 	fail = false
        		// }
	        }
	        if(fail)
	        {
	        	if(this.room.memory.lastFail == -1)
	        	{
	        		this.room.memory.lastFail = Game.time
	        	}
	        	else if(Game.time - this.room.memory.lastFail >= 800)
	        	{
	        		this.room.memory.spawnQueue = "HA,HA," + this.room.memory.spawnQueue
	        		this.room.memory.lastFail = -1
	        	}
	        }
	        else
	        {
	        	this.room.memory.lastFail = -1
	        }
		}
	}
