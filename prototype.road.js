StructureRoad.prototype.runRole = 
	function(){
		// If road goes below 25% health, report to the repair team
		if(this.hits <= this.hitsMax * .25)
		{
			this.room.memory.repairQueue += this.id + ","
		}
	};
