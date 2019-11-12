StructureSpawn.prototype.spawner =
	function()
	{
		if(this.room.memory.spawnQueue.length > 1)
		{
			var queue = this.room.memory.spawnQueue;
	        var next = queue.substring(0, queue.indexOf(','));
	        if(next.substring(0, 2) == "SH")
	        {
	            if(this.spawnCreep([MOVE,MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY], "stHarv"+Game.time, {memory:{role:'stHarv', srcID:next.substring(2), home:this.room}}) == 0)
	            {
	                // if it was spawned, remove from queue
	                this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	            }
	        }
	        else if(next.substring(0, 2) == 'FE')
	        {
	            if(this.spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], "ferry"+Game.time, {memory:{role:'ferry', contID:next.substring(2), home:this.room}}) == 0)
	            {
	                // if it was spawned, remove from queue
	                this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	            }
	        }
	        // Spawn Harvester Mark 0
	        else if(next.substring(0,  2) == "H0")
	        {
	        	if(this.spawnCreep([MOVE, WORK, CARRY], "Harv_Mk.0-"+Game.time, {memory:{role:'harvester', home:this.room}}) == 0)
	        	{
	        		this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	        	}
	        }
	        // Spawn Builder Mark 0
	        else if(next.substring(0, 2) == "B0")
	        {
	        	if(this.spawnCreep([MOVE, WORK, CARRY], "Build_Mk.0-"+Game.time, {memory:{role:'builder', home:this.room}}) == 0)
	        	{
	        		this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	        	}
	        }
	        // Spawn Upgrader Mark 0
	        else if(next.substring(0, 2) == "U0")
	        {
	        	if(this.spawnCreep([MOVE, WORK, CARRY], "Upgr_Mk.0-"+Game.time, {memory:{role:'upgrader', home:this.room}}) == 0)
	        	{
	        		this.room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
	        	}
	        }
		}
	}
