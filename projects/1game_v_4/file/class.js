class Unit{//
	constructor(health = 1, speed = 1, force = 1, type = "человек"){
		this.health = health;
		this.speed = speed;
		this.force = force;
		this.type = type;
	}
}
class Human extends Unit{
	
}
class Resources{// Ресурсы игрока золото, серебро и другие, должен обеспечивать добавление ресов и их трату, и отмену траты если стоимость привышает средства.
	constructor(gold = 0, silver = 0){
		this.gold = gold;
		this.silver = silver;
	}
	m_gold(sum = 0){
		if(this.gold + sum < 0)return -1;
		return this.gold += sum;
	}
	m_silver(sum = 0){
		if(this.silver + sum < 0)return -1;
		return this.silver += sum;
	}
}
class Storage{// Склад, хранит различные объекты(предметы), в массиве склада, должек уметь проверять что предмет именно предмет по типу(или крассу Предмет), помещать в склад извлекать, продавать, сортировать предметы.
	constructor(stack = new Array()){
		this.stack = stack;
	}
}
class Housing{// Жилище, хранит персонажей в массиве желища, должен иметь лимиты, развитее уровней, и помещать извлекать для миссии например персонажек, распределять персонажей по боевым группам, сортировать.
	constructor(stack = new Array()){
		this.stack = stack;
	}
}
class Hangar{// Ангар, хранит авто.
	constructor(stack = new Array()){
		this.stack = stack;
	}
}
class Laboratory{// Лаборатория, хранит массив технологий, возможность разбирать предметы на технологии.
	constructor(stack = new Array()){
		this.stack = stack;
	}
}
class Production{// Цех, возможность создавать и улучшать предметы, за ресурсы, по доступным технологиям, возможность разбирать на ресурсы предметы, модернезировать предметы.
	constructor(){
		
	}
}
class Player{
	constructor(){
		this.resources = new Resources();
		this.storage = new Storage();
		this.housing = new Housing();
		this.hangar = new Hangar();
		this.laboratory = new Laboratory();
		this.production = new Production();
	}
}
class Shop {
	constructor(){
		this.resources = new Resources();
		this.run();
	}
	run(){
		this.resources.gold = Math.floor(Math.random() * 3);
		this.resources.silver = Math.floor(Math.random() * 10000 + 10000);
	}
}



























