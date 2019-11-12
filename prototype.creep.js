var roles = 
{
	harvester: require('role.harvester'),
	stHarv: require('role.stationedHarvester'),
	ferry: require('role.ferry'),
	builder: require('role.builder'),
	upgrader: require('role.upgrader')
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