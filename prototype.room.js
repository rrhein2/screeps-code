Room.prototype.explore = 
	function() 
	{
		// If memory does not have a rooms value, create it
		if(Memory.rooms == undefined)
		{
			Memory.rooms = {};
		}
		// If rooms does not have this room as a value, create it
		if(Memory.rooms[this.name] == undefined)
		{
			Memory.rooms[this.name] = {};
		}

		// Get an array of varying objects in the room
		var sources = this.find(FIND_SOURCES);
		var enemyCreeps = this.find(FIND_HOSTILE_CREEPS);

		if(sources.length > 0)
		{
			if(Memory.rooms[this.name].sources == undefined)
			{
				Memory.rooms[this.name].sources = {};
				for(var src of sources)
				{
					Memory.rooms[this.name].sources[src.id] = {};
					Memory.rooms[this.name].sources[src.id].x = src.x;
					Memory.rooms[this.name].sources[src.id].y = src.y;
				}		
			}
		}
		// IF there is more than one enemy creep, mark as hostile room
		if(enemyCreeps.length > 1)
		{
			Memory.rooms[this.name].status = "enemy";
			Memory.rooms[this.name].searchTime = Game.time + 2000;
		}
		// If the controller doesn't exist, then mark it as explored
		else if(this.controller == undefined)
		{
			Memory.rooms[this.name].status = "explored";
			Memory.rooms[this.name].searchTime = Game.time + 1000;
		}
		// If the  controller is owned or is reserved and it isn't mine then it is an enemy
		else if(!this.controller.my && (this.controller.owner !=  undefined || this.controller.reserved  != undefined))
		{
			Memory.rooms[this.name].status = "enemy";
			Memory.rooms[this.name].searchTime = Game.time + 2000;
		}
		//  IF the room controller is unowned
		else if(this.controller.owner == undefined)
		{
			Memory.rooms[this.name].status = "empty";
			Memory.rooms[this.name].searchTime = Game.time + 500;
		}
		// If the room is owned by me
		else if(this.controller.my)
		{
			Memory.rooms[this.name].status = "mine";
			Memory.rooms[this.name].searchTime = -1;
		}
	};