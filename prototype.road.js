StructureRoad.prototype.runRole = 
	function(){
		// If road goes below 25% health, report to the repair team
		console.log(this.hits)
		console.log(this.hitsMax * .25)
		if(this.hits <= this.hitsMax * .25)
		{
			this.room.memory.repairQueue += this.id + ","
		}
	};
