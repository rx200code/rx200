// nava.js
(function(global){// Для экспорта библиотеки nava.js
"use strict";

/** АРХЕТЕКТУРА nava */
const nava = {};

// КОНСТАНТЫ И ФУНКЦИИ

// Константы PI
const rad_180 = Math.PI;
const rad_1 = rad_180 / 180;
const rad_45 = rad_180 / 4;
const rad_90 = rad_180 / 2;
const rad_360 = rad_180 * 2;
const rad_2340 = rad_180 * 13;
const deg_2rad = 360 / rad_180;// 2 радиана в градусах

// Функции перевода радиан в градусы и обратно.
const toRad = deg => deg * rad_1;
const toDeg = rad => rad / rad_1;

// минимальные и максимальные значения для широты, долготы(EPSG:3857) и зума.
const lat_min = -85.0511287;//Более точное значение -85.0511287798065822585;
const lat_max = 85.0511287;//Более точное значение 85.0511287798065822585;
const lon_min = -180;
const lon_max = 180;
const z_min = 0;
let z_max = 18;// let так как может менятся в зависимости от поставщика тайлов.
let tile_size = 256;


// ОСНОВНЫЕ переменные карты.
// Значения по умолчанию.
/*
Картак отображается относительно центра.
А центер всегда в координатах ТАЙЛОВ, для определенного зума.
Четыре параметра ниже, определяют как и где отобразится карта. Любое их изменение влечет и изменение дополнительных параметов.
*/
let zoom = 15;// Уровень зума
let center_x = 23938.844444444447;// lon = 83;// Долгота // z = 15;
let center_y = 10364.448450336584;// lat = 55;// Широта // z = 15;
let view_a = toRad(-0);//-0;// Угол поворота окна карты, относительно карты(отрицательный угол поворота карты).

// ДОПОЛНИТЕЛЬНЫЕ параметры, должны менятся при изменении основных.
const dpr = 1;// / 2;//(window.devicePixelRatio || 1); // Коэффициент плотности пикселей
const delimiter_zoom = .25;// переход на более мелкий зум? рост z
const step_zoom = .5;// Шаг зумирования.
let z = (zoom + delimiter_zoom) | 0; 
let scale = 2 ** (zoom - z) * dpr;
let tile_scale = tile_size * scale;

// Параметры для работы функций перевода в тайлы Веб меркатора и обратно, должны обновлятся при изменении зума.
let half_length_WM = 2 ** (z - 1);//let half_length_WM = 1 << (z - 1);// половина длины Веб меркатора в тайлах(tile = 1), Math.log2(tile) = 0;
let radius_WM = half_length_WM / rad_180;// Радиус веб меркатора, если считать длину в количестве тайлов на сторону.
let deg_WM = half_length_WM / 180;// Один градус долготы Веб меркатора в тайлах.

// Функции перевода в Веб меркатор в тайлах и обратно. функции для работы с радианами заканчиваются на Rad.
const toYRad = lat_rad => half_length_WM - radius_WM * Math.log(Math.tan(lat_rad / 2 + rad_45));// получает Y тайла Веб Меркатора исходя из широты в радианах(lat_rad).
const toY = lat => half_length_WM - radius_WM * Math.log(Math.tan(lat / deg_2rad + rad_45));// получает Y тайла Веб Меркатора исходя из широты в градусах(lat).
const toLatRad = y => Math.atan(Math.exp((half_length_WM - y) / radius_WM)) * 2 - rad_90;// обратная toYRad()
const toLat = y => Math.atan(Math.exp((half_length_WM - y) / radius_WM)) * deg_2rad - 90;// обратная toY()
const toXRad = lon_rad => lon_rad * radius_WM + half_length_WM;// получает X тайла Веб Меркатора исходя из долготы в радианах(lon_rad).
const toX = lon => lon * deg_WM + half_length_WM;// получает X тайла Веб Меркатора исходя из долготы в градусах(lon).
const toLonRad = x => x / radius_WM - rad_180;// обратная toXRad()
const toLon = x => x / deg_WM - 180;// обратная toX()

// Допрлнительно для получения широты и долготы центра карты.
const getLat = () => deg_2rad * Math.atan(Math.exp((half_length_WM - center_y) / radius_WM)) - 90;
const getLon = () => center_x / deg_WM - 180;

// 
let view_sin_a = Math.sin(view_a);// 0
let view_cos_a = Math.cos(view_a);// 1
let scale_sin_a = -view_sin_a * scale;// Синус с учетом масштаба, для применения в матрице setTransform
let scale_cos_a = view_cos_a * scale;// Косинус с учетом масштаба, для применения в матрице setTransform

// минимальные и максимальные значения для x, y, tile.
const min_xy = 0;
const tile_min = 1;
let max_xy = 1 << z;//2 ** z;


// МЕТОДЫ.

// Инициализация.
/*
Необходимо установить:
1. Элемент отображения. DIV и его размеры.
2. Источник тайлов.
3. Координаты центра, угол и зумм.
*/

// initView - инициализирует переменные связанные с отображением, и вызывает рендер карты, так же как и при изменении окна карты.

// Положение центра в окне карты.
let view_width;
let view_height;
let viev_center_x;
let viev_center_y;
let view_width_tile;// Ширена окна карты в тайлах веб меркатора
let view_height_tile;// Высота окна карты в тайлах веб меркатора
let viev_center_x_tile;// Смещение центра карты в тайлах веб меркатора относительно окна по оси x
let viev_center_y_tile;// Смещение центра карты в тайлах веб меркатора относительно окна по оси y

let view = document.createElement("div");// Обертка окно карты. Изоляция CSS
view.style.cssText = `
	all: unset;
	display: block; /* unset может сделать его inline */
	box-sizing: border-box;
	/**/
	overflow: hidden;
	/**/
	position: relative;
	width: 100%;
	height: 100%;
	background-color: #888;
	user-select: none;
	-webkit-user-select: none;
	line-height: normal;
	text-align: left;
	z-index: 0;
	-webkit-tap-highlight-color: transparent;
	touch-action: none;
`;
// Элементы отрисовки. можно менять, и выбрать другую стратегию отрисовки. но они вплетены в функции отрисовки.
let canvas = document.createElement("canvas");
let canvas_buf = document.createElement("canvas");
canvas.style.pointerEvents = canvas_buf.style.pointerEvents = 'none';
canvas.style.position = canvas_buf.style.position = 'absolute';
//canvas.style.transformOrigin = canvas_buf.style.transformOrigin = "center";
canvas.style.opacity = '1';
canvas_buf.style.opacity = '0';
//canvas_buf.style.outline = canvas.style.outline = "solid 2px #000";// TEST
view.appendChild(canvas);
view.appendChild(canvas_buf);

let ctx = canvas.getContext("2d");
let ctx_buf = canvas_buf.getContext("2d");

let canvas_side;
let canvas_center_xy;

// Слушатели
view.oncontextmenu = e => e.preventDefault();

let counter_down = 0;
let rot_x = center_x;
let rot_y = center_y;
let view_shift_x;
let view_shift_y;
let center_to_pivot_x = 0;
let center_to_pivot_y = 0;

let test_flag = false;

const activePointers = new Map();

// 2 ТАЧЬ.
let touch_x_1 = center_x;
let touch_y_1 = center_y;
let touch_x_2 = center_x;
let touch_y_2 = center_y;
let touch_distance = 0;
let touch_angle = 0;
view.onpointerdown = e => {
	view.setPointerCapture(e.pointerId);
	
	activePointers.set(e.pointerId, e);
	
	//ctx_buf.setTransform(ctx.getTransform());// Делаем последние трансформации канваса и на буфер.
	
	/** TEST */
	counter_down++;
	if(e.button === 2){
		test_flag = true;
		counter_down = 0;
	}
	
	if(activePointers.size === 1){
		// Смещение точки вращения относительно центра в тайлах.
		center_to_pivot_x = (e.offsetX - viev_center_x) / tile_scale;
		center_to_pivot_y = (e.offsetY - viev_center_y) / tile_scale;
		
		rot_x = center_to_pivot_x * view_cos_a - center_to_pivot_y * view_sin_a + center_x;
		rot_y = center_to_pivot_x * view_sin_a + center_to_pivot_y * view_cos_a + center_y;
	}
	
	if(e.button === 1){
		view_a = -0;
		view_sin_a = 0;
		view_cos_a = 1;
		
		// Устанавливаем новое положение центра.
		center_x = rot_x - center_to_pivot_x;
		center_y = rot_y - center_to_pivot_y;
		
		// Устанавливаем синус и косинус с учетом масштаба.
		scale_sin_a = 0;
		scale_cos_a = scale;
		
		// Устанавливаем смещение пространства канвас.
		view_shift_x = viev_center_x - viev_center_x * scale_cos_a;
		view_shift_y = viev_center_y - viev_center_y * scale_cos_a;
		
		render();
	}
	
	/** МУЛЬТИ ТАЧЬ, TEST */
	// 2 ТАЧЬ.
	if(activePointers.size === 2){
		touch_x_1 = rot_x / half_length_WM;
		touch_y_1 = rot_y / half_length_WM;
		
		let center_to_pivot_x_2 = (e.offsetX - viev_center_x) / tile_scale;
		let center_to_pivot_y_2 = (e.offsetY - viev_center_y) / tile_scale;
		
		let rot_x_2 = center_to_pivot_x_2 * view_cos_a - center_to_pivot_y_2 * view_sin_a + center_x;
		let rot_y_2 = center_to_pivot_x_2 * view_sin_a + center_to_pivot_y_2 * view_cos_a + center_y;
		
		touch_x_2 = rot_x_2 / half_length_WM;
		touch_y_2 = rot_y_2 / half_length_WM;
		
		touch_distance =  Math.hypot(touch_x_1 - touch_x_2, touch_y_1 - touch_y_2);
		touch_angle =  Math.atan2(touch_x_1 - touch_x_2, touch_y_1 - touch_y_2);
	}
	
	
	/**/
	
};

view.onpointermove = e => {
	if(activePointers.has(e.pointerId)){
		
		activePointers.set(e.pointerId, e);
		
		if(activePointers.size === 1){
			center_to_pivot_x = (e.offsetX - viev_center_x) / tile_scale;
			center_to_pivot_y = (e.offsetY - viev_center_y) / tile_scale;
			
			center_x = rot_x + (center_to_pivot_y * view_sin_a - center_to_pivot_x * view_cos_a);
			center_y = rot_y - (center_to_pivot_y * view_cos_a + center_to_pivot_x * view_sin_a);
			
			/** СТАРЫЙ ВАРИАНТ *
			// Смещения курсора в тайлах.
			let move_x = e.movementX / tile_scale;
			let move_y = e.movementY / tile_scale;
			
			// Новый центер, с учетом смещения и угла.
			center_x -= move_x * view_cos_a - move_y * view_sin_a;
			center_y -= move_x * view_sin_a + move_y * view_cos_a;
			/**/
			/** TEST для плавного перемещения. */
			canvas.style.left = (canvas.offsetLeft + e.movementX) + 'px';
			canvas.style.top = (canvas.offsetTop + e.movementY) + 'px';
			canvas_buf.style.left = '0px';
			canvas_buf.style.top = '0px';
			/**/
			render();
			out(getLat(), getLon(), "MOVE 1");// TEST
		}else if(activePointers.size === 2){
			const pointers = Array.from(activePointers.values());
			// Пример: расчет расстояния между точками pointers[0] и pointers[1]
			
			let view_touch_distance =  Math.hypot(pointers[0].offsetX - pointers[1].offsetX, pointers[0].offsetY - pointers[1].offsetY);// / tile_scale;
			
			let t_cof = view_touch_distance / touch_distance / 128;// 128 так как half_length_WM половина меркатора.
			let new_zoom = Math.log2(t_cof);
			
			
			let view_touch_angle = Math.atan2(pointers[0].offsetX - pointers[1].offsetX, pointers[0].offsetY - pointers[1].offsetY);
			
			let new_angle = view_touch_angle - touch_angle
			
			out(toDeg(new_angle));
			/** nava.setAngle(-new_angle); */
				view_a = new_angle;// Если карта вращается в одну сторону, то экран относительно карты в противоположенную.
				view_a = (view_a + rad_2340) % rad_360 - rad_180;
				
				view_sin_a = Math.sin(view_a);
				view_cos_a = Math.cos(view_a);
				
				// Устанавливаем синус и косинус с учетом масштаба.
				//scale_sin_a = -view_sin_a * scale;
				//scale_cos_a = view_cos_a * scale;
				
				// Устанавливаем смещение пространства канвас.
				//view_shift_x = viev_center_x - (viev_center_x * scale_cos_a - viev_center_y * scale_sin_a);
				//view_shift_y = viev_center_y - (viev_center_x * scale_sin_a + viev_center_y * scale_cos_a);
				
				//render();
			
			/**/
			
			
			
			/** nava.setZoom(new_zoom); */
			
			// устанавливаем новый зум.
			zoom = new_zoom;
			if(zoom < z_min)zoom = z_min;
			else if(zoom > z_max)zoom = z_max;
			z = (zoom + delimiter_zoom) | 0;// Зум тайлов.
			scale = 2 ** (zoom - z) * dpr;// Масштаб для отображения на экране.
			tile_scale = tile_size * scale;// Размер отображения тайлов учитывая масштаб
			
			// Убераем зум с координат центра.
			//center_x /= half_length_WM;
			//center_y /= half_length_WM;
			
			// Устанавливаем переменные для преобразорвания в тайловую систему координат в соответствии с зумом.
			half_length_WM = 2 ** (z - 1);
			radius_WM = half_length_WM / rad_180;
			deg_WM = half_length_WM / 180;
			max_xy = 1 << z;
			
			// Востонавливаем зум координат центра.
			//center_x *= half_length_WM;
			//center_y *= half_length_WM;
			
			// Устанавливаем синус и косинус с учетом масштаба.
			scale_sin_a = -view_sin_a * scale;
			scale_cos_a = view_cos_a * scale;
			
			// Устанавливаем ширену, высоту, и смещение центра, в тайлах, с учемтом масштаба.
			view_width_tile = view_width / tile_scale;
			view_height_tile = view_height / tile_scale;
			viev_center_x_tile = viev_center_x / tile_scale;
			viev_center_y_tile = viev_center_y / tile_scale;
			
			// Устанавливаем смещение пространства канвас.
			view_shift_x = viev_center_x - (viev_center_x * scale_cos_a - viev_center_y * scale_sin_a);
			view_shift_y = viev_center_y - (viev_center_x * scale_sin_a + viev_center_y * scale_cos_a);
			
			// ОПРЕДЕЛЯЕМ ПОЛОЖЕНИЕ НОВОГО ЦЕНТРА.
			
			center_to_pivot_x = (pointers[0].offsetX - viev_center_x) / tile_scale;
			center_to_pivot_y = (pointers[0].offsetY - viev_center_y) / tile_scale;
			
			center_x = (touch_x_1 * half_length_WM) + (center_to_pivot_y * view_sin_a - center_to_pivot_x * view_cos_a);
			center_y = (touch_y_1 * half_length_WM) - (center_to_pivot_y * view_cos_a + center_to_pivot_x * view_sin_a);
			
			render();
			
			
			/**/
			
			//out(t_cof, new_zoom, zoom);
			/**
			out(
				pointers[0].pointerId, pointers[0].isPrimary, pointers[0].offsetX, pointers[0].offsetY, "MOVE 2",
				pointers[1].pointerId, pointers[1].isPrimary, pointers[1].offsetX, pointers[1].offsetY
			);
			/**/
		}
	}
};

view.onpointerup = e => {
	//view.onpointermove = null;
	//view.onpointerup = null;
	
	/** TEST */
	test_flag = false;
	counter_down = 0;
	/**/
	
	//out("onpointerup", getLat(), getLon(), counter_down);// TEST
	activePointers.delete(e.pointerId);
	out(e.pointerId, e.isPrimary, e.offsetX, e.offsetY, "UP");
	
	for(let e of activePointers.values()){//e.isPrimary
		// Смещение точки вращения относительно центра в тайлах.
		center_to_pivot_x = (e.offsetX - viev_center_x) / tile_scale;
		center_to_pivot_y = (e.offsetY - viev_center_y) / tile_scale;
		
		rot_x = center_to_pivot_x * view_cos_a - center_to_pivot_y * view_sin_a + center_x;
		rot_y = center_to_pivot_x * view_sin_a + center_to_pivot_y * view_cos_a + center_y;
	}
	
};

view.onpointercancel = e => {
	/** TEST */
	test_flag = false;
	counter_down = 0;
	/**/
	activePointers.delete(e.pointerId);
	out(e.pointerId, e.isPrimary, e.offsetX, e.offsetY, "CANCEL");
};

view.onwheel = e => {// ПРОБНЫЙ ВАРИАНТ? для тестов
	e.preventDefault(); // Важно, чтобы не скроллилась страница
	// Вращение.
	if(counter_down){
		view_a -= Math.sign(e.deltaY) * rad_1 * 5;// Если карта вращается в одну сторону, то экран относительно карты в противоположенную.
		view_a = (view_a + rad_2340) % rad_360 - rad_180;
		view_sin_a = Math.sin(view_a);
		view_cos_a = Math.cos(view_a);
		
		// Устанавливаем новое положение центра.
		center_x = rot_x + (center_to_pivot_y * view_sin_a - center_to_pivot_x * view_cos_a);
		center_y = rot_y - (center_to_pivot_y * view_cos_a + center_to_pivot_x * view_sin_a);
		
		// Устанавливаем синус и косинус с учетом масштаба.
		scale_sin_a = -view_sin_a * scale;
		scale_cos_a = view_cos_a * scale;
		
		// Устанавливаем смещение пространства канвас.
		view_shift_x = viev_center_x - (viev_center_x * scale_cos_a - viev_center_y * scale_sin_a);
		view_shift_y = viev_center_y - (viev_center_x * scale_sin_a + viev_center_y * scale_cos_a);
		
		render();
		out(counter_down);
		return;
	}else if(test_flag){// Масштабирование.
		
		// разница между курсором и центром
		let dx = e.offsetX - viev_center_x;
		let dy = e.offsetY - viev_center_y;
		
		// Разница учитывая поворот систему координат.
		let rot_dx = dx * view_cos_a - dy * view_sin_a;
		let rot_dy = dx * view_sin_a + dy * view_cos_a;
		
		// Убераем зум с координат точки поворота.
		rot_x /= half_length_WM;
		rot_y /= half_length_WM;
		
		center_to_pivot_x /= half_length_WM;
		center_to_pivot_y /= half_length_WM;
		
		// устанавливаем новый зум.
		zoom -= Math.sign(e.deltaY) * step_zoom;//Для совместимости браузеров, от дельты берем только знак.
		if(zoom < z_min)zoom = z_min;
		else if(zoom > z_max)zoom = z_max;
		z = (zoom + delimiter_zoom) | 0;// Зум тайлов.
		scale = 2 ** (zoom - z) * dpr;// Масштаб для отображения на экране.
		tile_scale = tile_size * scale;// Размер отображения тайлов учитывая масштаб
		
		// Устанавливаем переменные для преобразорвания в тайловую систему координат в соответствии с зумом.
		half_length_WM = 2 ** (z - 1);
		radius_WM = half_length_WM / rad_180;
		deg_WM = half_length_WM / 180;
		max_xy = 1 << z;
		
		// Положение точки поворота, учитывая зумм, тайл = еденице измерения.
		rot_x *= half_length_WM;
		rot_y *= half_length_WM;
		
		
		center_to_pivot_x *= half_length_WM;
		center_to_pivot_y *= half_length_WM;
		
		// Устанавливаем новое положение центра.
		center_x = rot_x - rot_dx / tile_scale;
		center_y = rot_y - rot_dy / tile_scale;
		
		// Устанавливаем синус и косинус с учетом масштаба.
		scale_sin_a = -view_sin_a * scale;
		scale_cos_a = view_cos_a * scale;
		
		// Устанавливаем ширену, высоту, и смещение центра, в тайлах, с учемтом масштаба.
		view_width_tile = view_width / tile_scale;
		view_height_tile = view_height / tile_scale;
		viev_center_x_tile = viev_center_x / tile_scale;
		viev_center_y_tile = viev_center_y / tile_scale;
		
		// Устанавливаем смещение пространства канвас.
		view_shift_x = viev_center_x - (viev_center_x * scale_cos_a - viev_center_y * scale_sin_a);
		view_shift_y = viev_center_y - (viev_center_x * scale_sin_a + viev_center_y * scale_cos_a);
		
		render();
		
		return;
	}
	
	//Масштабирует относительно курсора.
	/**
	const delta = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
	zoom -= delta / 450;
	/**/
	
	// разница между курсором и центром
	let dx = e.offsetX - viev_center_x;
	let dy = e.offsetY - viev_center_y;
	
	// Разница учитывая поворот систему координат.
	let rot_dx = dx * view_cos_a - dy * view_sin_a;
	let rot_dy = dx * view_sin_a + dy * view_cos_a;
	
	
	// Положение точки поворота, в системе координат тайлов.
	let tile_x = rot_dx / tile_scale + center_x;
	let tile_y = rot_dy / tile_scale + center_y;
	
	// Убераем зум с координат точки поворота.
	tile_x /= half_length_WM;
	tile_y /= half_length_WM;
	
	// устанавливаем новый зум.
	zoom -= Math.sign(e.deltaY) * step_zoom;//Для совместимости браузеров, от дельты берем только знак.
	if(zoom < z_min)zoom = z_min;
	else if(zoom > z_max)zoom = z_max;
	z = (zoom + delimiter_zoom) | 0;// Зум тайлов.
	scale = 2 ** (zoom - z) * dpr;// Масштаб для отображения на экране.
	tile_scale = tile_size * scale;// Размер отображения тайлов учитывая масштаб
	
	// Устанавливаем переменные для преобразорвания в тайловую систему координат в соответствии с зумом.
	half_length_WM = 2 ** (z - 1);
	radius_WM = half_length_WM / rad_180;
	deg_WM = half_length_WM / 180;
	max_xy = 1 << z;
	
	// Положение точки поворота, учитывая зумм, тайл = еденице измерения.
	tile_x *= half_length_WM;
	tile_y *= half_length_WM;
	
	// Устанавливаем новое положение центра.
	center_x = tile_x - rot_dx / tile_scale;
	center_y = tile_y - rot_dy / tile_scale;
	
	// Устанавливаем синус и косинус с учетом масштаба.
	scale_sin_a = -view_sin_a * scale;
	scale_cos_a = view_cos_a * scale;
	
	// Устанавливаем ширену, высоту, и смещение центра, в тайлах, с учемтом масштаба.
	view_width_tile = view_width / tile_scale;
	view_height_tile = view_height / tile_scale;
	viev_center_x_tile = viev_center_x / tile_scale;
	viev_center_y_tile = viev_center_y / tile_scale;
	
	// Устанавливаем смещение пространства канвас.
	view_shift_x = viev_center_x - (viev_center_x * scale_cos_a - viev_center_y * scale_sin_a);
	view_shift_y = viev_center_y - (viev_center_x * scale_sin_a + viev_center_y * scale_cos_a);
	
	render();
	
	out(z, zoom);
};

const initView = elm => {
	elm.appendChild(view);
	/** for test */
	let point = document.createElement("span");
	point.style.cssText = `
		position: absolute;
		margin: 0;
		padding: 0;
		width: 0px;
		height: 0px;
		outline: solid 2px #F00;
	`;
	view.appendChild(point);
	/** end test */
	
	const observer = new ResizeObserver(entries => {
		// Ширина и высота окна просмотра.
		view_width = entries[0].contentRect.width;
		view_height = entries[0].contentRect.height;
		
		// Центер окна просмотра.
		viev_center_x = view_width / 2;
		viev_center_y = view_height / 2;
		
		// Ширена, высота, и смещение центра, в тайлах, с учемтом масштаба.
		view_width_tile = view_width / tile_scale;
		view_height_tile = view_height / tile_scale;
		viev_center_x_tile = viev_center_x / tile_scale;
		viev_center_y_tile = viev_center_y / tile_scale;
		
		// Устанавливаем ширену и высоту самого канваса, при этом сбрасываются все настройки канваса.
		canvas.width = canvas_buf.width = view_width;
		canvas.height = canvas_buf.height = view_height;
		
		// Устанавливаем смещение пространства канвас.
		view_shift_x = viev_center_x - (viev_center_x * scale_cos_a - viev_center_y * scale_sin_a);
		view_shift_y = viev_center_y - (viev_center_x * scale_sin_a + viev_center_y * scale_cos_a);
		
		render();
		
		/** for test */
		point.style.left = viev_center_x + "px";
		point.style.top = viev_center_y + "px";
		out(viev_center_x  + " | " + viev_center_y + " | " + dpr);
		/** end test */
		
	});

	observer.observe(view);
	
};

let render_flag = false;// С флагом похоже работает идеально. Наверно нужно добавить ещё лимит по времени загрузки.
let render_flag_data = false;
//let queue_render_flag = false;// Флаг очереди чтоб сделать последний рендер. ДОДЕЛАТЬ. НЕ РЕШАЕТ ПРОБЛЕМУ.
const render = () => {
	render_flag_data = true;
	if(render_flag)return;
	render_flag = true;
	render_flag_data = false;
	// Поворачиваем и масштабируем, систему координат в канвасе для правильного отображения тайлов.
	ctx_buf.setTransform(
		scale_cos_a,
		scale_sin_a,
		-scale_sin_a,
		scale_cos_a,
		view_shift_x,
		view_shift_y
	);
	
	
	//ctx.fillRect(0, 0, canvas_side, canvas_side);// TEST
	
	
	count_img_load = 0;
	
	let size_left_border, size_right_border;// относительно координат тайлов(плиток), размер левой и правой стороны окна карты
	let sin_a, cos_a;// Синус, косинус относительно верхнего угла экрана, в системе координат тайлов, кратен 90 градусам, от угла поворота, так как экран прямоугольный.
	let left_offset, top_offset;// Смещение относительно центра, верхнего угла карты в системе координат тайлов(Веб Меркатора)
	// определяем верхний угол окна, в системе координат тайлов. это может быть любой угол окна. (тот у которого координата 'y' в веб меркаторе меньше)
	
	if(view_a === 0){// 0 Номер четверти окружности поворота карты по часовой стрелки. (север ровно на 12 часов) Четверть 0 исключительный случай. Для быстрых расчетов и избежания let tan_a === 0;
		let y = center_y - viev_center_y_tile;
		let bottom_wm = y + view_height_tile;
		let left_wm = center_x - viev_center_x_tile;
		let right_wm = left_wm + view_width_tile;
		left_wm = Math.floor(left_wm);
		y = Math.floor(y);
		
		//canvas.style.transform = "rotate(" + (-view_a) + "rad)";
		
		for(; y < bottom_wm; y++)
			for(let x = left_wm; x < right_wm; x++)test_append_elm_v3(x, y);
		
		//render_flag = false;// Для test_append_elm_v4
		return;
	}else if(view_a > 0){// определяем начальные переменные относительно верхнего угла окна карты в системе координат тайлов.
		if(view_a <= rad_90){// IV Номер четверти окружности поворота карты по часовой стрелки. (север карты на 9 - 12 часов, в окне карты.)
			size_left_border = view_height_tile;
			size_right_border = view_width_tile;
			left_offset = -viev_center_x_tile;
			top_offset = viev_center_y_tile;
			cos_a = view_cos_a;// СТОИТ УЧЕСТЬ ЧТО Math.cos в javascript, как и в большинстве других языков, ни когда не вернет НОЛЬ!!! И sin / cos безопасна!
			sin_a = view_sin_a;// ТАКЖЕ СТОИТ УЧЕСТЬ в javascript, как и в большинстве других языков, Math.sin(x) возвращает 0 только для x = 0, и (0 четверть) единственный случай.
		}else{// III
			size_left_border = view_width_tile;
			size_right_border = view_height_tile;
			left_offset = -viev_center_x_tile;
			top_offset = -viev_center_y_tile;
			sin_a = -view_cos_a;
			cos_a = view_sin_a;
		}
	}else{
		if(view_a >= -rad_90){// I
			size_left_border = view_width_tile;
			size_right_border = view_height_tile;
			left_offset = viev_center_x_tile;
			top_offset = viev_center_y_tile;
			sin_a = view_cos_a;
			cos_a = -view_sin_a;
		}else{// II
			size_left_border = view_height_tile;
			size_right_border = view_width_tile;
			left_offset = viev_center_x_tile;
			top_offset = -viev_center_y_tile;
			sin_a = -view_sin_a;
			cos_a = -view_cos_a;
		}
	}
	// Единственный случай когда tan_a === 0 это когда sin_a === 0, а этот вариант исключен условием a_view === 0
	let tan_a = sin_a / cos_a;// Тангенс, относительно верхнего угла экрана в системе координат тайлов
	let cot_a = 1 / tan_a;// Котангенс.
	let left_shift_h = size_left_border * cos_a;// размер левой стороны дисплея по оси y
	let right_shift_h = size_right_border * sin_a;// размер правой стороны дисплея по оси y
	// координаты верхнего угла окна карты, в системе координат плиток.
	let x_top_corner = left_offset * view_cos_a + top_offset * view_sin_a + center_x;
	let y_top_corner = left_offset * view_sin_a - top_offset * view_cos_a + center_y;
	let tile_y = Math.floor(y_top_corner);// ряд верхней плитки дисплея.// tile_y = tile_top;
	let tile_bottom = Math.floor(y_top_corner + left_shift_h + right_shift_h);// ряд нижней плитки дисплея.
	let l_min = x_top_corner - size_left_border * sin_a;// минимальная координата дисплея по оси x
	let r_max = x_top_corner + size_right_border * cos_a;// максимальная координата дисплея по оси x
	let shift_y_tile = Math.ceil(y_top_corner) - y_top_corner;// смещение верхнего угла дисплея относительно плитки по оси y
	let l_pos = x_top_corner - shift_y_tile * tan_a;// левая позиция в ряде.
	let r_pos = x_top_corner + shift_y_tile / tan_a;// правая позиция в ряде.
	let left_corner_y = y_top_corner + left_shift_h;// Положение левого угла дисплея по оси y, левого относительно координат тайлов.
	let right_corner_y = y_top_corner + right_shift_h;// Положение правого угла дисплея по оси y, правого относительно координат тайлов.
	let r_corner_offset = (Math.ceil(left_corner_y) - left_corner_y) / tan_a;// смещение по оси x на один ряд, относительно левого угла дисплея с левой стороны в право
	let l_corner_offset = (Math.ceil(right_corner_y) - right_corner_y) * tan_a;// смещение по оси x на один ряд, относительно правого угла дисплея с правой стороны в лево // l_corner_offset = -l_2;
	let l_shift = -tan_a;// смещение левой позиции в ряде, относительно позиции в предыдущем ряде.
	let r_shift = cot_a;// смещение правой позиции в ряде, относительно позиции в предыдущем ряде.
	let flag_l = false;// флаг достижения левого края дисплея и смены направления
	let flag_r = false;// флаг достижения правого края дисплея и смены направления
	
	while(tile_y <= tile_bottom){
		if(l_pos < l_min){// если достигнут левый край экрана
			l_pos = l_min;
			l_shift = r_corner_offset;
			flag_l = true;
		}
		if(r_pos > r_max){// если достигнут правый край экрана
			r_pos = r_max;
			r_shift = l_corner_offset;
			flag_r = true;
		}
		let l_tile = Math.floor(l_pos);
		let r_tile = Math.floor(r_pos);
		while(l_tile <= r_tile)test_append_elm_v3(l_tile++, tile_y);
		++tile_y;
		l_pos += l_shift;
		r_pos += r_shift;
		if(flag_l){
			l_shift = cot_a;
			flag_l = false;
		}
		if(flag_r){
			r_shift = -tan_a;
			flag_r = false;
		}
	}
};

const subdomains = ["a.","b.","c.",""];// поддомены.
const subdomain_mask = 3;// Маска поддомена.

const test_append_elm_v4 = (x, y) => {// Ускореная версия где нет поворота.
	let temp_x = x - center_x;
	let temp_y = y - center_y;
	let dx = Math.floor(temp_x * tile_size + viev_center_x);
	let dy = Math.floor(temp_y * tile_size + viev_center_y);
	
	/**/
	x %= max_xy;
	y %= max_xy;
	if(x < 0)x += max_xy;
	if(y < 0)y += max_xy;
	/**/
	
	let img = new Image(tile_size, tile_size);
	img.src = "https://" + subdomains[(x ^ y) & subdomain_mask] + "tile.openstreetmap.org/" + z + "/" + x + "/" + y + ".png";// + (((x ^ y) & 7) !== 0 ? "": "qwe");// Искуственная ошибка.
	
	img.onload = () => {
		ctx.drawImage(img, dx, dy, tile_size, tile_size);
	};
	img.onerror = () => {
		ctx.fillRect(dx, dy, tile_size, tile_size);// Заглушка.
	};
	
};

let count_img_load = 0;

const test_append_elm_v3 = (x, y) => {
	
	
	let temp_x = x - center_x;
	let temp_y = y - center_y;
	let dx = Math.floor(temp_x * tile_size + viev_center_x);
	let dy = Math.floor(temp_y * tile_size + viev_center_y);
	
	/**/
	x %= max_xy;
	y %= max_xy;
	if(x < 0)x += max_xy;
	if(y < 0)y += max_xy;
	/**/
	
	count_img_load++;
	let img = new Image(tile_size, tile_size);
	img.src = "https://" + subdomains[(x ^ y) & subdomain_mask] + "tile.openstreetmap.org/" + z + "/" + x + "/" + y + ".png";// + (((x ^ y) & 7) !== 0 ? "": "qwe");// Искуственная ошибка.
	
	img.onload = () => {
		ctx_buf.drawImage(img, dx, dy, tile_size + .3, tile_size + .3);
		count_img_load--;
		if(count_img_load === 0)test_77();
	};
	img.onerror = () => {
		ctx_buf.fillRect(dx, dy, tile_size, tile_size);// Заглушка.
		count_img_load--;
		if(count_img_load === 0)test_77();
	};
	
};

const test_77 = () => {
	/**/
	//alert(123);
	let temp_canvas = canvas;
	let temp_ctx = ctx;
	canvas = canvas_buf;
	ctx = ctx_buf;
	canvas_buf = temp_canvas;
	ctx_buf = temp_ctx;
	/**/
	
	
	canvas.style.opacity = '1';
	canvas_buf.style.opacity = '0';
	render_flag = false;
	if(render_flag_data)render();
};


/**/

nava.init = (elm) => {
	initView(elm);
};

nava.setAngleDeg = a => {
	nava.setAngle(toRad(a));
};

nava.setAngle = a => {
	view_a = -a;// Если карта вращается в одну сторону, то экран относительно карты в противоположенную.
	view_a = (view_a + rad_2340) % rad_360 - rad_180;
	
	view_sin_a = Math.sin(view_a);
	view_cos_a = Math.cos(view_a);
	
	// Устанавливаем синус и косинус с учетом масштаба.
	scale_sin_a = -view_sin_a * scale;
	scale_cos_a = view_cos_a * scale;
	
	// Устанавливаем смещение пространства канвас.
	view_shift_x = viev_center_x - (viev_center_x * scale_cos_a - viev_center_y * scale_sin_a);
	view_shift_y = viev_center_y - (viev_center_x * scale_sin_a + viev_center_y * scale_cos_a);
	
	render();
};

nava.setZoom = new_zoom => {
	// устанавливаем новый зум.
	zoom = new_zoom;
	if(zoom < z_min)zoom = z_min;
	else if(zoom > z_max)zoom = z_max;
	z = (zoom + delimiter_zoom) | 0;// Зум тайлов.
	scale = 2 ** (zoom - z) * dpr;// Масштаб для отображения на экране.
	tile_scale = tile_size * scale;// Размер отображения тайлов учитывая масштаб
	
	// Убераем зум с координат центра.
	center_x /= half_length_WM;
	center_y /= half_length_WM;
	
	// Устанавливаем переменные для преобразорвания в тайловую систему координат в соответствии с зумом.
	half_length_WM = 2 ** (z - 1);
	radius_WM = half_length_WM / rad_180;
	deg_WM = half_length_WM / 180;
	max_xy = 1 << z;
	
	// Востонавливаем зум координат центра.
	center_x *= half_length_WM;
	center_y *= half_length_WM;
	
	// Устанавливаем синус и косинус с учетом масштаба.
	scale_sin_a = -view_sin_a * scale;
	scale_cos_a = view_cos_a * scale;
	
	// Устанавливаем ширену, высоту, и смещение центра, в тайлах, с учемтом масштаба.
	view_width_tile = view_width / tile_scale;
	view_height_tile = view_height / tile_scale;
	viev_center_x_tile = viev_center_x / tile_scale;
	viev_center_y_tile = viev_center_y / tile_scale;
	
	// Устанавливаем смещение пространства канвас.
	view_shift_x = viev_center_x - (viev_center_x * scale_cos_a - viev_center_y * scale_sin_a);
	view_shift_y = viev_center_y - (viev_center_x * scale_sin_a + viev_center_y * scale_cos_a);
	
	render();
};


// Безопасный экспорт в глобальную область (window или global)
if(!global.nava)global.nava = nava;

})(typeof window !== "undefined" ? window : this);
