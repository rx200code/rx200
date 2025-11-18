

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

class BattleField{
	constructor(){

	}
}

class Field{
	static types = [
		{
			name: "default",
			rate: 1,
			description: ""
		}
	];
	constructor(){
		
		this.type_id = 0;
		this.items = [];
		this.unit;
	}
}

class TestField{
	
	constructor(width = 10, height = 10){
		this.width = width;
		this.height = height;
		this.w = this.width * 2 + 1;
		this.h = this.height * 2 + 1;

		this.cells = [];
		let w_edge = this.w - 1;
		let h_edge = this.h - 1;
		for(let x = 0; x < this.w; x++){
			this.cells[x] = [];
			for(let y = 0; y < this.h; y++){
				if(x === 0 || x === w_edge || y === 0 || y === h_edge)this.cells[x][y] = Infinity;
				else this.cells[x][y] = ((x & 1 ^ 1) + (y & 1 ^ 1)) ** .5;
			}
		}


		
	}
}

function f_test(x_cells, y_cells, arr_distance, cells){
	let temp_arr = [];
	let neighboring_cells = [
		[-1, -1], [0, -1], [1, -1],
		[-1, 0], [1, 0],
		[-1, 1], [0, 1], [1, 1]
	];
	for(let cell_xy of neighboring_cells){
		let x = x_cells + cell_xy[0];
		let y = y_cells + cell_xy[1];
		let temp_distance = arr_distance[x_cells][y_cells] + cells[x][y];
		if(temp_distance < arr_distance[x][y]){
			arr_distance[x][y] = temp_distance;
			temp_arr.push([x, y]);
		}
	}

	return temp_arr;
}
let arr_distance = [];
function f_distance(x, y, tiles, cells){
	let x_cells = x * 2 + 1;
	let y_cells = y * 2 + 1;
	let width = cells.length;
	let height = cells[0].length;
	arr_distance = [];
	for(let x = 0; x < width; x++){
		arr_distance[x] = [];
		for(let y = 0; y < height; y++)arr_distance[x][y] = Infinity;
	}

	arr_distance[x_cells][y_cells] = cells[x_cells][y_cells];
	//alert(cells[x_cells][y_cells]);

	let temp_arr = f_test(x_cells, y_cells, arr_distance, cells);
	while(temp_arr.length){
		let temp_arr_2 = [];
		//alert(temp_arr.length);
		for(let i = 0; i < temp_arr.length; i++){
			temp_arr_2.push(...f_test(temp_arr[i][0], temp_arr[i][1], arr_distance, cells));
		}
		temp_arr = temp_arr_2;
	}


	for(let x = 0; x < tiles.length; x++)
		for(let y = 0; y < tiles[x].length; y++){
			let d = arr_distance[x * 2 + 1][y * 2 + 1];
			tiles[x][y].innerHTML = d.toFixed(3);
			//if(d >= 7 && d <= 10)tiles[x][y].style.backgroundColor = "#ccc";
		}



	/**
	let text = "";
	for(let i = 0; i < arr_distance.length; i++)text += arr_distance[i] + "\n";
	alert(text);
	/**/

	//alert(cells[x_cells][y_cells]);
}
let arr_path = [];
function out_path(x, y, tiles){
	for(let tiles_xy of arr_path)tiles[tiles_xy[0]][tiles_xy[1]].style.backgroundColor = "#fff";
	arr_path = [];

	let neighboring_cells = [
		[-1, -1], [0, -1], [1, -1],
		[-1, 0], [1, 0],
		[-1, 1], [0, 1], [1, 1]
	];
	
	let x_cells = x * 2 + 1;
	let y_cells = y * 2 + 1;
	let temp_min = arr_distance[x_cells][y_cells];
	let temp_coor = [x, y];
	out(temp_min);
	while(temp_min !== 0 && temp_min !== Infinity){
		for(let cell_xy of neighboring_cells){
			x_cells = (x + cell_xy[0]) * 2 + 1;
			y_cells = (y + cell_xy[1]) * 2 + 1;
			if(x_cells > 0 && y_cells > 0 && x_cells < arr_distance.length && y_cells < arr_distance[x_cells].length){
				if(temp_min > arr_distance[x_cells][y_cells]){
					temp_min = arr_distance[x_cells][y_cells];
					temp_coor[0] = x + cell_xy[0];
					temp_coor[1] = y + cell_xy[1];
				}
			}
		}
		arr_path.push([x, y]);
		x = temp_coor[0];
		y = temp_coor[1];
	}


	for(let tiles_xy of arr_path)tiles[tiles_xy[0]][tiles_xy[1]].style.backgroundColor = "#f00";
}


function main(elm_view_game){
	// настройка элемента отображения игры.
	//elm_view_game.innerHTML = "main";
	let fild = new TestField(28,28);
	let cells = fild.cells;
	/**
	cells[3][1] = Infinity;
	cells[3][2] = Infinity;
	cells[3][3] = Infinity;
	cells[3][4] = Infinity;
	cells[3][5] = Infinity;
	cells[3][6] = Infinity;
	cells[3][7] = Infinity;
	/**/


	let text = "";
	for(let i = 0; i < cells.length; i++)text += cells[i] + "\n";

	const tile_size = 40;
	var tiles = [];
	let i = 0;
	
	let elm_left = 0;
	let elm_target;
	for(let x = 0; x < fild.width; x++){
		let elm_tpo = 0;
		tiles[x] = [];
		for(let y = 0; y < fild.height; y++){
			tiles[x][y] = createElement("div", ["style", "top: " + elm_tpo + "px; left: " + elm_left + "px;"]);
			tiles[x][y].innerHTML = x + "<br>" + y;
			tiles[x][y].onclick = e => {
				for(let tiles_xy of arr_path)tiles[tiles_xy[0]][tiles_xy[1]].style.backgroundColor = "#fff";
				arr_path = [];

				if(elm_target)elm_target.style.backgroundColor = "#fff";
				elm_target = e.target;
				elm_target.style.backgroundColor = "#aaa";
				f_distance(x, y, tiles, cells);
			};
			tiles[x][y].onmouseover = e => {
				//out(x + " " + y + " " + (++i));
				if(arr_distance.length)out_path(x, y, tiles);
			};
			
			elm_view_game.appendChild(tiles[x][y]);
			elm_tpo += tile_size;
		}
		elm_left += tile_size;
	}



	//alert(text);

	return;
	/**/
	// FOR TESTS
	// 1.4142135623730951 перемещение по диагонали.
	let row_battle_field = 10;
	let col_battle_field = 10;
	
	
	let battle_field = [];
	for(let x = 0; x < row_battle_field; x++){
		battle_field[x] = [];
		for(let y = 0; y < col_battle_field; y++)
			battle_field[x][y] = new Field;
	}
	elm_view_game.innerHTML = "<textarea>" + JSON.stringify(battle_field, null, "\t") + "</textarea>";
	/**/

}


