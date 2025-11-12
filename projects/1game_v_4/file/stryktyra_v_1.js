/// 
var game = null;// Корень игры.
window.onload = function(){
	game = new Game();
	
}
function Game(){
	this.data = new Data_game();
	this.view = new View_game();
}
function Data_game(){
	this.player = new Player();
	this.shop = new Shop();
	this.missions = new Missions();
}
function Player(){
	this.resources = new Resources([new Gold(), new Silver()]);
	this.storage = new Storage([new Thing(), new Thing()]);
	this.housing = new Housing([new Unit(), new Unit()]);
	this.hangar = new Hangar([new Vehicle(), new Vehicle()]);
	this.laboratory = new Laboratory([new Technology(), new Technology()]);
	this.production = new Production();
}
function Shop(){
	this.resources = new Resources([new Gold(), new Silver()]);
	this.storage = new Storage([new Thing(), new Thing()]);
	this.housing = new Housing([new Unit(), new Unit()]);
	this.hangar = new Hangar([new Vehicle(), new Vehicle()]);
}
function Resources(){
	this.catalog = new Array();
}
class Resource{}//type, amount, rate.
class Gold extends Resource{}
class Silver extends Resource{}
function Storage(){
	this.catalog = new Array();
}
class Effect{}
class Thing{}
function Housing(){
	this.catalog = new Array();
}
class Unit{}
function Hangar(){
	this.catalog = new Array();
}
class Vehicle{}
function Laboratory(){
	this.catalog = new Array();
}
class Technology{}
function Production(){
	
}



function Missions([new Mission(), new Mission()]){
	this.catalog = new Array(1,2);
}
class Mission{}

function View_game(){
	
}














































