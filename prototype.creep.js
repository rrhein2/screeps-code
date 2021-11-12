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
		console.log("Ran energy average")
        var prevAverage = Memory.energyEffeciency[this.memory.role]
        var count = Memory.energyEffeciency.counts[this.memory.role]
        var energyUsed = this.memory.netEnergy

        Memory.energyEffeciency[this.memory.role] = prevAverage + ((energyUsed - prevAverage) / (count + 1))
        Memory.energyEffeciency.counts[this.memory.role] = count + 1

        this.memory.energyTallied = true
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
		// if(!Memory.energyEffeciency[this.memory.role])
		// {
		// 	Memory.energyEffeciency[this.memory.role] = 0
		// }
		// if(!Memory.energyEffeciency.counts)
		// {
		// 	Memory.energyEffeciency.counts = {}
		// }
		// if(!Memory.energyEffeciency.counts[this.memory.role])
		// {
		// 	Memory.energyEffeciency.counts[this.memory.role] = 0
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