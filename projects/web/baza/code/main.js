/**
Пространство
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
var container;
var canvas;
var ctx;
var innerWidth;
var innerHeight;
var mouse_x, mouse_y;
const size_img_data = 1024;// 1024 x 1024
var img_data;
var grass_pattern;
var objects_atlas_canvas;// Глобальный холст-атлас для объектов
var map;
var map_x = 0;
var map_y = 0;
var map_z = 1;

// Данные
const type_grounds = [
	{
		id: 0,
		name: "dirt",// земля // грунт
		movement_speed: 1,
		view_id: 0

	},
	{
		id: 1,
		name: "grass",// трава
		movement_speed: 1.2,
		view_id: 1
	}
]
// Логика
class Cell{// ячейуа.
	
	constructor(){
		this.xy = 0;
		this.biome_id = 0;
		this.unit = null;
		this.building = null;
		//this.fog_of_war = null;// перенести в играков.
		this.items = [];// обекты ячейки.
	}
}

class Map{// карта.
	//
	constructor(){
		this.w = 256;
		this.h = 256;
		this.cells = [];// обекты поля.
		this.items = [];// обекты поля.
	}
}

function __getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomInt(n){
	return Math.random() * (n + 1) >>> 0;
}

let seed = (Math.random() * 0x100000000) >>> 0;//0x77777777;//
function fastRandomInt(n){
	// Алгоритм SplitMix32: генерируем сырое 32-битное число
	let t = seed = (seed + 0x6D2B79F5) >>> 0;
	t = Math.imul(t ^ (t >>> 15), t | 1);
	t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
	let rawRandom = (t ^ (t >>> 14)) >>> 0;
	
	// Ограничиваем диапазон побитовой маской без использования медленного оператора %
	let mask = 0xFFFFFFFF >>> Math.clz32(n);
	let result = (rawRandom & mask) >>> 0; 
	
	// Метод исключения (Rejection Sampling): если число вышло за рамки N, берем следующее
	while(result > n){
		t = seed = (seed + 0x6D2B79F5) >>> 0;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		rawRandom = (t ^ (t >>> 14)) >>> 0;
		result = (rawRandom & mask) >>> 0;
	}
	
	return result;
}

// 2.1 Быстрый генератор случайных. от 0 до 1 не включая 1.
let rng = () => {
	seed = (seed * 1664525 + 1013904223) % 4294967296;
	return seed / 4294967296;
};
const permutation = new Uint8Array(512);
for(let i = 0; i < 256; i++)permutation[i] = i;

// 2. Быстрое тасование Фишера-Йетса
for(let i = 255; i > 0; i--){
    const j = (rng() * (i + 1)) | 0;
    const temp = permutation[i];
    permutation[i] = permutation[j];
    permutation[j] = temp;
}
for(let i = 0; i < 256; i++){
	permutation[i + 256] = permutation[i];
}
let fade = t => t * t * t * (t * (t * 6 - 15) + 10);
let lerp = (t, a, b) => a + t * (b - a);
let grad = (hash, x, y) => {
	const h = hash & 3;
	const u = h < 2 ? x : -x;
	const v = (h === 0 || h === 2) ? y : -y;
	return u + v;
};
// 1. Базовый шум Перлина (возвращает от 0.0 до 1.0)
let noise2D = (x, y) => {
	const xInt = Math.floor(x);
	const yInt = Math.floor(y);

	let X = xInt & 255;
	let Y = yInt & 255;

	x -= xInt;
	y -= yInt;

	const u = fade(x);
	const v = fade(y);

	const p = permutation;
	const aa = p[p[X] + Y];
	const ab = p[p[X] + Y + 1];
	const ba = p[p[X + 1] + Y];
	const bb = p[p[X + 1] + Y + 1];

	const x1 = lerp(u, grad(aa, x, y), grad(ba, x - 1, y));
	const x2 = lerp(u, grad(ab, x, y - 1), grad(bb, x - 1, y - 1));

	const val = lerp(v, x1, x2);
	return (val + 1.0) / 2.0;
};

// Константы скоса для 2D пространства
const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

// Градиенты для Симплекс-шума (12 векторов направлений по кругу)
const grad3 = new Float32Array([
	1,1,  -1,1,  1,-1,  -1,-1,
	1,0,  -1,0,  0,1,   0,-1,
	0,1,   0,-1, 1,0,   -1,0
]);

let simplex2D = (xin, yin) => {
	let n0, n1, n2; // Вклад от трех вершин

	// 1. Скашиваем входное пространство для определения ячейки
	const s = (xin + yin) * F2;
	const i = Math.floor(xin + s);
	const j = Math.floor(yin + s);

	// Обратный сдвиг, чтобы вернуть координаты в обычное пространство
	const t = (i + j) * G2;
	const X0 = i - t;
	const Y0 = j - t;

	// Расстояние от первой вершины (0) до исходной точки
	const x0 = xin - X0;
	const y0 = yin - Y0;

	// 2. Определяем, в каком из двух треугольников ячейки мы находимся
	let i1, j1; // Смещения для второй вершины
	if(x0 > y0) {
		i1 = 1; j1 = 0; // Нижний треугольник
	} else {
		i1 = 0; j1 = 1; // Верхний треугольник
	}

	// Координаты второй и третьей вершин в сдвинутом пространстве
	const x1 = x0 - i1 + G2;
	const y1 = y0 - j1 + G2;
	const x2 = x0 - 1.0 + 2.0 * G2;
	const y2 = y0 - 1.0 + 2.0 * G2;

	// Хэшируем координаты вершин через наш Uint8Array массив permutation
	const p = permutation;
	const ii = i & 255;
	const jj = j & 255;

	const gi0 = p[ii + p[jj]] % 12;
	const gi1 = p[ii + i1 + p[jj + j1]] % 12;
	const gi2 = p[ii + 1 + p[jj + 1]] % 12;

	// 3. Считаем вклад от первой вершины
	let t0 = 0.5 - x0 * x0 - y0 * y0;
	if(t0 < 0) n0 = 0.0;
	else {
		t0 *= t0;
		// Скалярное произведение вектора градиента и вектора расстояния
		n0 = t0 * t0 * (grad3[gi0 * 2] * x0 + grad3[gi0 * 2 + 1] * y0);
	}

	// Вклад от второй вершины
	let t1 = 0.5 - x1 * x1 - y1 * y1;
	if(t1 < 0) n1 = 0.0;
	else {
		t1 *= t1;
		n1 = t1 * t1 * (grad3[gi1 * 2] * x1 + grad3[gi1 * 2 + 1] * y1);
	}

	// Вклад от третьей вершины
	let t2 = 0.5 - x2 * x2 - y2 * y2;
	if(t2 < 0) n2 = 0.0;
	else {
		t2 *= t2;
		n2 = t2 * t2 * (grad3[gi2 * 2] * x2 + grad3[gi2 * 2 + 1] * y2);
	}

	// Суммируем вклады и нормализуем строго в диапазон [0.0, 1.0]
	// Исходный симплекс выдает значения от ~ -0.014 до ~ 0.014 из-за констант затухания
	const finalVal = 70.0 * (n0 + n1 + n2);// первый параметер 70 в строке "70.0 * (n0 + n1 + n2);" влияет на диапазон шума(контраст)
	return (finalVal + 1.0) / 2.0;
};

// 2. Фрактальный шум Перлина (возвращает от 0.0 до 1.0)
let fractal2D = (x, y, octaves = 4, persistence = 0.5, lacunarity = 2.0) => {
	let total = 0.0;
	let frequency = 1.0;
	let amplitude = 1.0;
	let maxValue = 0.0;

	for(let i = 0; i < octaves; i++){
		total += simplex2D(x * frequency, y * frequency) * amplitude;
		maxValue += amplitude;

		amplitude *= persistence;
		frequency *= lacunarity;
	}

	return total / maxValue;
};
// Популярные алгоритмы процедурной генерации карт:
/*
const MAP_ALGORITHMS = [
	"PerlinNoise",     // Базовый рельеф, плавные холмы, облака, текстуры дерева
	"SimplexNoise",    // Контрастный природный рельеф без диагональных артефактов
	"VoronoiDiagram",  // Разбиение на биомы, зоны государств, тектонические плиты
	"WorleyNoise",     // Базальтовые скалы, текстура камня, чешуя, жидкая лава
	"ValueNoise",      // Быстрая интерполяция высот, спавн пятен руды и ресурсов
	"CellularAutomata" // Генерация лабиринтов, пещер, подземелий, сглаживание блоков
];
//*/

class Map_test{// карта.
	//
	constructor(){
		this.w = 256;
		this.h = 256;
		img_data = ctx.createImageData(this.w, this.h);
		const buf_32 = new Uint32Array(img_data.data.buffer);
		for (let i = 0; i < buf_32.length; i++) {
			// Записываем пиксель в формате ABGR
			buf_32[i] = 0xFF000000;
		}
		// генерируем карту.

		//// генератор реки.
		// выбираем точку входа реки.
		let start_r = fastRandomInt(200) + 28;
		let w_r = fastRandomInt(20) + 10;

		/*
		for(let x = 0; x < this.w; x++){
			let temp = fastRandomInt(100);
			// вероятность изменения,
			if(temp <= 15)start_r += 1;
			else if(temp <= 30)start_r -= 1;
			temp = fastRandomInt(100);
			if(temp <= 15)w_r += 1;
			else if(temp <= 30)w_r -= 1;

			for(let y = start_r; y < start_r + w_r; y++){
				// Записываем пиксель в формате ABGR
				buf_32[y * this.w + x] = 0xFFFF8800;
			}
		}
		//*/
		/*
		for (let i = 0; i < 100000; i++) {
			// Записываем пиксель в формате ABGR
			let x = fastRandomInt(255);
			let y = fastRandomInt(255);
			//buf_32[y * this.w + x] = 0xFFFFFFFF;
			let t = buf_32[y * this.w + x] & 0xFF;
			t += 0x22;
			if(t > 0xFF)t = 0xFF;
			buf_32[y * this.w + x] = 0xFF000000 | (t << 16) | (t << 8) | t;
		}
		//*/
		/*
		for(let x = 0; x < this.w; x++){

			let y = fastRandomInt(x);
			buf_32[y * this.w + x] = 0xFF0000FF;
		}
		//*/
		//*
		const scale = 64.0;
		// Берем любые большие некратные числа в качестве смещения
		const offsetX = 10005.37;
		const offsetY = 20009.81;
		for(let x = 0; x < this.w; x++){
			for(let y = 0; y < this.h; y++){
				// Сдвигаем координаты на случайные большие числа, чтобы уйти от точки (0,0)
				// И слегка подмешиваем одну координату в другую для имитации микро-поворота
				const nx = (x / scale) + offsetX;
				const ny = (y / scale) + offsetY;

				let c = fractal2D(nx, ny, 6, 0.5, 2.0) * 0xFF & 0xFF;
				/*
				// Варианта для увеличения диапазона 70 в const finalVal = 70.0 * (n0 + n1 + n2);
				let c = fractal2D(nx, ny, 6, 0.5, 2.0) * 0xFF;
				if(c > 0xFF)c = 0xFF;
				else if(c < 0)c = 0;
				//*/
				buf_32[y * this.w + x] = 0xFF000000 | (c << 16) | (c << 8) | c;
			}
		}
		//*/

		// 1. Создаем финальный холст-атлас в памяти
		objects_atlas_canvas = document.createElement('canvas');
		objects_atlas_canvas.width = this.w;
		objects_atlas_canvas.height = this.h;
		const atlas_ctx = objects_atlas_canvas.getContext('2d');
		atlas_ctx.putImageData(img_data, 0, 0, 0, 0, this.w, this.h); 
		
	}
}
// Визуал

// Инициализация
function init(){
	// создаем текстуры
	img_data = ctx.createImageData(64, 64);
	const buf_32 = new Uint32Array(img_data.data.buffer);
	for (let i = 0; i < buf_32.length; i++) {
		//buf_32[i] = (255 << 24) | (0 << 16) | (120 << 8) | 40; // Пример цвета
		// Получаем локальные координаты пикселя внутри тайла 64х64
		const x = i % 64;
		const y = (i / 64) | 0;

		// Быстрый математический псевдошум (без медленного Math.random)
		let h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
		h = (h - (h | 0)) * 255; 

		// Вариация зеленого цвета на основе шума (оттенок меняется от 100 до 140)
		const g = 100 + (Math.abs(h) * 0.15) | 0;
		
		// Записываем пиксель в формате ABGR
		buf_32[i] = (255 << 24) | (30 << 16) | (g << 8) | 40;
	}
	
	// Создаем ОДНУ статичную матрицу изометрического сжатия (2:1)
	const iso_matrix = new DOMMatrix([1, 0, 0, 0.5, 0, 0]); 

	createImageBitmap(img_data).then(bitmap => {
		// Этот колбэк выполнится сразу же в текущем тике, так как источник локальный
		grass_pattern = ctx.createPattern(bitmap, 'repeat');
		grass_pattern.setTransform(iso_matrix);
		bitmap.close(); // Память очищена
	});


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
}


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

	container.innerHTML = '';
	container.appendChild(canvas);

	//init();
	map = new Map_test();


	// Отключаем сглаживание
	ctx.imageSmoothingEnabled = false;
	ctx.font = "bold 14px 'Courier New', Courier, monospace";
	drawTestScene();

	//*
	let offsetX, offsetY, isDragging = false;

	canvas.addEventListener('mousedown', (e) => {
		isDragging = true;
		offsetX = e.clientX;
		offsetY = e.clientY;
		
	});


	canvas.addEventListener('mousemove', (e) => {
		if (!isDragging) return;

		map_x += e.movementX;
		map_y += e.movementY;
		drawTestScene();
	});

	canvas.addEventListener('mouseup', () => {
		isDragging = false;
	});
	canvas.addEventListener('mouseleave', () => {
		isDragging = false;
	});

	canvas.addEventListener('wheel', (e) => {
		//map_z *= e.deltaY < 0 ? .9: 1.1;
		let temp_z = map_z;
		map_z += e.deltaY < 0 ? 1: -1;
		if(map_z < 1)map_z = 1;
		if(map_z > 20)map_z = 20;

		let offsetX = e.offsetX - map_x;
		let offsetY = e.offsetY - map_y;

		temp_z = map_z / temp_z;

		offsetX *= temp_z;
		offsetY *= temp_z;

		map_x = e.offsetX - offsetX;
		map_y = e.offsetY - offsetY;

		
		drawTestScene();
	}, { passive: false });
	//*/

	/**
	canvas.addEventListener("mousemove", e => {
		mouse_x = e.offsetX;
		mouse_y = e.offsetY;
		drawTestScene();
		
	});
	//*/
}






// Тесты
function drawTestScene(){
	ctx.fillStyle = '#87CEFA';
	ctx.fillRect(0, 0, innerWidth, innerHeight);

	ctx.drawImage(objects_atlas_canvas, 0, 0, map.w, map.h, map_x, map_y, map.w * map_z, map.h * map_z);
}

function drawTestScene_v1(){
	ctx.fillStyle = '#87CEFA';
	ctx.fillRect(0, 0, innerWidth, innerHeight);

	ctx.strokeStyle = '#888888';
	ctx.lineWidth = 4;
	ctx.strokeRect(2, 2, innerWidth - 4, innerHeight - 4);

	// Тест
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = 1;
	ctx.lineCap = "round";
	ctx.beginPath();

	let m = 4 + 1;
	let kof = 2;//1.414;
	let _innerHeight = (innerHeight - m * 2) * (kof >= 2 ? 1.0 : kof / 2);

	
	let quantity = 4;
	let w_offset = _innerHeight / quantity;
	let h_offset = w_offset / kof;
	let x_start = innerWidth / 2;
	let y_start = m;
	let w_x = _innerHeight;
	let w_y = w_x / kof;
	let y = 0;

	for(let x = 0; x <= quantity; x++){
		ctx.moveTo(x_start + w_offset * x, y_start + h_offset * y);
		ctx.lineTo(x_start + w_offset * x - w_x, y_start + h_offset * y + w_y);

		ctx.moveTo(x_start - w_offset * x, y_start + h_offset * y);
		ctx.lineTo(x_start - w_offset * x + w_x, y_start + h_offset * y + w_y);
		y++;
	}

	ctx.moveTo(50, 50);
	ctx.lineTo(150, 50);
	ctx.moveTo(50, 80);
	ctx.lineTo(150, 80);
	ctx.stroke();

	
	

	// Вычисляем ячейки.
	const TILE_WIDTH = w_offset * 2;
	const TILE_HEIGHT = h_offset * 2;
	const relative_x = mouse_x - m;
	const relative_y = mouse_y - m;
	const nx = relative_x / TILE_WIDTH;
	const ny = relative_y / TILE_HEIGHT;
	let cellI = Math.floor(nx + ny);
	let cellJ = Math.floor(ny - nx);
	// нарисуем рамку.
	const screen_x = (cellI - cellJ) * w_offset + m * 2;
    const screen_y = (cellI + cellJ) * h_offset + m;
	ctx.strokeStyle = '#FF0000';
	ctx.fillStyle = grass_pattern;
	//ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(screen_x, screen_y);
	ctx.lineTo(screen_x + w_offset, screen_y + h_offset);
	ctx.lineTo(screen_x, screen_y + TILE_HEIGHT);
	ctx.lineTo(screen_x - w_offset, screen_y + h_offset);
	ctx.closePath();
	//ctx.stroke();
	ctx.fill();

	ctx.drawImage(objects_atlas_canvas, 0, 0, 64, 64, screen_x, screen_y, TILE_WIDTH, TILE_HEIGHT);

	cellI -= quantity / 2;
	cellJ += quantity / 2;

	ctx.fillStyle = '#000';
	
	ctx.fillText("mouse_x: " + mouse_x, 50, 40);
	ctx.fillText("mouse_y: " + mouse_y, 50, 70);
	ctx.fillText("x: " + cellI + ", y: " + cellJ, 50, 100);

}



