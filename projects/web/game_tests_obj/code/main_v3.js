/**
Пространство
/**/
/** проверка точки в фигуре(полигоне). чёт, не чёт в inside

// Вычисляется один раз при создании фигуры
double minX, maxX, minY, maxY; 

// Сама проверка (O(1))
if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) {
    return false; // Точка гарантированно снаружи
}
// И только если прошла — пускаем в цикл по ребрам

if (((polygon[i].y > point.y) != (polygon[j].y > point.y)) &&
    ((point.x - polygon[i].x) * (polygon[j].y - polygon[i].y) < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) == 
    (polygon[i].y > polygon[j].y))) {
    inside = !inside;
}
/**/
// Вспомогательные функции
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

// Константы переменные.
var container;// Контенер который передается в котором будет рисоваться вся графика.
var canvas;// основной холст в контейнере.
var ctx;// контекст основного холста для рисования.
var innerWidth;// ширина холста.
var innerHeight;// высота холста.

var mouse_x = 0, mouse_y = 0;

const DEFAULT_VIEW_X = 53;
const DEFAULT_VIEW_Y = 57;
var view_x = DEFAULT_VIEW_X;
var view_y = DEFAULT_VIEW_Y;
let view_z = 1;

//################ тестируемый объект ################

// Логика
const SQRT_3 = Math.sqrt(3);// INNER_RATIO
const R = 30;
const W = SQRT_3 * R; // Ширина прямоугольного сектора
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
	id;
	x;
	y;
	unit = null;

	constructor(id, x, y){
		this.id = id;
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

// Инициализация
var grass_pattern;
/*
	• a — масштаб по оси X (scaleX). Принимает значение косинуса при повороте.
	• b — наклон (skew) по оси Y. Принимает значение синуса при повороте.
	• c — наклон (skew) по оси X. Принимает значение минус синуса при повороте.
	• d — масштаб по оси Y (scaleY). Принимает значение косинуса при повороте.
	• e — сдвиг (трансляция) по оси X (translateX).
	• f — сдвиг (трансляция) по оси Y (translateY).
*/
var matrix = {// Матрица без изменений (единичная):
	a: 1,// масштаб по оси X (scaleX). Принимает значение косинуса при повороте.
	b: 0,// наклон (skew) по оси Y. Принимает значение синуса при повороте.
	c: 0,// наклон (skew) по оси X. Принимает значение минус синуса при повороте.
	d: 1,// масштаб по оси Y (scaleY). Принимает значение косинуса при повороте.
	e: 0,// сдвиг (трансляция) по оси X (translateX).
	f: 0//  сдвиг (трансляция) по оси Y (translateY).
};

class Field{// поле схватки.
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

		
		if(id !== -1 && this.cells[id].unit !== null){// Если есть клетка и на ней юнит.
			// Вычисляем передвижение.
			
			let neighboring_cells = [// шаблон соседних клеток по q и r.
				[-1, -1], [0, -1],
				[-1, 0], [1, 0],
				[0, 1], [1, 1],
			];

			let cost_move = 1;//Стандартная цена хода.
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


function init(){
	// создаем текстуры
	let size_wh = 256;
	let img_data = ctx.createImageData(size_wh, size_wh);
	const buf_32 = new Uint32Array(img_data.data.buffer);
	for (let i = 0; i < buf_32.length; i++) {
		//buf_32[i] = (255 << 24) | (0 << 16) | (120 << 8) | 40; // Пример цвета
		// Получаем локальные координаты пикселя внутри тайла 64х64(size_wh x size_wh)
		const x = i % size_wh;
		const y = (i / size_wh) | 0;

		// Быстрый математический псевдошум (без медленного Math.random)
		let h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
		h = (h - (h | 0)) * 255; 

		
		/* Вариация зеленого цвета на основе шума (оттенок меняется от 100 до 140)
		const g = 100 + (Math.abs(h) * 0.15) | 0;
		// Записываем пиксель в формате ABGR
		buf_32[i] = (255 << 24) | (30 << 16) | (g << 8) | 40;
		/**/

		/* Вариация песочного цвета на основе шума (основной тон меняется от 190 до 230)
		const r = 190 + (Math.abs(h) * 0.15) | 0;
		// Записываем пиксель в формате ABGR (красный r, зеленый ~r-30, синий ~r-80)
		buf_32[i] = (255 << 24) | ((r - 80) << 16) | ((r - 30) << 8) | r;
		/**/

		// Яркий песочный цвет (основной тон меняется от 215 до 255)
		const r = 215 + (Math.abs(h) * 0.15) | 0;
		// Записываем пиксель в формате ABGR (зеленый чуть меньше красного, синий сильно занижен для сочности)
		buf_32[i] = (255 << 24) | ((r - 120) << 16) | ((r - 25) << 8) | r;

	}
	
	// Создаем ОДНУ статичную матрицу изометрического сжатия (2:1)
	//const iso_matrix = new DOMMatrix([1, 0, 0, 0.5, 0, 0]);
	createImageBitmap(img_data).then(bitmap => {
		// Этот колбэк выполнится сразу же в текущем тике, так как источник локальный
		grass_pattern = ctx.createPattern(bitmap, 'repeat');
		//grass_pattern.setTransform(iso_matrix);
		bitmap.close(); // Память очищена
	});


	/*
	// второй способ drawImage
	// 1. Создаем финальный холст-атлас в памяти
	objects_atlas_canvas = document.createElement('canvas');
	objects_atlas_canvas.width = 512;
	objects_atlas_canvas.height = 512;
	const atlas_ctx = objects_atlas_canvas.getContext('2d');
	createImageBitmap(img_data).then(bitmap => {
		atlas_ctx.drawImage(bitmap, 0, 0); // x=0, y=0
		bitmap.close();
	});
	/**/
}
//####################################################
//////

function main(elm_view_game){
	container = elm_view_game;

	innerWidth = container.clientWidth;
	innerHeight = container.clientHeight;
	
	// Создаём canvas и задаём физическое разрешение
	canvas = createElement('canvas', ['style', 'width:100%;height:100%;display:block;']);
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	ctx = canvas.getContext('2d');

	init();

	container.innerHTML = '';
	container.appendChild(canvas);
	// создаем тестовый объект.
	field = new Field();
	field.cells[field.cells.length - 2].unit = new Unit(5, 7, 2);
	field.cells[field.cells.length - 3].unit = new Unit(2, 2, 2);
	//for(let i = 0; i < field.cells.length; i++)field.cells[i].unit = new Unit(5, 7, 2);

	ctx.font = "bold 14px 'Courier New', Courier, monospace";
	drawTestScene();
	



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


	canvas.addEventListener("mousemove", e => {
		mouse_x = e.offsetX;
		mouse_y = e.offsetY;

		if(isDragging){
			view_x += e.movementX;
			view_y += e.movementY;
		}
		drawTestScene();
		
	});

	let offsetX, offsetY, isDragging = false;

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

	//*
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
	//*/

}


// Тесты

function drawTestScene(){
	//ctx.fillStyle = '#87CEFA';
	ctx.fillStyle = '#AAA';
	/*
	matrix.a = view_z;
	matrix.d = view_z;
	matrix.e = view_x;
	matrix.f = view_y;
	grass_pattern?.setTransform(matrix);
	ctx.fillStyle = grass_pattern;
	/**/
	//ctx.fillStyle = '#000';

	ctx.fillRect(0, 0, innerWidth, innerHeight);
	

	// тестовый объект
	field.view();
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

	/* Рамка
	ctx.strokeStyle = '#888888';
	ctx.lineWidth = 4;
	ctx.strokeRect(2, 2, innerWidth - 4, innerHeight - 4);
	/**/
}



