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
let create_text = (...attr) => createElementNS("text", ['font-family', "monospace"], ['fill', "#000"], ...attr);

// Кручение в SVG
let m_down = (e, f, f2) => {
	e.preventDefault();
	let onMouseUp = e => {
		if(f2 !== undefined)f2(e);
		document.removeEventListener('mouseup', onMouseUp);
		document.removeEventListener('mousemove', f);
	};
	document.addEventListener('mousemove', f);
	document.addEventListener('mouseup', onMouseUp);
};

let create_input_a = (f, a = 0) => {
	let w = 40;
	let w_2 = w / 2;
	let r = w_2 - 2;
	let elm = createElementNS("svg", ["style", "margin: -9px 0px 0px 0px; width: "+(w * 2)+"px; height: "+w+"px; float: right;"]);
	elm.appendChild(createElementNS("circle", ["cx", w_2], ["cy", w_2], ["r", r], ["fill", "none"], ["stroke", "#000"], ["pointer-events", "none"]));
	let arrow = createElementNS("path", ["d", "M"+w_2+","+w_2+"v-"+r], ["fill", "none"], ["stroke", "#555"], ["pointer-events", "none"]);
	elm.appendChild(arrow);
	let arrow_r = createElementNS("path", ["fill", "none"], ["stroke", "#ff5050"], ["pointer-events", "none"]);
	elm.appendChild(arrow_r);
	let w_x, w_y;
	let text = createElementNS("text", ["x", w + 2], ["y", w_2 + 3], ["font-size", 14], ["pointer-events", "none"]);
	text.textContent = "0";
	elm.appendChild(text);
	elm.onmousemove = e => {
		let a = Math.atan2(e.offsetX - w_2, w_2 - e.offsetY);
		text.textContent = Math.round(toDeg(a));
		arrow_r.setAttributeNS(null, "d", "M"+w_2+","+w_2+"l"+(Math.sin(a) * r)+","+(Math.cos(a) * -r));
	};
	elm.onmouseleave = e => {
		arrow_r.setAttributeNS(null, "d", "");
		text.textContent = Math.round(toDeg(a));
	};
	//*/
	elm.onmousedown = e => {
		w_x = w_2 - e.offsetX + e.pageX;
		w_y = w_2 - e.offsetY + e.pageY;
		m_down(e, e => {
			a = Math.atan2(e.pageX - w_x, w_y - e.pageY);
			text.textContent = Math.round(toDeg(a));
			arrow_r.setAttributeNS(null, "d", "M"+w_2+","+w_2+"l"+(Math.sin(a) * r)+","+(Math.cos(a) * -r));
			f(a);
		}, e => {
			a = Math.atan2(e.pageX - w_x, w_y - e.pageY);
			text.textContent = Math.round(toDeg(a));
			arrow_r.setAttributeNS(null, "d", "");
			arrow.setAttributeNS(null, "d", "M"+w_2+","+w_2+"l"+(Math.sin(a) * r)+","+(Math.cos(a) * -r));
			f(a);
		});
	};
	elm.f_a = _a => {
		a = _a;
		text.textContent = Math.round(toDeg(a));
		arrow.setAttributeNS(null, "d", "M"+w_2+","+w_2+"l"+(Math.sin(a) * r)+","+(Math.cos(a) * -r));
	};
	
	return elm;
};
let create_input_a_c = (f, f_d, a = 0) => {
	let w = 50;
	let w_2 = w / 2;
	let r = w_2 - 2;
	let elm = createElementNS("svg", ["style", "margin: -9px 0px 0px 0px; width: "+(w * 2)+"px; height: "+w+"px; float: right;"]);
	elm.appendChild(createElementNS("circle", ["cx", w_2], ["cy", w_2], ["r", r], ["fill", "none"], ["stroke", "#000"], ["pointer-events", "none"]));
	let arrow_m = createElementNS("path", ["d", "M"+w_2+","+w_2+"v-"+r], ["fill", "none"], ["stroke", "#888"], ["pointer-events", "none"]);
	elm.appendChild(arrow_m);
	let arrow = createElementNS("path", ["d", "M"+w_2+","+w_2+"v-"+r], ["fill", "none"], ["stroke", "#000"], ["pointer-events", "none"]);
	elm.appendChild(arrow);
	let arrow_r = createElementNS("path", ["fill", "none"], ["stroke", "#ff5050"], ["pointer-events", "none"]);
	elm.appendChild(arrow_r);
	
	
	
	let compass_needle_n = createElementNS("path", ["fill", "#09f"], ["pointer-events", "none"]);
	elm.appendChild(compass_needle_n);
	let compass_needle_s = createElementNS("path", ["fill", "#ff5050"], ["pointer-events", "none"]);
	elm.appendChild(compass_needle_s);
	
	let height_needle = w / 3;
	let width_needle = height_needle / 3;
	
	elm.f_c = a => {
		let a_cos = Math.cos(a);
		let a_sin = Math.sin(a);
		compass_needle_n.setAttributeNS(null, "d", "M"+(w_2 + a_cos * width_needle)+","+(w_2 + a_sin * width_needle)+
		"L"+(w_2 + a_sin * height_needle)+","+(w_2 - a_cos * height_needle)+
		"L"+(w_2 - a_cos * width_needle)+","+(w_2 - a_sin * width_needle)+"z");
		compass_needle_s.setAttributeNS(null, "d", "M"+(w_2 + a_cos * width_needle)+","+(w_2 + a_sin * width_needle)+
		"L"+(w_2 - a_cos * width_needle)+","+(w_2 - a_sin * width_needle)+
		"L"+(w_2 - a_sin * height_needle)+","+(w_2 + a_cos * height_needle)+"z");
	};
	elm.f_m = a => {
		arrow_m.setAttributeNS(null, "d", "M"+w_2+","+w_2+"l"+(Math.sin(a) * r)+","+(Math.cos(a) * -r));
	};
	
	
	let w_x, w_y;
	let text = createElementNS("text", ["x", w + 2], ["y", w_2 + 3], ["font-size", 14], ["pointer-events", "none"]);
	text.textContent = "0";
	elm.appendChild(text);
	elm.onmousemove = e => {
		let a = Math.atan2(e.offsetX - w_2, w_2 - e.offsetY);
		text.textContent = Math.round(toDeg(a));
		arrow_r.setAttributeNS(null, "d", "M"+w_2+","+w_2+"l"+(Math.sin(a) * r)+","+(Math.cos(a) * -r));
	};
	elm.onmouseleave = e => {
		arrow_r.setAttributeNS(null, "d", "");
		text.textContent = Math.round(toDeg(a));
	};
	//*/
	elm.onmousedown = e => {
		w_x = w_2 - e.offsetX + e.pageX;
		w_y = w_2 - e.offsetY + e.pageY;
		f_d();
		m_down(e, e => {
			a = Math.atan2(e.pageX - w_x, w_y - e.pageY);
			text.textContent = Math.round(toDeg(a));
			arrow_r.setAttributeNS(null, "d", "M"+w_2+","+w_2+"l"+(Math.sin(a) * r)+","+(Math.cos(a) * -r));
			f(a);
		}, e => {
			a = Math.atan2(e.pageX - w_x, w_y - e.pageY);
			text.textContent = Math.round(toDeg(a));
			arrow_r.setAttributeNS(null, "d", "");
			arrow.setAttributeNS(null, "d", "M"+w_2+","+w_2+"l"+(Math.sin(a) * r)+","+(Math.cos(a) * -r));
			f(a);
		});
	};
	elm.f_a = _a => {
		a = _a;
		text.textContent = Math.round(toDeg(a));
		arrow.setAttributeNS(null, "d", "M"+w_2+","+w_2+"l"+(Math.sin(a) * r)+","+(Math.cos(a) * -r));
	};
	
	return elm;
};
// Сохранение / Загрузка файлов.
let download = (data, filename, type) => {
	let file = new Blob([data], {type: type});
	/*
	if(window.navigator.msSaveOrOpenBlob) // IE10+
	window.navigator.msSaveOrOpenBlob(file, filename);
	else{ // Others
	//*/
	let a = document.createElement("a"),
		url = URL.createObjectURL(file);
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	setTimeout(() => {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);  
	}, 0); 
	//}
};

let input_file = createElement("input", ["type", "file"]);

let f_out_file, f_dop;
input_file.onchange = () => {
	let reader = new FileReader();
	reader.onload = function(){
		if(f_dop !== undefined)f_dop();
		f_out_file(reader.result);
	};
	reader.readAsText(input_file.files[0]);
};
//input_file.onchange = f_handleFiles;

let f_load = (f, f_2) => {
	f_out_file = f;
	f_dop = f_2;
	input_file.click();
};





// Функция перевода чисел в числобуквенный формат записи числа.
let text_in_number = text => {
	// Определяем тип т начала вхождения. и вычисляем по типу до конца вхождения символов данного типа.
	// типы: 48 - 57 цыфры. 65 - 90 A-Z, 97 - 122 a-z, кирилица 1040 - 1071 кроме (Ё, Й 1049, Ъ 1066, Ы 1067, Ь 1068) А-Я, мелкие 1072-1103 кроме (ё, й 1081, ъ 1098, ы 1099, ь 1100).
	let type = 0;
	let result = 1;
	let multiplier = 0;
	for(let i = 0; i < text.length; i++){
		let u = text.charCodeAt(i);
		if((type <= 1) && u >= 48 && u <= 57){
			if(type == 0){
				type = 1;
				result = text.charAt(i) * 1;
			}else result = result * 10 + text.charAt(i) * 1;
		}else if((type == 0 || type == 2) && u >= 65 && u <= 90){
			if(type == 0){
				type = 2;
				multiplier = 26;
				result = u - 64;
			}else result = result * multiplier + (u - 64);
		}else if((type == 0 || type == 3) && u >= 97 && u <= 122){
			if(type == 0){
				type = 3;
				multiplier = 26;
				result = u - 96;
			}else result = result * multiplier + (u - 96);
		}else if((type == 0 || type == 4) && u >= 1040 && u <= 1071 && u != 1049 && (u < 1066 || u > 1068)){
			if(u > 1068)u -= 4;
			else if(u > 1049)u--;
			if(type == 0){
				type = 4;
				multiplier = 28;
				result = u - 1039;
			}else result = result * multiplier + (u - 1039);
		}else if((type == 0 || type == 5) && u >= 1072 && u <= 1103 && u != 1081 && (u < 1098 || u > 1100)){
			if(u > 1100)u -= 4;
			else if(u > 1081)u--;
			if(type == 0){
				type = 5;
				multiplier = 28;
				result = u - 1071;
			}else result = result * multiplier + (u - 1071);
		}else if(type != 0){
			break;
		}
	}
	return [result, type];
};
let number_in_text = (n, type) => {
	let result = "";
	if(type <= 1)result += n;
	else{
		let multiplier = 26;
		let offset = 64;
		if(type == 3)offset = 96;
		else if(type == 4){
			multiplier = 28;
			offset = 1039;
		}else if(type == 5){
			multiplier = 28;
			offset = 1071;
		}
		while(n > 0){
			let remainder = n % multiplier;
			if(remainder == 0)remainder = multiplier;
			n -= remainder;
			n /= multiplier;
			if(type >= 4){
				if(remainder > 25)remainder += 4;
				else if(remainder > 9)remainder++;
			}
			remainder += offset;
			result = String.fromCharCode(remainder) + result;
		}
	}
	return result;
};

/*
// Шаблон объекта трека.
let obj_track = {
	options:{// опции.
		type:"",// тип
		grid:options,// Если сохранены настройки сетки + данные нумерации.
		point:{// характеристики цвета/прозрачности точик.
			color:"#000",
			opacity:1,
			b_color:"#000",
			b_opacity:1,
			t_color:"#000",
			t_opacity:1
		},
		track:{// характеристики цвета/прозрачности треков.
			color:"#000",
			opacity:1,
			b_color:"#000",
			b_opacity:1,
			t_color:"#000",
			t_opacity:1
		}
	},
	points:[[...coor_WM,text]],// Массив точик, и если есть их текстов.
	points_time:[time],// Массим времени точек.
	tracks:[[[...coor_WM,text]]],// Массив, массивов точек треков и если есть текстов.
	tracks_time:[[time]]// Массив массивов времени треков.
};
//*/
// Шаблон объекта трека. всоответствии со схемой gpx.
/// Функции zip и kmz, kml
let encoder = new TextEncoder();
let from_zip = buffer => {// Принимает ArrayBuffer, возвращает массиы ArrayBuffer.
	// Вариант 1. Минуя заголовок zip и центральный каталог извлекаем все файлы с начала файла zip, начиная с локального заголовка первого файла.
	// Вариант 2. Начинаем с поиска и чтения заголовка zip.
	// Подготавливаем интерфейс для работы с данными. 
	let data = new DataView(buffer);// Типизированный массив для работы с байтами.
	let u8_arr = new Uint8Array(buffer);// Типизированный массив для работы с байтами.
	let byte;// Байт.
	let l = u8_arr.byteLength;// Размер байт.
	let p = l - 22;// Указатель на байт.
	let b;// Указатель на бит.
	let bits;
	let f_L = n => {// getBitL // Обратный порядок бит, с права старший.
		bits = 0;
		while(n--){
			if(b > 7){
				b = 0;
				byte = u8_arr[p++];
			}
			if(byte & (1 << b))bits |= 1 << n;
			b++;
		}
	};
	let f_B = n => {// getBitB // Прямой порядок бит, с лева старший.
		bits = 0;
		let i = 0;
		while(i < n){
			if(b > 7){
				b = 0;
				byte = u8_arr[p++];
			}
			if(byte & (1 << b))bits |= 1 << i;
			b++;
			i++;
		}
	};
	let _a_tc;// = [];// tree_code // Вместо одномерного массива создаем дерево массивов кодов Хоффмана.
	let _src;// = _a_tc;// Вспомогательная ссылка на массив, нужна при проходе по дереву.
	let f_add_cod = (cod, n, l) => {// Создает ветку дерева из значения кода и длины.
		let id;
		while(--l){
			id = (n >>> l) & 1;
			if(_src[id] === undefined){
				_src[id] = [];
				_src = _src[id];
			}else _src = _src[id];
		}
		id = n & 1;
		_src[id] = cod;
		_src = _a_tc;
	};
	while(p)if(data.getUint32(p, false) === 0x504B0506)break;// 0x504B0506;// Прямой порядок байтов. PK 05 06 // Находим адрес заголовка, если есть.
		else p--;
	if(p === 0)return;
	// информация о центральном каталоге и количестве файлов в архиве.
	let c_files = data.getUint16(p + 10, true);
	let cd_size = data.getUint32(p + 12, true);
	let cd_p = data.getUint32(p + 16, true);
	// центральный каталог.
	// готовим/запускаем цыкал чтения файлов.
	let arr_file = [];// Итоговый массив файлов. и данных о файлах.
	//let decoder = new TextDecoder();// Для работы с текстом.
	while(c_files--){
		if(data.getUint32(cd_p, false) !== 0x504B0102)return;// 0x504B0102;// Сигнатура центрального каталога. PK 01 02
		p = data.getUint32(cd_p + 42, true);// Ссылка на локальный каталог файла.
		if(data.getUint32(p, false) !== 0x504B0304)return;// 0x504B0304;// Сигнатура локального каталога. PK 03 04
		let method = data.getUint16(p + 8, true);
		if(method !==0 && method !== 8)return;
		let size_f = data.getUint32(p + 22, true);
		let name_len = data.getUint16(p + 26, true);
		let extra_len = data.getUint16(p + 28, true);
		//*
		p += 30;
		let name = "";
		while(name_len--)name += String.fromCharCode(u8_arr[p++]);
		//*/
		//let name = decoder.decode(u8_arr.slice(p += 30, p += name_len));
		p += extra_len;
		// Считываем блоки данных.
		if(method === 8){// Deflate
			b = 8;
			let file_buf = new ArrayBuffer(size_f);// Создаем буфер для файла.
			let file_buf_8 = new Uint8Array(file_buf);
			let p_f = 0;
			let fg_next;// Флаг установлен если есть следующий блок.
			do{
				let fg = true;// Флаг установлен если литералы или длины, опущен если смещение.
				let len, dist;// Длина, смещение.
				f_L(1);
				fg_next = bits !== 1;// Флаг установлен если есть следующий блок.
				f_L(2);
				if(bits === 0){// Несжатые данные.
					//alert("Несжатые данные");
					// НЕ ТЕСТИРОВАЛОСЬ
					b = 8;// В случае несжатых данных пропускаем остаток байта.
					len = data.getUint16(p, true);
					p += 4;
					file_buf_8.set(u8_arr.slice(p, p += len), p_f);
					p_f += len;
				}else if(bits === 1){// Динамический Хаффман.
					//alert("Динамический Хаффман");
					// Считываем данные HLIT(5 битов), HDIST(5 битов), HCLEN(4 бита).
					f_B(5);
					let hlit = bits + 257;// кодов литерала/длины (257 - 286)
					f_B(5);
					let hdist = bits + 1;// кодов расстояния (1 - 32)
					f_B(4);
					let hclen = bits + 4;// количество, трехбитных, кодов длины (4 - 19)
					// Находим длины кодов длин кодов.
					let a_ci = [3, 17, 15, 13, 11, 9, 7, 5, 4, 6, 8, 10, 12, 14, 16, 18, 0, 1, 2];
					let a_cl = [];// codelen_lengths // Трехбитные длины кодов.
					let a_c = [0, 0, 0, 0, 0, 0, 0, 0];// bl_count // Количество кодов каждой длины.
					while(hclen--){// Считываем трехбайтовые значения и заполняем массив длин.
						f_B(3);
						a_cl.push(bits);
						a_c[bits]++;
					}
					a_c[0] = 0;// Количество нулевых длин устанавливаем в ноль.
					let a_nc = [0];// next_code // Начальные коды каждой длины.
					cod = 0;
					for(let i = 1; i < 8; i++){// Создаем начальные коды для каждой из длин.
						cod = (cod + a_c[i - 1]) << 1;
						a_nc[i] = cod;
					}
					_a_tc = [];
					_src = _a_tc;
					for(let i = 0; i < a_ci.length; i++){// Создаем многомерный массив, дерево где ветки коды, а листья значения.
						let ids = a_ci[i];
						len = a_cl[ids];
						if(len){
							f_add_cod(i, a_nc[len], len);
							a_nc[len]++;
						}
					}
					let w = 0;
					let a_l = [];// Массив длин кодов литералов и расстояний. Дистанции будут перенесены в другой массив.
					while(w < hlit + hdist){
						while(true){
							if(b > 7){
								b = 0;
								byte = u8_arr[p++];
							}
							bits = (byte & (1 << b)) >>> b;
							b++;
							if(Array.isArray(_src[bits]))_src = _src[bits];
							else{
								cod = _src[bits];
								_src = _a_tc;
								break;
							}
						}
						if(cod <= 15)a_l[w++] = cod;
						else if(cod === 16){// Читаем два бита и копируем предведущий символ от 3 до 6 раз.
							f_B(2);
							bits += 3;
							while(bits--){
								a_l[w] = a_l[w - 1];
								w++;
							}
						}else if(cod === 17){// Повторить код 0, 3 - 10 раз. (считываем 3 бита)
							f_B(3);
							bits += 3;
							while(bits--)a_l[w++] = 0;
						}else{//if(cod === 18)// Повторить код 0, 11 - 138 раз. (считываем 7 бит)
							f_B(7);
							bits += 11;
							while(bits--)a_l[w++] = 0;
						}
					}
					let a_d = a_l.splice(hlit);// Массив длин кодов дистанций.
					// Создаем дерево кодов значений для дистанций(обратных отступов).
					a_c = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];// bl_count // Количество кодов каждой длины.
					for(let i = 0; i < hdist; i++)a_c[a_d[i]]++;
					a_c[0] = 0;
					cod = 0;
					for(let i = 1; i < 16; i++){// Создаем начальные коды для каждой из длин.
						cod = (cod + a_c[i - 1]) << 1;
						a_nc[i] = cod;
					}
					_a_tc = [];
					_src = _a_tc;
					for(let i = 0; i < hdist; i++){// Создаем многомерный массив, дерево где ветки коды, а листья значения. Длин.
						len = a_d[i];
						if(len !== 0){
							f_add_cod(i, a_nc[len], len);
							a_nc[len]++;
						}
					}
					let _tc_d = _a_tc;// Дерево(смещений) длин
					_a_tc = [];
					_src = _a_tc;// Литералов и расстояний длин
					// Создаем дерево кодов значений для длин и расстояний.
					a_c = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];// bl_count // Количество кодов каждой длины.
					for(let i = 0; i < hlit; i++)a_c[a_l[i]]++;
					a_c[0] = 0;
					cod = 0;
					for(let i = 1; i < 16; i++){// Создаем начальные коды для каждой из длин.
						cod = (cod + a_c[i - 1]) << 1;
						a_nc[i] = cod;
					}
					for(let i = 0; i < hlit; i++){// Создаем многомерный массив, дерево где ветки коды, а листья значения. Литералы и расстояния.
						len = a_l[i];
						if(len !== 0){
							f_add_cod(i, a_nc[len], len);
							a_nc[len]++;
						}
					}
					while(p_f < size_f){
						// Определяем код.
						while(true){
							if(b > 7){
								b = 0;
								byte = u8_arr[p++];
							}
							bits = (byte & (1 << b)) >>> b;
							b++;
							if(Array.isArray(_src[bits]))_src = _src[bits];
							else{
								cod = _src[bits];
								_src = _a_tc;
								break;
							}
						}
						// Обрабатываем код.
						if(fg){// литералы или длины
							if(cod < 256)file_buf_8[p_f++] = cod;// литералы.
							else if(cod > 256){// длины.
								if(cod < 265)len = cod - 254;
								else if(cod < 269){
									len = cod - 254 + (cod - 265);
									f_L(1);
									len += bits;
								}else if(cod < 273){
									len = cod - 250 + (cod - 269) * 3;
									f_B(2);
									len += bits;
								}else if(cod < 277){
									len = cod - 238 + (cod - 273) * 7;
									f_B(3);
									len += bits;
								}else if(cod < 281){
									len = cod - 210 + (cod - 277) * 15;
									f_B(4);
									len += bits;
								}else if(cod < 285){
									len = cod - 150 + (cod - 281) * 31;
									f_B(5);
									len += bits;
								}else len = 258;//else if(cod === 285)len = 258;else return;// 286–287 не являются корректными len-значениями.
								fg = false;
								_src = _tc_d;
							}else break;// Конец блокаю
						}else{// смещение.
							fg = true;
							if(cod < 4)dist = cod + 1;
							else if(cod < 6)dist = cod + 1 + (cod - 4);
							else if(cod < 8)dist = cod + 3 + (cod - 6) * 3;
							else if(cod < 10)dist = cod + 9 + (cod - 8) * 7;
							else if(cod < 12)dist = cod + 23 + (cod - 10) * 15;
							else if(cod < 14)dist = cod + 53 + (cod - 12) * 31;
							else if(cod < 16)dist = cod + 115 + (cod - 14) * 63;
							else if(cod < 18)dist = cod + 241 + (cod - 16) * 127;
							else if(cod < 20)dist = cod + 495 + (cod - 18) * 255;
							else if(cod < 22)dist = cod + 1005 + (cod - 20) * 511;
							else if(cod < 24)dist = cod + 2027 + (cod - 22) * 1023;
							else if(cod < 26)dist = cod + 4073 + (cod - 24) * 2047;
							else if(cod < 28)dist = cod + 8167 + (cod - 26) * 4095;
							else if(cod < 30)dist = cod + 16357 + (cod - 28) * 8191;
							f_B(((cod - 2) / 2) | 0);
							dist += bits;
							while(len--){
								file_buf_8[p_f] = file_buf_8[p_f - dist];
								p_f++;
							}
						}
					}
				}else if(bits === 2){// Статический Хаффман.
					//alert("Статический Хаффман");
					// НЕ ТЕСТИРОВАЛОСЬ
					while(p_f < size_f){
						// Определяем код.
						f_L(7);
						let cod = bits;
						if(cod <= 23){
							cod += 256;
						}else if(cod <= 95){
							cod <<= 1;
							f_L(1);
							cod |= bits;
							cod -= 48;
						}else if(cod <= 99){
							cod <<= 1;
							f_L(1);
							cod |= bits;
							cod += 88;//cod -= 192;//cod += 280;
						}else{//if(cod <= 127){
							cod <<= 2;
							f_L(2);
							cod |= bits;
							cod -= 256;//cod -= 400;//cod += 144;
						}
						// Обрабатываем код.
						if(fg){// литералы или длины
							if(cod < 256)file_buf_8[p_f++] = cod;// литералы.
							else if(cod > 256){// длины.
								if(cod < 265)len = cod - 254;
								else if(cod < 269){
									len = cod - 254 + (cod - 265);
									f_L(1);
									len += bits;
								}else if(cod < 273){
									len = cod - 250 + (cod - 269) * 3;
									f_B(2);
									len += bits;
								}else if(cod < 277){
									len = cod - 238 + (cod - 273) * 7;
									f_B(3);
									len += bits;
								}else if(cod < 281){
									len = cod - 210 + (cod - 277) * 15;
									f_B(4);
									len += bits;
								}else if(cod < 285){
									len = cod - 150 + (cod - 281) * 31;
									f_B(5);
									len += bits;
								}else len = 258;//else if(cod === 285)len = 258;else return;// 286–287 не являются корректными len-значениями.
								fg = false;
							}else break;// Конец блокаю
						}else{// смещение.
							fg = true;
							if(cod < 4)dist = cod + 1;
							else if(cod < 6)dist = cod + 1 + (cod - 4);
							else if(cod < 8)dist = cod + 3 + (cod - 6) * 3;
							else if(cod < 10)dist = cod + 9 + (cod - 8) * 7;
							else if(cod < 12)dist = cod + 23 + (cod - 10) * 15;
							else if(cod < 14)dist = cod + 53 + (cod - 12) * 31;
							else if(cod < 16)dist = cod + 115 + (cod - 14) * 63;
							else if(cod < 18)dist = cod + 241 + (cod - 16) * 127;
							else if(cod < 20)dist = cod + 495 + (cod - 18) * 255;
							else if(cod < 22)dist = cod + 1005 + (cod - 20) * 511;
							else if(cod < 24)dist = cod + 2027 + (cod - 22) * 1023;
							else if(cod < 26)dist = cod + 4073 + (cod - 24) * 2047;
							else if(cod < 28)dist = cod + 8167 + (cod - 26) * 4095;
							else if(cod < 30)dist = cod + 16357 + (cod - 28) * 8191;
							f_B(((cod - 2) / 2) | 0);
							dist += bits;
							while(len--){
								file_buf_8[p_f] = file_buf_8[p_f - dist];
								p_f++;
							}
						}
					}
				}
			}while(fg_next);
			arr_file.push({buffer:file_buf, name:name});
		}else{// Несжатые данные.
			arr_file.push({buffer:buffer.slice(p, p + size_f), name:name});
		}
		cd_p += data.getUint16(cd_p + 28, true) + data.getUint16(cd_p + 30, true) + data.getUint16(cd_p + 32, true) + 46;
	}
	return arr_file;
};
let to_zip = arr_file => {// Принимает массиы ArrayBuffer ArrayBuffer, возвращает. Без сжатия.
	// Вычисляем размер файла.
	let p = 22 + arr_file.length * 46;
	let cfh = arr_file.length * 30;
	// Подготавливаем каталоги.
	for(let i = 0; i < arr_file.length; i++){
		cfh += arr_file[i].buffer.byteLength;
		cfh += arr_file[i].name.length;
		p += arr_file[i].name.length;
	}
	let buffer = new ArrayBuffer(p += cfh);
	let u8_arr = new Uint8Array(buffer);
	let data = new DataView(buffer);
	// Заголовок EOCDR(zip). Следует после центрального каталога и невходит в него..
	data.setUint32(p - 22, 0x504B0506, false);// Сигнатура EOCDR конца центрального каталога.
	data.setUint16(p - 18, 0, true);// Номер этого диска.
	data.setUint16(p - 16, 0, true);// Номер диска запуска CD.
	data.setUint16(p - 14, arr_file.length, true);// Количество записей на этом CD диске.
	data.setUint16(p - 12, arr_file.length, true);// Количество записей(файлов) в центральном каталоге.
	data.setUint32(p - 10, p - (cfh + 22), true);// Размер центрального каталога в байтах.
	data.setUint32(p - 6, cfh, true);// Смещение центрального каталога.
	data.setUint16(p - 2, 0, true);// Длина комментария.
	p = 0;
	// Готовим дату и время в формате MS-DOS.
	let date = new Date();
	let dos_time = (date.getUTCHours() << 11) | (date.getUTCMinutes() << 5) | (date.getUTCSeconds() / 2);
	let dos_date = ((date.getUTCFullYear() - 1980) << 9) | ((date.getUTCMonth() + 1) << 5) | date.getUTCDate();
	// Готовим таблицу контрольной суммы CRC 32.
	let c;
	let crcTable = [];
	for(let n = 0; n < 256; n++){
		c = n;
		for(let k = 0; k < 8; k++)c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
		crcTable[n] = c;
    }
	for(let i = 0; i < arr_file.length; i++){
		// Пишем локальный каталог.
		data.setUint32(p, 0x504B0304, false);// Сигнатура локального каталога.
		data.setUint16(p += 4, 20, true);// Версия, необходимая для извлечения, PKZip 2.0.
		data.setUint16(p += 2, 0, true);// Битовый флаг общего назначения.
		data.setUint16(p += 2, 0, true);// Метод сжатия. 0 - Без сжатия.
		data.setUint16(p += 2, dos_time, true);// Время последнего изменения файла.
		data.setUint16(p += 2, dos_date, true);// Дата последнего изменения файла.
		let crc_p = p += 2;// CRC 32
		data.setUint32(p += 4, arr_file[i].buffer.byteLength, true);// Сжатый размер.
		data.setUint32(p += 4, arr_file[i].buffer.byteLength, true);// Не сжатый размер.
		data.setUint16(p += 4, arr_file[i].name.length, true);// Длина имени файла.
		data.setUint16(p += 2, 0, true);// Длина дополнительного поля.
		p += 2;
		//Имя файла.
		//* Потом переделать.
		for(let j = 0; j < arr_file[i].name.length; j++){
			u8_arr[p++] = arr_file[i].name.charCodeAt(j);// потом переделать. Вычислять длину и перекодировать имя зарание, чтобы были имена и латиницей.
			if(u8_arr[p - 1] < 32 || u8_arr[p - 1] === 0x22 || u8_arr[p - 1] === 0x2A || u8_arr[p - 1] === 0x2F || u8_arr[p - 1] === 0x3A || u8_arr[p - 1] === 0x3C || u8_arr[p - 1] === 0x3E || u8_arr[p - 1] === 0x3F || u8_arr[p - 1] === 0x5C || u8_arr[p - 1] === 0x7C)u8_arr[p - 1] = 95;//32;// Недопустимые символы. Фильтруем \/:*?"<>|
		}
		//*/
		let u8_file = new Uint8Array(arr_file[i].buffer);
		let crc = 0 ^ (-1);
		for (let j = 0; j < arr_file[i].buffer.byteLength; j++ ){
			crc = (crc >>> 8) ^ crcTable[(crc ^ u8_file[j]) & 0xFF];
			u8_arr[p++] = u8_file[j];
		}
		crc = (crc ^ (-1)) >>> 0;
		data.setUint32(crc_p, crc, true);// контрольная сумма CRC 32.
		// Пишем центральный каталог.
		data.setUint32(cfh, 0x504B0102, false);// Сигнатура центрального каталога.
		data.setUint16(cfh += 4, 20, true);// Версия, на которой сделано, PKZip 2.0.
		data.setUint16(cfh += 2, 20, true);// Версия, необходимая для извлечения, PKZip 2.0.
		data.setUint16(cfh += 2, 0, true);// Битовый флаг общего назначения.
		data.setUint16(cfh += 2, 0, true);// Метод сжатия. 0 - Без сжатия.
		data.setUint16(cfh += 2, dos_time, true);// Время последнего изменения файла.
		data.setUint16(cfh += 2, dos_date, true);// Дата последнего изменения файла.
		data.setUint32(cfh += 2, crc, true);// контрольная сумма CRC 32.
		data.setUint32(cfh += 4, arr_file[i].buffer.byteLength, true);// Сжатый размер.
		data.setUint32(cfh += 4, arr_file[i].buffer.byteLength, true);// Не сжатый размер.
		data.setUint16(cfh += 4, arr_file[i].name.length, true);// Длина имени файла.
		data.setUint16(cfh += 2, 0, true);// Длина дополнительного поля.
		data.setUint16(cfh += 2, 0, true);// Длина комментария к файлу.
		data.setUint16(cfh += 2, 0, true);// Номер диска, где начинается файл.
		data.setUint16(cfh += 2, 0, true);// Внутренние атрибуты файла.
		data.setUint32(cfh += 2, 32, true);// Внешние атрибуты файла. // Доделать.
		data.setUint32(cfh += 4, crc_p - 14, true);// Смещение локального заголовка файла.
		u8_arr.copyWithin(cfh += 4, crc_p + 16, crc_p + 16 + arr_file[i].name.length);//Имя файла.
		cfh += arr_file[i].name.length;
	}
	return buffer;
};
// Для построения рамки.
let rail_over = e => {//onmouseover//onmouseenter
	e.target.setAttributeNS(null, "stroke", "#ff5050");
	e.target.setAttributeNS(null, "stroke-width", 1);
};
let rail_out = e => {//onmouseout//onmouseleave
	e.target.setAttributeNS(null, "stroke", "#000");
	e.target.setAttributeNS(null, "stroke-width", .4);
};
let create_rail = () => {
	let elm = createElementNS("path", ["fill", "#fff"], ["fill-opacity", .3], ["stroke-opacity", .5],["stroke", "#000"], ["stroke-width", .4], ["pointer-events", "visible"]);
	elm.onmouseenter = rail_over;
	elm.onmouseout = rail_out;
	return elm;
};
// доп.
let f_enter = e => {if(e.keyCode === 13)e.target.blur();};
let f_focus = e => {e.target.select();};
















