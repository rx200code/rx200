
class Building{
	constructor(width, height, cost = {}, pictures = [], level = 0){
		this.width = width;
		this.height = height;
		this._cost = cost;
		this._pictures = pictures;
		this.level = 0;
		
	}
	get cost(){
		return this._cost[this.level];
	}
}
class Guildhall extends Building{
	constructor(){
		let cost = {
			gold:[100, 500, 2000, 7000, 25000, 100000],
			wood:[10, 100, 500, 2000, 5000, 25000],
			stone:[0, 10, 100, 500, 3000, 40000],
			iron:[0, 0, 10, 100, 1000, 20000]
		};
		let pictures = [];
		super(4, 4, cost, pictures);
	}
}
