/**
Разные генераторы рандома с разной плотностью распределения.
/**/
// 1. Самый простой рандом на основе Math.random. Генерирует число от 0 до N включительно.
function getRandomInt(n){
	return Math.random() * (n + 1) >>> 0;
}

// 2. Быстрый генератор случайных чисел от 0 до N максимальное 0xFFFFFFFF (4294967295) с сохранением последовательности в зависимости от seed.
// Инициализируем стартовое число (seed)
let seed = (Math.random() * 0x100000000) >>> 0;//0x77777777;

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

// Функции распределения плотности. Может быть любая. Ниже примеры.
// Нормальное распределение.
function f_normal_v1(x){// с -3 до 3 пик в 0
	return (1 / ((Math.PI * 2) ** .5)) * (Math.E ** (x * x * -.5));
}
function f_Normal_v2(x){// Нормальное распределение с параметрами.
	let q_2 = 1 ** .5;// Дисперсия, Среднеквадратическое отклонение в квадрате.
	let m = 0;// Сигма, мат. ожидания.
	return (1 / ((Math.PI * 2 * q_2) ** .5)) * (Math.E ** ((((x - m) / q_2) ** 2) * -.5));
}

// Рост под 45 градусов с нуля.
function f_x_y(x){
	return x;
}
// Затухающая синусоида, ИНТЕРВАЛ: от x = 0 до x = 5 (можно расширить, но после 5 значение стремится к 0).
function f_damped_sine(x){
	// Math.exp(-x) — экспоненциальное затухание (прижимает график к нулю)
	// Math.sin(3 * x) — сама волна (множитель 3 задает частоту колебаний)
	return Math.exp(-x) * Math.sin(3 * x) + .25;
}

// Импульс / Отклик, ИНТЕРВАЛ: от x = 0 до x = 3 (пик достигается при x ≈ 0.7, после 3 график прижимается к 0)
function f_impulse_response(x) {
	// x — обеспечивает плавный рост из нуля в начале
	// Math.exp(-Math.pow(x, 2)) — гасит график при росте x
	return x * Math.exp(-Math.pow(x, 2));
}

// Ломаная, ИНТЕРВАЛ: от 0 до 6
function f_piecewise(x) {
	return (x < 2 ? x : (x < 4 ? 4 - x : (x <= 6 ? 0.5 * (x - 4) : 0))) / 2;
}

//// Функция связывания, равномерного распределения с функцией(любой) которая представляет плотность.
// Перед использованием необходима инициализация через random_density_f_x.init(densityFunction, min_f, max_f, max_x);
function random_density_f_x(){
	// 1. Получаем случайное число 4ккк+
	let rand32 = fastRandomInt(0xFFFFFFFF);

	// 3. Переводим rand32 в целевую площадь, которую нужно найти под кривой
	let targetArea = (rand32 / 0xFFFFFFFF) * random_density_f_x.totalArea;

	// 4. Поиск «в лоб» точки x, на которой мы набрали нужную площадь
	// БИНАРНЫЙ ПОИСК ДЛЯ ФУНКЦИИ
	let low = 0;
	let high = random_density_f_x.max_x - 1;
	let x = random_density_f_x.max_x; // Значение по умолчанию, если вдруг вышли за границы

	while(low <= high){
		// Находим середину текущего диапазона.
		// Оператор ">> 1" делит на 2 и автоматически округляет вниз до целого.
		let mid = (low + high) >> 1;

		if(random_density_f_x.cdfBuffer[mid] >= targetArea){
			x = mid;// Запоминаем этот шаг как подходящий кандидат
			high = mid - 1;// Продолжаем искать левее, чтобы найти самый первый подходящий шаг
		}else{
			low = mid + 1; // Искомая площадь больше, сдвигаем левую границу вправо
		}
	}
	// Возвращаем точную координату x, где площадь совпала со случайным числом
	return x;
}
random_density_f_x.max_buffer = 4096;// Можно настраивать здесь.
random_density_f_x.cdfBuffer = new Float64Array(random_density_f_x.max_buffer);
random_density_f_x.totalArea = 0;
random_density_f_x.max_x = random_density_f_x.max_buffer;
random_density_f_x.init = (densityFunction, min_f, max_f, max_x) => {
	// Функция принимает параметрв
	// densityFunction - Функция f(x), для распределения плотности.
	// min_f, max_f - Отрезак на котором интегрировать функцию f(x).
	// max_x - шагов интеграции отразка. Ониже количество рандомных значений которое будет выдавать функция, от 0 до max_x - 1.
	random_density_f_x.max_x = max_x;
	if(max_x > random_density_f_x.max_buffer){
		alert("Слишком маленький буфер в функции random_density_f_x, можно перенастроить в коде. Буфер щас обновится до " + max_x + ".");
		random_density_f_x.max_buffer = max_x;
		random_density_f_x.cdfBuffer = new Float64Array(random_density_f_x.max_buffer);
	}
	
	// 2. Шаг «в лоб»: Строим кумулятивную функцию распределения (интеграл площади)
	random_density_f_x.totalArea = 0;

	let step = (max_f - min_f) / random_density_f_x.max_x;
	for(let i = 0; i < random_density_f_x.max_x; i++){
		random_density_f_x.totalArea += densityFunction(min_f + i * step);
		random_density_f_x.cdfBuffer[i] = random_density_f_x.totalArea;
	}
};

/*
// оставлено для примера логики функции выше.
const cdfBuffer = new Float64Array(4096);

function random_density_f_x(x){
	let densityFunction = f_normal_v1;
	let max_x = 256; // Ваша текущая константа (потом станет переменной)

	// 1. Получаем случайное число 4ккк+
	let rand32 = fastRandomInt(0xFFFFFFFF);

	// 2. Шаг «в лоб»: Строим кумулятивную функцию распределения (интеграл площади)
	let totalArea = 0;
	for (let i = 0; i <= max_x; i++) {
		let y = densityFunction(i);
		
		// Возвращаем функцию к чистой плотности (убираем инверсию 256 - ...)
		let pureY = max_x - y; 
		
		totalArea += pureY;
		cdfBuffer[i] = totalArea;
	}

	// 3. Переводим rand32 в целевую площадь, которую нужно найти под кривой
	let targetArea = (rand32 / 0xFFFFFFFF) * totalArea;

	// 4. Поиск «в лоб» точки x, на которой мы набрали нужную площадь
	let x = 0;
	for (; x <= max_x; x++) {
		if (cdfBuffer[x] >= targetArea) {
			break;
		}
	}

	// Возвращаем точную координату x, где площадь совпала со случайным числом
	return x >>> 0;
}

// для справки рабочий вариант.
function random_density_f_x_v1(){
	// 1. Получаем случайное число 4ккк+
	let rand32 = fastRandomInt(0xFFFFFFFF);

	// 3. Переводим rand32 в целевую площадь, которую нужно найти под кривой
	let targetArea = (rand32 / 0xFFFFFFFF) * random_density_f_x.totalArea;

	// 4. Поиск «в лоб» точки x, на которой мы набрали нужную площадь
	let x = 0;
	for(; x <= random_density_f_x.max_x; x++){
		if(random_density_f_x.cdfBuffer[x] >= targetArea)break;
	}
	// Возвращаем точную координату x, где площадь совпала со случайным числом
	return x;
}
//*/
