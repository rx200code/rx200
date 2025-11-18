
let createElementNS = (name, ...attr) => {
	let elm = document.createElementNS("http://www.w3.org/2000/svg", name);
	for(let arr_set of attr)elm.setAttributeNS(null, arr_set[0], arr_set[1]);
	return elm;
};
let createElement = (name, ...attr) => {
	let elm = document.createElement(name);
	for(let arr_set of attr)elm.setAttribute(arr_set[0], arr_set[1]);
	return elm;
};

class Unit {// прототип характеристик персонажа, непосредственно учавствующих в итве.
	// Характеристики на которые напрямую игрок влиять не может.
	action_points = 2;// action points - очки действий
	//current_action_points = 2;
	initiative = 0;// initiative - инициатива

	review = 3;// review - обзор.
	stealth = 0;// stealth - скрытность

	level = 0;// level - уровень. // за уровень получает points

	// определяют наносимый получаемый урон 
	hit_points = 1;// hit points, health points - очки жизни, здоровья
	//current_hit_points = 1;
	damage_dealer = 1;// damage dealer - наносящий урон
	
	attack = 0;// attack - атака
	defense = 0;// defense - защита

	accuracy = 0;// accuracy - точность, меткость.// в том числе с силой влияет на дальность атак
	evasion = 0;// evasion - уклонение.

	// методы.

}

class Cell {
	constructor(movement = 0){
		this.movement = movement;
	}
}
class BattleField {
	static WIDTH = 21;
	static HEIGHT = 10;
	constructor(){
		this.width = BattleField.WIDTH;
		this.height = BattleField.HEIGHT;
		this.w = this.width * 2 + 1;
		this.h = this.height * 2 + 1;

		this.map_movement = [];
		let w_edge = this.w - 1;
		let h_edge = this.h - 1;
		for(let x = 0; x < this.w; x++){
			this.map_movement[x] = [];
			for(let y = 0; y < this.h; y++){
				if(x === 0 || x === w_edge || y === 0 || y === h_edge)this.map_movement[x][y] = Infinity;
				else this.map_movement[x][y] = ((x & 1 ^ 1) + (y & 1 ^ 1)) ** .5;
			}
		}

		// TEST
		this.map_movement[3][3] = Infinity;
		this.map_movement[2][2] = Infinity;
		this.map_movement[3][2] = Infinity;
		this.map_movement[4][2] = Infinity;
		this.map_movement[5][7] = Infinity;
		//this.map_movement[2][1] = Infinity;
		this.map_movement[20][13] = Infinity;
		this.map_movement[20][14] = Infinity;
		this.map_movement[20][15] = Infinity;
		this.map_movement[20][16] = Infinity;
		this.map_movement[20][17] = Infinity;
		this.map_movement[20][18] = Infinity;
		
		
		
		
		// END TEST
		this.units = [];
	}
	addUnit(unit, x, y){
		x += x + 1;//x = x * 2 + 1;
		y += y + 1;//y = y * 2 + 1;
		if(x >= this.w || y >= this.h || this.map_movement[x][y] === Infinity){
			// ERROR
			return;
		}
		
		unit.x = x;
		unit.y = y;
		this.map_movement[x][y] = Infinity;

		this.units.push(unit);
	}
	getArrDistance(x, y){
		let movements = [];
		for(let x = 0; x < this.w; x++){
			movements[x] = [];
			for(let y = 0; y < this.h; y++)movements[x][y] = Infinity;
		}
		movements[x][y] = 0;

		// тестируем соседние клетки
		let temp_arr = [];
		/**
		// 1
		let x_cell = x - 1;
		let y_cell = y - 1;
		let temp_distance = movements[x][y] + this.map_movement[x_cell][y_cell];
		if(temp_distance < movements[x_cell][y_cell]){
			movements[x_cell][y_cell] = temp_distance;
			temp_arr.push([x_cell, y_cell]);
		}
		// 2
		x_cell++;
		temp_distance = movements[x][y] + this.map_movement[x_cell][y_cell];
		if(temp_distance < movements[x_cell][y_cell]){
			movements[x_cell][y_cell] = temp_distance;
			temp_arr.push([x_cell, y_cell]);
		}
		// 3
		x_cell++;
		temp_distance = movements[x][y] + this.map_movement[x_cell][y_cell];
		if(temp_distance < movements[x_cell][y_cell]){
			movements[x_cell][y_cell] = temp_distance;
			temp_arr.push([x_cell, y_cell]);
		}
		// 4
		x_cell -= 2;
		y_cell++;
		temp_distance = movements[x][y] + this.map_movement[x_cell][y_cell];
		if(temp_distance < movements[x_cell][y_cell]){
			movements[x_cell][y_cell] = temp_distance;
			temp_arr.push([x_cell, y_cell]);
		}
		// 5
		x_cell += 2;
		temp_distance = movements[x][y] + this.map_movement[x_cell][y_cell];
		if(temp_distance < movements[x_cell][y_cell]){
			movements[x_cell][y_cell] = temp_distance;
			temp_arr.push([x_cell, y_cell]);
		}
		// 6
		x_cell -= 2;
		y_cell++;
		temp_distance = movements[x][y] + this.map_movement[x_cell][y_cell];
		if(temp_distance < movements[x_cell][y_cell]){
			movements[x_cell][y_cell] = temp_distance;
			temp_arr.push([x_cell, y_cell]);
		}
		// 7
		x_cell++;
		temp_distance = movements[x][y] + this.map_movement[x_cell][y_cell];
		if(temp_distance < movements[x_cell][y_cell]){
			movements[x_cell][y_cell] = temp_distance;
			temp_arr.push([x_cell, y_cell]);
		}
		// 8
		x_cell++;
		temp_distance = movements[x][y] + this.map_movement[x_cell][y_cell];
		if(temp_distance < movements[x_cell][y_cell]){
			movements[x_cell][y_cell] = temp_distance;
			temp_arr.push([x_cell, y_cell]);
		}
		/**/



		let neighboring_cells = [
			[-1, -1], [0, -1], [1, -1],
			[-1, 0], [1, 0],
			[-1, 1], [0, 1], [1, 1]
		];
		for(let cell_xy of neighboring_cells){
			let x_cell = x + cell_xy[0];
			let y_cell = y + cell_xy[1];
			let temp_distance = movements[x][y] + this.map_movement[x_cell][y_cell];
			if(temp_distance < movements[x_cell][y_cell]){
				movements[x_cell][y_cell] = temp_distance;
				temp_arr.push([x_cell, y_cell]);
			}
		}
		while(temp_arr.length){
			//alert(temp_arr.length)
			let temp_arr_2 = [];
			for(let i = 0; i < temp_arr.length; i++){
				
				/**/
				let _x = temp_arr[i][0] & 1;
				let _y = temp_arr[i][1] & 1;
				if(_x){
					if(_y){// 8
						for(let cell_xy of neighboring_cells){
							let x_cell = temp_arr[i][0] + cell_xy[0];
							let y_cell = temp_arr[i][1] + cell_xy[1];

							let temp_distance = movements[temp_arr[i][0]][temp_arr[i][1]] + this.map_movement[x_cell][y_cell];
							if(temp_distance < movements[x_cell][y_cell]){
								movements[x_cell][y_cell] = temp_distance;
								temp_arr_2.push([x_cell, y_cell]);
							}
							
						}
					}else{// 2 y
						let x = temp_arr[i][0];
						let y = temp_arr[i][1] - 1;
						let temp_distance = movements[temp_arr[i][0]][temp_arr[i][1]] + this.map_movement[x][y];
						if(temp_distance < movements[x][y]){
							movements[x][y] = temp_distance;
							temp_arr_2.push([x, y]);
						}
						y = temp_arr[i][1] + 1;
						temp_distance = movements[temp_arr[i][0]][temp_arr[i][1]] + this.map_movement[x][y];
						if(temp_distance < movements[x][y]){
							movements[x][y] = temp_distance;
							temp_arr_2.push([x, y]);
						}
					}
				}else if(_y){// 2 x
					let x = temp_arr[i][0] - 1;
					let y = temp_arr[i][1];
					let temp_distance = movements[temp_arr[i][0]][temp_arr[i][1]] + this.map_movement[x][y];
					if(temp_distance < movements[x][y]){
						movements[x][y] = temp_distance;
						temp_arr_2.push([x, y]);
					}
					x = temp_arr[i][0] + 1;
					temp_distance = movements[temp_arr[i][0]][temp_arr[i][1]] + this.map_movement[x][y];
					if(temp_distance < movements[x][y]){
						movements[x][y] = temp_distance;
						temp_arr_2.push([x, y]);
					}

				}else{// 4
					let x = temp_arr[i][0] - 1;
					let y = temp_arr[i][1] - 1;
					let temp_distance = movements[temp_arr[i][0]][temp_arr[i][1]] + this.map_movement[x][y];
					if(temp_distance < movements[x][y]){
						movements[x][y] = temp_distance;
						temp_arr_2.push([x, y]);
					}
					x = temp_arr[i][0] + 1;
					temp_distance = movements[temp_arr[i][0]][temp_arr[i][1]] + this.map_movement[x][y];
					if(temp_distance < movements[x][y]){
						movements[x][y] = temp_distance;
						temp_arr_2.push([x, y]);
					}
					y = temp_arr[i][1] + 1;
					temp_distance = movements[temp_arr[i][0]][temp_arr[i][1]] + this.map_movement[x][y];
					if(temp_distance < movements[x][y]){
						movements[x][y] = temp_distance;
						temp_arr_2.push([x, y]);
					}
					x = temp_arr[i][0] - 1;
					temp_distance = movements[temp_arr[i][0]][temp_arr[i][1]] + this.map_movement[x][y];
					if(temp_distance < movements[x][y]){
						movements[x][y] = temp_distance;
						temp_arr_2.push([x, y]);
					}
				}

				/**/

				/**
				for(let cell_xy of neighboring_cells){
					let x_cell = temp_arr[i][0] + cell_xy[0];
					let y_cell = temp_arr[i][1] + cell_xy[1];

					if((1 & temp_arr[i][0] & temp_arr[i][1]) || (1 & x_cell & y_cell)){
						let temp_distance = movements[temp_arr[i][0]][temp_arr[i][1]] + this.map_movement[x_cell][y_cell];
						if(temp_distance < movements[x_cell][y_cell]){
							movements[x_cell][y_cell] = temp_distance;
							temp_arr_2.push([x_cell, y_cell]);
						}
					}
				}
				/**/

			}
			temp_arr = temp_arr_2;
		}

		return movements;
	}

}

class Battle {
	constructor(){
		this.battleField = new BattleField;
	}
}

class ViewBattle {
	constructor(battle){
		this.battle = battle;

		this.elm = createElement("canvas", ["width", 1000], ["height", 500]);//["style", "position: absolute;"]

		//this.elm.style.left = "100px";
		//this.elm.style.top = "200px";
		this.elm.style.position = 'absolute';
		

		this.ctx = this.elm.getContext("2d");
		//this.ctx.fillStyle = "blue";
		//this.ctx.fillRect(1, 1, 998, 498);
		this.elm_layer_1 = createElement("canvas", ["width", 1000], ["height", 500]);//["style", "position: absolute;"]
		this.ctx_layer_1 = this.elm_layer_1.getContext("2d");



		// рисуем сетку.
		let size_cell = 45;
		let r = size_cell / 7 | 0;
		let r_sin_45 = r * Math.sin(Math.PI / 4);
		
		let bottom = size_cell * this.battle.battleField.height;
		let left = size_cell * this.battle.battleField.width;
		this.ctx_layer_1.beginPath();
		this.ctx_layer_1.strokeStyle = "#888";
		for(let x = 0; x < left; x += size_cell){
			this.ctx_layer_1.moveTo(x, r);
			this.ctx_layer_1.lineTo(x, bottom - r);
		}
		for(let y = 0; y < bottom; y += size_cell){
			this.ctx_layer_1.moveTo(r, y);
			this.ctx_layer_1.lineTo(left - r, y);
		}
		this.ctx_layer_1.stroke();

		// рисуем занятые.
		this.ctx_layer_1.beginPath();
		this.ctx_layer_1.strokeStyle = "#000";
		for(let x = 0; x < this.battle.battleField.w; x++){
			for(let y = 0; y < this.battle.battleField.h; y++){
				if(this.battle.battleField.map_movement[x][y] === Infinity){
					let coor_x = (x / 2 | 0) * size_cell;
					let coor_y = (y / 2 | 0) * size_cell;
					if(x & 1){
						if(y & 1){// поле
							this.ctx_layer_1.moveTo(coor_x + r_sin_45, coor_y + r_sin_45);
							this.ctx_layer_1.lineTo(coor_x + size_cell - r_sin_45, coor_y + size_cell - r_sin_45);
							this.ctx_layer_1.moveTo(coor_x + size_cell - r_sin_45, coor_y + r_sin_45);
							this.ctx_layer_1.lineTo(coor_x + r_sin_45, coor_y + size_cell - r_sin_45);
						}else{// горизонтальный барьер.
							this.ctx_layer_1.moveTo(coor_x + r, coor_y);
							this.ctx_layer_1.lineTo(coor_x + size_cell - r, coor_y);
						}
					}else if(y & 1){// вертикальный барьер.
						this.ctx_layer_1.moveTo(coor_x, coor_y + r);
						this.ctx_layer_1.lineTo(coor_x, coor_y + size_cell - r);
					}else{// на искосок барьер.
						
						this.ctx_layer_1.moveTo(coor_x + r, coor_y);
						this.ctx_layer_1.arc(coor_x, coor_y, r, 0, 2 * Math.PI);
					}

				}
				
			}
		}
		this.ctx_layer_1.stroke();


		// рисуем персонажей
		let r_unit = size_cell / 3 | 0;
		this.ctx_layer_1.beginPath();
		this.ctx_layer_1.strokeStyle = "#F00";
		for(let unit of this.battle.battleField.units){
			let coor_x = unit.x / 2 * size_cell;
			let coor_y = unit.y / 2 * size_cell;
			this.ctx_layer_1.moveTo(coor_x + r_unit, coor_y);
			this.ctx_layer_1.arc(coor_x, coor_y, r_unit, 0, 2 * Math.PI);
		}
		this.ctx_layer_1.stroke();

		// TEST
		/**
		this.ctx.font = (size_cell / 4 | 0) + "px serif";
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		
		if(this.battle.battleField.units.length){
			let movements = this.battle.battleField.getArrDistance(
				this.battle.battleField.units[this.battle.battleField.units.length - 1].x,
				this.battle.battleField.units[this.battle.battleField.units.length - 1].y
			);
			for(let x = 0; x < this.battle.battleField.w; x++){
				if(x & 1){
					for(let y = 0; y < this.battle.battleField.h; y++){
						if(y & 1){
							this.ctx.fillText(movements[x][y].toFixed(3), x / 2 * size_cell, y / 2 * size_cell);
						}
					}
				}
			}
		}
		/**/
		this.elm_layer_2 = createElement("canvas", ["width", 1000], ["height", 500]);//["style", "position: absolute;"]
		this.ctx_layer_2 = this.elm_layer_2.getContext("2d");
		this.ctx_layer_2.fillStyle = "blue";
		this.ctx_layer_2.font = (size_cell / 4 | 0) + "px serif";
		this.ctx_layer_2.textAlign = "center";
		this.ctx_layer_2.textBaseline = "middle";

		this.elm.onclick = e => {

			let rect = this.elm.getBoundingClientRect();
			//alert(e.clientX + " " + rect.left);
			let x = (e.clientX - rect.left) / size_cell | 0;
			let y = (e.clientY - rect.top) / size_cell | 0;


			x += x + 1;
			y += y + 1;
			for(let unit of this.battle.battleField.units){
				if(unit.x === x && unit.y === y){
					
					
					this.ctx_layer_2.clearRect(0, 0, this.elm_layer_2.width, this.elm_layer_2.height);
					
					let movements = this.battle.battleField.getArrDistance(unit.x, unit.y);
					for(let x = 0; x < this.battle.battleField.w; x++){
						if(x & 1){
							for(let y = 0; y < this.battle.battleField.h; y++){
								if(y & 1){
									this.ctx_layer_2.fillText(movements[x][y].toFixed(3), x / 2 * size_cell, y / 2 * size_cell);
									
									
								}
							}
						}
					}
					this.ctx.clearRect(0, 0, this.elm_layer_2.width, this.elm_layer_2.height);
					this.ctx.drawImage(this.elm_layer_2, 0, 0);
					this.ctx.drawImage(this.elm_layer_1, 0, 0);
					
					
				}
			}
		};
		// END TEST
		//this.ctx.drawImage(this.elm_layer_2, 0, 0);
		this.ctx.drawImage(this.elm_layer_1, 0, 0);
		
		
	}
}

function main(elm_view_game){
	// задача инициалзация элемента и подключение можулей

	// инициализация окна игры elm_view_game

	elm_view_game.style.backgroundColor = "#adf";
	elm_view_game.style.padding = "0px";
	elm_view_game.style.overflow = "hidden";
	let width_view = elm_view_game.clientWidth;
	let height_view = elm_view_game.clientHeight;
	elm_view_game.innerHTML = "";

	
	let battle = new Battle();
	
	battle.battleField.addUnit({}, 7, 7);
	battle.battleField.addUnit({}, 7, 6);
	battle.battleField.addUnit({}, 7, 5);
	battle.battleField.addUnit({}, 7, 4);
	battle.battleField.addUnit({}, 7, 3);
	battle.battleField.addUnit({}, 7, 2);
	battle.battleField.addUnit({}, 7, 1);
	battle.battleField.addUnit({}, 7, 0);
	battle.battleField.addUnit({}, 5, 5);
	battle.battleField.addUnit({}, 1, 0);

	let viewBattle = new ViewBattle(battle);

	elm_view_game.append(viewBattle.elm);
	//elm_view_game.innerHTML = battleField.x + " x";

	return;
	
}


