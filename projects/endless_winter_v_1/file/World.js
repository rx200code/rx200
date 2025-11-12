function World(){
	this.parent = null;
	this.childs = [];
	this.childs[0] = new Sector(this, 0, 0, 400, 100, 10);
	this.childs[1] = new Sector(this, 1, 0, 400, 150, 5);
	this.childs[2] = new Sector(this, 2, 1, 400, 200, 7);
	this.childs[3] = new Sector(this, 3, 2, 350, 200, 5);
	this.childs[4] = new Sector(this, 4, 3, 300, 200, 10);
	this.childs[5] = new Sector(this, 5, 2, 450, 200, 5);
	this.childs[6] = new Sector(this, 6, 5, 500, 200, 10);
	this.childs[7] = new Sector(this, 7, 2, 400, 250, 5);
	this.childs[8] = new Sector(this, 8, 7, 400, 300, 7);
	this.childs[9] = new Sector(this, 9, 8, 450, 300, 10);
	this.childs[10] = new Sector(this, 10, 8, 400, 350, 5);
	this.childs[11] = new Sector(this, 11, 10, 400, 400, 10);
	
	this.players = [];
	this.players[0] = new Player(this, 0, "RX200", "#840", 100);
	go_player = this.players[0];
	
	this.players[1] = new Player(this, 0, "zz", "#880", 100);
	this.players[2] = new Player(this, 0, "xx", "#00f", 100);
	this.players[3] = new Player(this, 0, "cc", "#f00", 100);
	this.players[4] = new Player(this, 0, "vv", "#a0f", 100);
	
	this.childs[9].add_child(new City(this.players[0]));
	this.childs[0].add_child(new City(this.players[1]));
	this.childs[4].add_child(new City(this.players[2]));
	this.childs[6].add_child(new City(this.players[3]));
	this.childs[11].add_child(new City(this.players[4]));
}