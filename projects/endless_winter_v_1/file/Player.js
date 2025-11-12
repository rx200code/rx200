function Player(world, id, name, color, gold){
	this.parent = world;
	this.id = id;
	this.name = name || "none";
	this.color = color || "#888";
	this.gold = gold || 0;
	
	this.add_gold = function(gold){
		this.gold += gold;
		if(this === go_player)go_interf.gold(this.gold);
	}
}