function Manager_tracks(){
	let t_gpx;
	let menu = document.getElementById("content_tracks");
	let b_load = document.getElementById("track_load");
	
	// Ссылки на доккументацию GPX.
	let url_gpx = "https://www.topografix.com/GPX/1/1/";
	let schema_a = "<a href='"+url_gpx+"#SchemaProperties' target='_blank'>SchemaProperties</a>";
	let gpx_a = "<a href='"+url_gpx+"#type_gpxType' target='_blank'>gpxType</a>";
	let metadata_a = "<a href='"+url_gpx+"#type_metadataType' target='_blank'>metadataType</a>";
	let author_a = "<a href='"+url_gpx+"#type_personType' target='_blank'>author(personType)</a>";
	let email_a = "<a href='"+url_gpx+"#type_emailType' target='_blank'>emailType</a>";
	let link_a = "<a href='"+url_gpx+"#type_linkType' target='_blank'>linkType</a>";
	let copyright_a = "<a href='"+url_gpx+"#type_copyrightType' target='_blank'>copyrightType</a>";
	let bounds_a = "<a href='"+url_gpx+"#type_boundsType' target='_blank'>boundsType</a>";
	let extensions_a = "<a href='"+url_gpx+"#type_extensionsType' target='_blank'>extensionsType</a>";
	let wpt_a = "<a href='"+url_gpx+"#type_wptType' target='_blank'>wptType</a>";
	let rte_a = "<a href='"+url_gpx+"#type_rteType' target='_blank'>rteType</a>";
	let trk_a = "<a href='"+url_gpx+"#type_trkType' target='_blank'>trkType</a>";
	let trkseg_a = "<a href='"+url_gpx+"#type_trksegType' target='_blank'>trksegType</a>";
	//
	let lat_a = "<a href='"+url_gpx+"#type_latitudeType' target='_blank'>latitudeType</a>";
	let lon_a = "<a href='"+url_gpx+"#type_longitudeType' target='_blank'>longitudeType</a>";
	let deg_a = "<a href='"+url_gpx+"#type_degreesType' target='_blank'>degreesType</a>";
	let fix_a = "<a href='"+url_gpx+"#type_fixType' target='_blank'>fixType</a>";
	let dgpsid_a = "<a href='"+url_gpx+"#type_dgpsStationType' target='_blank'>dgpsStationType</a>";
	
	
	// Информация о загрузки
	let b_i_load = document.getElementById("info_load");
	b_i_load.style.display = "none";
	let i_load_s = document.getElementById("info_load_sing");
	//i_load_s.style.color = "#0c0";//"#ff5050";
	let info_out_b = createElement("span", ["class", "info_out_b"]);//, ["style", "width:: "+document.documentElement.clientWidth+"px; height:"+document.documentElement.clientHeight+"px;"]);
	let info_out_t = createElement("span", ["class", "info_out_t"]);
	let info_out = createElement("span");
	info_out.append(info_out_b);
	info_out.append(info_out_t);
	b_i_load.onclick = () => {
		document.body.append(info_out);
	};
	let flag_m_i = true;
	info_out.onmousedown = e => {
		flag_m_i = e.target.className !== "";
	};
	info_out.onmouseup = e => {
		if(flag_m_i && e.target.className !== "")document.body.removeChild(info_out);
	};
	let f_error_out = (f_n, t, flag = true) => {
		if(flag)i_load_s.style.color = "#ff5050";
		info_out_t.insertAdjacentHTML('beforeend', "<br><b>"+f_n+":</b><span style='color:"+(flag ? "#ff5050": "green")+";'> "+t+"</span>");
	};
	
	// for TESTS
	let test_out = document.getElementById("test_out");
	
	// Загрузка треков.
	let input_file_gpx = createElement("input", ["type", "file"], ["multiple", ""]);
	
	
	//input_file_gpx.onchange = () => {for(let i = 0; i < input_file_gpx.files.length; i++)input_file_gpx.files[i].text().then(value => {alert(value);});};
	
	let pos_file = 0;// позиция для последовательного чтения данных из файла(текста).
	// Функция заполнения декларации xml
	let r_declaration = /^\s*(<\?xml[^\?]*\?>)/i;
	let f_declaration = (obj) => {
		let result = r_declaration.exec(t_gpx);
		if(result !== null){
			pos_file = result[0].length;
			let arr = /version\s*=\s*('|")(.*?)\1/ims.exec(result[1]);
			if(arr !== null)obj.dop.v = arr[2];
			arr = /encoding\s*=\s*('|")(.*?)\1/ims.exec(result[1]);
			if(arr !== null)obj.dop.en = arr[2];
			arr = /standalone\s*=\s*('|")(.*?)\1/ims.exec(result[1]);
			if(arr !== null)obj.dop.st = arr[2];
		}
		
	};
	// Функция нахождения тега gpx и его атрибутов.
	let f_tag_gpx = (obj) => {
		
		
	};
	// Парсер gpx. Текстовый.
	let parser_gpx_T = (file, t) => {
		t_gpx = t;// Чтоб каждый раз в функции не передавать по значению.
		pos_file = 0;
		let obj = {};// Объект трека, в котором все данные трека, и который будет добавлен в массив треков.
		obj.dop = {// данные трека не относящиеся напрямую к самому треку.
			//d:null,// Знаков после запятой, при сохранении будет обрезать координаты, если не undefined
			n:file.name,// Имя файла.
			s:file.size// Размер файла.
		};
		// Заполняем декларацию xml. obj.declaration = {version, encoding, standalone} || null
		f_declaration(obj);
		//alert("pos = "+pos_file+"\nversion = "+obj.dop.v+"\nencoding = "+obj.dop.en+"\nstandalone = "+obj.dop.st);// для тестов.
		
		// МЕТОД РАБОТЫ С ТЕКСТОМ возможно пригодится для оптимизации.
		
		// Находим открывающий тег gpx, и его атрибуты, если открывающий сразу и закрывающий то остонавливаем загрузку, или можно загрузить несколько корневых тегов?.
		f_tag_gpx(obj);
		
	};
	
	
	// Функции для разбора элементов gpx.
	// Функции типов.
	f_lat = t => {// Широта точки. Десятичные градусы, датум WGS84. // -90.0 <= value <= 90.0
		let n = parseFloat(t);
		if(isFinite(n) && -90 <= n && n <= 90)return n;
		else return undefined;
	};
	f_lon = t => {// Долгота точки. Десятичные градусы, датум WGS84. // -180.0 <= value < 180.0
		let n = parseFloat(t);
		if(isFinite(n)){
			n %= 360;
			if(n >= 180)n -= 360;
			else if(n < -180)n += 360;
			return n;
		}else return undefined;
	};
	
	
	let f_metadata, f_wpt, f_rte, f_trk, f_extensions;// Основные, Функции для разбора элементов gpx.
	let f_trkseg, f_copyright, f_link, f_email, f_author/* personType */, f_bounds;// Дополнительные функции для разбора элементов gpx.
	//let f_pt, f_ptseg;// Редкие для использования в других схемах.
	// Основные, Функции для разбора элементов gpx.
	f_metadata = (obj, elm, name_f) => {// obj.gpx.metadata. // Информация о файле GPX, авторе и ограничениях авторских прав находится в разделе метаданных. Предоставление обширной и содержательной информации о ваших файлах GPX позволяет другим искать и использовать ваши данные GPS. 
		// Заполняем metadata.
		let i_sequence = 0;// следим за последовательностью.
		let i = 0;
		while(i < elm.children.length){
			if(elm.children[i].tagName === "name"){// Имя файла GPX.
				if(obj.name === undefined){
					if(i_sequence > 0)f_error_out(name_f, "Нарушена последовательность в metadata элементом name "+metadata_a);
					obj.name = elm.children[i].textContent;
				}else f_error_out(name_f, "В metadata недопустимо больше одного тега name "+metadata_a);
			}else if(elm.children[i].tagName === "desc"){// Описание содержимого файла GPX. 
				if(obj.desc === undefined){
					if(i_sequence > 1)f_error_out(name_f, "Нарушена последовательность в metadata элементом desc "+metadata_a);
					else i_sequence = 1;
					obj.desc = elm.children[i].textContent;
				}else f_error_out(name_f, "В metadata недопустимо больше одного тега desc "+metadata_a);
			}else if(elm.children[i].tagName === "author"){// Человек или организация, создавшие файл GPX.
				if(obj.author === undefined){
					if(i_sequence > 2)f_error_out(name_f, "Нарушена последовательность в metadata элементом author "+metadata_a);
					else i_sequence = 2;
					obj.author = {};
					f_author(obj.author, elm.children[i], name_f);
				}else f_error_out(name_f, "В metadata недопустимо больше одного тега author "+metadata_a);
			}else if(elm.children[i].tagName === "copyright"){// Информация об авторских правах и лицензиях, регулирующих использование файла. 
				if(obj.copyright === undefined){
					if(i_sequence > 3)f_error_out(name_f, "Нарушена последовательность в metadata элементом copyright "+metadata_a);
					else i_sequence = 3;
					let copyright = f_copyright(elm.children[i], name_f);
					if(copyright !== undefined)obj.copyright = copyright;
				}else f_error_out(name_f, "В metadata недопустимо больше одного тега copyright "+metadata_a);
			}else if(elm.children[i].tagName === "link"){// URL-адреса, связанные с местоположением, описанным в файле.
				if(i_sequence > 4)f_error_out(name_f, "Нарушена последовательность в metadata элементом link "+metadata_a);
				else i_sequence = 4;
				let link = f_link(elm.children[i], name_f);
				if(link !== undefined){
					if(obj.links === undefined)obj.links = [];// Массив.
					obj.links.push(link);
				}
			}else if(elm.children[i].tagName === "time"){// Дата создания файла.
				if(obj.time === undefined){
					if(i_sequence > 5)f_error_out(name_f, "Нарушена последовательность в metadata элементом time "+metadata_a);
					else i_sequence = 5;
					obj.time = elm.children[i].textContent;
				}else f_error_out(name_f, "В metadata недопустимо больше одного тега time "+metadata_a);
			}else if(elm.children[i].tagName === "keywords"){// Ключевые слова, связанные с файлом. Поисковые системы или базы данных могут использовать эту информацию для классификации данных.
				if(obj.keywords === undefined){
					if(i_sequence > 6)f_error_out(name_f, "Нарушена последовательность в metadata элементом keywords "+metadata_a);
					else i_sequence = 6;
					obj.keywords = elm.children[i].textContent;
				}else f_error_out(name_f, "В metadata недопустимо больше одного тега keywords "+metadata_a);
			}else if(elm.children[i].tagName === "bounds"){// Минимальные и максимальные координаты, которые описывают размер координат в файле.
				if(obj.bounds === undefined){
					if(i_sequence > 7)f_error_out(name_f, "Нарушена последовательность в metadata элементом bounds "+metadata_a);
					else i_sequence = 7;
					let bounds = f_bounds(elm.children[i], name_f);
					if(bounds !== undefined)obj.bounds = bounds;
				}else f_error_out(name_f, "В metadata недопустимо больше одного тега bounds "+metadata_a);
			}else if(elm.children[i].tagName === "extensions"){// Вы можете добавить расширение GPX, добавив сюда свои собственные элементы из другой схемы.
				if(obj.extensions === undefined){
					/* По логики ни когда не должно происходить.
					if(i_sequence > 8)f_error_out(name_f, "Нарушена последовательность в metadata элементом extensions "+metadata_a);
					else */
					i_sequence = 8;
					obj.extensions = f_extensions(elm.children[i], name_f);
				}else f_error_out(name_f, "В metadata недопустимо больше одного тега extensions "+metadata_a);
			}else f_error_out(name_f, "Неизвестный элемент(<b>"+elm.children[i].tagName+"</b>) в metadata "+metadata_a);
			i++;
		}
	};
	f_wpt = (elm, name_f) => {// wpt представляет собой путевую точку, достопримечательность или именованный объект на карте.
		let lat, lon;
		if(elm.hasAttribute("lat")){// Широта точки. Десятичные градусы, датум WGS84.
			lat = f_lat(elm.getAttribute("lat"));
			if(lat === undefined){
				f_error_out(name_f, "В wpt атрибут lat не соответствует типу "+lat_a);
				return undefined;
			}
		}else{
			f_error_out(name_f, "В wpt отсутствует обязательный атрибут lat "+wpt_a);
			return undefined;
		}
		if(elm.hasAttribute("lon")){// Долгота точки. Десятичные градусы, датум WGS84.
			lon = f_lon(elm.getAttribute("lon"));
			if(lon === undefined){
				f_error_out(name_f, "В wpt атрибут lon не соответствует типу "+lon_a);
				return undefined;
			}
		}else{
			f_error_out(name_f, "В wpt отсутствует обязательный атрибут lon "+wpt_a);
			return undefined;
		}
		let obj = {lat:lat, lon:lon};
		// Заполняем wpt.
		let i_sequence = 0;// следим за последовательностью.
		let i = 0;
		while(i < elm.children.length){
			if(elm.children[i].tagName === "ele"){// Высота (в метрах) точки.
				if(obj.ele === undefined){
					if(i_sequence > 0)f_error_out(name_f, "Нарушена последовательность в wpt элементом ele "+wpt_a);
					let ele = elm.children[i].textContent;
					let n = parseFloat(ele);
					if(isFinite(n))obj.ele = n;
					else{
						obj.ele = ele;
						f_error_out(name_f, "В wpt тег ele не соответствует числу(decimal) "+wpt_a);
					}
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега ele "+wpt_a);
			}else if(elm.children[i].tagName === "time"){// Отметка времени создания / модификации элемента. Дата и время указаны в универсальном координированном времени (UTC), а не по местному времени! Соответствует спецификации ISO 8601 для представления даты / времени. Дробные секунды разрешены для миллисекундного отсчета времени в журналах.
				if(obj.time === undefined){
					if(i_sequence > 1)f_error_out(name_f, "Нарушена последовательность в wpt элементом time "+wpt_a);
					else i_sequence = 1;
					obj.time = elm.children[i].textContent;
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега time "+wpt_a);
			}else if(elm.children[i].tagName === "magvar"){// Магнитное отклонение (в градусах) в точке.
				if(obj.magvar === undefined){
					if(i_sequence > 2)f_error_out(name_f, "Нарушена последовательность в wpt элементом magvar "+wpt_a);
					else i_sequence = 2;
					let magvar = elm.children[i].textContent;
					let n = parseFloat(magvar);
					if(isFinite(n) && n >= 0 && n < 360)obj.magvar = n;
					else{
						obj.magvar = magvar;
						f_error_out(name_f, "В wpt тег magvar не соответствует числу(decimal) 0 <= magvar < 360 "+deg_a);
					}
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега magvar "+wpt_a);
			}else if(elm.children[i].tagName === "geoidheight"){// Высота (в метрах) геоида (средний уровень моря) над земным эллипсоидом WGS84. Как определено в сообщении NMEA GGA.
				if(obj.geoidheight === undefined){
					if(i_sequence > 3)f_error_out(name_f, "Нарушена последовательность в wpt элементом geoidheight "+wpt_a);
					else i_sequence = 3;
					let geoidheight = elm.children[i].textContent;
					let n = parseFloat(geoidheight);
					if(isFinite(n))obj.geoidheight = n;
					else{
						obj.geoidheight = geoidheight;
						f_error_out(name_f, "В wpt тег geoidheight не соответствует числу(decimal) "+wpt_a);
					}
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега geoidheight "+wpt_a);
			}else if(elm.children[i].tagName === "name"){// GPS-имя путевой точки. Это поле будет передано в GPS и обратно. GPX не накладывает ограничений на длину этого поля или содержащихся в нем символов. Принимающее приложение должно проверить поле перед его отправкой в GPS.
				if(obj.name === undefined){
					if(i_sequence > 4)f_error_out(name_f, "Нарушена последовательность в wpt элементом name "+wpt_a);
					else i_sequence = 4;
					obj.name = elm.children[i].textContent;
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега name "+wpt_a);
			}else if(elm.children[i].tagName === "cmt"){// Комментарий к путевой точке GPS. Отправлено в GPS как комментарий.
				if(obj.cmt === undefined){
					if(i_sequence > 5)f_error_out(name_f, "Нарушена последовательность в wpt элементом cmt "+wpt_a);
					else i_sequence = 5;
					obj.cmt = elm.children[i].textContent;
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега cmt "+wpt_a);
			}else if(elm.children[i].tagName === "desc"){// Текстовое описание элемента. Содержит дополнительную информацию об элементе, предназначенном для пользователя, а не GPS.
				if(obj.desc === undefined){
					if(i_sequence > 6)f_error_out(name_f, "Нарушена последовательность в wpt элементом desc "+wpt_a);
					else i_sequence = 6;
					obj.desc = elm.children[i].textContent;
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега desc "+wpt_a);
			}else if(elm.children[i].tagName === "src"){// Источник данных. Включено, чтобы дать пользователю некоторое представление о надежности и точности данных. Например «Garmin eTrex», «квадроцикл USGS Boston North».
				if(obj.src === undefined){
					if(i_sequence > 7)f_error_out(name_f, "Нарушена последовательность в wpt элементом src "+wpt_a);
					else i_sequence = 7;
					obj.src = elm.children[i].textContent;
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега src "+wpt_a);
			}else if(elm.children[i].tagName === "link"){// Ссылка на дополнительную информацию о путевой точке.
				if(i_sequence > 8)f_error_out(name_f, "Нарушена последовательность в wpt элементом link "+wpt_a);
				else i_sequence = 8;
				let link = f_link(elm.children[i], name_f);
				if(link !== undefined){
					if(obj.links === undefined)obj.links = [];// Массив.
					obj.links.push(link);
				}
			}else if(elm.children[i].tagName === "sym"){// Текст названия символа GPS. Для обмена с другими программами используйте точное написание символа, отображаемое на GPS. Если GPS сокращает слова, произносите их по буквам.
				if(obj.sym === undefined){
					if(i_sequence > 9)f_error_out(name_f, "Нарушена последовательность в wpt элементом sym "+wpt_a);
					else i_sequence = 9;
					obj.sym = elm.children[i].textContent;
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега sym "+wpt_a);
			}else if(elm.children[i].tagName === "type"){// Тип (классификация) путевой точки.
				if(obj.type === undefined){
					if(i_sequence > 10)f_error_out(name_f, "Нарушена последовательность в wpt элементом type "+wpt_a);
					else i_sequence = 10;
					obj.type = elm.children[i].textContent;
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега type "+wpt_a);
			}else if(elm.children[i].tagName === "fix"){// Тип исправления GPX.
				if(obj.fix === undefined){
					if(i_sequence > 11)f_error_out(name_f, "Нарушена последовательность в wpt элементом fix "+wpt_a);
					else i_sequence = 11;
					let fix = elm.children[i].textContent;
					if(/^none|2d|3d|dgps|pps$/.test(fix))f_error_out(name_f, "Значение в fix не соответствует {'none'|'2d'|'3d'|'dgps'|'pps'} "+fix_a);
					obj.fix = fix;
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега fix "+wpt_a);
			}else if(elm.children[i].tagName === "sat"){// Количество спутников, используемых для расчета местоположения GPX.
				if(obj.sat === undefined){
					if(i_sequence > 12)f_error_out(name_f, "Нарушена последовательность в wpt элементом sat "+wpt_a);
					else i_sequence = 12;
					let sat = elm.children[i].textContent;
					let n = parseFloat(sat);
					if(isFinite(n) && n >= 0 && n % 1 === 0)obj.sat = n;
					else{
						obj.sat = sat;
						f_error_out(name_f, "Значение в sat не соответствует nonNegativeInteger "+wpt_a);
					}
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега sat "+wpt_a);
			}else if(elm.children[i].tagName === "hdop"){// Горизонтальное снижение точности.
				if(obj.hdop === undefined){
					if(i_sequence > 13)f_error_out(name_f, "Нарушена последовательность в wpt элементом hdop "+wpt_a);
					else i_sequence = 13;
					let hdop = elm.children[i].textContent;
					let n = parseFloat(hdop);
					if(isFinite(n))obj.hdop = n;
					else{
						obj.hdop = hdop;
						f_error_out(name_f, "В wpt тег hdop не соответствует числу(decimal) "+wpt_a);
					}
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега hdop "+wpt_a);
			}else if(elm.children[i].tagName === "vdop"){// Вертикальное снижение точности.
				if(obj.vdop === undefined){
					if(i_sequence > 14)f_error_out(name_f, "Нарушена последовательность в wpt элементом vdop "+wpt_a);
					else i_sequence = 14;
					let vdop = elm.children[i].textContent;
					let n = parseFloat(vdop);
					if(isFinite(n))obj.vdop = n;
					else{
						obj.vdop = vdop;
						f_error_out(name_f, "В wpt тег vdop не соответствует числу(decimal) "+wpt_a);
					}
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега vdop "+wpt_a);
			}else if(elm.children[i].tagName === "pdop"){// Снижение точности позиционирования.
				if(obj.pdop === undefined){
					if(i_sequence > 15)f_error_out(name_f, "Нарушена последовательность в wpt элементом pdop "+wpt_a);
					else i_sequence = 15;
					let pdop = elm.children[i].textContent;
					let n = parseFloat(pdop);
					if(isFinite(n))obj.pdop = n;
					else{
						obj.pdop = pdop;
						f_error_out(name_f, "В wpt тег pdop не соответствует числу(decimal) "+wpt_a);
					}
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега pdop "+wpt_a);
			}else if(elm.children[i].tagName === "ageofdgpsdata"){// Количество секунд с момента последнего обновления DGPS.
				if(obj.ageofdgpsdata === undefined){
					if(i_sequence > 16)f_error_out(name_f, "Нарушена последовательность в wpt элементом ageofdgpsdata "+wpt_a);
					else i_sequence = 16;
					let ageofdgpsdata = elm.children[i].textContent;
					let n = parseFloat(ageofdgpsdata);
					if(isFinite(n))obj.ageofdgpsdata = n;
					else{
						obj.ageofdgpsdata = ageofdgpsdata;
						f_error_out(name_f, "В wpt тег ageofdgpsdata не соответствует числу(decimal) "+wpt_a);
					}
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега ageofdgpsdata "+wpt_a);
			}else if(elm.children[i].tagName === "dgpsid"){// ID станции DGPS, используемой в дифференциальной коррекции.
				if(obj.dgpsid === undefined){
					if(i_sequence > 17)f_error_out(name_f, "Нарушена последовательность в wpt элементом dgpsid "+wpt_a);
					else i_sequence = 17;
					let dgpsid = elm.children[i].textContent;
					let n = parseFloat(dgpsid);
					if(isFinite(n) && n >= 0 && n <= 1023 && n % 1 === 0)obj.dgpsid = n;
					else{
						obj.dgpsid = dgpsid;
						f_error_out(name_f, "Значение в dgpsid не соответствует, 0 <= dgpsid <= 1023 "+dgpsid_a);
					}
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега dgpsid "+wpt_a);
			}else if(elm.children[i].tagName === "extensions"){// Вы можете добавить расширение GPX, добавив сюда свои собственные элементы из другой схемы.
				if(obj.extensions === undefined){
					/* По логики ни когда не должно происходить.
					if(i_sequence > 18)f_error_out(name_f, "Нарушена последовательность в wpt элементом extensions "+wpt_a);
					else */
					i_sequence = 18;
					obj.extensions = f_extensions(elm.children[i], name_f);
				}else f_error_out(name_f, "В wpt недопустимо больше одного тега extensions "+wpt_a);
			}else f_error_out(name_f, "Неизвестный элемент(<b>"+elm.children[i].tagName+"</b>) в wpt "+wpt_a);
			i++;
		}
		return obj;
	};
	f_rte = (elm, name_f) => {// rte представляет маршрут - упорядоченный список путевых точек, представляющий серию точек поворота, ведущих к пункту назначения.
		let obj = {};
		// Заполняем rte.
		let i_sequence = 0;// следим за последовательностью.
		let i = 0;
		while(i < elm.children.length){
			if(elm.children[i].tagName === "name"){// GPS-название маршрута.
				if(obj.name === undefined){
					if(i_sequence > 0)f_error_out(name_f, "Нарушена последовательность в rte элементом name "+rte_a);
					obj.name = elm.children[i].textContent;
				}else f_error_out(name_f, "В rte недопустимо больше одного тега name "+rte_a);
			}else if(elm.children[i].tagName === "cmt"){// Комментарий GPS для маршрута.
				if(obj.cmt === undefined){
					if(i_sequence > 1)f_error_out(name_f, "Нарушена последовательность в rte элементом cmt "+rte_a);
					else i_sequence = 1;
					obj.cmt = elm.children[i].textContent;
				}else f_error_out(name_f, "В rte недопустимо больше одного тега cmt "+rte_a);
			}else if(elm.children[i].tagName === "desc"){// Текстовое описание маршрута для пользователя. Не отправляется в GPS.
				if(obj.desc === undefined){
					if(i_sequence > 2)f_error_out(name_f, "Нарушена последовательность в rte элементом desc "+rte_a);
					else i_sequence = 2;
					obj.desc = elm.children[i].textContent;
				}else f_error_out(name_f, "В rte недопустимо больше одного тега desc "+rte_a);
			}else if(elm.children[i].tagName === "src"){// Источник данных. Включено, чтобы дать пользователю некоторое представление о надежности и точности данных.
				if(obj.src === undefined){
					if(i_sequence > 3)f_error_out(name_f, "Нарушена последовательность в rte элементом src "+rte_a);
					else i_sequence = 3;
					obj.src = elm.children[i].textContent;
				}else f_error_out(name_f, "В rte недопустимо больше одного тега src "+rte_a);
			}else if(elm.children[i].tagName === "link"){// Ссылки на внешнюю информацию о маршруте.
				if(i_sequence > 4)f_error_out(name_f, "Нарушена последовательность в rte элементом link "+rte_a);
				else i_sequence = 4;
				let link = f_link(elm.children[i], name_f);
				if(link !== undefined){
					if(obj.links === undefined)obj.links = [];// Массив.
					obj.links.push(link);
				}
			}else if(elm.children[i].tagName === "number"){// Номер маршрута GPS.
				if(obj.number === undefined){
					if(i_sequence > 5)f_error_out(name_f, "Нарушена последовательность в rte элементом number "+rte_a);
					else i_sequence = 5;
					let number = elm.children[i].textContent;
					let n = parseFloat(number);
					if(isFinite(n) && n >= 0 && n % 1 === 0)obj.number = n;
					else{
						obj.number = number;
						f_error_out(name_f, "Значение в number не соответствует nonNegativeInteger "+rte_a);
					}
				}else f_error_out(name_f, "В rte недопустимо больше одного тега number "+rte_a);
			}else if(elm.children[i].tagName === "type"){// Тип (классификация) маршрута.
				if(obj.type === undefined){
					if(i_sequence > 6)f_error_out(name_f, "Нарушена последовательность в rte элементом type "+rte_a);
					else i_sequence = 6;
					obj.type = elm.children[i].textContent;
				}else f_error_out(name_f, "В rte недопустимо больше одного тега type "+rte_a);
			}else if(elm.children[i].tagName === "extensions"){// Вы можете добавить расширение GPX, добавив сюда свои собственные элементы из другой схемы.
				if(obj.extensions === undefined){
					if(i_sequence > 7)f_error_out(name_f, "Нарушена последовательность в rte элементом extensions "+rte_a);
					else i_sequence = 7;
					obj.extensions = f_extensions(elm.children[i], name_f);
				}else f_error_out(name_f, "В rte недопустимо больше одного тега extensions "+rte_a);
			}else if(elm.children[i].tagName === "rtept"){// Список точек маршрута.
				/* По логики ни когда не должно происходить.
				if(i_sequence > 8)f_error_out(name_f, "Нарушена последовательность в rte элементом rtept "+rte_a);
				else */
				i_sequence = 8;
				let rtept = f_wpt(elm.children[i], name_f);
				if(rtept !== undefined){
					if(obj.rtepts === undefined){
						obj.rtepts = [];// Массив.
						obj.rtepts_WM = [];// Массив. для ускоренного доступа к точкам в Веб Меркаторе.
					}
					obj.rtepts.push(rtept);
					obj.rtepts_WM.push(from_wgs_84([toRad(rtept.lon), toRad(rtept.lat)]));
				}
			}else f_error_out(name_f, "Неизвестный элемент(<b>"+elm.children[i].tagName+"</b>) в rte "+rte_a);
			i++;
		}
		if(i === 0)return undefined;
		else return obj;
	};
	f_trk = (elm, name_f) => {// trk представляет собой трек - упорядоченный список точек, описывающих путь.
		let obj = {};
		// Заполняем trk.
		let i_sequence = 0;// следим за последовательностью.
		let i = 0;
		while(i < elm.children.length){
			if(elm.children[i].tagName === "name"){// GPS-имя трека.
				if(obj.name === undefined){
					if(i_sequence > 0)f_error_out(name_f, "Нарушена последовательность в trk элементом name "+trk_a);
					obj.name = elm.children[i].textContent;
				}else f_error_out(name_f, "В trk недопустимо больше одного тега name "+trk_a);
			}else if(elm.children[i].tagName === "cmt"){// Комментарий GPS к треку.
				if(obj.cmt === undefined){
					if(i_sequence > 1)f_error_out(name_f, "Нарушена последовательность в trk элементом cmt "+trk_a);
					else i_sequence = 1;
					obj.cmt = elm.children[i].textContent;
				}else f_error_out(name_f, "В trk недопустимо больше одного тега cmt "+trk_a);
			}else if(elm.children[i].tagName === "desc"){// Пользовательское описание трека.
				if(obj.desc === undefined){
					if(i_sequence > 2)f_error_out(name_f, "Нарушена последовательность в trk элементом desc "+trk_a);
					else i_sequence = 2;
					obj.desc = elm.children[i].textContent;
				}else f_error_out(name_f, "В trk недопустимо больше одного тега desc "+trk_a);
			}else if(elm.children[i].tagName === "src"){// Источник данных. Включено, чтобы дать пользователю некоторое представление о надежности и точности данных.
				if(obj.src === undefined){
					if(i_sequence > 3)f_error_out(name_f, "Нарушена последовательность в trk элементом src "+trk_a);
					else i_sequence = 3;
					obj.src = elm.children[i].textContent;
				}else f_error_out(name_f, "В trk недопустимо больше одного тега src "+trk_a);
			}else if(elm.children[i].tagName === "link"){// Ссылки на внешнюю информацию о треке.
				if(i_sequence > 4)f_error_out(name_f, "Нарушена последовательность в trk элементом link "+trk_a);
				else i_sequence = 4;
				let link = f_link(elm.children[i], name_f);
				if(link !== undefined){
					if(obj.links === undefined)obj.links = [];// Массив.
					obj.links.push(link);
				}
			}else if(elm.children[i].tagName === "number"){// Номер трека GPS.
				if(obj.number === undefined){
					if(i_sequence > 5)f_error_out(name_f, "Нарушена последовательность в trk элементом number "+trk_a);
					else i_sequence = 5;
					let number = elm.children[i].textContent;
					let n = parseFloat(number);
					if(isFinite(n) && n >= 0 && n % 1 === 0)obj.number = n;
					else{
						obj.number = number;
						f_error_out(name_f, "Значение в number не соответствует nonNegativeInteger "+trk_a);
					}
				}else f_error_out(name_f, "В trk недопустимо больше одного тега number "+trk_a);
			}else if(elm.children[i].tagName === "type"){// Тип (классификация) трека.
				if(obj.type === undefined){
					if(i_sequence > 6)f_error_out(name_f, "Нарушена последовательность в trk элементом type "+trk_a);
					else i_sequence = 6;
					obj.type = elm.children[i].textContent;
				}else f_error_out(name_f, "В trk недопустимо больше одного тега type "+trk_a);
			}else if(elm.children[i].tagName === "extensions"){// Вы можете добавить расширение GPX, добавив сюда свои собственные элементы из другой схемы.
				if(obj.extensions === undefined){
					if(i_sequence > 7)f_error_out(name_f, "Нарушена последовательность в trk элементом extensions "+trk_a);
					else i_sequence = 7;
					obj.extensions = f_extensions(elm.children[i], name_f);
				}else f_error_out(name_f, "В trk недопустимо больше одного тега extensions "+trk_a);
			}else if(elm.children[i].tagName === "trkseg"){// Сегмент трека содержит список точек трека, которые логически связаны по порядку. Чтобы представить один трек GPS, на котором был потерян прием GPS или приемник GPS был выключен, запустите новый сегмент трека для каждого непрерывного диапазона данных трека.
				/* По логики ни когда не должно происходить.
				if(i_sequence > 8)f_error_out(name_f, "Нарушена последовательность в trk элементом rtept "+trk_a);
				else */
				i_sequence = 8;
				let trkseg = f_trkseg(elm.children[i], name_f);
				if(trkseg !== undefined){
					if(obj.trksegs === undefined)obj.trksegs = [];// Массив.
					obj.trksegs.push(trkseg);
				}else f_error_out(name_f, "В trk пустой элемент trkseg "+rte_a);
			}else f_error_out(name_f, "Неизвестный элемент(<b>"+elm.children[i].tagName+"</b>) в trk "+trk_a);
			i++;
		}
		if(i === 0)return undefined;
		else return obj;
	};
	f_extensions = (elm, name_f) => {// Вы можете добавить расширение GPX, добавив сюда свои собственные элементы из другой схемы. 
		// Разрешить любые элементы из пространства имен, кроме пространства имен этой схемы (слабая проверка). [0 .. *]
		// Потом доработать подсебя. Например сохранять/загружать данные сетки.
		if(elm.textContent == "")f_error_out(name_f, "Пустой элемент extensions "+extensions_a);
		return elm.textContent;
	};
	// Дополнительные функции для разбора элементов gpx.
	f_trkseg = (elm, name_f) => {// Сегмент трека содержит список точек трека, которые логически связаны по порядку. Чтобы представить один трек GPS, на котором был потерян прием GPS или приемник GPS был выключен, запустите новый сегмент трека для каждого непрерывного диапазона данных трека.
		let obj = {};
		// Заполняем trkseg.
		let i_sequence = 0;// следим за последовательностью.
		let i = 0;
		while(i < elm.children.length){
			if(elm.children[i].tagName === "trkpt"){// Точка трека содержит координаты, высоту, отметку времени и метаданные для одной точки трека.
				if(i_sequence > 0)f_error_out(name_f, "Нарушена последовательность в trkseg элементом trkpt "+trkseg_a);
				let trkpt = f_wpt(elm.children[i], name_f);
				if(trkpt !== undefined){
					if(obj.trkpts === undefined){
						obj.trkpts = [];// Массив.
						obj.trkpts_WM = [];// Массив. для ускоренного доступа к точкам в Веб Меркаторе.
					}
					obj.trkpts.push(trkpt);
					obj.trkpts_WM.push(from_wgs_84([toRad(trkpt.lon), toRad(trkpt.lat)]));
				}
			}else if(elm.children[i].tagName === "extensions"){// Вы можете добавить расширение GPX, добавив сюда свои собственные элементы из другой схемы.
				if(obj.extensions === undefined){
					/* По логики ни когда не должно происходить.
					if(i_sequence > 1)f_error_out(name_f, "Нарушена последовательность в trkseg элементом extensions "+trkseg_a);
					else */
					i_sequence = 1;
					obj.extensions = f_extensions(elm.children[i], name_f);
				}else f_error_out(name_f, "В trkseg недопустимо больше одного тега extensions "+trkseg_a);
			}else f_error_out(name_f, "Неизвестный элемент(<b>"+elm.children[i].tagName+"</b>) в trkseg "+trkseg_a);
			i++;
		}
		if(i === 0)return undefined;
		else return obj;
	};
	f_bounds = (elm, name_f) => {// Электронный адрес. Разделен на две части (идентификатор и домен), чтобы предотвратить сбор электронной почты. 
		let minlat, minlon, maxlat, maxlon;
		if(elm.hasAttribute("minlat")){
			minlat = f_lat(elm.getAttribute("minlat"));
			if(minlat === undefined){
				f_error_out(name_f, "В bounds атрибут minlat не соответствует типу "+lat_a);
				return undefined;
			}
		}else{
			f_error_out(name_f, "В bounds отсутствует обязательный атрибут minlat "+bounds_a);
			return undefined;
		}
		if(elm.hasAttribute("minlon")){
			minlon = f_lon(elm.getAttribute("minlon"));
			if(minlon === undefined){
				f_error_out(name_f, "В bounds атрибут minlon не соответствует типу "+lon_a);
				return undefined;
			}
		}else{
			f_error_out(name_f, "В bounds отсутствует обязательный атрибут minlon "+bounds_a);
			return undefined;
		}
		if(elm.hasAttribute("maxlat")){
			maxlat = f_lat(elm.getAttribute("maxlat"));
			if(maxlat === undefined){
				f_error_out(name_f, "В bounds атрибут maxlat не соответствует типу "+lat_a);
				return undefined;
			}
		}else{
			f_error_out(name_f, "В bounds отсутствует обязательный атрибут maxlat "+bounds_a);
			return undefined;
		}
		if(elm.hasAttribute("maxlon")){
			maxlon = f_lon(elm.getAttribute("maxlon"));
			if(maxlon === undefined){
				f_error_out(name_f, "В bounds атрибут maxlon не соответствует типу "+lon_a);
				return undefined;
			}
		}else{
			f_error_out(name_f, "В bounds отсутствует обязательный атрибут maxlon "+bounds_a);
			return undefined;
		}
		return {minlat:minlat, minlon:minlon, maxlat:maxlat, maxlon:maxlon};
	};
	f_copyright = (elm, name_f) => {// Информация о владельце авторских прав и лицензии, регулирующие использование этого файла. Установив ссылку на соответствующую лицензию, вы можете разместить свои данные в открытом доступе или предоставить дополнительные права на использование. 
		let obj;
		if(elm.hasAttribute("author")){
			obj = {};
			obj.author = elm.getAttribute("author");// Правообладатель (TopoSoft, Inc.).
		}else{
			f_error_out(name_f, "В copyright отсутствует обязательный атрибут author "+copyright_a);
			return undefined;
		}
		// Заполняем copyright.
		let i_sequence = 0;// следим за последовательностью.
		let i = 0;
		while(i < elm.children.length){
			if(elm.children[i].tagName === "year"){// Год авторских прав.
				if(obj.year === undefined){
					if(i_sequence > 0)f_error_out(name_f, "Нарушена последовательность в copyright элементом year "+copyright_a);
					obj.year = elm.children[i].textContent;
				}else f_error_out(name_f, "В copyright недопустимо больше одного тега year "+copyright_a);
			}else if(elm.children[i].tagName === "license"){// Ссылка на внешний файл, содержащий текст лицензии. 
				if(obj.license === undefined){
					if(i_sequence > 1)f_error_out(name_f, "Нарушена последовательность в copyright элементом license "+copyright_a);
					else i_sequence = 1;
					obj.license = elm.children[i].textContent;
				}else f_error_out(name_f, "В copyright недопустимо больше одного тега license "+copyright_a);
			}else f_error_out(name_f, "Неизвестный элемент(<b>"+elm.children[i].tagName+"</b>) в copyright "+copyright_a);
			i++;
		}
		return obj;
	};
	f_author = (obj, elm, name_f) => {// personType // Человек или организация.
		// Заполняем author.
		let i_sequence = 0;// следим за последовательностью.
		let i = 0;
		while(i < elm.children.length){
			if(elm.children[i].tagName === "name"){// Имя человека или организации. 
				if(obj.name === undefined){
					if(i_sequence > 0)f_error_out(name_f, "Нарушена последовательность в author элементом name "+author_a);
					obj.name = elm.children[i].textContent;
				}else f_error_out(name_f, "В author недопустимо больше одного тега name "+author_a);
			}else if(elm.children[i].tagName === "email"){
				if(obj.email === undefined){
					if(i_sequence > 1)f_error_out(name_f, "Нарушена последовательность в author элементом email "+author_a);
					else i_sequence = 1;
					let email = f_email(elm.children[i], name_f);
					if(email !== undefined)obj.email = email;
				}else f_error_out(name_f, "В author недопустимо больше одного тега email "+author_a);
			}else if(elm.children[i].tagName === "link"){// Ссылка на веб-сайт или другую внешнюю информацию о человеке. 
				if(obj.link === undefined){
					if(i_sequence > 2)f_error_out(name_f, "Нарушена последовательность в author элементом link "+author_a);
					else i_sequence = 2;
					let link = f_link(elm.children[i], name_f);
					if(link !== undefined)obj.link = link;
				}else f_error_out(name_f, "В author недопустимо больше одного тега link "+author_a);
			}else f_error_out(name_f, "Неизвестный элемент(<b>"+elm.children[i].tagName+"</b>) в author "+author_a);
			i++;
		}
		if(i === 0)f_error_out(name_f, "Пустой тег author "+author_a);
	};
	f_link = (elm, name_f) => {// Ссылка на внешний ресурс (веб-страницу, цифровое фото, видеоклип и т. Д.) С дополнительной информацией.
		let obj;
		if(elm.hasAttribute("href")){
			obj = {};
			obj.href = elm.getAttribute("href");// URL гиперссылки.
		}else{
			f_error_out(name_f, "В link отсутствует обязательный атрибут href "+link_a);
			return undefined;
		}
		// Заполняем link.
		let i_sequence = 0;// следим за последовательностью.
		let i = 0;
		while(i < elm.children.length){
			if(elm.children[i].tagName === "text"){// Текст гиперссылки.
				if(obj.text === undefined){
					if(i_sequence > 0)f_error_out(name_f, "Нарушена последовательность в link элементом text "+link_a);
					obj.text = elm.children[i].textContent;
				}else f_error_out(name_f, "В link недопустимо больше одного тега text "+link_a);
			}else if(elm.children[i].tagName === "type"){// Тип Mime контента (изображение / JPEG)
				if(obj.type === undefined){
					if(i_sequence > 1)f_error_out(name_f, "Нарушена последовательность в link элементом type "+link_a);
					else i_sequence = 1;
					obj.type = elm.children[i].textContent;
				}else f_error_out(name_f, "В link недопустимо больше одного тега type "+link_a);
			}else f_error_out(name_f, "Неизвестный элемент(<b>"+elm.children[i].tagName+"</b>) в link "+link_a);
			i++;
		}
		return obj;
	};
	f_email = (elm, name_f) => {// Электронный адрес. Разделен на две части (идентификатор и домен), чтобы предотвратить сбор электронной почты. 
		let id, domain;
		if(elm.hasAttribute("id"))id = elm.getAttribute("id");// идентификатор.
		else{
			f_error_out(name_f, "В email отсутствует обязательный атрибут id "+email_a);
			return undefined;
		}
		if(elm.hasAttribute("domain"))domain = elm.getAttribute("domain");// домен.
		else{
			f_error_out(name_f, "В email отсутствует обязательный атрибут domain "+email_a);
			return undefined;
		}
		return id+"@"+domain;
	};
	
	// Парсер gpx. по элементам DOM.
	let parser_gpx = (file, t) => {
		pos_file = 0;
		let obj = {};// Объект трека, в котором все данные трека, и который будет добавлен в массив треков.
		obj.dop = {// данные трека не относящиеся напрямую к самому треку.
			//d:null,// Знаков после запятой, при сохранении будет обрезать координаты, если не undefined
			n:file.name,// Имя файла.
			s:file.size// Размер файла.
		};
		// Заполняем декларацию xml. obj.declaration = {version, encoding, standalone} || null
		f_declaration(obj);
		//alert("pos = "+pos_file+"\nversion = "+obj.dop.v+"\nencoding = "+obj.dop.en+"\nstandalone = "+obj.dop.st);// для тестов.
		
		// МЕТОД РАБОТЫ С DOM
		
		let parser = new DOMParser();
		let xmlDoc = parser.parseFromString(t,"text/xml");
		
		// Находим корневой элемент gpx
		let tag_gpx = xmlDoc.documentElement;//xmlDoc.getElementsByTagName("gpx")[0];
		// Проверяем на соответствие, корневого элемента gpx
		if(tag_gpx.tagName === "gpx"){
			obj.gpx = {};
		}else if(tag_gpx.tagName === "parsererror"){
			f_error_out(file.name, tag_gpx.textContent);
			return;
		}else{
			f_error_out(file.name, "не верный корневой элемент. "+tag_gpx.tagName);
			return;
		}
		
		// заполняем атребуты gpx.
		if(tag_gpx.hasAttribute("xmlns")){
			obj.gpx.xmlns = tag_gpx.getAttribute("xmlns");
			if(obj.gpx.xmlns !== "http://www.topografix.com/GPX/1/1")f_error_out(file.name, "Неверное пространство имени '<b>"+obj.gpx.xmlns+"</b>' должно быть 'http://www.topografix.com/GPX/1/1' "+schema_a);
		}else f_error_out(file.name, "Отсутствует пространство имени "+schema_a);
		if(tag_gpx.hasAttribute("xmlns:xsi"))obj.gpx.xsi = tag_gpx.getAttribute("xmlns:xsi");
		if(tag_gpx.hasAttribute("xsi:schemaLocation"))obj.gpx.xsi_s = tag_gpx.getAttribute("xsi:schemaLocation");
		if(tag_gpx.hasAttribute("version")){
			obj.gpx.version = tag_gpx.getAttribute("version");
			if(obj.gpx.version !== "1.1")f_error_out(file.name, "Версия должна быть 1.1 "+gpx_a);
		}else f_error_out(file.name, "Отсутствует обязательная версия(version) "+gpx_a);
		if(tag_gpx.hasAttribute("creator"))obj.gpx.creator = tag_gpx.getAttribute("creator");
		else f_error_out(file.name, "Отсутствует обязательный атрибут создателя(creator) "+gpx_a);
		//alert("xmlns: "+obj.gpx.xmlns+"\nxmlns:xsi: "+obj.gpx.xsi+"\nxsi:schemaLocation: "+obj.gpx.xsi_s+"\nversion: "+obj.gpx.version+"\ncreator: "+obj.gpx.creator);
		
		// Заполняем gpx.
		let i_sequence = 0;// следим за последовательностью.
		let i = 0;
		while(i < tag_gpx.children.length){
			if(tag_gpx.children[i].tagName === "wpt"){// Список путевых точек.
				if(i_sequence > 1)f_error_out(file.name, "Нарушена последовательность в gpx элементом wpt "+gpx_a);
				else i_sequence = 1;
				let wpt = f_wpt(tag_gpx.children[i], file.name);
				if(wpt !== undefined){
					if(obj.wpts === undefined){
						obj.wpts = [];// Массив.
						obj.wpts_WM = [];// Массив. для ускоренного доступа к точкам в Веб Меркаторе.
					}
					obj.wpts.push(wpt);
					obj.wpts_WM.push(from_wgs_84([toRad(wpt.lon), toRad(wpt.lat)]));
				}
			}else if(tag_gpx.children[i].tagName === "trk"){// Список треков.
				if(i_sequence > 3)f_error_out(file.name, "Нарушена последовательность в gpx элементом trk "+gpx_a);
				else i_sequence = 3;
				let trk = f_trk(tag_gpx.children[i], file.name);
				if(trk !== undefined){
					if(obj.trks === undefined)obj.trks = [];// Массив.
					obj.trks.push(trk);
				}else f_error_out(file.name, "В gpx пустой элемент trk "+trk_a);
			}else if(tag_gpx.children[i].tagName === "rte"){// Список маршрутов.
				if(i_sequence > 2)f_error_out(file.name, "Нарушена последовательность в gpx элементом rte "+gpx_a);
				else i_sequence = 2;
				let rte = f_rte(tag_gpx.children[i], file.name);
				if(rte !== undefined){
					if(obj.rtes === undefined)obj.rtes = [];// Массив.
					obj.rtes.push(rte);
				}else f_error_out(file.name, "В gpx пустой элемент rte "+rte_a);
			}else if(tag_gpx.children[i].tagName === "metadata"){// Метаданные о файле. 
				if(obj.gpx.metadata === undefined){
					if(i_sequence !== 0)f_error_out(file.name, "Нарушена последовательность в gpx элементом metadata "+gpx_a);
					obj.gpx.metadata = {};
					f_metadata(obj.gpx.metadata, tag_gpx.children[i], file.name);
				}else f_error_out(file.name, "В gpx недопустимо больше одного тега методанных(metadata) "+gpx_a);
			}else if(tag_gpx.children[i].tagName === "extensions"){// Вы можете добавить расширение GPX, добавив сюда свои собственные элементы из другой схемы.
				if(obj.extensions === undefined){
					/* По логики ни когда не должно происходить.
					if(i_sequence > 4)f_error_out(file.name, "Нарушена последовательность в gpx элементом extensions "+gpx_a);
					else */
					i_sequence = 4;
					obj.extensions = f_extensions(tag_gpx.children[i], file.name);
				}else f_error_out(file.name, "В gpx недопустимо больше одного тега extensions "+gpx_a);
			}else f_error_out(file.name, "Неизвестный элемент(<b>"+tag_gpx.children[i].tagName+"</b>) в gpx "+gpx_a);
			i++;
		}
		
		f_error_out(file.name, "Загружен.", false);
		//document.getElementById("test_out").textContent = JSON.stringify(obj);
		
		
		//alert(file.name+"\n"+xmlDoc.getElementsByTagName("gpx")[0].attributes.length);
		//alert(file.name+"\n"+xmlDoc.getElementsByTagName("gpx")[0].attributes[0].nodeName+" "+xmlDoc.getElementsByTagName("gpx")[0].attributes[0].value);
		//*/
	};
	
	let reg_gpx_format = /\.gpx$/i;
	input_file_gpx.onchange = () => {
		b_i_load.style.display = "inline";
		i_load_s.style.color = "#0a0";
		info_out_t.innerHTML = "<center>Файлы</center><br>";
		for(let i = 0; i < input_file_gpx.files.length; i++){
			// добавить вывод информации о самом файле
			//input_file_gpx.files[i].text().then(parser_gpx, error => {alert(error);});// Вроде не работает в опере.
			// Проверка по фориату(gpx) имени файла.
			if(!reg_gpx_format.test(input_file_gpx.files[i].name)){
				f_error_out(input_file_gpx.files[i].name, "формат файла не gpx.");
				continue;
			}
			let reader = new FileReader();
			reader.onload = () => {
				parser_gpx(input_file_gpx.files[i], reader.result);
			};
			reader.readAsText(input_file_gpx.files[i]);
		}
	};
	
	
	b_load.onclick = () => {
		input_file_gpx.click();
	};
	
	
	
};