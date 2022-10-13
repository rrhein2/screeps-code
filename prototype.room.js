var creepEffeciency= ["baseManager", "stHarv", "ferry", "upgrader", "builder", "basicRemoteHarv"]

var csvToDict =
	function(csv)
	{
		var temp = csv
		var retDict = {}
		while(temp.includes(","))
		{
			var first = temp.substring(0, temp.indexOf(","))
			retDict[first.substring(0, 2)] = first.substring(2)
			temp = temp.substring(temp.indexOf(",")+1)
		}
		return retDict
	}

var dictToCsv =
	function(dict)
	{
		var retList = ""
		for(var i in dict)
		{
			retList += i + dict[i] + ","
		}
		return retList
	}

Room.prototype.setupMemory = 
	function()
	{
		console.log("IN HERE")
		if(this.memory.sources == undefined)
		{
			this.memory.sources = {}
		}
		if(this.memory.lastFail == undefined)
		{
			this.memory.lastFail = -1
		}
		if(this.memory.spawnQueue == undefined)
		{
			this.memory.spawnQueue = ""
		}
		if(this.memory.recentlyAttacke == undefined)
		{
			this.memory.recentlyAttacked = false
		}
		if(this.memory.level == undefined)
		{
			this.memory.level = 1
		}
		if(this.memory.backup == undefined)
		{
			this.memory.backup = {}
		}
		if(this.memory.status == undefined)
		{
			this.memory.status = "mine"
		}
		if(this.memory.searchTime == undefined)
		{
			this.memory.searchTime = -1
		}
		if(this.memory.repairQueue == undefined)
		{
			this.memory.repairQueue = ""
		}
		if(this.memory.remHarv == undefined)
		{
			this.memory.remHarv = {}
		}
		if(this.memory.energyEffeciency == undefined)
		{
			this.memory.energyEffeciency = {}
			for(var i of creepEffeciency)
			{
				this.memory.energyEffeciency[i] = 0
			}
		}
		if(this.memory.energyEffeciency.counts == undefined)
		{
			this.memory.energyEffeciency.counts = {}
			for(var i of creepEffeciency)
			{
				this.memory.energyEffeciency.counts[i] = 0
			}
		}
		if(this.memory.creepMaxes == undefined)
		{
			this.memory.creepMaxes = "UP16,BU16,"
		}
		if(this.memory.creepMaxCounts == undefined)
		{
			this.memory.creepMaxCounts = "UP10,BU10,"
		}
		if(this.memory.balanceTracker == undefined)
		{
			this.memory.balanceTracker = "UP-1,BU-1,"
		}
	}

// Modify this function so that it uses the memory's energyUsage instead of just rotating the string
//.  also give it ability to increase/decrease the number of those creeps based on energy usage
Room.prototype.balanceCreepEnergy =
	function()
	{
		if(this.memory.status != "mine")
		{
			return
		}

		var knownMax = {"BU": 16, "UP": 16}
		var maxCount = this.memory.creepMaxes
		var trackerDict = csvToDict(this.memory.balanceTracker)
		var maxCreepCountDict = csvToDict(this.memory.creepMaxCounts)

		var creepID = maxCount.substring(0, 2)
		var count = parseInt(maxCount.substring(2, maxCount.indexOf(',')))
		var tracker = trackerDict[creepID]
		var creepMaxCount = maxCreepCountDict[creepID]
		// Using 500 as an "acceptable" variance range from 0, will re-evaluate later
		if(this.netEnergyUsage() < 500)
		{
			if(count > 1)
			{
				count--

				// If I am currently tracking decreases for this creep, add another to that count
				if(tracker[0] == "-")
				{
					tracker = "-"+(parseInt(tracker[1]) + 1)
				}
				// Otherwise, if I was trackign increases, switch it to decreases
				else
				{
					tracker = "-1"
				}
			}
		}
		else if(this.netEnergyUsage() > 500)
		{
			if(count < knownMax[creepID])
			{
				count++
				if(tracker[0] == "+")
				{
					tracker = "+"+(parseInt(tracker[1]) + 1)
				}
				else
				{
					tracker = "+1"
				}
			}
		}

		if(Game.time%1500 == 0)
		{
			// If I've reached 5 in either increase or decrease tracker, try to modify the creep count
			if(parseInt(tracker[1]) >= 5)
			{
				// If it has been increasing, add to max count
				if(tracker[0] == "+")
				{
					creepMaxCount = parseInt(creepMaxCount) + 1
				}
				// Otherwise decrease it, unless it is 1 in which case leave it
				else if(creepMaxCount != "1")
				{
					creepMaxCount = parseInt(creepMaxCount) - 1
				}
			}
		}
		// console.log(maxCount.substring(maxCount.indexOf(",")+1) + creepID + count + ",")
		this.memory.creepMaxes = maxCount.substring(maxCount.indexOf(",")+1) + creepID + count + ","

		trackerDict[creepID] = tracker
		this.memory.balanceTracker = dictToCsv(trackerDict)
		maxCreepCountDict[creepID] = creepMaxCount
		this.memory.creepMaxCounts = dictToCsv(maxCreepCountDict)
	}

Room.prototype.resetEnergyEffeciency =
	function()
	{
		for(var i of creepEffeciency)
		{
			this.memory.energyEffeciency[i] = 0
		}

		for(var i of creepEffeciency)
		{
			this.memory.energyEffeciency.counts[i] = 0
		}
	}

Room.prototype.netEnergyUsage =
	function()
	{
		var creeps = this.pollRoom(true)
		var energyUsage = this.memory.energyEffeciency

		var totalUsed = 0
		for(var type of Object.keys(creeps))
		{
			if(energyUsage[type] != undefined)
			{
				totalUsed += energyUsage[type] * creeps[type]
			}
		}
		return totalUsed
	}

// Administrative function used for finding how many of each creep are in a room
Room.prototype.pollRoom = 
	function(shouldReturn = false)
	{
		var creepDict = {}
		for(var crp in Game.creeps)
		{
			var creep = Game.creeps[crp]
			if(creep.memory.home != this.name)
			{
				continue
			}
		// }
		// for(var creep of this.find(FIND_MY_CREEPS))
		// {
			if(creep.ticksTolive < 90)
			{
				continue
			}
			if(!(creep.memory.role in creepDict))
			{
				creepDict[creep.memory.role] = 1
			}
			else
			{
				creepDict[creep.memory.role]++
			}
		}

		if(shouldReturn)
		{
			return creepDict
		}
		else
		{
			for(var entry of Object.keys(creepDict))
			{
				console.log(entry + ": " + creepDict[entry])
			}
		}
	}

Room.prototype.remoteHarvesterRatings =
function(shouldReturn = false)
{
	for(var rm in this.memory.remHarv)
	{

	}
}

Room.prototype.killRoom =
function()
{
	creeps = this.find(FIND_MY_CREEPS)
	for(creep of creeps)
	{
		creep.suicide()
	}
}

Room.prototype.scoreRoom = 
	function()
	{
		if(Memory.rooms[this.name].idealCenter.x == null || Memory.rooms[this.name].idealCenter.x == undefined)
		{
			// console.log("No room here")
			Memory.rooms[this.name].colonizationScore = -9999
			return
		}
		var x = Memory.rooms[this.name].idealCenter.x
		var y = Memory.rooms[this.name].idealCenter.y

		var terrain = new Room.Terrain(this.name).getRawBuffer()
		var swampScore = 0
		var wallScore = 0
		var sourceScore = 0
		var statusScore = (Memory.rooms[this.name].status == "empty" ? 1 : -1)
		var mineralScore = 0
		var controllerScore = (50 - this.controller.pos.getRangeTo(x, y)) / 50
		var overallScore = 0

		// Calculate swampScores and wall Scores
		for(var i of terrain)
		{
			if(i == TERRAIN_MASK_SWAMP)
			{
				swampScore++
			}
			else if(i == TERRAIN_MASK_WALL)
			{
				wallScore++
			}
		}
		swampScore /= 2500
		wallScore /= 2500

		// Calculate sourceScore
		if(Memory.rooms[this.name].sources)
		{
			for(var src of Object.keys(Memory.rooms[this.name].sources))
			{
				var source = Game.getObjectById(src)
				sourceScore += (50 - source.pos.getRangeTo(x, y))
				// console.log(source.pos.getRangeTo(x, y))
			}
			sourceScore /= 100
		}

		// Calculate mineral score
		if(Memory.rooms[this.name].minerals)
		{
			for(var min of Object.keys(Memory.rooms[this.name].minerals))
			{
				mineralScore += (Memory.rooms[this.name].minerals[min].mineralScore) / 200
			}
		}

		// console.log("Swamp: " + (2*(1 - swampScore)))
		// console.log("Wall: " + (2*(1 - wallScore)))
		// console.log("Sources: " + (4*(sourceScore)))
		// console.log("Controller: " + 2 * controllerScore)
		// console.log("Mineral: " + mineralScore)
		overallScore = statusScore * ((1.5*(1 - swampScore)) + (1.5*(1 - wallScore)) + (4*sourceScore) + (2*controllerScore) + mineralScore)
		// console.log(overallScore)

		Memory.rooms[this.name].colonizationScore = overallScore

	}

Room.prototype.findCenter =
    function()
    {
    	// TO CONVERT FROM INDEX TO COORDS:
    	//   index % 50 = X coord
    	//   (index - X coord) / 50 = Y coord
    	var PER_ROW = 50
    	var BASE_AXIAL_LEN = 8
    	var terrain = new Room.Terrain(this.name)
    	var rawTerrain = terrain.getRawBuffer()
    	var index = -1
    	var failure = false
    	var possibleCenters = {}
    	var swampSpaces = 0
    	// Itterate through the grid starting at 7 and going to PER_ROW-7 because I need 7 spaces from the edge to make the base
    	// for(var i = 15; i < 18; i++)
    	for(var i = 7; i < PER_ROW-7; i++)
    	{
    		// for(var j = 7; j < 31; j++)
    		for(var j = 7; j < PER_ROW-7; j++)
    		{
    			index = j + (i * PER_ROW)
    			failure = false
    			// Check to the right first, because if something is there I can skip those spaces for a recheck
    			for(var k = 0; k < BASE_AXIAL_LEN; k++)
    			{
    				if(rawTerrain[index + k] == 1)
    				{
    					// If there is a wall at index+k, continue parsing at k+1 and break the k loop
    					// console.log("Failed at X:" + (j+k) + ", Y: " + i)
    					// console.log(rawTerrain(index + k))
    					j += k+1
    					k = 10
    					failure = true
    				}
    			}
    			// if the path failed, continue to next parse point along x axis
    			if(failure)
    			{
    				// console.log("X: " + j + ", Y: " + i)
    				// console.log('inside fail 1')
    				continue
    			}

    			// Assuming path did not fail, check the diagonal from the right-most point to the bottom-most point
    			//   if there is a conflict, calculate the minimum x-shift to avoid it and start again there
    			for(var k = 0; k < BASE_AXIAL_LEN; k++)
    			{
    				var tempIndex = (j + (BASE_AXIAL_LEN - 1 - k)) + ((i+k) * PER_ROW)
    				if(rawTerrain[tempIndex] == 1)
    				{
    					// console.log("Failure index: X: " + (j + BASE_AXIAL_LEN - 1 - k) + ", Y: " + ((i+k) * PER_ROW))
    					j += k+1
    					k = 10
    					failure = true
    				}
    			}
    			// if the path failed, continue to next parse point along x axis
    			if(failure)
    			{
    				// console.log("X: " + j + ", Y: " + i)
    				// console.log('inside fail 2')
    				continue
    			}

    			// If both of these heuristics passed, test entire space for being valid
    			var xDist = {7:2, 6:3, 5:4, 4:5, 3:6, 2:7, 1:7, 0:7}
    			swampSpaces = 0
    			for(var yChange = -7; yChange <= BASE_AXIAL_LEN - 1; yChange++)
    			{
    				for(var xChange = -1 * (xDist[Math.abs(yChange)]); xChange <= xDist[Math.abs(yChange)]; xChange++)
    				{
    					var tempIndex = ((j + xChange) + ((i + yChange) * PER_ROW))
    					if(rawTerrain[tempIndex] == 1)
    					{
    						xChange = 10
    						yChange = 10
    						failure = true
    					}
    					else if(rawTerrain[tempIndex] == 2)
    					{
    						swampSpaces++
    					}
    				}
    			}
    			if(failure)
    			{
    				// console.log('inside fail 3')
    				continue
    			}
    			else
    			{
    				// console.log('DID NOT FAIL')
    				// console.log("X: " + j + ", Y: " + i)
    				possibleCenters[index] = swampSpaces
    			}


    			// console.log(j + (i * PER_ROW))
    			// console.log(rawTerrain[j + (i * PER_ROW)])
    		}
    	}
    	// console.log(rawTerrain)
    	// console.log(possibleCenters)

    	// Process possible centers for optimal center
    	//   I should count up the number of swamp spaces in the area while checking for walls
    	//    then use that and the distance from controller/sources (and maybe minerals, as a small factor)
    	//    to determine the scores.
    	var x = -1
    	var y = -1
    	var AREA = 57
    	var MAX_DST = 49
    	var terrainScore = -1
    	var distScore = 0
    	var overallScore = 0

    	var currentMaxScore = -1
    	var currentCenter
    	for(const [key, value] of Object.entries(possibleCenters))
    	{
    		// reset reused variables
    		terrainScore = -1
    		distScore = 0
    		overallScore = 0

    		// Calculate x and y coords from 1-d array index
    		x = key % PER_ROW
    		y = (key - x) / PER_ROW
    		terrainScore = AREA - value

    		// Calculate distances to sources
    		if(Memory.rooms[this.name].sources)
    		{
	    		for(const key of Object.keys(Memory.rooms[this.name].sources))
	    		{
	    			distScore += MAX_DST - Game.getObjectById(key).pos.getRangeTo(x, y)
	    		}
    		}

    		// Calculate distance to minerals
    		if(Memory.rooms[this.name].minerals)
    		{
	    		for(const key of Object.keys(Memory.rooms[this.name].minerals))
	    		{
	    			// divide by 5 (arbitrary value of 5) because I prioritize minerals less than sources
	    			distScore += (MAX_DST - Game.getObjectById(key).pos.getRangeTo(x, y))/5
	    		}
    		}

    		// Calculate dist to controller
    		if(this.controller)
    		{
    			// Divide by 3 (arbitrary value of 3) because I prioritize controller more than minerals but less than sources
    			distScore += (MAX_DST - this.controller.pos.getRangeTo(x, y))/3
    		}

    		// Combine terrain and dist scores
    		//   (MAX_DST*2 + MAX_DST/3 + MAX_DST/5) is max possible score for distScore
    		overallScore = (2*(terrainScore / AREA)) + (distScore / (MAX_DST*2 + MAX_DST/3 + MAX_DST/5))

    		if(overallScore > currentMaxScore)
    		{
    			currentCenter = key
    			currentMaxScore = overallScore
    		}
    	}
    	Memory.rooms[this.name].idealCenter = {}
    	Memory.rooms[this.name].idealCenter.x = (currentCenter % PER_ROW)
		Memory.rooms[this.name].idealCenter.y = ((currentCenter - (currentCenter % PER_ROW)) / PER_ROW)
    };

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
		var minerals = this.find(FIND_MINERALS)
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
		if(minerals.length > 0)
		{
			if(Memory.rooms[this.name].minerals == undefined)
			{
				Memory.rooms[this.name].minerals = {};
				for(var min of minerals)
				{
					Memory.rooms[this.name].minerals[min.id] = {}
					Memory.rooms[this.name].minerals[min.id].x = min.x
					Memory.rooms[this.name].minerals[min.id].y = min.y
					Memory.rooms[this.name].minerals[min.id].mineralScore = Math.round((min.density * min.mineralAmount)/1000)
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


		// Generate a colonization score for the room based off of collected data
	};

Room.prototype.update = 
	function()
	{
		console.log("inside room update function")
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
					console.log(keys[j])
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
						console.log('in roads')
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