var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    
    var  harvs = 0, upgrs = 0; buildrs = 0;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
            harvs = harvs+1;
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            upgrs = upgrs+1;
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
            buildrs = buildrs+1;
        }
    }
    
    if(harvs < 4)
    {
        Game.spawns['Spawn1'].spawnCreep([MOVE, WORK, CARRY], "harv"+Game.time, {memory:{role:'harvester'}})
    }
    if(upgrs < 4)
    {
        Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, WORK, WORK, CARRY, CARRY], "upgr"+Game.time, {memory:{role:'upgrader'}})
    }
    if(buildrs<2)
    {
        Game.spawns['Spawn1'].spawnCreep([MOVE, WORK, CARRY], "buil"+Game.time, {memory:{role:'builder'}})
    }
}