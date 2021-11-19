var roles = 
{
	harvester: require('role.harvester'),
	stHarv: require('role.stationedHarvester'),
	ferry: require('role.ferry'),
	builder: require('role.builder'),
	upgrader: require('role.upgrader'),
	cart: require('role.cartographer'),
	prot: require('role.defender'),
	rohanian: require('role.rohanian'),
	wallE: require('role.wallE'),
	basicRemoteHarv: require('role.basicRemoteHarv'),
	colonizer: require('role.colonizer'),
	baseManager: require('role.baseManager'),
	claimer: require('role.claimer'),
	graverobber: require('role.graverobber'),
	carePackage: require('role.carePackage')
}

Creep.prototype.addEnergyAverage =
	function()
	{
		try
		{
			var room = this.memory.role == "basicRemoteHarv" ? this.memory.home : this.room.name
			if(this.room.name == "W8N3")
			{
				console.log("Ran energy average")
				console.log(this.memory.role)
			}
			if(Memory.rooms[room].energyEffeciency[this.memory.role] == undefined)
			{
				Memory.rooms[room].energyEffeciency[this.memory.role] = 0
			}
			if(Memory.rooms[room].energyEffeciency.counts[this.memory.role] == undefined)
			{
				Memory.rooms[room].energyEffeciency.counts[this.memory.role] = 0
			}
	        var prevAverage = Memory.rooms[room].energyEffeciency[this.memory.role]
	        var count = Memory.rooms[room].energyEffeciency.counts[this.memory.role]
	        var energyUsed = this.memory.netEnergy

	        Memory.rooms[room].energyEffeciency[this.memory.role] = prevAverage + ((energyUsed - prevAverage) / (count + 1))
	        Memory.rooms[room].energyEffeciency.counts[this.memory.role] = count + 1

	        this.memory.energyTallied = true
	    }
	    catch(error)
	    {
	    	console.log("Trying to run an energy average for role " + this.memory.role + " threw the error: " + error)
	    }
	}

Creep.prototype.runRole =
	function()
	{
		// if(!this.memory.netEnergy)
		// {
		// 	this.memory.netEnergy = 0
		// }
		// if(this.memory.energyTallied == undefined)
		// {
		// 	this.memory.energyTallied = false
		// }
		// if(Memory.energyEffeciency == undefined)
		// {
		// 	Memory.energyEffeciency = {}
		// }
		// if(!Memory.energyEffeciency.counts)
		// {
		// 	Memory.energyEffeciency.counts = {}
		// }



		// if(this.memory.role != "cartographer" && this.memory.role != "carePackage" && this.memory.role != "basicRemoteHarv")
		// {
		// 	// console.log(this.room.name)

		// 	if(this.room.memory.energyEffeciency == undefined)
		// 	{
		// 		this.room.memory.energyEffeciency = {}
		// 	}
		// 	if(this.room.memory.energyEffeciency.counts == undefined)
		// 	{
		// 		this.room.memory.energyEffeciency.counts = {}
		// 	}

		// 	if(this.room.memory.energyEffeciency[this.memory.role] != undefined)
		// 	{
		// 		this.room.memory.energyEffeciency[this.memory.role] = 0
		// 	}
		// 	else
		// 	{
		// 		this.room.memory.energyEffeciency[this.memory.role] = 0
		// 	}


		// 	if(this.room.memory.energyEffeciency.counts[this.memory.role] != undefined)
		// 	{
		// 		this.room.memory.energyEffeciency.counts[this.memory.role] = 0
		// 	}
		// 	else
		// 	{
		// 		this.room.memory.energyEffeciency[this.memory.role] = 0
		// 	}
		// }

		// if(this.memory.netEnergy)
		// {
		// 	this.memory.netEnergy = 0
		// }
		if(!this.spawning)
		{
			try
			{
				roles[this.memory.role].run(this);	
			} 
			catch(error)
			{
				console.log('Creep: ' + this.name + ' (room: ' + this.room.name + ') throwing role error ' + error);
			}
		}
	};

Creep.prototype.runOtherRole =
	function(other)
	{
		roles[other].run(this);
	};