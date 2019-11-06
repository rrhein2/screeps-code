StructureTower.prototype.runRole = 
    function() {
        let closestHostile = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile != undefined) {
            this.attack(closestHostile);
        } else {
            let closestHurt = this.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: c => c.hits < c.hitsMax
            });
            if(closestHurt != undefined) {
                this.heal(closestHurt);
            }

            // let closestDamagedStructure = this.pos.findClosestByRange(FIND_STRUCTURES, {
            //     filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART
            //     // filter: (structure) => structure.hits < structure.hitsMax// && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART
            // });
            // if(closestDamagedStructure != undefined) {
            //     this.repair(closestDamagedStructure);
            // }
        }
    };