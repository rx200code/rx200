
var Hex_View_JPEG = function(){
	
	this.span_log = document.getElementById("span_log");
	this.span_0 = document.getElementById("span_0");
	this.span_1 = document.getElementById("span_1");
	this.span_2 = document.getElementById("span_2");
	this.span_3 = document.getElementById("span_3");
	this.span_4 = document.getElementById("span_4");
	this.span_5 = document.getElementById("span_5");
	this.span_6 = document.getElementById("span_6");
	this.span_7 = document.getElementById("span_7");
	this.error_2 = document.getElementById("error_2");
	this.tables_DHT = [];
	this.create_DHT = function(arr_byte){
		if(arr_byte.length < 17){
			this.error_2.innerHTML += "ERROR: Маленький размер данных DHT меньше 17<br>";
			return;
		}
		let sum = arr_byte[1];
		let arr_code_counter = [arr_byte[1]];
		for(let i = 2; i < 17; i++){
			sum += arr_byte[i];
			arr_code_counter.push(arr_byte[i]);
		}
		if(sum != (arr_byte.length - 17)){
			this.error_2.innerHTML += "ERROR: Несходятся данные DHT по количеству кодов<br>";
			return;
		}
		//Строим дерево DHT[тип 0 - DC, 1 - AC][идентификатор таблицы(дерева)] далее бинарное дерево основанное на массивах с индексами [0] и [1].
		let type_DHT = arr_byte[0] >>> 4;
		let index_DHT = arr_byte[0] & 0xF;
		if(this.tables_DHT[type_DHT] == undefined)this.tables_DHT[type_DHT] = [];
		this.tables_DHT[type_DHT][index_DHT] = [];
		let arr_binary_tree = this.tables_DHT[type_DHT][index_DHT];
		
		let arr_codes = [];
		while(sum--)arr_codes.push(arr_byte[sum + 17]);//.toString(16).toUpperCase());//Заполняем массив символами в обратном порядке чтоб доставать с конца.
		
		let level_nod = 0;
		function create_node(level){
			//let level = level;
			if(arr_codes.length){
				let nod = [];
				if(arr_code_counter[level] > 0){
					arr_code_counter[level]--;
					nod[0] = arr_codes.pop();
				}else{
					level_nod++;
					nod[0] = create_node(level + 1);
				}
				if(arr_codes.length){
					if(arr_code_counter[level] > 0){
						arr_code_counter[level]--;
						nod[1] = arr_codes.pop();
					}else{
						level_nod++;
						nod[1] = create_node(level + 1);
					}
				}
				return nod;
			}
		}
		arr_binary_tree = create_node(0);
		this.span_3.innerHTML += JSON.stringify(arr_binary_tree)+"<br><br>";
		
		//this.span_3.innerHTML += arr_codes+"<br><br>";
		/*
		let arr_path = null;
		
		for(let level = 1; level < 17; level++){
			let code_counter = arr_byte[level];
			if(code_counter == 0)continue;
			
		}//*/
		
		//this.span_3.innerHTML = sum+" "+(arr_byte.length - 17);
		//alert((arr_byte[0] >>> 4)+" "+(arr_byte[0] & 0xF));
	}
	
	this.file = null;
	//загрузка.
	this.f_files = function(files){
		this.file = files[0];
		this.span_log.innerHTML = "Размер: "+this.file.size+". Начало загрузки.";
		
		let reader = new FileReader();
		
		reader.onerror = function(){
			this.span_log.innerHTML = "Ошибка.";
		}.bind(this);
		reader.onabort = function(){
			this.span_log.innerHTML = "Чтение прервано onabort.";
		}.bind(this);
		reader.onloadstart = function(){
			this.span_log.innerHTML = "Начата загрузка. onloadstart";
		}.bind(this);
		reader.onloadend = function(){
			this.span_log.innerHTML = "Чтение завершено. onloadend";
		}.bind(this);
		
		reader.onprogress = function(event){
			this.span_log.innerHTML = "Из "+event.total+" байт загружено "+event.loaded+" Процентов "+Math.round(event.loaded / event.total * 100)+"% Загружено.";
		}.bind(this);
		
		reader.onload = function(){
			this.span_log.innerHTML = "Загружено успешно.";
			let buffer = reader.result;
			let view = new DataView(buffer);
			
			this.span_0.innerHTML = "Фаил: <b>"+this.file.name+"</b> Размер: <b>"+this.file.size+"</b> байт (0x"+this.file.size.toString(16).toUpperCase()+"). Тип: <b>"+this.file.type+"</b>";
			this.span_3.innerHTML = "";
			this.error_2.innerHTML = "";
			//table
			let text_table = "<table style='font-family: monospace;'>";//<tr style='color: #00f;'><td>Offset</td><td>&nbsp;00 01 02 03 04 05 06 07&nbsp;&nbsp;08 09 0A 0B 0C 0D 0E 0F&nbsp;</td><td>Text</td></tr>";
			
			//text_table += "<tr style='color: #00f;'><td>Offset</td><td>&nbsp;00 01 02 03 04 05 06 07&nbsp;&nbsp;08 09 0A 0B 0C 0D 0E 0F&nbsp;</td><td>Text</td></tr><tr>";
			let td_offset = "";
			let td_byte = "";
			let td_text = "";
			let i = 0;
			function in_table(text, color){
				if(i != 0){
					td_offset += "</td>";
					td_byte += "</td>";
					td_text += "</td>";
					text_table += td_offset+td_byte+td_text+"</tr>";
				}
				text_table += text;
				//Возможно, в код ниже, следует добавить исключение и для маркера COM - комментариев.
				if(flag_SOS && !(uint8_marker == 0xDA || uint8_marker == 0xDC || (uint8_marker >= 0xD0 && uint8_marker <= 0xD7))){//В сжатых жанных могут быть маркера RST(от 0xD0 до 0xD7 включительно) и DNL(0xDC). Также маркер SOS сразу после которого начинаются сжатые данные, Маркер SOS(0xDA) устанавливает флаг flag_SOS по этому он здесь.
					text_table += "<tr style='background-color: #ccc;'><td colspan='3'><b style='background-color: #fff; color: #a00;'>Ошибка</b> маркер внктри данных сканирования.</td></tr>";
				}
				text_table += "<tr style='color: #00f;'><td>Offset</td><td>&nbsp;00 01 02 03 04 05 06 07&nbsp;&nbsp;08 09 0A 0B 0C 0D 0E 0F&nbsp;</td><td>Text</td></tr><tr>";
				td_offset = "<td style='color: #00f;'>";
				td_byte = "<td"+(color ? " style='color: #"+color+";'":"")+">";
				td_text = "<td"+(color ? " style='color: #"+color+";'":"")+">";
				let offset_byte = i % 16;
				if(offset_byte){
					let str = ((i - offset_byte)/16).toString(16).toUpperCase()+"0";
					str = ('000000' + str).slice(-8);
					td_offset += str+"<br>";
					
					for(let k = 0; k < offset_byte; k++){
						td_byte += "&nbsp;&nbsp;&nbsp;";
						td_text += "&nbsp;";
					}
					if(offset_byte > 8)td_byte += "&nbsp;";
				}
			}
			
			let flag_jepg = false;//Флаг определяет находимся ли внутри файла jpeg. и стоит ли искать маркеры.
			let flag_jepg_size = false;//Флаг определяет
			let flag_jepg_block = false;//
			let flag_input_block = false;//
			let arr_data_block = [];
			let flag_SOS = false;//Начало сканирования.
			let flag_DRI = false;//
			let uint8_marker = 0;//
			let length_byte = 0;//
			let size_block = 0;//
			//Внимание! Маркеры TEM, RSTn, SOI, EOI не имеют длинны и данных маркера и, следовательно, состоят из двух байт. 
			while(i < buffer.byteLength){
				
				if(0xFF == view.getUint8(i) && length_byte <= 0){
					if(0xD8 == view.getUint8(i + 1)){//Маркер обязательной обработки. SOI #################################### //Их всего 8.
						uint8_marker = view.getUint8(i + 1);
						in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер SOI</b> - Начало jpeg 0xFFD8</td></tr>");
						flag_jepg = true;
						length_byte = 2;
					}else if(0xD9 == view.getUint8(i + 1)){//Маркер обязательной обработки. EOI ####################################
						uint8_marker = view.getUint8(i + 1);
						flag_SOS = false;
						in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер EOI</b> - Конец jpeg 0xFFD9</td></tr>");
						flag_jepg = false;
						length_byte = 2;
					}
				}
				
				if(!flag_jepg && length_byte == 0){
					in_table("<tr style='background-color: #ccc; color: #f00;'><td colspan='3'>Непонятно что но не jpeg</td></tr>","f00");
				}
				
				if(flag_jepg){
					if(length_byte <= 0 && !flag_jepg_size && !flag_jepg_block){
						if(0xFF == view.getUint8(i)){
							let byte_02 = view.getUint8(i + 1);
							uint8_marker = byte_02;
							if(byte_02 == 0x0){
								//Внутри сжатых данных если встречается 0xFF то такие данные кодируются 0xFF00, чтобы было легче искать маркеры. По этому пропускаем маркеры 0xFF00
							}else if(byte_02 == 0x1){//TEM
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> TEM - Для временного локального определения настроек арифметического кодирования 0xFF01</td></tr>");
								length_byte = 2;
							}else if(byte_02 >= 0x2 && byte_02 <= 0xBF){//RES
								let string_byte_02 = byte_02.toString(16).toUpperCase();
								if(string_byte_02.length == 1)string_byte_02 = "0"+string_byte_02;
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> RES - Резерв для последующих расширений формата JPEG с 0xFF02 до 0xFFBF включительно. Конкретный маркер 0xFF"+string_byte_02+"</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xC0){//Маркер обязательной обработки. SOF0 ####################################
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер SOF0</b> - Начало фрейма (базовый, ДКП) 0xFFC0</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xC1){//Маркер обязательной обработки. SOF1 ####################################
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер SOF1</b> - Начало фрейма (расширенный, ДКП, код Хаффмана) 0xFFC1</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xC2){//Маркер обязательной обработки. SOF2 ####################################
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер SOF2</b> - Начало фрейма (прогрессивный, ДКП, код Хаффмана) 0xFFC2</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xC3){//SOF3
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> SOF3 - Начало кадра, метод сжатия без потерь. 0xFFC3</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xC4){//Маркер обязательной обработки. DHT ####################################
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер DHT</b> - Задает одну или более таблиц Хаффмана. 0xFFC4</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xC5){//SOF5
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> SOF5 - Начало кадра, дифференциальный последовательный метод. 0xFFC5</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xC6){//SOF6
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> SOF6 - Начало кадра, дифференциальный прогрессивный метод. 0xFFC6</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xC7){//SOF7
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> SOF7 - Начало кадра, дифференциальный метод без потерь. 0xFFC7</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xC8){//JPG
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> JPG - Резерв для последующих расширений формата JPEG. 0xFFC8</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xC9){//SOF9
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> SOF9 - Начало кадра, расширенный последовательный метод, арифметическое кодирование. 0xFFC9</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xCA){//SOF10
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> SOF10 - Начало кадра, прогрессивный метод, арифметическое кодирование. 0xFFCA</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xCB){//SOF11
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> SOF11 - Начало кадра, метод без потерь, арифметическое кодирование. 0xFFCB</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xCC){//DAC
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> DAC - Определений условий арифметического кодирования. 0xFFCC</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xCD){//SOF13
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> SOF13 - Начало кадра, дифференциальный последовательный метод, арифметическое кодирование. 0xFFCD</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xCE){//SOF14
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> SOF14 - Начало кадра, дифференциальный прогрессивный метод, арифметическое кодирование. 0xFFCE</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xCF){//SOF15
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> SOF15 - Начало кадра, дифференциальный метод без потерь, арифметическое кодирование. 0xFFCF</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 >= 0xD0 && byte_02 <= 0xD7){//RSTn #####. Бывает встречаются.//Их всего 5 //Обрабатывать не обязательно как и остальные редкие маркеры.
								let string_byte_02 = byte_02.toString(16).toUpperCase();
								if(string_byte_02.length == 1)string_byte_02 = "0"+string_byte_02;
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> <b>RSTn</b>(RST0 - RST7) - Перезапуск 0xFFDn Конкретный маркер 0xFF"+string_byte_02+
								(flag_DRI ? "":" <b style='background-color: #fff; color: #a00;'>Ошибка: не было маркера DRI</b>")+
								(flag_SOS ? "":" <b style='background-color: #fff; color: #a00;'>Ошибка: Должен быть внутри данных сканирования.</b>")+"</td></tr>");
								length_byte = 2;
							}else if(byte_02 == 0xDA){//Маркер обязательной обработки. SOS ####################################
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер SOS</b> - Начало сканирования. 0xFFDA</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
								flag_SOS = true;
							}else if(byte_02 == 0xDB){//Маркер обязательной обработки. DQT ####################################
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер DQT</b> - Задает одну или более таблиц квантования. 0xFFDB</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xDC){//DNL #####.
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> <b>DNL</b> - Определение числа линий 0xFFDC</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xDD){//DRI #####.
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> <b>DRI</b>(Длина 4 байта, 2 байта за маркером указывают размер который всегда должен быть равен 4. 2 байта на указание размера и 2 байта на данные.) - Указывает длину рестарт-интервала. 0xFFDD</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
								flag_DRI = true;
							}else if(byte_02 == 0xDE){//DHP
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> DHP - Определение иерархической прогрессии. 0xFFDE</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xDF){//EXP
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> EXP - Раскрытие справочных компонент. 0xFFDF</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 >= 0xE0 && byte_02 <= 0xEF){//APPn #####.
								in_table("<tr style='background-color: #ccc;'><td colspan='3' style='max-width: 200px;'><b style='font-size: x-large;'>Маркер</b> <b>APPn</b>(Стандартно APP0 формат JFIF)(APP0 - APP15) - Используется программами для хранения методанных 0xFFEn. По соглашению; программы, которые создают маркеры АРРn, сохраняют свое имя (заканчивающееся нулем) в начале маркера. Данный маркет APP"+(byte_02 - 0xE0)+"(0xFF"+byte_02.toString(16).toUpperCase()+")</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 >= 0xF0 && byte_02 <= 0xFD){//JPGn
								let string_byte_02 = byte_02.toString(16).toUpperCase();
								if(string_byte_02.length == 1)string_byte_02 = "0"+string_byte_02;
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> JPGn(JPG0 - JPG13) - Резерв для последующих расширений формата JPEG с 0xFFF0 до 0xFFFD включительно. Конкретный маркер 0xFF"+string_byte_02+"</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else if(byte_02 == 0xFE){//COM #####.
								in_table("<tr style='background-color: #ccc;'><td colspan='3'><b style='font-size: x-large;'>Маркер</b> <b>COM</b> - Содержит текст комментария. 0xFFFE</td></tr>");
								length_byte = 2;
								flag_jepg_size = true;
							}else{
								let string_byte_02 = byte_02.toString(16).toUpperCase();
								if(string_byte_02.length == 1)string_byte_02 = "0"+string_byte_02;
								in_table("<tr style='background-color: #ccc; color: #f00;'><td colspan='3'>Похоже неизвестный маркер "+view.getUint8(i).toString(16).toUpperCase()+" "+string_byte_02+"</td></tr>","f00");
								length_byte = 2;
							}
						}
					}
					
					if(flag_jepg_size && length_byte == 0){
						size_block = view.getUint16(i);
						size_block -= 2;
						in_table("<tr style='background-color: #ccc;'><td colspan='3' style='max-width: 200px;'>Размер блока "+size_block+" байт, Указанная длинна "+(size_block + 2)+"(0x"+(size_block + 2).toString(16).toUpperCase()+") байт включает в себя и два своих байта длины.</td></tr>","080");
						length_byte = 2;
						flag_jepg_size = false;
						flag_jepg_block = true;
					}
					if(flag_jepg_block && length_byte == 0){
						in_table("<tr style='background-color: #ccc;'><td colspan='3'>Блок размером "+size_block+"(0x"+size_block.toString(16).toUpperCase()+") байт</td></tr>","0f0");
						length_byte = size_block;
						flag_jepg_block = false;
						flag_input_block = true;
					}
					
					if(length_byte == 0){
						if(flag_SOS){
							in_table("<tr style='background-color: #ccc; color: #00f;'><td colspan='3'>Данные для сканирования(закодированное изображение).</td></tr>");
						}else{
							in_table("<tr style='background-color: #ccc; color: #a00;'><td colspan='3'>Непонятно что внутри jpeg</td></tr>","b80");
						}
					}
				}
				
				
				
				
				length_byte--;
				
				if(i % 16 == 0){
					let str = (i/16).toString(16).toUpperCase()+"0";
					str = ('000000' + str).slice(-8);
					td_offset += str+"<br>";
				}else if(i % 8 == 0){
					td_byte += "&nbsp;";
				}
				let index = view.getUint8(i);
				//##################################################################
				//Формирование таблиц Хофммана. Обработка данных DHT 0xFFC4
				if(uint8_marker == 0xC4 && flag_input_block){
					arr_data_block.push(index);
					if(length_byte == 0)this.create_DHT(arr_data_block);
				}
				if(flag_input_block && length_byte == 0){
					flag_input_block = false;
					arr_data_block.length = 0;
				}
				//##################################################################
				let str = index.toString(16).toUpperCase();
				if(str.length == 1)str = "0"+str;
				td_byte += "&nbsp;"+str;
				if(index < 32 || index == 127)index = 160;
				let str_char = "&#"+index+";";
				td_text += str_char;
				
				i++;
				if(i % 16 == 0){
					td_byte += "&nbsp;<br>";
					td_text += "<br>";
				}
			}
			
			td_offset += "</td>";
			td_byte += "</td>";
			td_text += "</td>";
			text_table += td_offset+td_byte+td_text+"</tr>";
			text_table += "</table>";
			
			this.span_2.innerHTML = text_table;
			//this.span_3.innerHTML = "";//С права от таблицы
		}.bind(this);
		//reader.readAsText(this.file);
		//reader.readAsDataURL(this.file);
		//reader.readAsBinaryString(this.file);
		reader.readAsArrayBuffer(this.file);
	}.bind(this);
	
}

var go = new Hex_View_JPEG();

function f_load(){
	var input = document.createElement("input");
	input.setAttribute("type", "file");
	input.setAttribute("multiple", "");
	input.setAttribute("onchange", "go.f_files(this.files)");
	input.click();
}
