StructureSpawn.prototype.spawner =
	function()
	{
		if(this.room.memory.spawnQueue.length > 1)
		{
			var body = [];
			var queue = this.room.memory.spawnQueue;
	        var next = queue.substring(0, queue.indexOf(','));
	        if(next.substring(0, 2) == "SH")
	        {
	            if(this.spawnCreep([MOVE,MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY], "stHarv"+Game.time, {memory:{role:'stHarv', srcID:next.substring(2), home:this.room.name, inQueue:false}}) == 0)
	            {
	                // if it was spawned, remove from queue
	                this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	            }
	        }
	        else if(next.substring(0, 2) == 'FE')
	        {
	        	if(this.room.energyAvailable <= 400)
	        	{
	        		body = [MOVE, MOVE, CARRY, CARRY];
	        	}
	        	else
	        	{
	        		for(var i = Math.floor(this.room.energyAvailable/200); i > 0; i--)
	        		{
	        			body.push(MOVE);
	        			body.push(MOVE);
	        			body.push(CARRY);
	        			body.push(CARRY);
	        		}
	        	}
	            if(this.spawnCreep(body, "ferry"+Game.time, {memory:{role:'ferry', contID:next.substring(2), home:this.room.name, inQueue:false}}) == 0)
	            {
	                // if it was spawned, remove from queue
	                this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	            }
	        }
	        // Spawn Harvester Mark 0
	        else if(next.substring(0,  2) == "HA")
	        {
	        	// First, count  the number of Stationary Harvesters in the spawn queue
	        	var stHarvCount = (this.room.memory.spawnQueue.match(/ a /g) || []).length;
	        	// Then get the number that exist in the room
	        	var creeps = this.room.find(FIND_MY_CREEPS)
	        	for(var i = 0; i < creeps.length; i++)
	        	{
	        		if(creeps[i].role == "stHarv")
	        		{
	        			stHarvCount++;
	        		}
	        	}
	        	// if there are less stharvs than sources and you have enoughe nergy to build a stHarv and a ferry
	        	// then build them
	        	if(stHarvCount < this.room.find(FIND_SOURCES).length && this.room.energyAvailable >= 1100)
	        	{
	        		// Remove the harvester
	        		this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	        		// Add the stharv and ferry
	        		this.room.memory.spawnQueue = "SH,FE," + this.room.memory.spawnQueue
	        	}
	        	// Else just spawn the harvester
	        	else
	        	{
		        	if(this.room.energyAvailable <= 400)
		        	{
		        		body = [MOVE, WORK, CARRY];
		        	}
		        	else
		        	{
		        		for(var i = Math.floor(this.room.energyAvailable/250); i > 0; i--)
		        		{
		        			body.push(MOVE);
		        			body.push(MOVE);
		        			body.push(WORK);
		        			body.push(CARRY);
		        		}
		        	}
		        	if(this.spawnCreep(body, "Harv_Mk.0-"+Game.time, {memory:{role:'harvester', home:this.room.name, inQueue:false}}) == 0)
		        	{
		        		this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
		        	}
		        }
	        }
	        // Spawn Builder Mark 0
	        else if(next.substring(0, 2) == "BU")
	        {
	        	if(this.room.energyAvailable <= 400)
	        	{
	        		body.push(MOVE);
	        		body.push(WORK);
	        		body.push(CARRY);
	        	}
	        	else
	        	{
	        		for(var i = Math.floor(this.room.energyAvailable/200); i > 0; i--)
	        		{
	        			body.push([MOVE, WORK, CARRY]);
	        		}
	        	}
	        	if(this.spawnCreep(body, "Build_Mk.0-"+Game.time, {memory:{role:'builder', home:this.room.name, inQueue:false}}) == 0)
	        	{
	        		this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	        	}
	        }
	        // Spawn Upgrader Mark 0
	        else if(next.substring(0, 2) == "UP")
	        {
	        	if(this.room.energyAvailable <= 400)
	        	{
	        		body = [MOVE, WORK, CARRY];
	        	}
	        	else
	        	{
	        		for(var i = Math.floor(this.room.energyAvailable/200); i > 0; i--)
	        		{
	        			body.push(MOVE);
	        			body.push(WORK);
	        			body.push(CARRY);
	        		}
	        	}
	        	if(this.spawnCreep(body, "Upgr_Mk.0-"+Game.time, {memory:{role:'upgrader', home:this.room.name, inQueue:false}}) == 0)
	        	{
	        		this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	        	}
	        }
	        // Spawn cartographer
	        else if(next.substring(0, 2) == "CT")
	        {
	        	if(this.spawnCreep([MOVE], "Cart-"+Game.time, {memory:{role:'cart', home:this.room.name, inSpawnQueue:false}}) == 0)
	        	{
	        		this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	        	}
	        }
	        // Spawn Defender Mark 0
	        else if(next.substring(0, 2) == "DF")
	        {
	        	if(this.room.energyAvailable <= 400)
	        	{
	        		body = [TOUGH, MOVE, MOVE, ATTACK];
	        	}
	        	else
	        	{
	        		for(var i = Math.floor(this.room.energyAvailable/200); i > 0; i--)
	        		{
	        			body.push(TOUGH);
	        			body.push(MOVE);
	        			body.push(MOVE);
	        			body.push(ATTACK);
	        		}
	        	}
	        	if(this.spawnCreep(body, "Prot_Mk.0-"+Game.time, {memory:{role:'prot', selector:-1, home:this.room.name}}) == 0)
	        	{
	        		this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	        	}
	        }
		}
	}
