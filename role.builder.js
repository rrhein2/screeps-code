var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            // If not building, then repairing
            else if(targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (conts) => {
                    return (conts.structureType == STRUCTURE_CONTAINER ||
                            conts.structureType == STRUCTURE_EXTENSION ||
                            conts.structureType == STRUCTURE_TOWER
                        ) && conts.hits < conts.hitsMax;
                }
            }) && targets.length)
            {
                if(creep.repair(targets) == ERR_NOT_IN_RANGE)
                {
                    creep.travelTo(targets);
                }
            }
            // If not building, then upgrading
            else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var sources = creep.pos.findClosestByRange(FIND_SOURCES);
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;