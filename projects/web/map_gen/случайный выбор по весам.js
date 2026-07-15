
const WEIGHTS = [1, 1, 100];// Веса.
const WEIGHTS_LENGTH = WEIGHTS.length;// Количество весов.


// INIT prob_weights, alias_weights

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
		scaled_prob[l_id] = scaled_prob[l_id] + scaled_prob[s_id] - 1.0;

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

let random_index = () => {
	// 1. Случайно выбираем одну из N ячеек (индекс от 0 до n-1)
	let i = Math.random() * WEIGHTS_LENGTH | 0;
	
	// 2. Бросаем монету внутри выбранной ячейки.
	// Если случайное число меньше порогового значения prob[i] — возвращаем исходный индекс ячейки.
	// В противном случае возвращаем сохраненный альтернативный элемент (alias).
	return Math.random() < prob_weights[i] ? i : alias_weights[i];
};

