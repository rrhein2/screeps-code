//var roleHarvester = require('role.harvester');
//var roleUpgrader = require('role.upgrader');
//var roleBuilder = require('role.builder');

require('prototype.creep');
require('prototype.tower');
require('prototype.source');
require('Traveler')

module.exports.loop = function () {
    
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    for(let tower of towers)
    {
        try
        {
            tower.runRole();
        }
        catch(error)
        {
            console.log('tower: ' + tower.room.name + '; ' + tower.pos.x + ', ' + tower.pos.y + ' errored: '  + error);
        }
    }

 /*   var tower = Game.getObjectById('TOWER_ID');
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
*/    
    var  harvs = 0, upgrs = 0; buildrs = 0;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            //roleHarvester.run(creep);
            harvs = harvs+1;
        }
        if(creep.memory.role == 'upgrader') {
            //roleUpgrader.run(creep);
            upgrs = upgrs+1;
        }
        if(creep.memory.role == 'builder') {
            //roleBuilder.run(creep);
            buildrs = buildrs+1;
        }
        creep.runRole();
    }
    
    if(harvs < 1)
    {
        Game.spawns['Spawn1'].spawnCreep([MOVE, WORK, CARRY], "harv"+Game.time, {memory:{role:'harvester'}})
    }
    if(Game.spawns['Spawn1'].room.memory.spawnQueue.length > 1)
    {
        var queue = Game.spawns['Spawn1'].room.memory.spawnQueue;
        var next = queue.substring(0, queue.indexOf(','));
        if(next.substring(0, 2) == "SH")
        {
            if(Game.spawns['Spawn1'].spawnCreep([MOVE, WORK, WORK, WORK, WORK, WORK, CARRY], "stHarv"+Game.time, {memory:{role:'stHarv', srcID:next.substring(2)}}) == 0)
            {
                // if it was spawned, remove from queue
                Game.spawns['Spawn1'].room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
            }
        }
        else if(next.substring(0, 2) == 'FE')
        {
            if(Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, CARRY, CARRY, CARRY, CARRY], "ferry"+Game.time, {memory:{role:'ferry', contID:next.substring(2)}}) == 0)
            {
                // if it was spawned, remove from queue
                Game.spawns['Spawn1'].room.memory.spawnQueue = queue.substring(queue.indexOf(',')+1);
            }
        }
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