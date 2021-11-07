StructureTower.prototype.runRole = 
    function() {
        let closestHostile = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile != undefined) {
            this.room.memory.recentlyAttacked = true
            this.attack(closestHostile);
        } else {
            let closestHurt = this.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: c => c.hits < c.hitsMax
            });
            if(closestHurt != undefined) {
                this.heal(closestHurt);
            }
            // let closestRoad = this.pos.findClosestByRange(FIND_STRUCTURES, {
            //     filter: (struct) => {
            //         return (struct.structureType == STRUCTURE_ROAD && struct.hits < struct.hitsMax && this.pos.inRangeTo(struct, 20))
            //     }
            // })
            // if(closestRoad != undefined)
            // {
            //     this.repair(closestRoad)
            // }
        }
    };