/**
Разные генераторы шума.
const MAP_ALGORITHMS = [
	// === АЛГОРИТМЫ ШУМА (Генерация непрерывных и случайных значений) ===
	"WhiteNoise",			 // Полный хаос, зернистость, базовый шум для постобработки и помех
	"PerlinNoise",			// Базовый рельеф, плавные холмы, облака, текстуры дерева
	"SimplexNoise",		   // Контрастный природный рельеф без диагональных артефактов
	"OpenSimplex2",		   // Современная свободная альтернатива Simplex без патентных ограничений
	"ValueNoise",			 // Быстрая интерполяция высот, спавн пятен руды и ресурсов
	"WorleyNoise",			// Базальтовые скалы, текстура камня, чешуя, жидкая лава
	"FractalBrownianMotion",  // Фрактальное наложение слоев шума (FBM) для детализированных гор
	"Turbulence",			 // Модификация шума с резкими складками для симуляции вен мрамора, лавы или огня

	// === НЕ ШУМЫ (Геометрические структуры, симуляции и алгоритмы постобработки) ===
	"VoronoiDiagram",		 // Разбиение пространства на биомы, зоны государств, тектонические плиты
	"CellularAutomata"		// Пошаговая симуляция ячеек: генерация лабиринтов, пещер, сглаживание блоков
];
/**/
// 0. Функция рандома. Быстрый генератор случайных. от 0 до 1 не включая 1.
let seed = (Math.random() * 0x100000000) >>> 0;//0x77777777;
let random = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;

/*
const buffer_random = new ArrayBuffer(16);
const float_view = new Float64Array(buffer_random);
const int_view = new Int32Array(buffer_random);
let random_noise = (x, y) => {
	// 1. Записываем x и y как "честные" 64-битные дроби (Double)
	float_view[0] = x;
	float_view[1] = y;
	// 3. Смешиваем все эти биты с вашим сидом через XOR
	let h = seed;
	h ^= Math.imul(int_view[0], 0x9e3779b9);
	h ^= Math.imul(int_view[1], 0x278dde6d);
	h ^= Math.imul(int_view[2], 0x7f4a7c15);
	h ^= Math.imul(int_view[3], 0x1dd31319);
	// 4. Дальше идет ваша отличная перемешка (MurmurHash)
	h = Math.imul(h, 374761393); // Подмешаем константу сразу в h
	h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
	h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
	h = h ^ (h >>> 16);
	
	return (h >>> 0) / 4294967295;
};
/**/
// 0.0 Белый шум WhiteNoise
//**
let random_noise = (x, y) => {
	let h = seed ^ x * 668265263 ^ y * 374761393 ^ 0x1337af; 
	h = Math.imul(h ^ (h >>> 16), 0x7feb352d);
	h = Math.imul(h ^ (h >>> 13), 0x846ca68b);
	h = h ^ (h >>> 16);
	return (h >>> 0) / 4294967295;
};
/**/
/**
let random_noise = (x, y) => {
	let h = seed ^ Math.imul(x, 668265263) ^ Math.imul(y, 374761393) ^ 0x1337af; 
	h = Math.imul(h ^ (h >>> 16), 0x7feb352d);
	h = Math.imul(h ^ (h >>> 13), 0x846ca68b);
	h = h ^ (h >>> 16);
	return (h >>> 0) / 4294967295;
};
/**/
/*
const buffer_random = new ArrayBuffer(16);
const data_random = new DataView(buffer_random);
let random_noise = (x, y) => {
	// 1. Записываем x и y как "честные" 64-битные дроби (Double)
	data_random.setFloat64(0, x);
	data_random.setFloat64(8, y);
	// 3. Смешиваем все эти биты с вашим сидом через XOR
	let h = seed ^ data_random.getInt32(0) ^ data_random.getInt32(4) ^ data_random.getInt32(8) ^ data_random.getInt32(12);
	// 4. Дальше идет ваша отличная перемешка (MurmurHash)
	h = Math.imul(h, 374761393); // Подмешаем константу сразу в h
	h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
	h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
	h = h ^ (h >>> 16);
	
	return (h >>> 0) / 4294967295;
};
/**/

// 0.1. Фрактальный шум.
let fractal2D = (f_noise, x, y, octaves = 4, persistence = 0.5, lacunarity = 2.0) => {
	let total = 0.0;
	let frequency = 1.0;
	let amplitude = 1.0;
	let maxValue = 0.0;

	for(let i = 0; i < octaves; i++){
		total += f_noise(x * frequency, y * frequency) * amplitude;
		maxValue += amplitude;
		amplitude *= persistence;
		frequency *= lacunarity;
	}
	return total / maxValue;
};

// 1. Базовый шум Перлина.
// 1.1 инициализация permutation, для установки своего seed вынесена в init_permutation.
const permutation = new Uint8Array(512);
let init_permutation = () => {
	for(let i = 0; i < 256; i++)permutation[i] = i;
	// Быстрое тасование Фишера-Йетса
	for(let i = 255; i > 0; i--){
		const j = (random() * (i + 1)) | 0;
		const temp = permutation[i];
		permutation[i] = permutation[j];
		permutation[j] = temp;
	}
	for(let i = 0; i < 256; i++){
		permutation[i + 256] = permutation[i];
	}
};
// Функция сглаживания Кэна Перлина (Smootherstep: 6t⁵ - 15t⁴ + 10t³)
let fade = t => t * t * t * (t * (t * 6 - 15) + 10);
// Линейная интерполяция (Lerp)
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


// 2. Симплексный шум Перлина.
// Константы скоса для 2D пространства
const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

// Градиенты для Симплекс-шума (12 векторов направлений по кругу)
const grad3 = new Float32Array([
	1,1,  -1,1,  1,-1,  -1,-1,
	1,0,  -1,0,  0,1,   0,-1,
	0,1,   0,-1, 1,0,   -1,0
]);

let simplex_scale_factor = 70.0;//70.17518298862789;
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
	const finalVal = simplex_scale_factor * (n0 + n1 + n2);// первый параметер 70 в строке "70.0 * (n0 + n1 + n2);" влияет на диапазон шума(контраст)
	return (finalVal + 1.0) / 2.0;
	//return (finalVal + simplex_scale_factor * 0.014) / 2.0;
};

// 3. Симплексный шум openSimplex2 от Курта Спенсера, улучшенный аналог Симплексного шум Перлина, (возвращает от 0.0 до 1.0).
// Взят с оригинала отсюда https://github.com/KdotJPG/OpenSimplex2/blob/master/java/OpenSimplex2.java
// Взят с оригинала отсюда https://github.com/KdotJPG/OpenSimplex2/blob/master/java/OpenSimplex2S.java
const HASH_MULTIPLIER = 0x53A3F72DEEC546F5n;
const PRIME_X = 0x5205402B9270C86Fn;
const PRIME_Y = 0x598CD327003817B5n;
const RSQUARED_2D = 2 / 3;
const UNSKEW_2D = -0.21132486540518713;
const SKEW_2D = 0.366025403784439;
const ROOT2OVER2 = 0.7071067811865476;

const NORMALIZER_2D = 0.05481866495625118;
const GRADIENTS_2D = new Float32Array(256);
const grad2 = [
	0.38268343236509, 0.923879532511287,
	0.923879532511287, 0.38268343236509,
	0.923879532511287, -0.38268343236509,
	0.38268343236509, -0.923879532511287,
	-0.38268343236509, -0.923879532511287,
	-0.923879532511287, -0.38268343236509,
	-0.923879532511287, 0.38268343236509,
	-0.38268343236509, 0.923879532511287,
	//-------------------------------------//
	0.130526192220052, 0.99144486137381,
	0.608761429008721, 0.793353340291235,
	0.793353340291235, 0.608761429008721,
	0.99144486137381, 0.130526192220051,
	0.99144486137381, -0.130526192220051,
	0.793353340291235, -0.60876142900872,
	0.608761429008721, -0.793353340291235,
	0.130526192220052, -0.99144486137381,
	-0.130526192220052, -0.99144486137381,
	-0.608761429008721, -0.793353340291235,
	-0.793353340291235, -0.608761429008721,
	-0.99144486137381, -0.130526192220052,
	-0.99144486137381, 0.130526192220051,
	-0.793353340291235, 0.608761429008721,
	-0.608761429008721, 0.793353340291235,
	-0.130526192220052, 0.99144486137381,
];

for(let i = 0; i < grad2.length; i++)grad2[i] /= NORMALIZER_2D;
for(let i = 0; i < GRADIENTS_2D.length; i++)GRADIENTS_2D[i] = grad2[i % 48];

let grad_s = (xsvp, ysvp, dx, dy) => {
	let hash = BigInt(seed) ^ xsvp ^ ysvp;
	hash = BigInt.asIntN(64, hash * HASH_MULTIPLIER);;
	hash ^= hash >> 56n;
	let gi = Number(hash & 0xFEn);
	return GRADIENTS_2D[gi | 0] * dx + GRADIENTS_2D[gi | 1] * dy;
};

// 3.1. Симплексный шум openSimplex2F от Курта Спенсера, улучшенный аналог Симплексного шум Перлина, (возвращает от 0.0 до 1.0).
let noise2_UnskewedBaseF = (xs, ys) => {
	// Get base points and offsets.
	let floorX = Math.floor(xs);
	let floorY = Math.floor(ys);
	let xsb = BigInt(floorX);
	let ysb = BigInt(floorY);
	let xi = xs - floorX;
	let yi = ys - floorY;

	// Prime pre-multiplication for hash.
	let xsbp = xsb * PRIME_X;
	let ysbp = ysb * PRIME_Y;

	// Unskew.
	let t = (xi + yi) * UNSKEW_2D;
	let dx0 = xi + t;
	let dy0 = yi + t;

	// First vertex.
	let value = 0;
	let a0 = RSQUARED_2D - dx0 * dx0 - dy0 * dy0;
	if(a0 > 0)value = (a0 * a0) * (a0 * a0) * grad_s(xsbp, ysbp, dx0, dy0);

	// Second vertex.
	let a1 = (2 * (1 + 2 * UNSKEW_2D) * (1 / UNSKEW_2D + 2)) * t + ((-2 * (1 + 2 * UNSKEW_2D) * (1 + 2 * UNSKEW_2D)) + a0);
	if(a1 > 0){
		let dx1 = dx0 - (1 + 2 * UNSKEW_2D);
		let dy1 = dy0 - (1 + 2 * UNSKEW_2D);
		value += (a1 * a1) * (a1 * a1) * grad_s(xsbp + PRIME_X, ysbp + PRIME_Y, dx1, dy1);
	}

	// Third vertex.
	if(dy0 > dx0){
		let dx2 = dx0 - UNSKEW_2D;
		let dy2 = dy0 - (UNSKEW_2D + 1);
		let a2 = RSQUARED_2D - dx2 * dx2 - dy2 * dy2;
		if(a2 > 0)value += (a2 * a2) * (a2 * a2) * grad_s(xsbp, ysbp + PRIME_Y, dx2, dy2);
	}else{
		let dx2 = dx0 - (UNSKEW_2D + 1);
		let dy2 = dy0 - UNSKEW_2D;
		let a2 = RSQUARED_2D - dx2 * dx2 - dy2 * dy2;
		if(a2 > 0)value += (a2 * a2) * (a2 * a2) * grad_s(xsbp + PRIME_X, ysbp, dx2, dy2);
	}

	return (value + 1) / 2;
};

// 3.2. Симплексный шум openSimplex2S от Курта Спенсера, улучшенный аналог Симплексного шум Перлина, (возвращает от 0.0 до 1.0).
let noise2_UnskewedBaseS = (xs, ys) => {
	// Get base points and offsets.
	let floorX = Math.floor(xs);
	let floorY = Math.floor(ys);
	let xsb = BigInt(floorX);
	let ysb = BigInt(floorY);
	let xi = xs - floorX;
	let yi = ys - floorY;

	// Prime pre-multiplication for hash.
	let xsbp = xsb * PRIME_X;
	let ysbp = ysb * PRIME_Y;

	// Unskew.
	let t = (xi + yi) * UNSKEW_2D;
	let dx0 = xi + t;
	let dy0 = yi + t;

	// First vertex.
	let a0 = RSQUARED_2D - dx0 * dx0 - dy0 * dy0;
	let value = (a0 * a0) * (a0 * a0) * grad_s(xsbp, ysbp, dx0, dy0);

	// Second vertex.
	let a1 = (2 * (1 + 2 * UNSKEW_2D) * (1 / UNSKEW_2D + 2)) * t + ((-2 * (1 + 2 * UNSKEW_2D) * (1 + 2 * UNSKEW_2D)) + a0);
	let dx1 = dx0 - (1 + 2 * UNSKEW_2D);
	let dy1 = dy0 - (1 + 2 * UNSKEW_2D);
	value += (a1 * a1) * (a1 * a1) * grad_s(xsbp + PRIME_X, ysbp + PRIME_Y, dx1, dy1);

	// Third and fourth vertices.
	// Nested conditionals were faster than compact bit logic/arithmetic.
	let xmyi = xi - yi;
	if(t < UNSKEW_2D){
		if(xi + xmyi > 1){
			let dx2 = dx0 - (3 * UNSKEW_2D + 2);
			let dy2 = dy0 - (3 * UNSKEW_2D + 1);
			let a2 = RSQUARED_2D - dx2 * dx2 - dy2 * dy2;
			if(a2 > 0)value += (a2 * a2) * (a2 * a2) * grad_s(xsbp + (PRIME_X << 1n), ysbp + PRIME_Y, dx2, dy2);
		}else{
			let dx2 = dx0 - UNSKEW_2D;
			let dy2 = dy0 - (UNSKEW_2D + 1);
			let a2 = RSQUARED_2D - dx2 * dx2 - dy2 * dy2;
			if(a2 > 0)value += (a2 * a2) * (a2 * a2) * grad_s(xsbp, ysbp + PRIME_Y, dx2, dy2);
		}

		if(yi - xmyi > 1){
			let dx3 = dx0 - (3 * UNSKEW_2D + 1);
			let dy3 = dy0 - (3 * UNSKEW_2D + 2);
			let a3 = RSQUARED_2D - dx3 * dx3 - dy3 * dy3;
			if (a3 > 0)value += (a3 * a3) * (a3 * a3) * grad_s(xsbp + PRIME_X, ysbp + (PRIME_Y << 1n), dx3, dy3);
		}else{
			let dx3 = dx0 - (UNSKEW_2D + 1);
			let dy3 = dy0 - UNSKEW_2D;
			let a3 = RSQUARED_2D - dx3 * dx3 - dy3 * dy3;
			if(a3 > 0)value += (a3 * a3) * (a3 * a3) * grad_s(xsbp + PRIME_X, ysbp, dx3, dy3);
		}
	}else{
		if(xi + xmyi < 0){
			let dx2 = dx0 + (1 + UNSKEW_2D);
			let dy2 = dy0 + UNSKEW_2D;
			let a2 = RSQUARED_2D - dx2 * dx2 - dy2 * dy2;
			if(a2 > 0)value += (a2 * a2) * (a2 * a2) * grad_s(xsbp - PRIME_X, ysbp, dx2, dy2);
		}else{
			let dx2 = dx0 - (UNSKEW_2D + 1);
			let dy2 = dy0 - UNSKEW_2D;
			let a2 = RSQUARED_2D - dx2 * dx2 - dy2 * dy2;
			if(a2 > 0)value += (a2 * a2) * (a2 * a2) * grad_s(xsbp + PRIME_X, ysbp, dx2, dy2);
		}

		if(yi < xmyi){
			let dx2 = dx0 + UNSKEW_2D;
			let dy2 = dy0 + (UNSKEW_2D + 1);
			let a2 = RSQUARED_2D - dx2 * dx2 - dy2 * dy2;
			if(a2 > 0)value += (a2 * a2) * (a2 * a2) * grad_s(xsbp, ysbp - PRIME_Y, dx2, dy2);
		}else{
			let dx2 = dx0 - UNSKEW_2D;
			let dy2 = dy0 - (UNSKEW_2D + 1);
			let a2 = RSQUARED_2D - dx2 * dx2 - dy2 * dy2;
			if(a2 > 0)value += (a2 * a2) * (a2 * a2) * grad_s(xsbp, ysbp + PRIME_Y, dx2, dy2);
		}
	}
	return (value + 1) / 2;
};

// 2D OpenSimplex2S/SuperSimplex noise, standard lattice orientation.
let openSimplex2S_v1 = (x, y) => {
	// Get points for A2* lattice
	let s = SKEW_2D * (x + y);
	let xs = x + s;
	let ys = y + s;
	return noise2_UnskewedBaseS(xs, ys);
};

/**
 * 2D OpenSimplex2S/SuperSimplex noise, with Y pointing down the main diagonal.
 * Might be better for a 2D sandbox style game, where Y is vertical.
 * Probably slightly less optimal for heightmaps or continent maps,
 * unless your map is centered around an equator. It's a slight
 * difference, but the option is here to make it easy.
 */
let openSimplex2S_v2 = (x, y) => {
	// Skew transform and rotation baked into one.
	let xx = x * ROOT2OVER2;
	let yy = y * (ROOT2OVER2 * (1 + 2 * SKEW_2D));
	return noise2_UnskewedBaseS(yy + xx, yy - xx);
};
// Доблирование кода выше для noise2_UnskewedBaseF
let openSimplex2F_v1 = (x, y) => {
	let s = SKEW_2D * (x + y);
	let xs = x + s;
	let ys = y + s;
	return noise2_UnskewedBaseF(xs, ys);
};
let openSimplex2F_v2 = (x, y) => {
	let xx = x * ROOT2OVER2;
	let yy = y * (ROOT2OVER2 * (1 + 2 * SKEW_2D));
	return noise2_UnskewedBaseF(yy + xx, yy - xx);
};

// 4. Value Noise (Шум значений)
// Глобальные переменные для подготовленного сида (вынесены наружу)
let seedShiftX = 0;
let seedShiftY = 0;

// Вызывается ОДИН раз при старте генерации нового шума
let initSeedShiftXY = () => {
	// Тот самый uint32 сид: (Math.random() * 0x100000000) >>> 0
	// Перемешиваем биты один раз, чтобы соседние сиды давали разные шумы
	let h = seed >>> 0;
	h ^= h >>> 16;
	h = Math.imul(h, 0x85ebca6b);
	h ^= h >>> 13;
	h = Math.imul(h, 0xc2b2ae35);
	h ^= h >>> 16;
	let s = (h >>> 0) / 0x100000000;

	// Генерируем огромные хаотичные смещения для осей
	seedShiftX = Math.sin(s) * 100000.0;
	seedShiftY = Math.cos(s) * 100000.0;
};

// Быстрый хэш для узлов сетки (работает с уже смещенными координатами)
let hash2D = (x, y) => {
	let sine = Math.sin((x + seedShiftX) * 12.9898 + (y + seedShiftY) * 78.233) * 43758.5453123;
	return sine - Math.floor(sine);
};

//4. Функция генерации бесконечного шума значений, Value Noise
let getInfiniteValueNoise = (x, y) => {
	let x0 = Math.floor(x);
	let y0 = Math.floor(y);

	let tx = x - x0;
	let ty = y - y0;

	let sx = fade(tx);
	let sy = fade(ty);

	// Считаем значения в углах «на лету»
	let c00 = hash2D(x0, y0);
	let c10 = hash2D(x0 + 1, y0);
	let c01 = hash2D(x0, y0 + 1);
	let c11 = hash2D(x0 + 1, y0 + 1);

	return lerp(sy, lerp(sx, c00, c10), lerp(sx, c01, c11));
};

// 5. Алгоритм WorleyNoise, (шум Ворли или клеточный шум).

/* Оставлено как шаблон для генерации целых.
let grid_size_WN = grid_side_size_WN ** 2 + 1;// Размер одного квадрата сетки в пикселях
let grad_w_v1 = (x, y) => {
	// 1. Создаем простое числовое смешивание (аналог хеша)
	//let h = seed ^ (x * 374761393) ^ (y * 668265263);
	let h = seed ^ Math.imul(x, 374761393) ^ Math.imul(y, 668265263);

	// 2. Дополнительно перемешиваем биты для лучшего распределения
	h = (h ^ (h >>> 16)) * 0x85ebca6b;
	h = (h ^ (h >>> 13)) * 0xc2b2ae35;
	h = h ^ (h >>> 16);
	
	// 3. Возвращаем положительное число в диапазоне от 0 до n
	return (h >>> 0) % grid_size_WN;
};
/**/
let grid_side_size_WN = 1;
let max_dist = grid_side_size_WN * Math.SQRT2;
//*
let grad_w_x = (x, y) => {
	let h = seed ^ x * 374761393 ^ y * 668265263;
	h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
	h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
	h = h ^ (h >>> 16);
	return (h >>> 0) / 4294967295 * grid_side_size_WN;
};
let grad_w_y = (x, y) => {
	let h = seed ^ x * 668265263 ^ y * 374761393 ^ 0x1337af; 
	h = Math.imul(h ^ (h >>> 16), 0x7feb352d);
	h = Math.imul(h ^ (h >>> 13), 0x846ca68b);
	h = h ^ (h >>> 16);
	return (h >>> 0) / 4294967295 * grid_side_size_WN;
};
/**/
/*
let grad_w_x = (x, y) => {
	let h = seed ^ Math.imul(x, 374761393) ^ Math.imul(y, 668265263);
	h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
	h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
	h = h ^ (h >>> 16);
	return (h >>> 0) / 4294967295 * grid_side_size_WN;
};
let grad_w_y = (x, y) => {
	let h = seed ^ Math.imul(x, 668265263) ^ Math.imul(y, 374761393) ^ 0x1337af; 
	h = Math.imul(h ^ (h >>> 16), 0x7feb352d);
	h = Math.imul(h ^ (h >>> 13), 0x846ca68b);
	h = h ^ (h >>> 16);
	return (h >>> 0) / 4294967295 * grid_side_size_WN;
};
/**/
// Евклидово расстояние
let dist_f_v1 = (x, y) => Math.sqrt(x * x + y * y);
// Манхэттенское расстояние (Manhattan / City Block), эффект ромбов.
let dist_f_v2 = (x, y) => Math.abs(x) + Math.abs(y);
// Расстояние Чебышёва (Chebyshev), эффект квадраты.
let dist_f_v3 = (x, y) => Math.max(Math.abs(x), Math.abs(y));
// Расстояние Минковского (Minkowski), эффект звезды.
let dist_f_v4 = (x, y) => {
	// При p = 0.5 ячейки становятся «звездчатыми» с острыми лучами.
	// При p = 4 они превращаются в скругленные супер-квадраты.
	const p = .5;
	return Math.pow(Math.pow(Math.abs(x), p) + Math.pow(Math.abs(y), p), 1/p);
};

let arr_out_f = [
	f1 => f1 / max_dist,
	(f1, f2) => f2 / max_dist,
	(f1, f2, f3) => f3 / max_dist,
	(f1, f2) => 1.0 - (f2 - f1) / max_dist,
	(f1, f2, f3) => 1.0 - (f3 - f2) / max_dist,
	(f1, f2, f3) => 1.0 - (f3 - f1) / max_dist,
	(f1, f2) => Math.min(1.0, (f1 + f2) / (max_dist * 1.5)),
	(f1, f2, f3) => Math.min(1.0, (f1 + f2 + f3) / (max_dist * 2.0)),
	(f1, f2, f3) => {
		const val = (f3 - f2 - f1) / max_dist;
		return val < 0.0 ? 0.0 : val;
	},
	(f1, f2, f3) => {
		const val = (f3 * f2 - f1) / (max_dist * max_dist);
		return val > 1.0 ? 1.0 : (val < 0.0 ? 0.0 : val);
	},
	(f1, f2) => (f2 - f1) / max_dist,
	(f1, f2, f3) => (f3 - f2) / max_dist,
	(f1, f2, f3) => (f3 - f1) / max_dist,
	(f1, f2) => (f1 + f2) / max_dist,
	(f1, f2, f3) => (f1 + f2 + f3) / max_dist,
	(f1, f2, f3) => (f3 - f2 - f1) / max_dist,
	(f1, f2, f3) => (f3 * f2 - f1) / max_dist,
	(f1, f2) => {
		// 1. Получаем чистую разность (на стыках она равна 0.0)
		const val = (f2 - f1) / max_dist;
		// 2. Вырезаем только самые узкие границы около нуля.
		// Чем меньше второе число (0.05), тем тоньше будут белые линии.
		// smoothstep вернет 0.0 там, где трещины широкие, и 1.0 на самых стыках.
		const edge = 0.05;
		const t = val / edge;
		const f = t < 0.0 ? 0.0 : (t > 1.0 ? 1.0 : t);
		// 3. Возвращаем инвертированный и сглаженный результат
		return 1.0 - (f * f * (3.0 - 2.0 * f));
	}
];
// 5. Функция генерации бесконечного шума WorleyNoise.
let dist_f_WN = dist_f_v1;
let out_f_WM = arr_out_f[0];
let getWorleyNoise = (x, y) => {
	const cellX = Math.floor(x / grid_side_size_WN);
	const cellY = Math.floor(y / grid_side_size_WN);

	let minDist_3 = max_dist;
	let minDist_2 = max_dist;
	let minDist_1 = max_dist;
	for(let oY = -1; oY <= 1; oY++){
		for(let oX = -1; oX <= 1; oX++){
			const checkY = cellY + oY;
			const checkX = cellX + oX;
			// Считаем расстояние до точки
			const dx = grad_w_x(checkY, checkX) + checkX * grid_side_size_WN - x;
			const dy = grad_w_y(checkY, checkX) + checkY * grid_side_size_WN - y;
			const dist = dist_f_WN(dx, dy);
			// Ищем самую близкую точку
			if(dist < minDist_1){
				minDist_3 = minDist_2;
				minDist_2 = minDist_1;
				minDist_1 = dist;
			}else if(dist < minDist_2){
				minDist_3 = minDist_2;
				minDist_2 = dist;
			}else if(dist < minDist_3)minDist_3 = dist;
			
		}
	}
	return out_f_WM(minDist_1, minDist_2, minDist_3);
};
//* Оригинал
let getWorleyNoise_v1 = (x, y) => {
	const cellX = Math.floor(x / grid_side_size_WN);
	const cellY = Math.floor(y / grid_side_size_WN);
	let minDist = max_dist;
	for(let oY = -1; oY <= 1; oY++){
		for(let oX = -1; oX <= 1; oX++){
			const checkY = cellY + oY;
			const checkX = cellX + oX;
			// Считаем Евклидово расстояние до точки
			const dx = grad_w_x(checkY, checkX) + checkX * grid_side_size_WN - x;
			const dy = grad_w_y(checkY, checkX) + checkY * grid_side_size_WN - y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			// Ищем самую близкую точку
			if(dist < minDist)minDist = dist;
		}
	}
	return minDist / max_dist;
};
/**/

// Мрамор от ии
/*
let warpWorley2D = (x, y) => {
	// 1. Получаем первичное искажение координат
	// Используем твой же фрактал, но со сдвигом по осям
	const qx = fractal2D(getWorleyNoise, x, y, 3, 0.5, 2.0);
	const qy = fractal2D(getWorleyNoise, x + 5.2, y + 1.3, 3, 0.5, 2.0);
	
	// 2. Передаем искаженные координаты в финальный фрактал
	// Умножение на 2.0 — это сила искажения (экспериментируй с ней)
	return fractal2D(getWorleyNoise, x + qx * 2.0, y + qy * 2.0, 4, 0.5, 2.0);
};
/**/

// 7. CellularAutomata Клеточные автоматы.
let map_ca_U8A;
let w_ca;
let h_ca;
let length_ca_U8A;
let initCellularAutomata = (w, h) => {
	w_ca = w;
	h_ca = h;
	length_ca_U8A = w_ca * h_ca;
	map_ca_U8A = new Uint8Array(length_ca_U8A);
};

// Правило 4, 5
let rule_ca_4_5 = () => {
	let _w_ca = w_ca - 1;
	let _h_ca = h_ca - 1;
	let _w_ca_p = w_ca + 1;
	let board = 0.5;
	
	let cell_1, cell_2, cell_3,
		cell_4, cell_5, cell_6,
		cell_7, cell_8, cell_9;
	
	for(let i = 0; i < length_ca_U8A; i++){
		let x = i % w_ca;
		let y = i / w_ca | 0;
		cell_5 = map_ca_U8A[i] & 1;
		if(y === 0){
			cell_1 = board;
			cell_2 = board;
			cell_3 = board;
			cell_8 = map_ca_U8A[i + w_ca] & 1;
			if(x === 0){
				cell_4 = board;
				cell_7 = board;
				cell_6 = map_ca_U8A[i + 1] & 1;
				cell_9 = map_ca_U8A[i + _w_ca_p] & 1;
			}else if(x === _w_ca){
				cell_6 = board;
				cell_9 = board;
				cell_4 = (map_ca_U8A[i - 1] >> 1) & 1;
				cell_7 = map_ca_U8A[i + _w_ca] & 1;
			}else{
				cell_4 = (map_ca_U8A[i - 1] >> 1) & 1;
				cell_6 = map_ca_U8A[i + 1] & 1;
				cell_7 = map_ca_U8A[i + _w_ca] & 1;
				cell_9 = map_ca_U8A[i + _w_ca_p] & 1;
			}
		}else if(y === _h_ca){
			cell_7 = board;
			cell_8 = board;
			cell_9 = board;
			cell_2 = (map_ca_U8A[i - w_ca] >> 1) & 1;
			if(x === 0){
				cell_1 = board;
				cell_4 = board;
				cell_3 = (map_ca_U8A[i - _w_ca] >> 1) & 1;
				cell_6 = map_ca_U8A[i + 1] & 1;
			}else if(x === _w_ca){
				cell_3 = board;
				cell_6 = board;
				cell_1 = (map_ca_U8A[i - _w_ca_p] >> 1) & 1;
				cell_4 = (map_ca_U8A[i - 1] >> 1) & 1;
			}else{
				cell_1 = (map_ca_U8A[i - _w_ca_p] >> 1) & 1;
				cell_3 = (map_ca_U8A[i - _w_ca] >> 1) & 1;
				cell_4 = (map_ca_U8A[i - 1] >> 1) & 1;
				cell_6 = map_ca_U8A[i + 1] & 1;
			}
		}if(x === 0){
			cell_1 = board;
			cell_4 = board;
			cell_7 = board;
			cell_2 = (map_ca_U8A[i - w_ca] >> 1) & 1;
			cell_3 = (map_ca_U8A[i - _w_ca] >> 1) & 1;
			cell_6 = map_ca_U8A[i + 1] & 1;
			cell_8 = map_ca_U8A[i + w_ca] & 1;
			cell_9 = map_ca_U8A[i + _w_ca_p] & 1;
		}else if(x === _w_ca){
			cell_3 = board;
			cell_6 = board;
			cell_9 = board;
			cell_1 = (map_ca_U8A[i - _w_ca_p] >> 1) & 1;
			cell_2 = (map_ca_U8A[i - w_ca] >> 1) & 1;
			cell_4 = (map_ca_U8A[i - 1] >> 1) & 1;
			cell_7 = map_ca_U8A[i + _w_ca] & 1;
			cell_8 = map_ca_U8A[i + w_ca] & 1;
		}else{
			cell_1 = (map_ca_U8A[i - _w_ca_p] >> 1) & 1;
			cell_2 = (map_ca_U8A[i - w_ca] >> 1) & 1;
			cell_3 = (map_ca_U8A[i - _w_ca] >> 1) & 1;
			cell_4 = (map_ca_U8A[i - 1] >> 1) & 1;
			cell_6 = map_ca_U8A[i + 1] & 1;
			cell_7 = map_ca_U8A[i + _w_ca] & 1;
			cell_8 = map_ca_U8A[i + w_ca] & 1;
			cell_9 = map_ca_U8A[i + _w_ca_p] & 1;
		}

		map_ca_U8A[i] <<= 1;
		// правила.
		//*
		let sum = cell_1 + cell_2 + cell_3 +
				  cell_4 + 			cell_6 +
				  cell_7 + cell_8 + cell_9;
		/**/
		/*
		let sum = cell_1 * 1 + cell_2 * 1 + cell_3 * 1 +
				  cell_4 * 1 + 				cell_6 * 1 +
				  cell_7 * 1 + cell_8 * 1 + cell_9 * 1;
		/**/
		if(cell_5){
			if(sum >= 4)map_ca_U8A[i] |= 1;
			else map_ca_U8A[i] &= 0xFE;
		}else{
			if(sum >= 5)map_ca_U8A[i] |= 1;
			else map_ca_U8A[i] &= 0xFE;
		}
	}
};

let getCellularAutomata = (view_buf) => {
	// Заполняем первый начальный массив.
	for(let i = 0; i < length_ca_U8A; i++)
		map_ca_U8A[i] = (view_buf[i] & 0xFF) > 127 ? 1: 0;

	// Применяем автома.
	
	rule_ca_4_5();

	// TEST 1
	for(let i = 0; i < length_ca_U8A; i++)view_buf[i] = map_ca_U8A[i] & 1 ? 0xFFFFFFFF: 0xFF000000;
	// TEST 2
	//for(let i = 0; i < length_ca_U8A; i++)view_buf[i] = map_ca_U8A[i] & 2 ? 0xFFFFFFFF: 0xFF000000;
};



/* Вариант 1 не оптимизирован.
let map_ca_U32A;
let w_ca;
let h_ca;
let offset_ca = 0;
let offset_next_ca;
let initCellularAutomata = (w, h) => {
	w_ca = w;
	h_ca = h;
	offset_next_ca = w_ca * h_ca;
	map_ca_U32A = new Uint32Array(Math.ceil(offset_next_ca * 2 / 32));
};

let getCellularAutomata = (view_buf) => {
	let length_b = view_buf.length;
	// Заполняем первый начальный массив.
	for(let i = 0; i < length_b; i++)
		if((view_buf[i] & 0xFF) > 127)map_ca_U32A[i >> 5] |= 1 << (i & 31);
		else map_ca_U32A[i >> 5] &= ~(1 << (i & 31));
	// Применяем автома.
	
	let _w_ca = w_ca - 1;
	let _h_ca = h_ca - 1;
	let _wh_ca = w_ca * h_ca;
	for(let i = 0; i < length_b; i++){
		let x = i % w_ca;
		let y = i / w_ca | 0;
		let j = i + _wh_ca;

		if(x === 0 || x === _w_ca || y === 0 || y === _h_ca){
			map_ca_U32A[j >> 5] |= 1 << (j & 31);
			continue;
		}

		let k = i - 1 - w_ca;
		let sum = (map_ca_U32A[k >> 5] >> (k & 31) & 1);
		k++;
		sum += (map_ca_U32A[k >> 5] >> (k & 31) & 1);
		k++;
		sum += (map_ca_U32A[k >> 5] >> (k & 31) & 1);

		k += w_ca;
		sum += (map_ca_U32A[k >> 5] >> (k & 31) & 1);
		k -= 2;
		sum += (map_ca_U32A[k >> 5] >> (k & 31) & 1);

		k += w_ca;
		sum += (map_ca_U32A[k >> 5] >> (k & 31) & 1);
		k++;
		sum += (map_ca_U32A[k >> 5] >> (k & 31) & 1);
		k++;
		sum += (map_ca_U32A[k >> 5] >> (k & 31) & 1);

		// правила.
		if(map_ca_U32A[i >> 5] >> (i & 31) & 1){
			if(sum >= 4)map_ca_U32A[j >> 5] |= 1 << (j & 31);
			else map_ca_U32A[j >> 5] &= ~(1 << (j & 31));
		}else{
			if(sum >= 5)map_ca_U32A[j >> 5] |= 1 << (j & 31);
			else map_ca_U32A[j >> 5] &= ~(1 << (j & 31));
		}

	}

	// TEST
	//for(let i = 0; i < length_b; i++)view_buf[i] = map_ca_U32A[i >> 5] >> (i & 31) & 1 ? 0xFFFFFFFF: 0xFF000000;
	
	// TEST 2
	for(let i = 0, j = _wh_ca; i < length_b; i++, j++)view_buf[i] = map_ca_U32A[j >> 5] >> (j & 31) & 1 ? 0xFFFFFFFF: 0xFF000000;
};
/**/

// Flood Fill
let flood_fill = (map, w, h, i_xy, target_type, replacement_type) => {
	if(map[i_xy] !== target_type)return 0;
	let filled_count = 0;
	map[i_xy] = replacement_type;
	let q = [i_xy];
	filled_count++;
	const dxy = [-w, w, -1, 1];
	let w_1 = w - 1;

	while(q.length){
		let current = q.pop();
		for(let i = 0; i < 4; i++){
			let nxy = current + dxy[i];
			let nx = nxy % w;
			if((nx === 0 && i === 3) || (nx === w_1 && i === 2))continue;

			let ny = Math.floor(nxy / w);

			// Валидация границ матрицы
			if(nx >= 0 && nx < w && ny >= 0 && ny < h)
				if(map[nxy] === target_type){
					map[nxy] = replacement_type;
					q.push(nxy);
					filled_count++;
				}

		}
	}

	return filled_count;
};

//

// 8. Коллапс волновой функции // Вариант 1 ОЧЕНЬ МЕДЛЕННЫЙ, ниже вариант 2 гораздо более быстрый. 
let tiles_wfc = [// 12
	// X
	{type: "X", weight:1, tile: [1,1,1, 1,1,1, 1,1,1]},
	{type: "X", weight:1, tile: [1,0,1, 0,0,0, 1,0,1]},
	// I
	{type: "I", weight:1, tile: [1,0,1, 1,0,1, 1,0,1]},
	{type: "I", weight:1, tile: [1,1,1, 0,0,0, 1,1,1]},
	// T
	{type: "T", weight:1, tile: [1,1,1, 0,0,0, 1,0,1]},
	{type: "T", weight:1, tile: [1,0,1, 0,0,1, 1,0,1]},
	{type: "T", weight:1, tile: [1,0,1, 0,0,0, 1,1,1]},
	{type: "T", weight:1, tile: [1,0,1, 1,0,0, 1,0,1]},
	// L
	{type: "L", weight:1, tile: [1,0,1, 1,0,0, 1,1,1]},
	{type: "L", weight:1, tile: [1,1,1, 1,0,0, 1,0,1]},
	{type: "L", weight:1, tile: [1,1,1, 0,0,1, 1,0,1]},
	{type: "L", weight:1, tile: [1,0,1, 0,0,1, 1,1,1]},
	// DOP
	{type: "X", weight:10, tile: [0,0,0, 0,0,0, 0,0,0]}
];
const count_tiles = tiles_wfc.length;
// not_top, not_right, not_bottom, not_left
for(let i = 0; i < count_tiles; i++){
	tiles_wfc[i].not_top = [];
	tiles_wfc[i].not_right = [];
	tiles_wfc[i].not_bottom = [];
	tiles_wfc[i].not_left = [];
	for(let j = 0; j < count_tiles; j++){
		if(tiles_wfc[i].tile[1] !== tiles_wfc[j].tile[7])tiles_wfc[i].not_top.push(j);
		if(tiles_wfc[i].tile[5] !== tiles_wfc[j].tile[3])tiles_wfc[i].not_right.push(j);
		if(tiles_wfc[i].tile[7] !== tiles_wfc[j].tile[1])tiles_wfc[i].not_bottom.push(j);
		if(tiles_wfc[i].tile[3] !== tiles_wfc[j].tile[5])tiles_wfc[i].not_left.push(j);
	}
}

let f_collapse = (arr, r) => {
	let sum = 0;
	for(let i = 0; i < count_tiles; i++)
		if(arr[i])sum += tiles_wfc[i].weight;
	r *= sum;
	for(let i = 0; i < count_tiles; i++)
		if(arr[i] && (r -= tiles_wfc[i].weight) <= 0)
			return i;
	return -1;
};

let wfc = (buf, b_w, b_h) => {
	const w = Math.ceil(b_w / 3);
	const h = Math.ceil(b_h / 3);

	// Создаем изначальный массив волны.
	let wave = [];
	let not_collapse = [];

	for(let x = 0; x < w; x++){
		wave[x] = [];
		not_collapse[x] = [];
		for(let y = 0; y < h; y++){
			wave[x][y] = [];
			not_collapse[x][y] = -10;
			for(let i = 0; i < count_tiles; i++){
				wave[x][y][i] = true;
			}
		}
	}
	// Выбираем случайное поле и калапсируем.
	let x_random = random() * w | 0;
	let y_random = random() * h | 0;

	let candidates = [[x_random, y_random, -10]];// кандидаты.
	while(candidates.length){
		// выбираем кандидата

		let max = -10;
		for(let i = 0; i < candidates.length; i++)
			if(max < candidates[i][2])max = candidates[i][2];

		let candidates_ids = [];
		for(let i = 0; i < candidates.length; i++)
			if(max === candidates[i][2])candidates_ids.push(i);


		let candidates_id = candidates_ids[random() * candidates_ids.length | 0];

		let cell_x = candidates[candidates_id][0];
		let cell_y = candidates[candidates_id][1];

		candidates.splice(candidates_id, 1);


		let id = f_collapse(wave[cell_x][cell_y], random());
		for(let i = 0; i < count_tiles; i++){
			if(id !== i)wave[cell_x][cell_y][i] = false;
		}

		not_collapse[cell_x][cell_y] = id;


		// not_top, not_right, not_bottom, not_left
		// not_top
		let temp_x = cell_x;
		let temp_y = cell_y - 1;
		if(temp_y >= 0 && not_collapse[temp_x][temp_y] < 0){
			for(let n = 0; n < tiles_wfc[id].not_top.length; n++){
				if(wave[temp_x][temp_y][tiles_wfc[id].not_top[n]]){
					wave[temp_x][temp_y][tiles_wfc[id].not_top[n]] = false;
					not_collapse[temp_x][temp_y]++;
				}
			}
			// добавляем кандидата если его нет, иначе обновляем его макс к калапсированию.
			let i = 0;
			for(; i < candidates.length; i++)
				if(candidates[i][0] === temp_x && candidates[i][0] === temp_y)break;
			candidates[i] = [temp_x, temp_y, not_collapse[temp_x][temp_y]];
		}
		// not_right
		temp_x = cell_x + 1;
		temp_y = cell_y;
		if(temp_x < w && not_collapse[temp_x][temp_y] < 0){
			for(let n = 0; n < tiles_wfc[id].not_right.length; n++){
				if(wave[temp_x][temp_y][tiles_wfc[id].not_right[n]]){
					wave[temp_x][temp_y][tiles_wfc[id].not_right[n]] = false;
					not_collapse[temp_x][temp_y]++;
				}
			}
			let i = 0;
			for(; i < candidates.length; i++)
				if(candidates[i][0] === temp_x && candidates[i][0] === temp_y)break;
			candidates[i] = [temp_x, temp_y, not_collapse[temp_x][temp_y]];
		}
		// not_bottom
		temp_x = cell_x;
		temp_y = cell_y + 1;
		if(temp_y < h && not_collapse[temp_x][temp_y] < 0){
			for(let n = 0; n < tiles_wfc[id].not_bottom.length; n++){
				if(wave[temp_x][temp_y][tiles_wfc[id].not_bottom[n]]){
					wave[temp_x][temp_y][tiles_wfc[id].not_bottom[n]] = false;
					not_collapse[temp_x][temp_y]++;
				}
			}
			let i = 0;
			for(; i < candidates.length; i++)
				if(candidates[i][0] === temp_x && candidates[i][0] === temp_y)break;
			candidates[i] = [temp_x, temp_y, not_collapse[temp_x][temp_y]];
		}
		// not_left
		temp_x = cell_x - 1;
		temp_y = cell_y;
		if(temp_x >= 0 && not_collapse[temp_x][temp_y] < 0){
			for(let n = 0; n < tiles_wfc[id].not_left.length; n++){
				if(wave[temp_x][temp_y][tiles_wfc[id].not_left[n]]){
					wave[temp_x][temp_y][tiles_wfc[id].not_left[n]] = false;
					not_collapse[temp_x][temp_y]++;
				}
			}
			let i = 0;
			for(; i < candidates.length; i++)
				if(candidates[i][0] === temp_x && candidates[i][0] === temp_y)break;
			candidates[i] = [temp_x, temp_y, not_collapse[temp_x][temp_y]];
		}

	}




	// Отрисовываем.
	//let l = b_w * b_h;
	for(let b_x = 0; b_x < b_w; b_x++){
		for(let b_y = 0; b_y < b_h; b_y++){
			let x = b_x / 3 | 0;
			let y = b_y / 3 | 0;
			//let cell_id = 0;
			let id = 0;
			for(; id < count_tiles; id++)
				if(wave[x][y][id])break;
			let i = (b_x % 3) + (b_y % 3) * 3;
			let p = tiles_wfc[id].tile[i];
			buf[b_y * b_w + b_x] = p ? 0xFFFFFFFF: 0xFF000000;
			//if(x_random === x || y_random === y)buf[b_y * b_w + b_x] = p ? 0xFF0000FF: 0xFF00FF00;
		}
	}
	//info(x_random + " " +y_random);
};

// Вариант 2 wfc более быстрый. На много более быстрый чем вариант 1 выше. Можно и ещё ускорить(оптимизировать).
// из за того что порядок элементов в candidates[i] меняется не соответствует варианту 1, но порядок неважен так как рандом выбор.
const TILES_WFC = [// 12
	// X
	{type: "X", weight:1, tile: [1,1,1, 1,1,1, 1,1,1]},
	{type: "X", weight:1, tile: [1,0,1, 0,0,0, 1,0,1]},
	// I
	{type: "I", weight:1, tile: [1,0,1, 1,0,1, 1,0,1]},
	{type: "I", weight:1, tile: [1,1,1, 0,0,0, 1,1,1]},
	// T
	{type: "T", weight:1, tile: [1,1,1, 0,0,0, 1,0,1]},
	{type: "T", weight:1, tile: [1,0,1, 0,0,1, 1,0,1]},
	{type: "T", weight:1, tile: [1,0,1, 0,0,0, 1,1,1]},
	{type: "T", weight:1, tile: [1,0,1, 1,0,0, 1,0,1]},
	// L
	{type: "L", weight:1, tile: [1,0,1, 1,0,0, 1,1,1]},
	{type: "L", weight:1, tile: [1,1,1, 1,0,0, 1,0,1]},
	{type: "L", weight:1, tile: [1,1,1, 0,0,1, 1,0,1]},
	{type: "L", weight:1, tile: [1,0,1, 0,0,1, 1,1,1]},
	// DOP
	{type: "X", weight:10, tile: [0,0,0, 0,0,0, 0,0,0]}
];
const COUNT_TILES = TILES_WFC.length;

for(let i = 0; i < COUNT_TILES; i++){
	TILES_WFC[i].top = 0;
	TILES_WFC[i].right = 0;
	TILES_WFC[i].bottom = 0;
	TILES_WFC[i].left = 0;
	for(let j = 0; j < COUNT_TILES; j++){
		if(TILES_WFC[i].tile[1] === TILES_WFC[j].tile[7])TILES_WFC[i].top |= 1 << j;
		if(TILES_WFC[i].tile[5] === TILES_WFC[j].tile[3])TILES_WFC[i].right |= 1 << j;
		if(TILES_WFC[i].tile[7] === TILES_WFC[j].tile[1])TILES_WFC[i].bottom |= 1 << j;
		if(TILES_WFC[i].tile[3] === TILES_WFC[j].tile[5])TILES_WFC[i].left |= 1 << j;
	}
}


let f_collapse_v2 = (wave, id_candidate, r) => {
	let wave_n = wave[id_candidate];
	let sum = 0;
	let i = 0;
	for(; i < COUNT_TILES; i++)
		if((wave_n >> i) & 1)sum += TILES_WFC[i].weight;
	r *= sum;
	i = 0;
	for(; i < COUNT_TILES; i++)
		if((wave_n >> i) & 1 && (r -= TILES_WFC[i].weight) <= 0)
			break;
	wave[id_candidate] = i << COUNT_TILES;
};


let countSetBitsFast = n => {
	n = n - ((n >> 1) & 0x55555555);
	n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
	return (((n + (n >> 4)) & 0x0F0F0F0F) * 0x01010101) >> 24;
};

let wfc_v2 = (buf, b_w, b_h) => {
	const w = Math.ceil(b_w / 3);
	const h = Math.ceil(b_h / 3);
	const l = w * h;
	const w_1 = w - 1;
	const l_1 = l - w;

	const max_wave = (1 << COUNT_TILES) - 1;
	let wave = new Array(l).fill(max_wave);
	

	/* ЛОГИКА
	// 1. Случайно выбираем поле. // Начального кандидата. //let candidates = [random() * l | 0];// кандидаты.
	// 2. Случайно выбираем первую плитку. // Коллапсируем. и удаляем кандидата.
	// 3. Проверяем соседей. Записывая их в кандидаты. Если они не калапсировали.

	/**/
	// 1. Случайно выбираем поле.
	let x_random = random() * w | 0;
	let y_random = random() * h | 0;

	let candidates = new Array(COUNT_TILES);
	for(let i = 0; i < COUNT_TILES; i++)candidates[i] = [];
	candidates[COUNT_TILES - 1] = [y_random * w + x_random];
	//let candidates = [y_random * w + x_random];// кандидаты.
	let candidates_length = 1;
	let temp_length = 1;
	let id_candidate = 0;
	let temp_id = 0;

	while(candidates_length){
		// Выбираем случайного кандидата из меньших кандидатов по числу вариантов каллапса.
		for(let i = 1; i < COUNT_TILES; i++){
			if(temp_length = candidates[i].length){
				let index = random() * temp_length | 0;
				id_candidate = candidates[i][index];
				candidates[i][index] = candidates[i][--temp_length];
				candidates[i].length = temp_length;
				break;
			}
		}

		// каллапсируем.
		f_collapse_v2(wave, id_candidate, random());
		candidates_length--;
		
		// проверяем соседей.
		// top, right, bottom, left
		//top
		if(id_candidate >= w){// проверяем не вышли ли за границы.
			temp_id = id_candidate - w;
			if((wave[temp_id] & max_wave) !== 0){// проверяем не калапсировал ли ещё сосед.
				if(wave[temp_id] === max_wave){// проверяем что сосед ещё не добавлен в кандидаты.
					// Считаем биты, чем меньше тем ближе к коллапсу.
					// добавляем в кандидаты.
					candidates[countSetBitsFast(wave[temp_id] = TILES_WFC[wave[id_candidate] >> COUNT_TILES].top)].push(temp_id);
					candidates_length++;
				}else{// сосед уже есть в кандидатах.
					// достаем из кандидатов.
					let b = countSetBitsFast(wave[temp_id]);
					for(let i = 0; ; i++){
						if(candidates[b][i] === temp_id){
							let lastIndex = candidates[b].length - 1;
							candidates[b][i] = candidates[b][lastIndex];
							candidates[b].length = lastIndex;
							break;
						}
					}
					// добавляем в кандидаты.
					candidates[countSetBitsFast(wave[temp_id] &= TILES_WFC[wave[id_candidate] >> COUNT_TILES].top)].push(temp_id);
				}
			}
		}

		// right
		if(id_candidate % w < w_1){
			temp_id = id_candidate + 1;
			if((wave[temp_id] & max_wave) !== 0){
				if(wave[temp_id] === max_wave){
					candidates[countSetBitsFast(wave[temp_id] = TILES_WFC[wave[id_candidate] >> COUNT_TILES].right)].push(temp_id);
					candidates_length++;
				}else{
					let b = countSetBitsFast(wave[temp_id]);
					for(let i = 0; ; i++){
						if(candidates[b][i] === temp_id){
							let lastIndex = candidates[b].length - 1;
							candidates[b][i] = candidates[b][lastIndex];
							candidates[b].length = lastIndex;
							break;
						}
					}
					candidates[countSetBitsFast(wave[temp_id] &= TILES_WFC[wave[id_candidate] >> COUNT_TILES].right)].push(temp_id);
				}
			}
		}

		// bottom
		if(id_candidate < l_1){
			temp_id = id_candidate + w;
			if((wave[temp_id] & max_wave) !== 0){
				if(wave[temp_id] === max_wave){
					candidates[countSetBitsFast(wave[temp_id] = TILES_WFC[wave[id_candidate] >> COUNT_TILES].bottom)].push(temp_id);
					candidates_length++;
				}else{
					let b = countSetBitsFast(wave[temp_id]);
					for(let i = 0; ; i++){
						if(candidates[b][i] === temp_id){
							let lastIndex = candidates[b].length - 1;
							candidates[b][i] = candidates[b][lastIndex];
							candidates[b].length = lastIndex;
							break;
						}
					}
					candidates[countSetBitsFast(wave[temp_id] &= TILES_WFC[wave[id_candidate] >> COUNT_TILES].bottom)].push(temp_id);
				}
			}
		}
		
		// left
		if(id_candidate % w !== 0){
			temp_id = id_candidate - 1;
			if((wave[temp_id] & max_wave) !== 0){
				if(wave[temp_id] === max_wave){
					candidates[countSetBitsFast(wave[temp_id] = TILES_WFC[wave[id_candidate] >> COUNT_TILES].left)].push(temp_id);
					candidates_length++;
				}else{
					let b = countSetBitsFast(wave[temp_id]);
					for(let i = 0; ; i++){
						if(candidates[b][i] === temp_id){
							let lastIndex = candidates[b].length - 1;
							candidates[b][i] = candidates[b][lastIndex];
							candidates[b].length = lastIndex;
							break;
						}
					}
					candidates[countSetBitsFast(wave[temp_id] &= TILES_WFC[wave[id_candidate] >> COUNT_TILES].left)].push(temp_id);
				}
			}
		}
		
	}

	// Отрисовываем.
	//let l = b_w * b_h;
	for(let b_x = 0; b_x < b_w; b_x++){
		for(let b_y = 0; b_y < b_h; b_y++){
			let x = b_x / 3 | 0;
			let y = b_y / 3 | 0;
			let id = wave[y * w + x] >> COUNT_TILES;
			let i = (b_x % 3) + (b_y % 3) * 3;
			let p = TILES_WFC[id].tile[i];
			buf[b_y * b_w + b_x] = p ? 0xFFFFFFFF: 0xFF000000;
			//if(x_random === x || y_random === y)buf[b_y * b_w + b_x] = p ? 0xFF0000FF: 0xFF00FF00;
		}
	}
};


// случайный выбор на основе весов.

const WEIGHTS = [1, 1, 100];// Веса.
const WEIGHTS_LENGTH = WEIGHTS.length;// Количество весов.


// INIT
let prob_weights = new Array(WEIGHTS_LENGTH).fill(0);
let alias_weights = new Array(WEIGHTS_LENGTH).fill(0);
(() => {
	let sum_weights = WEIGHTS.reduce((a, b) => a + b);// Сумма весов.
	let scaled_prob = WEIGHTS.map(w => (w * WEIGHTS_LENGTH) / sum_weights);

	let small_ids = []; // Индексы элементов с весом меньше среднего
	let large_ids = []; // Индексы элементов с весом больше или равным среднему

	// Шаг 2: Масштабируем веса так, чтобы средний вес был равен 1.0.
	// Элементы распределяются по корзинам small и large.
	for(let i = 0; i < WEIGHTS_LENGTH; i++)
		if(scaled_prob[i] < 1.0)
			small_ids.push(i);
		else
			large_ids.push(i);
	

	// Шаг 3: Балансировка. Заполняем каждую из N ячеек.
	// Берем недогруженную ячейку (small) и досыпаем в нее вес из перегруженной (large).
	while(small_ids.length && large_ids.length){
		let s_id = small_ids.pop(); // Индекс маленького элемента
		let l_id = large_ids.pop(); // Индекс большого элемента, который поделится весом

		prob_weights[s_id] = scaled_prob[s_id]; // Задаем вероятность выбрать основной элемент в этой ячейке
		alias_weights[s_id] = l_id;// Если выпала вторая часть ячейки — отдаем ее большому элементу

		// Уменьшаем вес большого элемента на ту часть, которую он только что отдал
		scaled_prob[l_id] = (scaled_prob[l_id] + scaled_prob[s_id]) - 1.0;

		// Возвращаем остаток большого элемента в нужный список после уменьшения веса
		if(scaled_prob[l_id] < 1.0)
			small_ids.push(l_id);
		else
			large_ids.push(l_id);
	}

	// Шаг 4: Оставшиеся элементы занимают свои ячейки целиком (вероятность 1.0)
	while(large_ids.length)prob_weights[large_ids.pop()] = 1.0;
	while(small_ids.length)prob_weights[small_ids.pop()] = 1.0;

})();

//alert(prob_weights + "\n\n" + alias_weights + "\n\n");