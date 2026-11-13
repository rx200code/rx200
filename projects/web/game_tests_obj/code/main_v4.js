// Константы переменные.
var seed = 0x77777777;//(Math.random() * 0x100000000) >>> 0;//0x77777777;//сид для рандома.

var container;// Контенер который передается в котором будет рисоваться вся графика.
var canvas;// основной холст в контейнере.
var canvas_w;// ширина холста.
var canvas_h;// высота холста.
var ctx;// контекст основного холста для рисования.

// вариант для прямоугольной сетки.
const CELLS_W = 30;//ширина в гексах
const CELLS_H = 3;//высота в гексах
const CELLS_LONG_W = CELLS_W + 1;//ширина в гексах на крае. тоесть чтоб углы были одинаковы, соседи два гекса.
const CELLS_PAIR_W = CELLS_W + CELLS_LONG_W;//ширина в сумме соседних строк.
const CELLS_LENGTH = CELLS_LONG_W * CELLS_H - (CELLS_H * .5 | 0);//общее количество гексов

// вариант для шестиугольной сетки.
const CELLS_RADIUS = 5;//радиус в гексах
const CELLS_D = (CELLS_RADIUS - 1) * 2 + 1;//диаметр поля в гексах (он же максимальная ширина и высота)
const CELLS_LENGTH_HEX = 3 * CELLS_RADIUS * (CELLS_RADIUS - 1) + 1;//общее количество гексов

// Гексы
const SQRT_3 = Math.sqrt(3);// INNER_RATIO
const R = 30;// радиус сектора.
const W = SQRT_3 * R; // Ширина прямоугольного сектора
const COMPRESSION_H = .72;// Коэффицент сжатия по высоте.
const R_H = R * COMPRESSION_H;// радиус сектора по высоте.

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

// Координаты центра нулевого(первого) гекса.
var field_x = 0;
var field_y = 0;

// Положение поля и масштаб.
var view_x = 0;
var view_y = 0;
var view_z = 1;

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

// Инициализация графики
var pattern_sand;// sand - песок
var pattern_margin_top;// паттерн неба и затемнения к горизонту
async function init_graphics(){
	// создаем текстуры
	let size_wh = 256;
	let img_data = ctx.createImageData(size_wh, size_wh);
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

	let bitmap = await createImageBitmap(img_data);
	pattern_sand = ctx.createPattern(bitmap, 'repeat');
	bitmap.close(); // Память очищена

	// создаем градиент неба и затемнения к горизонту
	let h = Math.ceil(margin_top_field);
	let temp_grad = ctx.createLinearGradient(0, 0, 0, h);
	temp_grad.addColorStop(0, '#1A64B5');
	temp_grad.addColorStop(.25, '#539BE2');
	temp_grad.addColorStop(.5, '#AED4F7');
	temp_grad.addColorStop(.5, '#0C121CD9');
	temp_grad.addColorStop(.55, '#0C121CB3');
	temp_grad.addColorStop(.65, '#0C121C66');
	temp_grad.addColorStop(.8, '#0C121C1F');
	temp_grad.addColorStop(.9, '#0000');
	temp_grad.addColorStop(1, '#0000');
	ctx.fillStyle = temp_grad;
	ctx.fillRect(0, 0, 1, h);
	img_data = ctx.getImageData(0, 0, 1, h);
	bitmap = await createImageBitmap(img_data);
	pattern_margin_top = ctx.createPattern(bitmap, 'repeat-x');
	bitmap.close();
}


function init_field(){

	let zoom_w = canvas_w / view_w;
	let zoom_h = canvas_h / view_h;
	view_z = Math.min(zoom_w, zoom_h);


	cell_r = R * view_z;// текущий радиус сектора.
	cell_r_h = R_H * view_z;// текущий радиус сектора по высоте.
	cell_step_h = cell_r_h * 1.5;// расстояние по высоте между центрами ячеек(смещение ряда)
	cell_half_r_h = cell_r_h * .5;// половина радиуса по высоте (используется для смещения рядов/колонок)
	cell_step_w = cell_r * SQRT_3;// расстояние по ширине между центрами ячеек(inner_cell_d - внутренний диаметр сектора)
	cell_half_w = cell_step_w * .5;// половина расстояния по ширине(inner_cell_r - внутренний радиус сектора)

	// Вычисляем ширину и высоту поля.
	field_w = cell_step_w * CELLS_LONG_W;//Ширина поля
	field_h = cell_step_h * (CELLS_H - 1) + cell_r_h * 2;//Высота поля

	// отступы.
	margin_field = cell_step_w;
	margin_top_field = margin_field * MARGIN_COEF_TOP;
	horizon_y = margin_top_field * .5;

	// размер видимой области.
	view_w = field_w + margin_field * 2;
	view_h = field_h + margin_field + margin_top_field;



	
	view_x = (canvas_w - view_w) * .5;
	view_y = (canvas_h - view_h) * .5;

	field_x = view_x + margin_field + cell_half_w;
	field_y = view_y + margin_top_field + cell_r_h;



	// Вешеем события.
//*
	let offsetX, offsetY, isDragging = false;
	canvas.addEventListener("mousemove", e => {
		mouse_x = e.offsetX;
		mouse_y = e.offsetY;

		if(isDragging){
			view_x += e.movementX;
			view_y += e.movementY;
		}
		draw_field();
		
	});
/*
	canvas.addEventListener('mousedown', (e) => {
		isDragging = true;
		offsetX = e.clientX;
		offsetY = e.clientY;
		
	});

	canvas.addEventListener('dblclick', (e) => {
		view_x = DEFAULT_VIEW_X;
		view_y = DEFAULT_VIEW_Y;
		view_z = 1;
		cell_r = R;
		cell_q = COMPRESSION_R;
		cell_q_1_5 = cell_q * 1.5;
		cell_half_q = cell_q * .5;
		inner_cell_d = cell_r * SQRT_3;
		inner_cell_r = inner_cell_d * .5;


		
		drawTestScene();
	});

	canvas.addEventListener('mouseup', () => {
		isDragging = false;
	});
	canvas.addEventListener('mouseleave', () => {
		isDragging = false;
	});

	canvas.addEventListener('wheel', (e) => {
		e.preventDefault();
		let temp_z = view_z;
		view_z *= e.deltaY < 0 ? 1.1: .9;
		//view_z += e.deltaY < 0 ? 1: -1;
		if(view_z < .3)view_z = .3;
		else if(view_z > 7)view_z = 7;

		let offsetX = e.offsetX - view_x;
		let offsetY = e.offsetY - view_y;

		temp_z = view_z / temp_z;

		offsetX *= temp_z;
		offsetY *= temp_z;

		view_x = e.offsetX - offsetX;
		view_y = e.offsetY - offsetY;

		// доп
		cell_r = R * view_z;
		cell_q = COMPRESSION_R * view_z;
		cell_q_1_5 = cell_q * 1.5;
		cell_half_q = cell_q * .5;
		inner_cell_d = cell_r * SQRT_3;
		inner_cell_r = inner_cell_d * .5;

		drawTestScene();
	}, { passive: false });

	/* На весь эеран
	canvas.addEventListener("click", e => {
		// Проверяем, есть ли сейчас элемент в полноэкранном режиме
		if (document.fullscreenElement) {
			// Если открыт, то закрываем полноэкранный режим
			document.exitFullscreen();
		} else {
			// Если закрыт, разворачиваем нужный элемент (например, ваш svg или canvas)
			// Замените "svg" на переменную вашего элемента, если она называется иначе
			canvas.requestFullscreen().catch(err => {
				alert(`Ошибка при переходе в полноэкранный режим: ${err.message}`);
			});
		}
		drawTestScene();
	});
	/**/
}

//Отрисовка.
function draw_bg(){
	matrix.a = view_z;
	matrix.d = view_z;
	matrix.e = view_x;
	matrix.f = view_y;
	pattern_sand.setTransform(matrix);

	ctx.fillStyle = '#AAA';
	ctx.fillRect(0, 0, canvas_w, canvas_h);
	ctx.fillStyle = pattern_sand;
	ctx.fillRect(view_x, view_y, view_w, view_h);
	//ctx.fillRect(0, view_y, canvas_w, view_h);

	pattern_margin_top.setTransform(matrix);
	ctx.fillStyle = pattern_margin_top;
	ctx.fillRect(view_x, view_y, view_w, margin_top_field);

	/* TEST
	ctx.strokeStyle = '#000';
	ctx.lineWidth = 1;
	ctx.strokeRect(field_x - cell_half_w, field_y - cell_r_h, field_w, field_h);
	/**/
}

function draw_grid(){
	// 2. Рисуем поле.
	ctx.beginPath();
	ctx.strokeStyle = '#0004';
	ctx.lineWidth = 1 * view_z;
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

}

function draw_ui(){

}

function draw_field(){
	draw_bg();
	draw_grid();
	draw_odj();
	draw_ui();

	// Тест
	ctx.strokeStyle = '#000000';
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

	ctx.font = "bold 14px 'Courier New', Courier, monospace";

	draw_field();
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