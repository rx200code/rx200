class Resource{
	constructor(type, amount, rate = 1){
		this.type = type;
		this.amount = amount;
		if(this.constructor.rate === undefined)this.constructor.rate = rate;
	}
	get rate(){return this.constructor.rate;}
	set rate(i_value){return this.constructor.rate = i_value;}
}
class Gold extends Resource{
	constructor(amount){
		super("gold", amount, 7);
	}
}
class Silver extends Resource{
	constructor(amount){
		super("silver", amount, 3);
	}
}
//* Вещи.
class Effect{
	constructor(){
		this.type;
		this.power;
	}
}
class Thing{
	constructor(){
		this.price = new Resources([new Gold(), new Silver()]);
		this.resources = new Resources([new Gold(), new Silver()]);
		this.percent_create_resources = 1;
		this.effects = [];
		//this.technology;
		
	}
	
}
class Topor extends Thing{
	constructor(){
		super();
	}
}
class Shlem extends Thing{
	constructor(){
		super();
	}
}
//tests
let thing = new Thing();

alert(thing);

//*/




