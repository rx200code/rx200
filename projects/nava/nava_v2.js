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
const deg_2rad = 360 / rad_180;// 2 радиана в градусах

// Функции перевода радиан в градусы и обратно.
const toRad = deg => deg * rad_1;
const toDeg = rad => rad / rad_1;

// минимальные и максимальные значения для широты, долготы(EPSG:3857) и зума.
const lat_min = -85.0511287;//Более точное значение -85.0511287798065822585;
const lat_max = 85.0511287;//Более точное значение 85.0511287798065822585;
const lon_min = -180;
const lon_max = 180;
const zoom_min = 0;
let zoom_max = 18;// let так как может менятся в зависимости от поставщика тайлов.
let tile_size = 256;


// ОСНОВНЫЕ переменные карты.
// Значения по умолчанию.
/*
Картак отображается относительно центра.
А центер всегда в координатах ТАЙЛОВ, для определенного зума.
Четыре параметра ниже, определяют как и где отобразится карта. Любое их изменение влечет и изменение дополнительных параметов.
*/
let zoom = 15;// Уровень зума
let center_x = 23938.844444444447;// lon = 83;// Долгота // zoom = 15;
let center_y = 10364.448450336584;// lat = 55;// Широта // zoom = 15;
let view_a = toRad(-0);//-0;// Угол поворота окна карты, относительно карты(отрицательный угол поворота карты).

// ДОПОЛНИТЕЛЬНЫЕ параметры, должны менятся при изменении основных.

// Параметры для работы функций перевода в тайлы Веб меркатора и обратно, должны обновлятся при изменении зума.
let half_length_WM = 2 ** (zoom - 1);//let half_length_WM = 1 << (zoom - 1);// половина длины Веб меркатора в тайлах(tile = 1), Math.log2(tile) = 0;
let radius_WM = half_length_WM / rad_180;// Радиус веб меркатора, если считать длину в количестве тайлов на сторону.
let deg_WM = half_length_WM / 180;// Один градус долготы Веб меркатора в тайлах.

// Функции перевода в Веб меркатор в тайлах и обратно. функции для работы с радианами заканчиваются на Rad.
const toYRad = lat_rad => half_length_WM - radius_WM * Math.log(Math.tan(lat_rad / 2 + rad_45));// получает Y Веб Меркатора исходя из широты в радианах(lat_rad).
const toY = lat => half_length_WM - radius_WM * Math.log(Math.tan(lat / deg_2rad + rad_45));// получает Y Веб Меркатора исходя из широты в градусах(lat).
const toLatRad = y => Math.atan(Math.exp((half_length_WM - y) / radius_WM)) * 2 - rad_90;// обратная toYRad()
const toLat = y => Math.atan(Math.exp((half_length_WM - y) / radius_WM)) * deg_2rad - 90;// обратная toY()
const toXRad = lon_rad => lon_rad * radius_WM + half_length_WM;// получает X Веб Меркатора исходя из долготы в радианах(lon_rad).
const toX = lon => lon * deg_WM + half_length_WM;// получает X Веб Меркатора исходя из долготы в градусах(lon).
const toLonRad = x => x / radius_WM - rad_180;// обратная toXRad()
const toLon = x => x / deg_WM - 180;// обратная toX()

// Допрлнительно для получения широты и долготы центра карты.
const getLat = () => deg_2rad * Math.atan(Math.exp((half_length_WM - center_y) / radius_WM)) - 90;
const getLon = () => center_x / deg_WM - 180;

// 
let view_sin_a = Math.sin(view_a);// 0
let view_cos_a = Math.cos(view_a);// 1

// минимальные и максимальные значения для x, y, tile.
const min_xy = 0;
const tile_min = 1;
let max_xy = 1 << zoom;//2 ** zoom;


// МЕТОДЫ.

// Инициализация.
/*
Необходимо установить:
1. Элемент отображения. DIV и его размеры.
2. Источник тайлов.
3. Координаты центра, угол и зумм.
*/

// initView - инициализирует переменные связанные с отображением, и вызывает рендер карты, так же как и при изменении окна карты.
const dpr = .5;//window.devicePixelRatio || 1; // Коэффициент плотности пикселей
// Положение центра в окне карты.
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
	overflow: hidden;
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
canvas_buf.style.opacity = '0';
view.appendChild(canvas);
view.appendChild(canvas_buf);

let ctx = canvas.getContext("2d");
let ctx_buf = canvas_buf.getContext("2d");

let canvas_side;
let canvas_center_xy;

// Слушатели
view.onwheel = e => {// ПРОБНЫЙ ВАРИАНТ? для тестов
	//Масштабирует относительно центра окна карты.
	
	//out(e.offsetX + " | " + e.offsetY);
	
	//
	let temp_x = center_x / half_length_WM;
	let temp_y = (half_length_WM - center_y) / radius_WM;
	
	zoom -= Math.sign(e.deltaY);//Для совместимости браузеров, от дельты берем только знак.
	
	if(zoom < zoom_min)zoom = zoom_min;
	else if(zoom > zoom_max)zoom = zoom_max;
	
	//half_length_WM = 1 << (zoom - 1);// половина длины Веб меркатора в тайлах(tile = 1), Math.log2(tile) = 0;
	half_length_WM = 2 ** (zoom - 1);// половина длины Веб меркатора в тайлах(tile = 1), Math.log2(tile) = 0;
	radius_WM = half_length_WM / rad_180;// Радиус веб меркатора, если считать длину в количестве тайлов на сторону.
	max_xy = 1 << zoom;
	
	center_x = temp_x * half_length_WM;
	center_y = half_length_WM - temp_y * radius_WM;
	
	render();
	
	out(zoom);
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
		
		const view_width = entries[0].contentRect.width;
		const view_height = entries[0].contentRect.height;
		
		viev_center_x = view_width / 2;
		viev_center_y = view_height / 2;
		
		view_width_tile = view_width / tile_size;
		view_height_tile = view_height / tile_size;
		viev_center_x_tile = viev_center_x / tile_size;
		viev_center_y_tile = viev_center_y / tile_size;
		
		
		
		canvas_side = Math.ceil((view_width ** 2 + view_height ** 2) ** .5);
		canvas_center_xy = canvas_side / 2;
		canvas.width = canvas.height = canvas_buf.width = canvas_buf.height = canvas_side;
		
		let canvas_x_offset = canvas_center_xy - viev_center_x;// Начальное смещение положения буферов за пределы окна карты по x
		let canvas_y_offset = canvas_center_xy - viev_center_y;// Начальное смещение положения буферов за пределы окна карты по y
		canvas.style.left = canvas_buf.style.left = -canvas_x_offset + 'px';
		canvas.style.top = canvas_buf.style.top = -canvas_y_offset + 'px';
		
		//ctx.fillStyle = ctx_buf.fillStyle = "#888";
		
		
		render();
		
		/** for test */
		point.style.left = viev_center_x + "px";
		point.style.top = viev_center_y + "px";
		out(viev_center_x  + " | " + viev_center_y + " | ");
		/** end test */
		
	});

	observer.observe(view);
	
};

let render_flag = false;// С флагом похоже работает идеально. Наверно нужно добавить ещё лимит по времени загрузки.
const render = () => {
	if(render_flag)return;
	render_flag = true;
	
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
		
		canvas.style.transform = "rotate(" + (-view_a) + "rad)";
		
		for(; y < bottom_wm; y++)
			for(let x = left_wm; x < right_wm; x++)test_append_elm_v4(x, y);
		
		render_flag = false;// Для test_append_elm_v4
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
	let dx = Math.floor(temp_x * tile_size + canvas_center_xy);
	let dy = Math.floor(temp_y * tile_size + canvas_center_xy);
	
	/**/
	x %= max_xy;
	y %= max_xy;
	if(x < 0)x += max_xy;
	if(y < 0)y += max_xy;
	/**/
	
	let img = new Image(tile_size, tile_size);
	img.src = "https://" + subdomains[(x ^ y) & subdomain_mask] + "tile.openstreetmap.org/" + zoom + "/" + x + "/" + y + ".png";// + (((x ^ y) & 7) !== 0 ? "": "qwe");// Искуственная ошибка.
	
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
	let dx = Math.floor(temp_x * tile_size + canvas_center_xy);
	let dy = Math.floor(temp_y * tile_size + canvas_center_xy);
	
	/**/
	x %= max_xy;
	y %= max_xy;
	if(x < 0)x += max_xy;
	if(y < 0)y += max_xy;
	/**/
	
	count_img_load++;
	let img = new Image(tile_size, tile_size);
	img.src = "https://" + subdomains[(x ^ y) & subdomain_mask] + "tile.openstreetmap.org/" + zoom + "/" + x + "/" + y + ".png";// + (((x ^ y) & 7) !== 0 ? "": "qwe");// Искуственная ошибка.
	
	img.onload = () => {
		ctx_buf.drawImage(img, dx, dy, tile_size, tile_size);
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
	
	canvas.style.transform = "rotate(" + (-view_a) + "rad)";
	canvas.style.opacity = '1';
	canvas_buf.style.opacity = '0';
	render_flag = false;
};


/**/

nava.init = (elm) => {
	initView(elm);
};


// Безопасный экспорт в глобальную область (window или global)
if(!global.nava)global.nava = nava;

})(typeof window !== "undefined" ? window : this);
