var graveRobber = 
{
	run: function(creep)
	{

		if(creep.memory.toTomb == undefined)
		{
			creep.memory.toTomb = false
		}

		var tombs = creep.room.find(FIND_TOMBSTONES, {
			filter: (tomb) => {
				return (tomb.store.getUsedCapacity() > 0)
			}
		})
		if(!creep.memory.toTomb && creep.store.getUsedCapacity() == 0 && tombs.length > 0)
		{
			creep.memory.toTomb = true;
		}
		else if(creep.memory.toTomb && (creep.store.getUsedCapacity() == creep.store.getCapacity() || tombs.length == 0))
		{
			creep.memory.toTomb = false;
		}


		if(!creep.memory.toTomb)
		{
			if(creep.transfer(creep.room.storage, _.findKey(creep.store)) == ERR_NOT_IN_RANGE)
			{
				creep.travelTo(creep.room.storage)
			}
			// else if(tombs.length == 0)
			// {
			// 	creep.runOtherRole('upgrader')
			// }
		}
		else
		{
			var tombs = creep.room.find(FIND_TOMBSTONES)
			if(tombs.length)
			{
				if(creep.withdraw(tombs[0], _.findKey(tombs[0].store)) == ERR_NOT_IN_RANGE)
				{
					creep.travelTo(tombs[0])
				}
			}
		}
	}
}

module.exports = graveRobber;


