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
class field{// поле схватки.
	
	constructor(){
		// ширина и высота, абстрактно задает размеры
		this.width = 10;
		this.height = 8;
		// тип земли, поверхности по умолчанию.
		
		this.type_ground_id = 0;
		this.items = [];
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

	init();

	drawTestScene();
	ctx.font = "bold 14px 'Courier New', Courier, monospace";
	canvas.addEventListener("mousemove", e => {
		mouse_x = e.offsetX;
		mouse_y = e.offsetY;
		drawTestScene();
		
	});
}






// Тесты

function drawTestScene(){
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



