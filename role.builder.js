var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

    	if(Game.time%50 == 0)
		{
			if(creep.ticksToLive <= 70)
			{
				creep.room.memory.spawnQueue += ("B0,");
			}
		}

        if((creep.memory.building && creep.carry.energy == 0) || creep.memory.building == undefined) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }
        
        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            var structures = creep.room.find(FIND_STRUCTURES, {
                filter: (conts) => {
                    return (conts.structureType == STRUCTURE_CONTAINER ||
                            conts.structureType == STRUCTURE_EXTENSION ||
                            conts.structureType == STRUCTURE_TOWER
                        ) && conts.hits < conts.hitsMax;
                }
            });
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            // If not building, then repairing
            else if(structures.length)
            {
                if(creep.repair(structures[0]) == ERR_NOT_IN_RANGE)
                {
                    creep.travelTo(structures[0]);
                }
            }
            // If not building, then upgrading
            else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var energyCont = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (cont) => {
                    return (cont.structureType == STRUCTURE_EXTENSION ||
                            cont.structureType == STRUCTURE_CONTAINER ||
                            cont.structureType == STRUCTURE_STORAGE
                    ) && cont.store[RESOURCE_ENERGY] > 0;
                }
            });
            if(creep.withdraw(energyCont, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(energyCont, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;