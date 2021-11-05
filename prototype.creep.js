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
	graverobber: require('role.graverobber')
}

Creep.prototype.runRole =
	function()
	{
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