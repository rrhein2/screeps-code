var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

    	if(Game.time%30 == 0)
		{
			if(creep.ticksToLive < 30 && creep.memory.inQueue == false)
			{
                creep.memory.inQueue = true
				Game.rooms[creep.memory.home].memory.spawnQueue += ("UP,");
			}
		}

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var energyCont = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (cont) => {
                    return (/*cont.structureType == STRUCTURE_EXTENSION ||*/
                            cont.structureType == STRUCTURE_CONTAINER ||
                            cont.structureType == STRUCTURE_STORAGE
                    ) && cont.store[RESOURCE_ENERGY] > 0;
                }
            });
            if(creep.withdraw(energyCont, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.travelTo(energyCont, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            else if(energyCont == null)
            {
                energyCont = creep.room.find(FIND_SOURCES);
                if(creep.harvest(energyCont[0]) == ERR_NOT_IN_RANGE)
                {
                    creep.travelTo(energyCont[0]);
                }
            }
        }
    }
};

module.exports = roleUpgrader;