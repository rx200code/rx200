//Внешние данные для тестов.
let test_counter = 0;// для тестов
//if(++test_counter % 10000 === 0)alert(1);
var army = [
	{
		hp: 3,
		hp_t: 3,
		mp: 4,
		mp_t: 4,
		dmg: 2,
		r_dmg: 1,
		cost: 1,
		player: true,
		current: true,
		border: [
			0, 10,
			-15, -15,
			-15, -40,
			-5, -50,
			5, -50,
			15, -40,
			15, -15
		]
	},
	{
		hp: 3,
		hp_t: 3,
		mp: 2,
		mp_t: 2,
		dmg: 1,
		r_dmg: 3,
		cost: 2,
		player: true,
		current: false,
		border: [
			0, 10,
			-15, -15,
			-15, -40,
			0, -55,
			15, -40,
			15, -15
		]
	},
	{
		hp: 3,
		hp_t: 3,
		mp: 4,
		mp_t: 4,
		dmg: 2,
		r_dmg: 1,
		cost: 1,
		player: false,
		current: false,
		border: [
			0, 10,
			-15, -15,
			-15, -40,
			-5, -50,
			5, -50,
			15, -40,
			15, -15
		]
	},
	{
		hp: 3,
		hp_t: 3,
		mp: 2,
		mp_t: 2,
		dmg: 1,
		r_dmg: 3,
		cost: 2,
		player: false,
		current: false,
		border: [
			0, 10,
			-15, -15,
			-15, -40,
			0, -55,
			15, -40,
			15, -15
		]
	}
];
army.forEach(num => num.border.forEach((num, i, arr) => arr[i] *= 2.5));

var units;
var current_unit_i = 0;

function test_run(){
	army[current_unit_i].current = false;
	army[current_unit_i].mp_t = army[current_unit_i].mp;// Восполняем очки действия.
	current_unit_i = (current_unit_i + 1) % army.length;
	if(army[current_unit_i].hp_t <= 0){// мёртв
		for(let i = 1; i < army.length; i++){
			if(army[(current_unit_i + i) % army.length].hp_t > 0){
				current_unit_i = (current_unit_i + i) % army.length;
				break;
			}
		}
	}
	army[current_unit_i].current = true;
}

function test_at(id, id_2){
	units[id_2].hp_t -= units[id].dmg;
	if(units[id_2].hp_t <= 0){// если умер удаляем
		units[id_2] = null;
	}
}

function test_click(){
	
	
	//// вычисляем гекс под мышью.
	// Координаты мыши в системе гексогонов.
	let x = mouse_x - field_x;
	let y = mouse_y - field_y;
	// 1. Масштабируем пиксели относительно геометрии сетки
	// Приводим базисные векторы к прямоугольной сетке ромбов
	const scaleX = x / (cell_r * SQRT_3);
	const scaleY = y / (cell_r_h * SQRT_3);
	// 2. Проекция на косые гексагональные оси
	const temp = Math.floor(scaleX + SQRT_3 * scaleY + 1);
	// 3. Вычисление чистых осевых координат q и r без if-else
	const q_click = Math.floor((Math.floor(2 * scaleX + 1) + temp) / 3);
	const r_click = Math.floor((temp + Math.floor(-scaleX + SQRT_3 * scaleY + 1)) / 3);
	// id
	
	let q_2 = (q_click - ((r_click + 1) >> 1));
	let id_click = -1;
	if(r_click >= 0 && r_click < CELLS_H && q_2 >= 0 && q_2 < (CELLS_LONG_W - (r_click & 1)))
		id_click = r_click * CELLS_LONG_W - (r_click >> 1) + q_2;

	if(id_click !== -1){// действие.
		// вычисляем id, q и r активного.
		let id_activ = -1;
		let q_activ, r_activ;
		for(let i = 0; i < CELLS_LENGTH; i++){
			if(units[i]?.current){
				id_activ = i;
				r_activ = id_activ / CELLS_PAIR_W_2 | 0;
				q_activ = id_activ - r_activ * CELLS_W;
				break;
			}
		}
		if(id_activ !== -1){// действие.
			// TEST
			/*
			out("id_click: " + id_click + ", q: " + q_click + ", r: " + r_click + "<br>" +
				"id_activ: " + id_activ + ", q: " + q_activ + ", r: " + r_activ + "<br>"
			);
			/**/
			// действие.
			// 1. Если клетка пустая то передвижение туда.
			// 1.1. Если очков действия нет и атаковать некого, конец хода.
			// 1.2. Иначе(1.1.) return.

			// 2. Если юнит.
			// 2.1. Если свой, return.
			// 2.2. Если чужой.
			// 2.2.1. Если в зоне поражения, атакуем. конец хода.
			// 2.2.2. Если не в зоне поражения.
			// 2.2.2.1. Перемещаемся, пока не будет в зоне поражения и атакуем. конец хода.
			// 2.2.2.2. Если на макс перемещение вражеский юнит не в зоне поражения. Перемещаемся в его сторону.
			// 2.2.2.2.1. если других врагов нет в зоне поражения, конец хода.
			// 2.2.2.2.2. Иначе(2.2.2.2.1.) return.


			//units[16] = units[17];// для теста


			// заполняем массив дистанции передвижения.
			let arr_distance = new Array(CELLS_LENGTH).fill(Infinity);
			let neighboring_cells = [// шаблон соседних клеток по q и r. по часовой стрелки.
				[-1, -1], [0, -1], [1, 0], [1, 1], [0, 1], [-1, 0]
			];

			let cost_move = 1;//Стандартная цена хода.
			let temp_arr = [[q_activ, r_activ]];//Начальная позиция юнита, соседей которого нужно проверить.

			let mp_move = 0;
			arr_distance[id_activ] = mp_move;//id позиции юнита и сколько на ней очков передвижения.
			//let movements = [[active_unit, 0]];//id позиции юнита и сколько на ней очков передвижения.
			mp_move += cost_move;

			while(temp_arr.length){
				let temp_arr_2 = [];
				for(let i = 0; i < temp_arr.length; i++){//Перебираем проверяемые клетки.
					for(let cell_qr of neighboring_cells){//Перебираем соседей.

						// проверяемые координаты клетки.
						let q_cell = temp_arr[i][0] + cell_qr[0];
						let r_cell = temp_arr[i][1] + cell_qr[1];

						if(r_cell >= 0 && r_cell < CELLS_H){// Если клетка есть по вертикали.
							let q_cell_2 = (q_cell - ((r_cell + 1) * .5 | 0));
							if(q_cell_2 >= 0 && q_cell_2 < (CELLS_LONG_W - (r_cell & 1))){// Если клетка есть по горизонтали.
								let id_cell = r_cell * CELLS_LONG_W - (r_cell / 2 | 0) + q_cell_2;// находим ид клетки.
								if(units[id_cell] === null){//Проверяем что клетка не занята.
									if(arr_distance[id_cell] === Infinity){//Клетки нет в проверенных
										arr_distance[id_cell] = mp_move;//добавляем клетку в проверенные.
										temp_arr_2.push([q_cell, r_cell]);//добавляем клетку чтоб проверить соседей.
									}else{//Клетка есть в проверенных
										if(mp_move < arr_distance[id_cell]){//Проверяем не быстрее ли, пришли по новому пути.
											arr_distance[id_cell] = mp_move;// добавляем в клетку новую скорость.
										}
									}
								}
							}
						}
					}
				}
				temp_arr = temp_arr_2;
				mp_move += cost_move;
			}

			// Ищем путь.
			let arr_path = [];

			let temp_id = id_click;
			let temp_q = q_click;
			let temp_r = r_click;
			let min_mp = arr_distance[id_click];

			do{
				arr_path.push([temp_q, temp_r, temp_id, min_mp]);
				for(let cell_qr of neighboring_cells){//Перебираем соседей.
					// проверяемые координаты клетки.
					let q_cell = arr_path[arr_path.length - 1][0] + cell_qr[0];
					let r_cell = arr_path[arr_path.length - 1][1] + cell_qr[1];
					if(r_cell >= 0 && r_cell < CELLS_H){// Если клетка есть по вертикали.
						let q_cell_2 = (q_cell - ((r_cell + 1) * .5 | 0));
						if(q_cell_2 >= 0 && q_cell_2 < (CELLS_LONG_W - (r_cell & 1))){// Если клетка есть по горизонтали.
							let id_cell = r_cell * CELLS_LONG_W - (r_cell / 2 | 0) + q_cell_2;// находим ид клетки.

							if(arr_distance[id_cell] < min_mp){
								temp_q = q_cell;
								temp_r = r_cell;
								temp_id = id_cell;
								min_mp = arr_distance[id_cell];
							}
						}
					}
				}
			}while(min_mp < arr_path[arr_path.length - 1][3]);

			//out(arr_path.map(arr => arr[3]));



			// действие.
			if(units[id_click] === null){// 1. Если клетка пустая то передвижение туда(в сторону).
				for(let i = 0; i < arr_path.length - 1; i++){
					if(arr_path[i][3] <= units[id_activ].mp_t){
						units[id_activ].mp_t -= arr_path[i][3];
						units[arr_path[i][2]] = units[id_activ];
						units[id_activ] = null;
						id_activ = arr_path[i][2];
						// 1.1. Если очков действия нет и атаковать некого, конец хода.
						let flag_not_d = true;
						for(let j = 0; j < CELLS_LENGTH; j++){
							if(units[j] !== null && units[j].player !== units[id_activ].player){
								let r_at = j / CELLS_PAIR_W_2 | 0;
								let q_at = j - r_at * CELLS_W;

								let dq = arr_path[i][0] - q_at;
								let dr = arr_path[i][1] - r_at;
								let distance = Math.max(Math.abs(dq), Math.abs(dr), Math.abs(dq - dr));
								
								if(distance <= units[id_activ].r_dmg){
									flag_not_d = false;
									break;
								}
							}
						}
						if(flag_not_d && units[id_activ].mp_t <= 0)test_run();// конец хода.
						// 1.2. Иначе(1.1.) return.
						break;
					}
				}
			}else{// 2. Если юнит.
				if(units[id_click].player === units[id_activ].player){
					// 2.1. Если свой, return.
				}else{// 2.2. Если чужой.
					// 2.2.1. Если в зоне поражения, атакуем. конец хода.
					let dq = q_activ - q_click;
					let dr = r_activ - r_click;
					let distance = Math.max(Math.abs(dq), Math.abs(dr), Math.abs(dq - dr));
					if(distance <= units[id_activ].r_dmg){
						test_at(id_activ, id_click);
						test_run();
					}else{// 2.2.2. Если не в зоне поражения.
						if(arr_path.length > 1){
							// 2.2.2.1. Перемещаемся, пока не будет в зоне поражения и атакуем. конец хода.
							for(let i = arr_path.length - 2; i > 0; i--){
								if(units[id_activ].mp_t >= arr_path[i][3]){
									let dq = arr_path[i][0] - q_click;
									let dr = arr_path[i][1] - r_click;
									let distance = Math.max(Math.abs(dq), Math.abs(dr), Math.abs(dq - dr));
									if(distance <= units[id_activ].r_dmg){
										units[id_activ].mp_t -= arr_path[i][3];
										units[arr_path[i][2]] = units[id_activ];
										units[id_activ] = null;
										id_activ = arr_path[i][2];
										test_at(id_activ, id_click);
										test_run();
										break;
									}
								}else{// 2.2.2.2. Если на макс перемещение вражеский юнит не в зоне поражения. Перемещаемся в его сторону.
									i++;
									units[id_activ].mp_t -= arr_path[i][3];
									units[arr_path[i][2]] = units[id_activ];
									units[id_activ] = null;
									id_activ = arr_path[i][2];

									let flag_not_d = true;
									for(let j = 0; j < CELLS_LENGTH; j++){
										if(units[j] !== null && units[j].player !== units[id_activ].player){
											let r_at = j / CELLS_PAIR_W_2 | 0;
											let q_at = j - r_at * CELLS_W;

											let dq = arr_path[i][0] - q_at;
											let dr = arr_path[i][1] - r_at;
											let distance = Math.max(Math.abs(dq), Math.abs(dr), Math.abs(dq - dr));
											
											if(distance <= units[id_activ].r_dmg){
												flag_not_d = false;
												break;
											}
										}
									}
									if(flag_not_d && units[id_activ].mp_t <= 0)test_run();// конец хода.

									// 2.2.2.2.1. если других врагов нет в зоне поражения, конец хода.
									break;
								}
							}

							
						}
						// 2.2.2.2.2. Иначе(2.2.2.2.1.) return.
					}
				}
			}
		}
	}

}

// дано произвольные иды, нужно составить рамку.
var test_ids = [8,9,15,17,23,24];
// 1. берем каждый ид, и записываем его грани одним числом, и добавляем в сет.
// 2. соеденяем все грани, в пути, по общим точкам. пока не получатся кольца.
/*
function f_test(id){
	let r = id / CELLS_PAIR_W_2 | 0;
	let q = id - r * CELLS_W;
	return [id, q, r];
}
/**/
/*
	for(let i = 0; i < CELLS_LENGTH; i++){
		let x = i % CELLS_PAIR_W % CELLS_LONG_W;
		let y = i / CELLS_PAIR_W * 2 | 0;

		let offset_x = x * cell_step_w + field_x;
		let offset_y = y * cell_step_h + field_y;
		if(y & 1)offset_x += cell_half_w;

		ctx.moveTo(offset_x - cell_half_w, offset_y - cell_half_r_h);
		ctx.lineTo(offset_x, offset_y - cell_r_h);
		ctx.lineTo(offset_x + cell_half_w, offset_y - cell_half_r_h);
		ctx.lineTo(offset_x + cell_half_w, offset_y + cell_half_r_h);
		ctx.lineTo(offset_x, offset_y + cell_r_h);
		ctx.lineTo(offset_x - cell_half_w, offset_y + cell_half_r_h);
		ctx.closePath();
	}
/**/
var loops = [];
function test_get_paths(arr_ids){
	// Улучшения
	let cell_index_map = new Map(arr_ids.map((id, idx) => [id, idx]));
	//* Вариант 2
	// 1. создаем массиы с 63 заместо идов
	let edges_all = new Array(arr_ids.length).fill(63);

	// 2. Выбиваем грани соседей
	let neighboring_cells = [// шаблон соседних клеток по q и r. по часовой стрелки.
		[-1, -1], [0, -1], [1, 0], [1, 1], [0, 1], [-1, 0]
	];
	for(let i = 0; i < edges_all.length; i++){
		let r = arr_ids[i] / CELLS_PAIR_W_2 | 0;
		let q = arr_ids[i] - r * CELLS_W;
		for(let n = 0, m = 32; n < neighboring_cells.length; n++, m >>>= 1){
			if(edges_all[i] & m){
				let q_cell = q + neighboring_cells[n][0];
				let r_cell = r + neighboring_cells[n][1];
				if(r_cell >= 0 && r_cell < CELLS_H){// Если клетка есть по вертикали.
					let q_cell_2 = (q_cell - (r_cell + 1 >> 1));
					if(q_cell_2 >= 0 && q_cell_2 < (CELLS_LONG_W - (r_cell & 1))){// Если клетка есть по горизонтали.
						let id_cell = r_cell * CELLS_LONG_W - (r_cell >> 1) + q_cell_2;// находим ид клетки.
						let j = arr_ids.indexOf(id_cell);
						if(j !== -1){//Проверяем что клетка есть.
							edges_all[i] ^= m;
							edges_all[j] ^= (m & 7) ? m << 3: m >>> 3;
						}
					}
				}
			}
		}
	}
	//alert("4: " + edges_all.map(elm => elm.toString(2).padStart(6, '0')));
	// 3. Составляем путь по соседям выбивая оставшиеся грани.
	// 4. повторяем пункт 3 пока не занулим все.
	//*
	loops = [];
	let m = 32;
	let x, y;
	for(let i = 0; i < edges_all.length; i++){
		if(edges_all[i]){// собираем путь
			let current_path = [];
			// проверяем какая грань есть и идем вдоль неё
			while(m > 0){
				if(edges_all[i] & m){
					edges_all[i] ^= m;
					
					if(current_path.length === 0){// Определяем первую точку. остальные по смещению.
						// определяем координаты центра гекса
						x = arr_ids[i] % CELLS_PAIR_W % CELLS_LONG_W;
						y = arr_ids[i] / CELLS_PAIR_W * 2 | 0;
						x *= W;
						if(y & 1)x += HALF_W;
						y *= STEP_H;
						
						if(m === 32){// смещение относительно центра
							x -= HALF_W;
							y -= HALF_R_H;
						}else if(m === 16){
							y -= R_H;
						}else if(m === 8){
							x += HALF_W;
							y -= HALF_R_H;
						}else if(m === 4){
							x += HALF_W;
							y += HALF_R_H;
						}else if(m === 2){
							y += R_H;
						}else if(m === 1){
							x -= HALF_W;
							y += HALF_R_H;
						}
					}

					// добавляем точку в путь
					current_path.push(x);
					current_path.push(y);

					if(m === 32)m = 1;
					else m <<= 1;

					if((edges_all[i] & m) === 0){// меняем клетку.
						let n = Math.clz32(m) - 26;

						if(m > 2)m >>>= 2;
						else m <<= 4;

						// определяем i тоесть id соседа.
						let r = arr_ids[i] / CELLS_PAIR_W_2 | 0;
						let q = arr_ids[i] - r * CELLS_W;

						q += neighboring_cells[n][0];
						r += neighboring_cells[n][1];

						//i = arr_ids.indexOf(r * CELLS_W + q);
						i = cell_index_map.get(r * CELLS_W + q);
						
					}

					if(m === 32){// смещение относительно начала ребра в конец ребра.
						x -= HALF_W;
						y += HALF_R_H;
					}else if(m === 16){
						x -= HALF_W;
						y -= HALF_R_H;
					}else if(m === 8){
						y -= R_H;
					}else if(m === 4){
						x += HALF_W;
						y -= HALF_R_H;
					}else if(m === 2){
						x += HALF_W;
						y += HALF_R_H;
					}else if(m === 1){
						y += R_H;
					}

					continue;
				}else m >>>= 1;
			}
			i = -1;
			loops.push(current_path);
			/*
			if(loops.length > 100){
				alert("3: " + edges_all.map(elm => elm.toString(2).padStart(6, '0')));// тут ошибка
				//2: 8,		9,		15,		17,		23,	24
				//4: 110101,111010,101011,011101,010111,101110
				//3: 000100,000010,001000,000001,010000,100000
				break;
			}
			/**/
			m = 32;
			continue;
		}else m = 32;
	}
	
	
	//out(loops);
	/**/


	/**/

	/* Вариант 1
	let text_out = "";
	let edges = new Set();
	for(let i = 0; i < arr_ids.length; i++){
		let r = arr_ids[i] / CELLS_PAIR_W_2 | 0;
		let q = arr_ids[i] - r * CELLS_W;
		// Сдвигаем сетку чтоб избежать отрицательных значений.
		q++;
		r++;
		q <<= 1;
		r <<= 1;
		// Грани от меньшей к большей, с лева направа, сверху вниз.
		// 1. грань.
		edges.add(((q - 1) << 16) | (r - 1));
		edges.add((q << 16) | (r - 1));
		edges.add(((q - 1) << 16) | r);
		edges.add(((q + 1) << 16) | r);
		edges.add((q << 16) | (r + 1));
		edges.add(((q + 1) << 16) | (r + 1));
		//text_out += "q: " + q + ", r: " + r + ", id: <b>" + arr_ids[i] + "</b><br>";
	}

	//alert(JSON.stringify(loops, null, '\t'));
	/**/
	/*
	let text_out = "";
	for(let i = 0; i < edges_all.length; i++){
		text_out += "<b>id" + arr_ids[i] + "</b>, b: " + edges_all[i].toString(2).padStart(6, '0') + "<br>";
	}
	out(text_out);
	/**/
}


// Константы переменные.
var seed = 0x77777777;//(Math.random() * 0x100000000) >>> 0;//0x77777777;//сид для рандома.

var container;// Контенер который передается в котором будет рисоваться вся графика.
var canvas;// основной холст в контейнере.
var canvas_w;// ширина холста.
var canvas_h;// высота холста.
var ctx;// контекст основного холста для рисования.

// вариант для прямоугольной сетки.
const CELLS_W = 17;//ширина в гексах
const CELLS_H = 11;//высота в гексах
const CELLS_LONG_W = CELLS_W + 1;//ширина в гексах на крае. тоесть чтоб углы были одинаковы, соседи два гекса.
const CELLS_PAIR_W = CELLS_W + CELLS_LONG_W;//ширина в сумме соседних строк.
const CELLS_PAIR_W_2 = CELLS_PAIR_W / 2;
const CELLS_LENGTH = CELLS_LONG_W * CELLS_H - (CELLS_H >> 1);//общее количество гексов

// вариант для шестиугольной сетки.
const CELLS_RADIUS = 5;//радиус в гексах
const CELLS_D = (CELLS_RADIUS - 1) * 2 + 1;//диаметр поля в гексах (он же максимальная ширина и высота)
const CELLS_LENGTH_HEX = 3 * CELLS_RADIUS * (CELLS_RADIUS - 1) + 1;//общее количество гексов

// Гексы
const SQRT_3 = Math.sqrt(3);// INNER_RATIO
const R = 80;// радиус сектора.
const W = SQRT_3 * R; // Ширина прямоугольного сектора
const COMPRESSION_H = .72;// Коэффицент сжатия по высоте.
const R_H = R * COMPRESSION_H;// радиус сектора по высоте.

const HALF_W = W * .5;// Половина ширины
const HALF_R_H = R_H * .5;
const STEP_H = R_H * 1.5;


var cell_r = R;// текущий радиус сектора.
var cell_r_h = R_H;// текущий радиус сектора по высоте.
var cell_step_h = cell_r_h * 1.5;// расстояние по высоте между центрами ячеек(смещение ряда)
var cell_half_r_h = cell_r_h * .5;// половина радиуса по высоте (используется для смещения рядов/колонок)
var cell_step_w = cell_r * SQRT_3;// расстояние по ширине между центрами ячеек(inner_cell_d - внутренний диаметр сектора)
var cell_half_w = cell_step_w * .5;// половина расстояния по ширине(inner_cell_r - внутренний радиус сектора)

// Вычисляем ширину и высоту поля.
var field_w = cell_step_w * CELLS_LONG_W;//Ширина поля
var field_h = cell_step_h * (CELLS_H - 1) + cell_r_h * 2;//Высота поля

// отступы.
const MARGIN_COEF_TOP = 1.7;
var margin_field = cell_step_w;
var margin_top_field = margin_field * MARGIN_COEF_TOP;
//var horizon_y = margin_top_field * .5;

// размер видимой области.
var view_w = field_w + margin_field * 2;
var view_h = field_h + margin_field + margin_top_field;
const DEFAULT_VIEW_W = view_w;
const DEFAULT_VIEW_H = view_h;

// Координаты центра нулевого(первого) гекса.
var field_x = 0;
var field_y = 0;

// Положение поля и масштаб.
var view_x = 0;
var view_y = 0;
var view_z = 1;
var step_z = .9;//шаг масштабирования
var step_inv_z = 1 / step_z;

// ограничения
var view_x_max;
var view_x_min;
var view_y_max;
var view_y_min;
const MAX_ZOOM = 150 / R;
var view_z_max;// = view_z * Math.pow(step_inv_z, Math.round(Math.log(MAX_ZOOM / view_z) / Math.log(step_inv_z)));// близко к MAX_ZOOM.
var view_z_min;// = view_z * step_z;

var border_x, border_y, border_w, border_h;

var mouse_x = 0;
var mouse_y = 0;

var matrix = {// Матрица без изменений (единичная):
	a: 1,// масштаб по оси X (scaleX). Принимает значение косинуса при повороте.
	b: 0,// наклон (skew) по оси Y. Принимает значение синуса при повороте.
	c: 0,// наклон (skew) по оси X. Принимает значение минус синуса при повороте.
	d: 1,// масштаб по оси Y (scaleY). Принимает значение косинуса при повороте.
	e: 0,// сдвиг (трансляция) по оси X (translateX).
	f: 0//  сдвиг (трансляция) по оси Y (translateY).
};

// Константы графики.
const GRID_STROKE_W = R * .0375;
const GRID_STROKE_STYLE = "#0004";
// цвета
const C_SKY_1 = '#93C5FD';// 7BA1BA // 5FA8E9 // 60A5FA // 7DD3FC
const C_SKY_2 = '#BFDBFE';// A4C2D4 // 9ECBF5 // BFDBFE
const C_SKY_3 = '#F1F5F9';// F1F5F9 // E3F1FD //  FEF3C7 // FCE7F3
const C_FOG = '#251B22';// 0C121C // 1C120C // 251B22

// Инициализация графики
var pattern_sand;// sand - песок
var pattern_margin_top;// паттерн неба и затемнения к горизонту
async function init_graphics(){
	const CANVAS_WH = 2048;
	let temp_canvas = window.OffscreenCanvas ? new OffscreenCanvas(CANVAS_WH, CANVAS_WH): document.createElement('canvas');//для совместимости
	let t_ctx = temp_canvas.getContext('2d');
	//transferToImageBitmap(), convertToBlob()

	// создаем текстуры
	let size_wh = 256;
	let img_data = t_ctx.createImageData(size_wh, size_wh);
	const buf_32 = new Uint32Array(img_data.data.buffer);
	for(let i = 0; i < buf_32.length; i++){
		// 1. Быстрое перемешивание
		let h = (i ^ seed) >>> 0;
		h = ((h >>> 16) ^ h) * 0x45d9f3b;
		h = ((h >>> 16) ^ h) * 0x45d9f3b;
		h = (h >>> 16) & 255; 

		// Яркий песочный цвет (основной тон меняется от 215 до 255)
		const r = 215 + (Math.abs(h) * 0.15) | 0;
		// Записываем пиксель в формате ABGR (зеленый чуть меньше красного, синий сильно занижен для сочности)
		buf_32[i] = (255 << 24) | ((r - 120) << 16) | ((r - 25) << 8) | r;
	}
	//для ускорения на старых устройствах делаем через putImageData
	//let bitmap = await createImageBitmap(img_data);
	t_ctx.putImageData(img_data, 0, 0);
	let bitmap = await createImageBitmap(temp_canvas, 0, 0, size_wh, size_wh);
	t_ctx.clearRect(0, 0, CANVAS_WH, CANVAS_WH);//очищаем холст(весь очистить быстрее чем часть).
	pattern_sand = ctx.createPattern(bitmap, 'repeat');
	bitmap.close(); // Память очищена
	
	// создаем градиент неба и затемнения к горизонту
	let h = Math.ceil(margin_top_field);// проблемы если h больше canvas.height // решается canvas.height = h; и canvas.height = canvas_h;
	let temp_grad = t_ctx.createLinearGradient(0, 0, 0, h);
	temp_grad.addColorStop(0, C_SKY_1);// 7BA1BA // 5FA8E9 // 60A5FA
	temp_grad.addColorStop(.25, C_SKY_2);// A4C2D4 // 9ECBF5 // BFDBFE
	temp_grad.addColorStop(.5, C_SKY_3);// F1F5F9 // E3F1FD //  FEF3C7
	temp_grad.addColorStop(.5, C_FOG +'D9');// 0C121CD9
	temp_grad.addColorStop(.55, C_FOG + 'B3');// 0C121CB3
	temp_grad.addColorStop(.65, C_FOG + '66');// 0C121C66
	temp_grad.addColorStop(.8, C_FOG +'1F');// 0C121C1F
	temp_grad.addColorStop(.9, C_FOG +'0F');// '#0000'
	temp_grad.addColorStop(1, C_FOG +'00');
	//temp_grad.addColorStop(.9, '#0000');// '#0000'
	//temp_grad.addColorStop(1, '#0000');
	t_ctx.fillStyle = temp_grad;
	t_ctx.fillRect(0, 0, 1, h);
	bitmap = await createImageBitmap(temp_canvas, 0, 0, 1, h);
	pattern_margin_top = ctx.createPattern(bitmap, 'repeat-x');
	bitmap.close();

	// Рисуем в атлас(temp_canvas) объекты фона.

	// Рисуем в атлас объекты поля.

	// Рисуем в атлас внешние объекты юнитов.





	// Очищаем временный холст
	temp_canvas.width = 0; 
	temp_canvas.height = 0;
	t_ctx = null;
	temp_canvas = null;
}

function init_view(){
	let zoom_w = canvas_w / DEFAULT_VIEW_W;
	let zoom_h = canvas_h / DEFAULT_VIEW_H;
	view_z = Math.min(zoom_w, zoom_h);

	cell_r = R * view_z;
	cell_r_h = R_H * view_z;
	cell_step_h = cell_r_h * 1.5;
	cell_half_r_h = cell_r_h * .5;
	cell_step_w = cell_r * SQRT_3;
	cell_half_w = cell_step_w * .5;

	// Вычисляем ширину и высоту поля.
	field_w = cell_step_w * CELLS_LONG_W;
	field_h = cell_step_h * (CELLS_H - 1) + cell_r_h * 2;

	// отступы.
	margin_field = cell_step_w;
	margin_top_field = margin_field * MARGIN_COEF_TOP;

	// размер видимой области.
	view_w = field_w + margin_field * 2;
	view_h = field_h + margin_field + margin_top_field;
	
	view_x = (canvas_w - view_w) * .5;
	view_y = (canvas_h - view_h) * .5;

	field_x = view_x + margin_field + cell_half_w;
	field_y = view_y + margin_top_field + cell_r_h;

	// ограничения
	view_z_max = view_z * Math.pow(step_inv_z, Math.round(Math.log(MAX_ZOOM / view_z) / Math.log(step_inv_z)));
	view_z_min = view_z * step_z;

	border_x = (canvas_w * (view_z - view_z_min)) / (view_z * view_z_min);
	border_w = border_x + canvas_w / view_z;
	border_x = border_x * .5 + view_x / view_z

	border_y = (canvas_h * (view_z - view_z_min)) / (view_z * view_z_min);
	border_h = border_y + canvas_h / view_z;
	border_y = border_y * .5 + view_y / view_z
	
	view_x_max = border_x * view_z;
	view_y_max = border_y * view_z;
	view_x_min = view_x_max - border_w * view_z + canvas_w;
	view_y_min = view_y_max - border_h * view_z + canvas_h;
	
}

function init_field(){
	// Заполняем массив юнитов для тестов.
	units = new Array(CELLS_LENGTH).fill(null);
	let i_player = 0;
	let i_ai = CELLS_W;
	for(let i = 0; i < army.length; i++){// для тестов такое размещение войск пойдет.
		let y = i / CELLS_PAIR_W * 2 | 0;
		if(army[i].player){
			units[i_player] = army[i];
			i_player += y & 1 ? CELLS_W: CELLS_LONG_W;
		}else{
			units[i_ai] = army[i];
			i_ai += y & 1 ? CELLS_LONG_W: CELLS_W;
		}
	}



	// Вешеем события.
	let offsetX, offsetY, isDragging = false;
	canvas.addEventListener("mousemove", e => {
		mouse_x = e.offsetX;
		mouse_y = e.offsetY;

		if(isDragging){
			view_x += e.movementX;
			view_y += e.movementY;

			if(view_x < view_x_min)view_x = view_x_min;
			else if(view_x > view_x_max)view_x = view_x_max;
			if(view_y < view_y_min)view_y = view_y_min;
			else if(view_y > view_y_max)view_y = view_y_max;

			field_x = view_x + margin_field + cell_half_w;
			field_y = view_y + margin_top_field + cell_r_h;
		}
		draw_field();
		
	});

	canvas.addEventListener('mousedown', e => {
		isDragging = true;
		offsetX = e.clientX;
		offsetY = e.clientY;
	});
	canvas.addEventListener('mouseup', () => {
		isDragging = false;
	});
	canvas.addEventListener('mouseleave', () => {
		isDragging = false;
	});
	canvas.addEventListener('wheel', e => {
		e.preventDefault();
		let temp_z = view_z;
		view_z *= e.deltaY < 0 ? step_inv_z: step_z;
		
		if(view_z < view_z_min)view_z = view_z_min;
		else if(view_z > view_z_max)view_z = view_z_max;

		let offsetX = e.offsetX - view_x;
		let offsetY = e.offsetY - view_y;

		temp_z = view_z / temp_z;

		offsetX *= temp_z;
		offsetY *= temp_z;

		view_x = e.offsetX - offsetX;
		view_y = e.offsetY - offsetY;

		// доп
		cell_r = R * view_z;
		cell_r_h = R_H * view_z;
		cell_step_h = cell_r_h * 1.5;
		cell_half_r_h = cell_r_h * .5;
		cell_step_w = cell_r * SQRT_3;
		cell_half_w = cell_step_w * .5;

		// Вычисляем ширину и высоту поля.
		field_w = cell_step_w * CELLS_LONG_W;
		field_h = cell_step_h * (CELLS_H - 1) + cell_r_h * 2;

		// отступы.
		margin_field = cell_step_w;
		margin_top_field = margin_field * MARGIN_COEF_TOP;

		// размер видимой области.
		view_w = field_w + margin_field * 2;
		view_h = field_h + margin_field + margin_top_field;

		view_x_max = border_x * view_z;
		view_y_max = border_y * view_z;
		view_x_min = view_x_max - border_w * view_z + canvas_w;
		view_y_min = view_y_max - border_h * view_z + canvas_h;

		if(view_x < view_x_min)view_x = view_x_min;
		else if(view_x > view_x_max)view_x = view_x_max;
		if(view_y < view_y_min)view_y = view_y_min;
		else if(view_y > view_y_max)view_y = view_y_max;

		field_x = view_x + margin_field + cell_half_w;
		field_y = view_y + margin_top_field + cell_r_h;
		
		draw_field();
	}, { passive: false });
	//* На весь эеран
	canvas.addEventListener("dblclick", e => {
		//* для теста потом убрать
		let b_x_1 = canvas_w - 80;
		let b_x_2 = canvas_w - 20;
		let b_y_1 = canvas_h - 50;
		let b_y_2 = canvas_h - 20;
		if(e.offsetX >= b_x_1 && e.offsetX <= b_x_2 && e.offsetY >= b_y_1 && e.offsetY <= b_y_2)return;
		/**/

		// Проверяем, есть ли сейчас элемент в полноэкранном режиме
		if(document.fullscreenElement){
			// Если открыт, то закрываем полноэкранный режим
			document.exitFullscreen();
		}else{
			// Если закрыт, разворачиваем нужный элемент (например, ваш svg или canvas)
			// Замените "svg" на переменную вашего элемента, если она называется иначе
			canvas.requestFullscreen().catch(err => {
				alert(`Ошибка при переходе в полноэкранный режим: ${err.message}`);
			});
		}
	});

	//* TEST button
	canvas.addEventListener("click", e => {
		let b_x_1 = canvas_w - 80;
		let b_x_2 = canvas_w - 20;
		let b_y_1 = canvas_h - 50;
		let b_y_2 = canvas_h - 20;
		
		if(e.offsetX >= b_x_1 && e.offsetX <= b_x_2 && e.offsetY >= b_y_1 && e.offsetY <= b_y_2){
			test_run();
		}else{
			mouse_x = e.offsetX;
			mouse_y = e.offsetY;
			test_click();
		}

		draw_field();
	});
}

//Отрисовка.
function draw_bg(){
	matrix.a = view_z;
	matrix.d = view_z;
	matrix.e = view_x;
	matrix.f = view_y;
	pattern_sand.setTransform(matrix);

	ctx.fillStyle = C_SKY_1;
	ctx.fillRect(0, 0, canvas_w, canvas_h);
	ctx.fillStyle = pattern_sand;
	//ctx.fillRect(view_x, view_y, view_w, view_h);
	ctx.fillRect(0, view_y + view_z, canvas_w, canvas_h - view_y);

	pattern_margin_top.setTransform(matrix);
	ctx.fillStyle = pattern_margin_top;
	//ctx.fillRect(view_x, view_y, view_w, margin_top_field);
	ctx.fillRect(0, view_y, canvas_w, margin_top_field - view_z);

	// Отрисовка объекта фона.
	/* Место для отрисовки заднего плана, горизонт по середине.
	ctx.strokeStyle = '#F00';
	ctx.lineWidth = 1;
	//ctx.strokeRect(field_x - cell_half_w , view_y, field_w, margin_top_field);
	// Расширенный вариант.
	ctx.strokeRect(
		-border_x * view_z + view_x,
		-border_y * view_z + view_y,
		border_w * view_z,
		(view_y + margin_top_field) - (-border_y * view_z + view_y)
	);
	/**/

	/* TEST
	ctx.strokeStyle = '#000';
	ctx.lineWidth = 1;
	ctx.strokeRect(field_x - cell_half_w, field_y - cell_r_h, field_w, field_h);
	/**/
}

function draw_grid(){
	// 2. Рисуем поле.
	ctx.beginPath();
	ctx.strokeStyle = GRID_STROKE_STYLE;
	ctx.lineWidth = GRID_STROKE_W * view_z;
	ctx.lineCap = "round";
	
	for(let i = 0; i < CELLS_LENGTH; i++){
		let x = i % CELLS_PAIR_W % CELLS_LONG_W;
		let y = i / CELLS_PAIR_W * 2 | 0;

		let offset_x = x * cell_step_w + field_x;
		let offset_y = y * cell_step_h + field_y;
		if(y & 1)offset_x += cell_half_w;

		ctx.moveTo(offset_x - cell_half_w, offset_y - cell_half_r_h);
		ctx.lineTo(offset_x, offset_y - cell_r_h);
		ctx.lineTo(offset_x + cell_half_w, offset_y - cell_half_r_h);
		ctx.lineTo(offset_x + cell_half_w, offset_y + cell_half_r_h);
		ctx.lineTo(offset_x, offset_y + cell_r_h);
		ctx.lineTo(offset_x - cell_half_w, offset_y + cell_half_r_h);
		ctx.closePath();
	}

	//ctx.fill();
	ctx.stroke();
}

function draw_odj(){
	// рисуем юнитов
	let line_width = GRID_STROKE_W * view_z;
	ctx.lineCap = "round";

	// определяем юнита и сектор под курсором.
	let cells_offset = [// смещения секторов для проверки.
		[1, 2],
		[0, 1], [1, 1],
		[0, 0]
	];
	// Координаты мыши в системе гексогонов.
	let x = mouse_x - field_x;
	let y = mouse_y - field_y;
	// 1. Масштабируем пиксели относительно геометрии сетки
	// Приводим базисные векторы к прямоугольной сетке ромбов
	const scaleX = x / (cell_r * SQRT_3);
	const scaleY = y / (cell_r_h * SQRT_3);
	// 2. Проекция на косые гексагональные оси
	const temp = Math.floor(scaleX + SQRT_3 * scaleY + 1);
	// 3. Вычисление чистых осевых координат q и r без if-else
	let q = Math.floor((Math.floor(2 * scaleX + 1) + temp) / 3);
	let r = Math.floor((temp + Math.floor(-scaleX + SQRT_3 * scaleY + 1)) / 3);

	let active_unit = -1;
	for(let i = 0; i < cells_offset.length; i++){
		let q_t = q + cells_offset[i][0];
		let r_t = r + cells_offset[i][1];
		let q_2 = (q_t - ((r_t + 1) >> 1));
		let id = -1;
		if(r_t >= 0 && r_t < CELLS_H && q_2 >= 0 && q_2 < (CELLS_LONG_W - (r_t & 1))){
			id = r_t * CELLS_LONG_W - (r_t >> 1) + q_2;
			if(units[id] !== null){
				if(i == 3){// выбор по сектору
					active_unit = id;
				}else{
					let x_t = id % CELLS_PAIR_W % CELLS_LONG_W;
					let y_t = id / CELLS_PAIR_W * 2 | 0;
					let offset_x = x_t * cell_step_w + field_x;
					let offset_y = y_t * cell_step_h + field_y;
					if(y_t & 1)offset_x += cell_half_w;

					let m_x = (mouse_x - offset_x) / view_z;
					let m_y = (mouse_y - offset_y) / view_z;
					let len = units[id].border.length;
					let inside = false;
					for(let j = 0; j < len; j += 2){
						let x_1 = j;
						let y_1 = j + 1;
						let x_2 = (j + len - 2) % len;
						let y_2 = (j + len - 1) % len;

						let border = units[id].border;

						if(((border[y_1] > m_y) !== (border[y_2] > m_y)) &&
							(m_x < (border[x_2] - border[x_1]) * (m_y - border[y_1]) / (border[y_2] - border[y_1]) + border[x_1])
						){
							inside = !inside;
						}
					}
					if(inside){
						active_unit = id;
						break;
					}
				}
			}
		}
	}

	if(active_unit === -1)
		for(let i = 0; i < CELLS_LENGTH; i++)
			if(units[i]?.current){
				active_unit = i;
				break;
			}
	r = active_unit / CELLS_PAIR_W_2 | 0;
	q = active_unit - r * CELLS_W;
	// рисуем рамку ходов и стрельбы. у active_unity
	if(active_unit !== -1){// для теста
		// Вычисляем передвижение.
		
		let neighboring_cells = [// шаблон соседних клеток по q и r.
			[-1, -1], [0, -1],
			[-1, 0], [1, 0],
			[0, 1], [1, 1],
		];

		let cost_move = 1;//Стандартная цена хода.
		let mp = units[active_unit].mp_t;//Очков передвижения у юнита.

		let temp_arr = [[q, r]];//Начальная позиция юнита, соседей которого нужно проверить.
		let movements = [[active_unit, 0]];//id позиции юнита и сколько на ней очков передвижения.
		let mp_move = cost_move;

		while(temp_arr.length && mp_move <= mp){
			let temp_arr_2 = [];
			for(let i = 0; i < temp_arr.length; i++){//Перебираем проверяемые клетки.
				for(let cell_qr of neighboring_cells){//Перебираем соседей.

					// проверяемые координаты клетки.
					let q_cell = temp_arr[i][0] + cell_qr[0];
					let r_cell = temp_arr[i][1] + cell_qr[1];

					if(r_cell >= 0 && r_cell < CELLS_H){// Если клетка есть по вертикали.
						let q_cell_2 = (q_cell - ((r_cell + 1) * .5 | 0));
						if(q_cell_2 >= 0 && q_cell_2 < (CELLS_LONG_W - (r_cell & 1))){// Если клетка есть по горизонтали.
							let id_cell = r_cell * CELLS_LONG_W - (r_cell / 2 | 0) + q_cell_2;// находим ид клетки.
							if(units[id_cell] === null){//Проверяем что клетка не занята.

								// в будующем заменить findLastIndex на цикл перебора для скорости.
								let id_move = movements.findLastIndex(item => item[0] === id_cell);//проверяем нет ли клетки в проверенных.
								if(id_move === -1){//Клетки нет в проверенных
									movements.push([id_cell, mp_move]);//добавляем клетку в проверенные.
									temp_arr_2.push([q_cell, r_cell]);//добавляем клетку чтоб проверить соседей.
								}else{//Клетка есть в проверенных
									if(mp_move < movements[id_move][1]){//Проверяем не быстрее ли, пришли по новому пути.
										movements[id_move][1] = mp_move;// добавляем в клетку новую скорость.
									}
								}

							}
						}
					}
				}
			}
			temp_arr = temp_arr_2;
			mp_move += cost_move;
		}

		// отображаем клетки ходов.
		let arr_ids = [];
		for(let i = 0; i < movements.length; i++)arr_ids.push(movements[i][0]);
		test_get_paths(arr_ids);
		ctx.fillStyle = '#0004';
		ctx.strokeStyle = units[active_unit].player ? '#0A0': '#F00';
		ctx.lineWidth = line_width;
		ctx.beginPath();
		for(let i = 0; i < loops.length; i++){
			let j = 0;
			ctx.moveTo(loops[i][j++] * view_z + field_x, loops[i][j++] * view_z + field_y);
			while(j < loops[i].length)ctx.lineTo(loops[i][j++] * view_z + field_x, loops[i][j++] * view_z + field_y);
			ctx.closePath();
		}
		ctx.stroke();
		ctx.fill();

		//q = 9;
		//r = 4;

		// вычислякс клктки стрельбы удара. r_dmg
		let arr_ids_dmg = [];
		if(active_unit !== -1){// для теста
			let r_dmg = units[active_unit].r_dmg;//дальность стрельбы у юнита.
			// выводим инфу о юните атаку и хп
			info("<br>hp: " + units[active_unit].hp_t + "/" + units[active_unit].hp + "<br>at: " + units[active_unit].dmg);

			// 1. составляем список идов.
			// 2. выбиваем иды если туда стрелять нельзя.
			for(let r_t = -r_dmg; r_t <= r_dmg; r_t++){

				const qMin = Math.max(-r_dmg, r_t - r_dmg);
				const qMax = Math.min(r_dmg, r_t + r_dmg);

				for(let q_t = qMin; q_t <= qMax; q_t++){
					let q_cell = q_t + q;
					let r_cell = r_t + r;
					// вычисляем ид
					if(r_cell >= 0 && r_cell < CELLS_H){// Если клетка есть по вертикали.
						let q_cell_2 = (q_cell - ((r_cell + 1) * .5 | 0));
						if(q_cell_2 >= 0 && q_cell_2 < (CELLS_LONG_W - (r_cell & 1))){// Если клетка есть по горизонтали.
							let id_cell = r_cell * CELLS_LONG_W - (r_cell / 2 | 0) + q_cell_2;// находим ид клетки.
							if(units[id_cell] === null || units[id_cell].player !== units[active_unit].player){//  Проверяем не занята ли союзником
								arr_ids_dmg.push(id_cell);
							}
						}
					}
				}
			}
		}

		// отображаем клетки радиуса атаки
		
		test_get_paths(arr_ids_dmg);
		ctx.strokeStyle = '#000';//units[active_unit].player ? '#0A0': '#F00';
		ctx.lineWidth = line_width;
		ctx.setLineDash([10 * view_z, 20 * view_z]);
		ctx.beginPath();
		for(let i = 0; i < loops.length; i++){
			let j = 0;
			ctx.moveTo(loops[i][j++] * view_z + field_x, loops[i][j++] * view_z + field_y);
			while(j < loops[i].length)ctx.lineTo(loops[i][j++] * view_z + field_x, loops[i][j++] * view_z + field_y);
			ctx.closePath();
		}
		ctx.stroke();
		ctx.setLineDash([]);
		
	}
	


	for(let i = 0; i < CELLS_LENGTH; i++){
		if(units[i] !== null){
			// вычисляем положение центра клетки

			let x = i % CELLS_PAIR_W % CELLS_LONG_W;
			let y = i / CELLS_PAIR_W * 2 | 0;

			let offset_x = x * cell_step_w + field_x;
			let offset_y = y * cell_step_h + field_y;
			if(y & 1)offset_x += cell_half_w;

			if(units[i].current){// рисуем обводку сектора текущего юнита.
				ctx.strokeStyle = "#F80";
				ctx.lineWidth = line_width * 3;
				ctx.beginPath();
				ctx.moveTo(offset_x - cell_half_w, offset_y - cell_half_r_h);
				ctx.lineTo(offset_x, offset_y - cell_r_h);
				ctx.lineTo(offset_x + cell_half_w, offset_y - cell_half_r_h);
				ctx.lineTo(offset_x + cell_half_w, offset_y + cell_half_r_h);
				ctx.lineTo(offset_x, offset_y + cell_r_h);
				ctx.lineTo(offset_x - cell_half_w, offset_y + cell_half_r_h);
				ctx.closePath();
				ctx.stroke();
			}

			// рисуем юнита
			if(active_unit === i)ctx.lineWidth = line_width * 3;
			else ctx.lineWidth = line_width;


			ctx.strokeStyle = units[i].player ? '#0A0': '#F00';
			ctx.beginPath();
			ctx.moveTo(units[i].border[0] * view_z + offset_x, units[i].border[1] * view_z + offset_y);
			for(let j = 2; j < units[i].border.length;)
				ctx.lineTo(units[i].border[j++] * view_z + offset_x, units[i].border[j++] * view_z + offset_y);
			ctx.closePath();

			ctx.stroke();
			
		}
	}
	


}


function draw_ui(){
	//* TEST button
	ctx.strokeStyle = '#000';
	ctx.fillStyle = "#0004";
	ctx.lineWidth = 2;
	let b_x_1 = canvas_w - 80;
	let b_x_2 = canvas_w - 20;
	let b_y_1 = canvas_h - 50;
	let b_y_2 = canvas_h - 20;
	ctx.beginPath();
	ctx.moveTo(b_x_1, b_y_1);
	ctx.lineTo(b_x_2, b_y_1);
	ctx.lineTo(b_x_2, b_y_2);
	ctx.lineTo(b_x_1, b_y_2);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	ctx.fillStyle = '#000';
	ctx.fillText("ход", (b_x_1 + b_x_2) >> 1, (b_y_1 + b_y_2) >> 1);
	/**/
}

function draw_field(){
	draw_bg();
	draw_grid();
	draw_odj();
	draw_ui();
	// Тест рисуем обводку
	//* Вариант 1
	/*
	ctx.strokeStyle = '#F00';
	ctx.lineWidth = 1;
	ctx.beginPath();
	for(let i = 0; i < test_ids.length; i++){
		let x = test_ids[i] % CELLS_PAIR_W % CELLS_LONG_W;
		let y = test_ids[i] / CELLS_PAIR_W * 2 | 0;

		let offset_x = x * cell_step_w + field_x;
		let offset_y = y * cell_step_h + field_y;
		if(y & 1)offset_x += cell_half_w;

		ctx.moveTo(offset_x - cell_half_w, offset_y - cell_half_r_h);
		ctx.lineTo(offset_x, offset_y - cell_r_h);
		ctx.lineTo(offset_x + cell_half_w, offset_y - cell_half_r_h);
		ctx.lineTo(offset_x + cell_half_w, offset_y + cell_half_r_h);
		ctx.lineTo(offset_x, offset_y + cell_r_h);
		ctx.lineTo(offset_x - cell_half_w, offset_y + cell_half_r_h);
		ctx.closePath();
	}
	ctx.stroke();
	/**/

	/*
	test_get_paths([
		8,9,15,17,23,24
	]);
	ctx.fillStyle = '#0004';
	ctx.strokeStyle = '#0A0';
	ctx.lineWidth = 2;
	ctx.beginPath();
	for(let i = 0; i < loops.length; i++){
		let j = 0;
		ctx.moveTo(loops[i][j++] * view_z + field_x, loops[i][j++] * view_z + field_y);
		while(j < loops[i].length)ctx.lineTo(loops[i][j++] * view_z + field_x, loops[i][j++] * view_z + field_y);
		ctx.closePath();
	}
	ctx.stroke();
	ctx.fill();
	
	/**/
	

	// Тест
	ctx.strokeStyle = '#000';
	ctx.lineWidth = 1;
	ctx.lineCap = "round";
	ctx.beginPath();

	ctx.moveTo(50, 35);
	ctx.lineTo(150, 35);
	ctx.moveTo(50, 55);
	ctx.lineTo(150, 55);
	ctx.moveTo(50, 75);
	ctx.lineTo(150, 75);
	ctx.stroke();

	ctx.fillStyle = '#000';
	
	ctx.fillText("view_z: " + view_z, 50, 30);
	ctx.fillText("mouse_x: " + mouse_x, 50, 50);
	ctx.fillText("mouse_y: " + mouse_y, 50, 70);

	//*
	//// вычисляем гекс под мышью.
	// Координаты мыши в системе гексогонов.
	let x = mouse_x - field_x;
	let y = mouse_y - field_y;
	// 1. Масштабируем пиксели относительно геометрии сетки
	// Приводим базисные векторы к прямоугольной сетке ромбов
	const scaleX = x / (cell_r * SQRT_3);
	const scaleY = y / (cell_r_h * SQRT_3);
	// 2. Проекция на косые гексагональные оси
	const temp = Math.floor(scaleX + SQRT_3 * scaleY + 1);
	// 3. Вычисление чистых осевых координат q и r без if-else
	const q = Math.floor((Math.floor(2 * scaleX + 1) + temp) / 3);
	const r = Math.floor((temp + Math.floor(-scaleX + SQRT_3 * scaleY + 1)) / 3);
	// id
	//let id = r * CELLS_LONG_W + (q - (r >> 1));
	let q_2 = (q - ((r + 1) >> 1));
	let id = -1;
	if(r >= 0 && r < CELLS_H && q_2 >= 0 && q_2 < (CELLS_LONG_W - (r & 1)))
		id = r * CELLS_LONG_W - (r >> 1) + q_2;

	ctx.fillText("q: " + q + ", r: " + r + ", id: " + id + ", x: " + x + ", y: " + y, 50, 90);
	/**/
	//* test
	ctx.strokeStyle = '#000';
	ctx.lineWidth = 5;
	ctx.strokeRect(-border_x * view_z + view_x, -border_y * view_z + view_y, border_w * view_z, border_h * view_z);
	/**/

}

async function main(elm_view_game){
	container = elm_view_game;
	canvas_w = container.clientWidth;
	canvas_h = container.clientHeight;
	
	// Создаём canvas и задаём физическое разрешение
	canvas = document.createElement('canvas');
	canvas.setAttribute('style', 'width:100%;height:100%;display:block;');
	canvas.width = canvas_w;
	canvas.height = canvas_h;
	ctx = canvas.getContext('2d');

	await init_graphics();

	container.innerHTML = '';
	container.appendChild(canvas);

	init_field();

	
	// для полного экрана, реагирует на изменения размеров холста.
	const resizeObserver = new ResizeObserver((entries) => {
		for(let entry of entries){
			canvas_w = entry.contentRect.width;
			canvas_h = entry.contentRect.height;
			canvas.width = canvas_w;
			canvas.height = canvas_h;
			init_view();
			ctx.font = "bold 14px 'Courier New', Courier, monospace";
			draw_field();
		}
	});
	resizeObserver.observe(canvas);

	// TEST
	test_get_paths(test_ids);
}


/*
//################ тестируемый объект ################

// Логика

const COMPRESSION_Y = .72;
const COMPRESSION_R = R * COMPRESSION_Y;
//const H = R * 1.5 * COMPRESSION_Y;    // Высота прямоугольного сектора
let cell_r = R;
let cell_q = COMPRESSION_R;
let cell_q_1_5 = cell_q * 1.5;
let cell_half_q = cell_q * .5;
let inner_cell_d = cell_r * SQRT_3;
let inner_cell_r = inner_cell_d * .5;


class Cell{
	//id;
	x;
	y;
	unit = null;

	constructor(id, x, y){
		//this.id = id;
		this.x = x;
		this.y = y;
	}

	// Визуал
	//static 
	view(){

		let offset_x = this.x * inner_cell_d + view_x;
		let offset_y = this.y * cell_q_1_5 + view_y;
		if(this.y & 1)offset_x += inner_cell_r;

		ctx.moveTo(offset_x - inner_cell_r, offset_y - cell_half_q);
		ctx.lineTo(offset_x, offset_y - cell_q);
		ctx.lineTo(offset_x + inner_cell_r, offset_y - cell_half_q);
		ctx.lineTo(offset_x + inner_cell_r, offset_y + cell_half_q);
		ctx.lineTo(offset_x, offset_y + cell_q);
		ctx.lineTo(offset_x - inner_cell_r, offset_y + cell_half_q);
		ctx.closePath();

		if(this.unit !== null){
			this.unit.view(offset_x, offset_y);
		}
	}
	test(){
		if(this.unit !== null){
			let offset_x = this.x * inner_cell_d + view_x;
			let offset_y = this.y * cell_q_1_5 + view_y;
			if(this.y & 1)offset_x += inner_cell_r;

			let x = (mouse_x - offset_x) / view_z;
			let y = (mouse_y - offset_y) / view_z;

			this.unit.test(x, y, offset_x, offset_y);
		}
	}
}



class Field{// поле схватки.
	/* для работы необходимы внешние глобальные переменные.
	var canvas;// основной холст в контейнере.
	var ctx;// контекст основного холста для рисования.
	var canvas_w;// ширина холста.
	var canvas_h;// высота холста.
	/**/
	
/*

	static WIDTH_DEFAULT = 17;//17;
	static HEIGHT_DEFAULT = 11;//11;

	width;
	height;
	cells;
	CELLS_LENGTH;
	width_2;

	constructor(width, height){
		// ширина и высота, поля в гексах.
		this.width = width ?? this.constructor.WIDTH_DEFAULT;
		this.height = height ?? this.constructor.HEIGHT_DEFAULT;

		this.width_2 = this.width * 2 + 1;
		this.width++;

		
		//this.CELLS_LENGTH = this.width * this.height;
		this.CELLS_LENGTH = this.width * this.height - (this.height / 2 | 0);


		this.cells = new Array(this.CELLS_LENGTH);
		for(let i = 0; i < this.CELLS_LENGTH; i++){
			let x = i % this.width_2 % this.width;
			let y = i / this.width_2 * 2 | 0;
			this.cells[i] = new Cell(i, x, y);
		}

		/*TEST
		let text = "";
		for(let i = 0; i < this.CELLS_LENGTH; i++){
			text += this.cells[i].x + "," + this.cells[i].y + " | ";
		}
		alert(text);
		/**/
/*
	}

	// Визуал
	view(){
		// 1. рисуем фон
		matrix.a = view_z;
		matrix.d = view_z;
		matrix.e = view_x;
		matrix.f = view_y;
		grass_pattern?.setTransform(matrix);
		ctx.fillStyle = grass_pattern;

		//* 
		let offset_500 = 500 * view_z;
		let offset_250 = 250 * view_z;
		ctx.beginPath();
		ctx.arc(view_x + offset_500, view_y + offset_250, 2000 * view_z, 0, Math.PI * 2);
		ctx.fill();
		//ctx.beginPath();

		ctx.fillStyle = ctx.createRadialGradient(view_x + offset_500, view_y + offset_250, 1500 * view_z, view_x + offset_500, view_y + offset_250, 2000 * view_z);
		ctx.fillStyle.addColorStop(0, "#AAA0");
		ctx.fillStyle.addColorStop(1, "#AAA");
		ctx.fill();
		ctx.fillStyle = grass_pattern;
		/**/
/*
		// 2. Рисуем поле.
		ctx.beginPath();
		ctx.strokeStyle = '#0004';
		ctx.lineWidth = 1 * view_z;
		ctx.lineCap = "round";
		//ctx.beginPath();
		for(let i = 0; i < this.CELLS_LENGTH; i++)this.cells[i].view();
		ctx.fill();
		ctx.stroke();

		

		// 3. Ищем выделенное по курсору.

		for(let i = this.CELLS_LENGTH - 1; i >= 0; i--)this.cells[i].test();

		//// вычисляем гекс под мышью.
		// Координаты мыши в системе гексогонов.
		let x = mouse_x - view_x;
		let y = mouse_y - view_y;

		// 1. Масштабируем пиксели относительно геометрии сетки
		// Приводим базисные векторы к прямоугольной сетке ромбов
		const scaleX = x / (cell_r * SQRT_3);
		const scaleY = y / (cell_q * SQRT_3);
		

		// 2. Проекция на косые гексагональные оси
		const temp = Math.floor(scaleX + SQRT_3 * scaleY + 1);

		// 3. Вычисление чистых осевых координат q и r без if-else
		const q = Math.floor((Math.floor(2 * scaleX + 1) + temp) / 3);
		const r = Math.floor((temp + Math.floor(-scaleX + SQRT_3 * scaleY + 1)) / 3);

		// id
		
		//let id = r * this.width + (q - (r / 2 | 0));
		let q_2 = (q - ((r + 1) / 2 | 0));
		let id = -1;
		if(r >= 0 && r < this.height && q_2 >= 0 && q_2 < (this.width - (r & 1))){
		id = r * this.width - (r / 2 | 0) + q_2;
			//if(id >= 0 && id < this.CELLS_LENGTH){
				ctx.lineWidth = 2 * view_z;
				ctx.strokeStyle = '#0008';
				ctx.beginPath();
				this.cells[id].view();
				ctx.stroke();
			//}
		}
		/**/

	/*	
		if(id !== -1 && this.cells[id].unit !== null){// Если есть клетка и на ней юнит.
			// Вычисляем передвижение.
			
			let neighboring_cells = [// шаблон соседних клеток по q и r.
				[-1, -1], [0, -1],
				[-1, 0], [1, 0],
				[0, 1], [1, 1],
			];

			let cost_move = 2;//Стандартная цена хода.
			let mp = this.cells[id].unit.mp_t;//Очков передвижения у юнита.

			let temp_arr = [[q, r]];//Начальная позиция юнита, соседей которого нужно проверить.
			let movements = [[id, 0]];//id позиции юнита и сколько на ней очков передвижения.
			let mp_move = cost_move;

			while(temp_arr.length && mp_move <= mp){
				let temp_arr_2 = [];
				for(let i = 0; i < temp_arr.length; i++){//Перебираем проверяемые клетки.
					for(let cell_qr of neighboring_cells){//Перебираем соседей.

						// проверяемые координаты клетки.
						let q_cell = temp_arr[i][0] + cell_qr[0];
						let r_cell = temp_arr[i][1] + cell_qr[1];

						if(r_cell >= 0 && r_cell < this.height){// Если клетка есть по вертикали.
							let q_cell_2 = (q_cell - ((r_cell + 1) * .5 | 0));
							if(q_cell_2 >= 0 && q_cell_2 < (this.width - (r_cell & 1))){// Если клетка есть по горизонтали.
								let id_cell = r_cell * this.width - (r_cell / 2 | 0) + q_cell_2;// находим ид клетки.
								if(this.cells[id_cell].unit === null){//Проверяем что клетка не занята.

									// в будующем заменить findLastIndex на цикл перебора для скорости.
									let id_move = movements.findLastIndex(item => item[0] === id_cell);//проверяем нет ли клетки в проверенных.
									if(id_move === -1){//Клетки нет в проверенных
										movements.push([id_cell, mp_move]);//добавляем клетку в проверенные.
										temp_arr_2.push([q_cell, r_cell]);//добавляем клетку чтоб проверить соседей.
									}else{//Клетка есть в проверенных
										if(mp_move < movements[id_move][1]){//Проверяем не быстрее ли, пришли по новому пути.
											movements[id_move][1] = mp_move;// добавляем в клетку новую скорость.
										}
									}

								}
							}
						}
					}
				}
				temp_arr = temp_arr_2;
				mp_move += cost_move;
			}

			// отображаем клетки ходов.
			ctx.strokeStyle = '#0F08';
			ctx.beginPath();
			for(let i = 0; i < movements.length; i++)this.cells[movements[i][0]].view();
			ctx.stroke();
		}





		ctx.fillStyle = '#000';
		ctx.fillText("q: " + q + ", r: " + r + ", id: " + id + ", x: " + x + ", y: " + y, 50, 90);

	}

}
var field;
/* ЮНИТЫ
// Принцип развития, классы и остальное растут с развитием.
Классы древовидной структуры.
Стартуют с слабого юнита определенной рассы.

Уровень. - выбор.
//Каждый может стать полководцем.
У всех есть лидерство минимум 1 максимум 10.
большого отряда не может стать лидер с недостаточным лидерством.
//
пять стихий магии:
воздух
земля
вода
огонь
дерево
/**/
/*
class Unit{
	hp;
	hp_t;
	mp;
	mp_t;
	dmg;
	border = [
		0, 10,
		-15, -15,
		-15, -40,
		-5, -50,
		5, -50,
		15, -40,
		15, -15
	];

	constructor(hp, mp, dmg){
		this.hp = hp;
		this.mp = mp;
		this.dmg = dmg;

		this.hp_t = this.hp;
		this.mp_t = this.mp;

	}

	view(offset_x, offset_y){
		ctx.moveTo(this.border[0] * view_z + offset_x, this.border[1] * view_z + offset_y);
		for(let i = 2; i < this.border.length;)ctx.lineTo(this.border[i++] * view_z + offset_x, this.border[i++] * view_z + offset_y);
		ctx.closePath();
	}
	test(m_x, m_y, offset_x, offset_y){
		/*
		bool inside = false;
		int n = polygon.size(); // или polygon.length в зависимости от языка

		// Цикл обходит все вершины. j — это предыдущая вершина относительно i
		for (int i = 0, j = n - 1; i < n; j = i++) {
			
			// 1. Проверяем, пересекает ли луч по оси X горизонтальный отрезок грани (между polygon[i].y и polygon[j].y)
			if ((polygon[i].y > point.y) != (polygon[j].y > point.y)) {
				
				// 2. ИСПРАВЛЕНО: Вычисляем точную координату X пересечения луча с гранью 
				// и проверяем, находится ли точка слева от грани (луч идет вправо)
				if (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x) {
					inside = !inside;
				}
			}
		}
		/**/
/*
		let len = this.border.length;
		let inside = false;
		for(let i = 0; i < len; i += 2){
			let x_1 = i;
			let y_1 = i + 1;
			let x_2 = (i + len - 2) % len;
			let y_2 = (i + len - 1) % len;

			let border = this.border;

			/*
			if(point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x){
				inside = !inside;
			}
			/**/
/*
			if(((border[y_1] > m_y) !== (border[y_2] > m_y)) &&
				(m_x < (border[x_2] - border[x_1]) * (m_y - border[y_1]) / (border[y_2] - border[y_1]) + border[x_1])
			){
				inside = !inside;
			}
		}

		if(inside){
			ctx.lineWidth = 2 * view_z;
			ctx.strokeStyle = '#F00';
			ctx.beginPath();
			this.view(offset_x, offset_y);
			ctx.stroke();
			
		}
	}
}



//####################################################
//////




// Тесты

function drawTestScene(){
	

	/* Рамка
	ctx.strokeStyle = '#888888';
	ctx.lineWidth = 4;
	ctx.strokeRect(2, 2, canvas_w - 4, canvas_h - 4);
	/**/
/*
}
/**/