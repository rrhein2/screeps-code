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
			Memory.rooms[this.name].searchTime = Game.time + 3000;
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

Room.prototype.update = 
	function()
	{
		// Increase in extensions
		var ext = 0
		var tow = 0
		var sto = 0
		for(f of this.find(FIND_FLAGS))
		{
			var name = f.name
			if(name.includes("Build:"))
			{
				if(name.includes("extension") && ext < extensionIncreases[this.memory.level])
				{
					ext++
					this.createConstructionSite(f.pos, STRUCTURE_EXTENSION)
					f.remove()
				}
				else if(name.includes("tower") && tow < towerIncreases[this.memory.level])
				{
					tow++
					this.createConstructionSite(f.pos, STRUCTURE_TOWER)
					f.remove()
				}
				else if(name.includes('storage') && sto < storageIncreases[this.memory.level])
				{
					sto++
					this.createConstructionSite(f.pos, STRUCTURE_STORAGE)
					f.remove()
				}
			}
		}
		var center = this.find(FIND_FLAGS, {
			filter: (flag) => {
				return flag.name.includes('center')
			}
		})[0]

		if(center == null || center == undefined)
		{
			return
		}
		else
		{
			var level = levels[this.memory.level]
			for(var i = 0; i < Object.keys(level).length; i++)
			{
				var keys = Object.keys(level)
				for(var j = 0; j < keys.length; j++)
				{
					if(keys[j] == 'extension')
					{
						for(var k = 1; k <= Object.keys(level['extension']).length; k++)
						{
							this.createConstructionSite(center.pos.x + level['extension'][k]["x"], center.pos.y + level['extension'][k]['y'], STRUCTURE_EXTENSION)
						}
					}
					else if(keys[j] == 'tower')
					{
						for(var k = 1; k <= Object.keys(level['tower']).length; k++)
						{
							this.createConstructionSite(center.pos.x + level['tower'][k]["x"], center.pos.y + level['tower'][k]['y'], STRUCTURE_TOWER)
						}
					}
					else if(keys[j] == 'storage')
					{
						for(var k = 1; k <= Object.keys(level['storage']).length; k++)
						{
							this.createConstructionSite(center.pos.x + level['storage'][k]["x"], center.pos.y + level['storage'][k]['y'], STRUCTURE_STORAGE)
						}
					}
					else if(keys[j] == 'road')
					{
						for(var k = 1; k <= Object.keys(level['road']).length; k++)
						{
							this.createConstructionSite(center.pos.x + level['road'][k]["x"], center.pos.y + level['road'][k]['y'], STRUCTURE_ROAD)
						}
					}
					else if(keys[j] == 'creeps')
					{
						for(var k = 1; k < Object.keys(level['creeps']).length; k++)
						{
							this.memory.spawnQueue += level['creeps'][k]
						}
					}
					// else if(keys[j] == 'road')
					// {
					// 	for(var k = 1; k <= Object.keys(level['road']).length; k++)
					// 	{
					// 		this.createConstructionSite(center.pos.x + level['road'][k]["x"], center.pos.y + level['road'][k]['y'], STRUCTURE_ROAD)
					// 	}
					// }
				}
			}
		}
	}
const levels = {
	1:{"spawn":{'x':1, "y":-1}},
	2:{"extension":{1:{'x':-6, 'y':-1}, 2:{'x':-5, 'y':-1}, 3:{'x':-4, 'y':-1}, 4:{'x':-6, 'y':-2}, 5:{'x':-5, 'y':-2}}},
	3:{"extension":{1:{'x':-4, 'y':-2}, 2:{'x':-3, 'y':-2}, 3:{'x':-5, 'y':-3}, 4:{'x':-4, 'y':-3}, 5:{'x':-3, 'y':-3}}, "tower":{1:{'x':2, 'y':0}}, "road":{1:{'x':-6, 'y':0}, 2:{'x':-5, 'y':0}, 3:{'x':-4, 'y':0}, 4:{'x':-3, 'y':0}, 5:{'x':6, 'y':0}, 6:{'x':5, 'y':0}, 7:{'x':4, 'y':0}, 8:{'x':3, 'y':0}, 9:{'x':0, 'y':3}, 10:{'x':0, 'y':4}, 11:{'x':0, 'y':5}, 12:{'x':0, 'y':6}, 13:{'x':0, 'y':-3}, 14:{'x':0, 'y':-4}, 15:{'x':0, 'y':-5}, 16:{'x':0, 'y':-6},17:{'x':-3, 'y':-1}, 18:{'x':-2, 'y':-1}, 19:{'x':-2, 'y':-2}, 20:{'x':-1, 'y':-2}, 21:{'x':-1, 'y':-3}, 22:{'x':3, 'y':-1}, 23:{'x':2, 'y':-1}, 24:{'x':2, 'y':-2}, 25:{'x':1, 'y':-2}, 26:{'x':1, 'y':-3}, 27:{'x':-3, 'y':1}, 28:{'x':-2, 'y':1}, 29:{'x':-2, 'y':2}, 30:{'x':-1, 'y':2}, 31:{'x':-1, 'y':3}, 32:{'x':3, 'y':1}, 33:{'x':2, 'y':1}, 34:{'x':2, 'y':2}, 35:{'x':1, 'y':2}, 36:{'x':1, 'y':3}}},
	4:{"extension":{1:{'x':-2, 'y':-3}, 2:{'x':-4, 'y':-4}, 3:{'x':-3, 'y':-4}, 4:{'x':-2, 'y':-4}, 5:{'x':-1, 'y':-4}, 6:{'x':-3, 'y':-5}, 7:{'x':-2, 'y':-5}, 8:{'x':-1, 'y':-5}, 9:{'x':-2, 'y':-6}, 10:{'x':-1, 'y':-6}}, "storage":{1:{'x':-1, 'y':0}}, "creeps":{1:"BM-1,"}},
	5:{"extension":{1:{"x":-6, 'y':1}, 2:{'x':-5, 'y':1}, 3:{'x':-4, 'y':1}, 4:{'x':-6, 'y':2}, 5:{'x':-5, 'y':2}, 6:{'x':-4, 'y':2}, 7:{'x':-3, 'y':2}, 8:{'x':-5, 'y':3}, 9:{'x':-4, 'y':3}, 10:{'x':-3, 'y':3}}, "tower":{1:{"x":-2, 'y':0}}, 'road':{1:{'x':-7, 'y':0}, 2:{'x':-7, 'y':-1}, 3:{'x':-7, 'y':-2}, 4:{'x':-7, 'y':1}, 5:{'x':-7, 'y':2}, 6:{'x':7, 'y':0}, 7:{'x':7, 'y':-1}, 8:{'x':7, 'y':-2}, 9:{'x':7, 'y':1}, 10:{'x':7, 'y':2}, 11:{'x':-2, 'y':-7}, 12:{'x':-1, 'y':-7}, 13:{'x':0, 'y':-7}, 14:{'x':1, 'y':-7}, 15:{'x':2, 'y':-7}, 16:{'x':-2, 'y':7}, 17:{'x':-1, 'y':7}, 18:{'x':0, 'y':7}, 19:{'x':1, 'y':7}, 20:{'x':2, 'y':7}, 21:{'x':-6, 'y':-3}, 22:{'x':-5, 'y':-4}, 23:{'x':-4, 'y':-5}, 24:{'x':-3, 'y':-6}, 25:{'x':6, 'y':-3}, 26:{'x':5, 'y':-4}, 27:{'x':4, 'y':-5}, 28:{'x':3, 'y':-6}, 29:{'x':-6, 'y':3}, 30:{'x':-5, 'y':4}, 31:{'x':-4, 'y':5}, 32:{'x':-3, 'y':6}, 33:{'x':6, 'y':3}, 34:{'x':5, 'y':4}, 35:{'x':4, 'y':5}, 36:{'x':3, 'y':6}, 37:{'x':6, 'y':-1},  38:{'x':6, 'y':-2}, 39:{'x':1, 'y':-6}, 40:{'x':2, 'y':-6}}},
	6:{'extension':{1:{'x':-2, 'y':3}, 2:{'x':-4, 'y':4}, 3:{'x':-3, 'y':4}, 4:{'x':-2, 'y':4}, 5:{'x':-1, 'y':4}, 6:{'x':-3, 'y':5}, 7:{'x':-2, 'y':5}, 8:{'x':-1, 'y':5}, 9:{'x':-2, 'y':6}, 10:{'x':-1, 'y':6}}},
	7:{"extension":{1:{"x":6, 'y':1}, 2:{'x':5, 'y':1}, 3:{'x':4, 'y':1}, 4:{'x':6, 'y':2}, 5:{'x':5, 'y':2}, 6:{'x':4, 'y':2}, 7:{'x':3, 'y':2}, 8:{'x':5, 'y':3}, 9:{'x':4, 'y':3}, 10:{'x':3, 'y':3}}, "tower":{1:{"x":0, 'y':2}}, "spawn":{1:{'x':1, 'y':-4}, 2:{'x':4, 'y':-1}}},
	8:{'extension':{1:{'x':2, 'y':3}, 2:{'x':4, 'y':4}, 3:{'x':3, 'y':4}, 4:{'x':2, 'y':4}, 5:{'x':1, 'y':4}, 6:{'x':3, 'y':5}, 7:{'x':2, 'y':5}, 8:{'x':1, 'y':5}, 9:{'x':2, 'y':6}, 10:{'x':1, 'y':6}}, 'tower':{1:{'x':0, 'y': -2}, 2:{'x':2, 'y':2}, 3:{'x':-2, 'y':-2}}}
}
const extensionIncreases = {2:5, 3:5, 4:10, 5:10, 6:10, 7:10, 8:10}
const towerIncreases = {3:1, 5:1, 7:1, 8:3}
const spawnIncreases = {7:1, 8:1}
const storageIncreases = {4:1}