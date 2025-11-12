/*
function Players(){
	this.arr_players = new Array();//Массив играков.
	this.new_Player = function(flag_ai, name, gold){
		this.arr_players[this.arr_players.length] = new Player(this.arr_players.length, flag_ai, name, gold);
	}
	this.new_Player(false, "Player");
	this.seve = function(){
		var o_seve = {};
		o_seve.players = [];
		var i = 0;
		for(i = 0; i < this.arr_players.length; i++){
			o_seve.players[i] = this.arr_players[i].seve();
		}
		return o_seve;
	}
	this.load = function(o_seve){
		o_seve.players = [];
		this.arr_players = new Array();//Массив играков.
		var i = 0;
		for(i = 0; i < o_seve.players.length; i++){
			this.arr_players[i] = new Player();
			this.arr_players[i].load(o_seve.players[i]);
		}
	}
}//*/
function Player(id, flag_ai, name, gold, color){
	this.id = id || 0;
	this.name = name || "none";
	this.flag_ai = flag_ai == undefined ? true : flag_ai;
	this.gold = gold || 0;
	this.color = color || "#888";
	this.arr_child = new Array();
	this.run_ai = function(){
		
	}
	this.run = function(){//Функция которвя запускается каждый ход.
		for(var i = 0; i < this.arr_child.length; i++){
			if("run" in this.arr_child[i])this.arr_child[i].run();
		}
	}
	this.seve = function(){
		var o_seve = {};
		o_seve.id = this.id;
		o_seve.name = this.name;
		o_seve.flag_ai = this.flag_ai;
		o_seve.gold = this.gold;
		return o_seve;
	}
	this.load = function(o_seve){
		this.id = o_seve.id;
		this.name = o_seve.name;
		this.flag_ai = o_seve.flag_ai;
		this.gold = o_seve.gold;
	}
	this.del = function(){
		go_mir.child_players.splice(this.id,1);
	}
}