function Button(){
	//########## общие методы для кнопок. ##########
	this.on_focus = function(){
		if(this.backing_fill)this.backing_fill.setAttributeNS(null, "fill", go_colors.focus)
		if(this.backing_stroke)this.backing_stroke.setAttributeNS(null, "stroke", go_colors.focus)
		if(this.text_focus)this.text_focus.setAttributeNS(null, "fill", go_colors.focus)
	}
	this.off_focus = function(){
		if(this.backing_fill)this.backing_fill.setAttributeNS(null, "fill", go_colors.b_frame)
		if(this.backing_stroke)this.backing_stroke.setAttributeNS(null, "stroke", go_colors.b_frame)
		if(this.text_focus)this.text_focus.setAttributeNS(null, "fill", go_colors.text)
	}
	//##############################################
	
	//##Кнопка свернуть/развернуть на весь экран.##
	let full_screen_graf = document.createElementNS(svgns, "g");//Контейнер для изображения конпки развернуть/свернуть на весь экран. Сокращенно b_f_s.
	let title_b_f_s = document.createElementNS(svgns, "title");//Всплывающая подсказка кнопки, всплывает при наведении курсора.
	title_b_f_s.textContent = document.fullscreenElement ? go_text.exit_full_screen : go_text.full_screen;//Устанавливаем текст всплывающей подсказки, взависимости, от полноэкранного режима или свернутого.
	full_screen_graf.appendChild(title_b_f_s);//Добавляем подсказку в контент изображения кнопки.
	let backing_b_f_s = document.createElementNS(svgns, "rect");//Рисуем подкладку для кнопки, прямоугольник.
	backing_b_f_s.setAttributeNS(null, "width", go_sizes.b_f_s);//Ширина кнопки, такая же как и высота.
	backing_b_f_s.setAttributeNS(null, "height", go_sizes.b_f_s);//Высота кнопки.
	backing_b_f_s.setAttributeNS(null, "fill", "none");//Заливка отсутствует.
	backing_b_f_s.setAttributeNS(null, "pointer-events", "visible");//Несмотря на отсутствие заливки события мыши регистрирует.
	backing_b_f_s.setAttributeNS(null, "stroke", go_colors.b_frame);//Цвет контура кнопки, такой же как и у контура интерфейса.
	backing_b_f_s.setAttributeNS(null, "stroke-width", go_sizes.b_w_stroke);//Толщина контура кнопки.
	full_screen_graf.appendChild(backing_b_f_s);//Добовляем подкладку кнопки в контент изображения кнопки.
	let padding_b_f_s = go_sizes.b_f_s/7;//Отступ рисунка кнопки от внутреннего края кнопки.
	let picture_size_el = (go_sizes.b_f_s - (padding_b_f_s*2))/3;//Длина одного элемента ресунка кнопки, равно ширина кнопки минус внутринние отступы с каждой стороны, и деленое на три.
	let picture_on_full = "M"+padding_b_f_s+" "+(padding_b_f_s+picture_size_el)+" h"+picture_size_el+" v-"+picture_size_el+" m"+picture_size_el+" 0 v"+picture_size_el+" h"+picture_size_el+" m 0 "+picture_size_el+" h-"+picture_size_el+" v"+picture_size_el+" m -"+picture_size_el+" 0 v-"+picture_size_el+" h-"+picture_size_el;//Рисунок кнопки когда окно игры развернуто на весь экран. Стрелками во внутрь.
	let picture_off_full = "M"+padding_b_f_s+" "+(padding_b_f_s+picture_size_el)+" v-"+picture_size_el+" h"+picture_size_el+" m"+picture_size_el+" 0 h"+picture_size_el+" v"+picture_size_el+" m 0 "+picture_size_el+" v"+picture_size_el+" h-"+picture_size_el+" m -"+picture_size_el+" 0 h-"+picture_size_el+" v-"+picture_size_el;//Рисунок кнопки когда окно игры свернуто(не на весь экран). Стрелками от центра.
	let picture_b_f_s = document.createElementNS(svgns, "path");//Картинка кнопки линия(<path>).
	picture_b_f_s.setAttributeNS(null, "d", document.fullscreenElement ? picture_on_full : picture_off_full);//Рисуем картинку кнопки, в зависемости от развернутого или свернутого окна игры.
	picture_b_f_s.setAttributeNS(null, "fill", "none");//Заливка отсутствует.
	picture_b_f_s.setAttributeNS(null, "stroke", go_colors.b_frame);//Устанавливаем цвет линий рисунка кнопки.
	picture_b_f_s.setAttributeNS(null, "stroke-width", go_sizes.b_w_stroke);//Толщина линий рисунка кнопки.
	full_screen_graf.appendChild(picture_b_f_s);//Добавляем рисунок кнопки в контент изображения кнопки.
	this.full_screen = document.createElementNS(svgns, "g");//Сама кнопка.
	this.full_screen.appendChild(full_screen_graf);//Загружаем изображение кнопки в саму кнопку.
	//Методы кнопки свернуть/развернуть на весь экран.
	this.full_screen.on_focus = function(){//Метод получения фокуса кнопкой, свернуть/развернуть на весь экран.
		picture_b_f_s.setAttributeNS(null, "fill", go_colors.focus);//При наведении мыши на кнопку изображение кнопки получает заливку цвета фокуса интерфейса.
		backing_b_f_s.setAttributeNS(null, "stroke", go_colors.focus);//И контур самой кнопки получает цвет "выделенного/в фокусе" объекта.
	}
	this.full_screen.off_focus = function(){//Метод снятия фокуа с кнопки, свернуть/развернуть на весь экран.
		picture_b_f_s.setAttributeNS(null, "fill", "none");//Обратно с рисунка кнопки убираем заливку.
		backing_b_f_s.setAttributeNS(null, "stroke", go_colors.b_frame);//Цвет контура кнопки обратно меняем на цвет контура кнопки.
	}
	this.full_screen.set_pos = function(x, y){//Метод устанавливает позицию кнопки.
		this.setAttribute("transform", "translate("+x+", "+y+")");
	}
	//События кнопки свернуть/развернуть на весь экран.
	this.full_screen.onmouseover = this.full_screen.on_focus;//Вешаем на кнопку событие появления над ней курсора мыши.
	this.full_screen.onmouseout = this.full_screen.off_focus;//Вешаем на кнопку событие ухода курсора мыши с кнопки.
	this.full_screen.onclick = f_full_screen;//Вешаем на кнопку событие нажатие мышью.//Функция развертывает окно игры SVG на весь экран, а при развернутом экране свертывает окно игры SVG обратно к прежнему состоянию.
	//#############################################
	
	//##############Кнопка смены языка.##############
	this.language = document.createElementNS(svgns, "g");//Сама кнопка.
	let language_use_arr = [];//Массив подкнопок, с языками и флагами, по нажатию на которые происходит выбор языка.
	for(let i = 0, f = 1; i < go_text.languages.length; i++){//В цикле создаем для каждого языка подкнопку.
		let language_graf = document.createElementNS(svgns, "g");//Контейнер для изображения подконпки язык.
		let language_backing = document.createElementNS(svgns, "rect");//Рисуем подкладку для кнопки, прямоугольник.
		language_backing.setAttributeNS(null, "width", go_sizes.b_w);//Ширина кнопки, такая же как и высота.
		language_backing.setAttributeNS(null, "height", go_sizes.b_h);//Высота кнопки.
		language_backing.setAttributeNS(null, "fill", "none");//Заливка отсутствует.
		language_backing.setAttributeNS(null, "pointer-events", "visible");//Несмотря на отсутствие заливки события мыши регистрирует.
		language_backing.setAttributeNS(null, "stroke", go_colors.b_frame);//Цвет контура кнопки, такой же как и у контура интерфейса.
		language_backing.setAttributeNS(null, "stroke-width", go_sizes.b_w_stroke);//Толщина контура кнопки.
		language_backing.language = go_text.languages[i];//Устанавливаем на под кнопку обозначения языка этой подкнопки. Нужно чтоб при уходе курсора с одной подкнопки на другую не свертывалось всплывающее меню состоящее из подкнопок.
		language_graf.appendChild(language_backing);
		let language_title = document.createElementNS(svgns, "title");//Всплывающая подсказка кнопки, всплывает при наведении курсора.
		language_title.textContent = go_text._language_title_b[go_text.languages[i]];
		language_backing.appendChild(language_title);
		let language_flag = document.createElementNS(svgns, "use");//Флаг кнопки.
		language_flag.setAttributeNS(null, "href", go_text._flag_id[go_text.languages[i]]);//загружаем из скрытых объектовю
		language_flag.setAttributeNS(null, "x", go_sizes.b_w - (go_sizes.language_flag_w + 8));//Устанавливаем флаг в кнопку с отступом 8 с лева от кнопки.
		language_flag.setAttributeNS(null, "y", (go_sizes.b_h - go_sizes.language_flag_h) / 2);//Смещаем флаг вниз(центрируем).
		language_flag.setAttributeNS(null, "pointer-events", "none");//Флаг пропускает события мыши, дальше на кнопку.
		language_graf.appendChild(language_flag);
		let language_name = document.createElementNS(svgns, "text");//Текст кнопки.
		language_name.setAttributeNS(null,'fill', go_colors.text);
		language_name.setAttributeNS(null, "dy", "1.25em");//Смещаем позицию текста по аертикали.
		language_name.setAttributeNS(null, "pointer-events", "none");//пропускает события мыши, дальше на кнопку.
		language_name.textContent = "\u2000"+go_text._language_name[go_text.languages[i]];
		language_graf.appendChild(language_name);
		let language_use = document.createElementNS(svgns, "g");//Сама подкнопка.//раньше была не "g" а "use"
		language_use.appendChild(language_graf);//Загружаем изображение подкнопки в саму подкнопку.
		language_use.backing_stroke = language_backing;//Устанавливаем ссылку на подкладку кнопки, для функции фокусировки, которая изменит цвет контура кнопки при наведении мыши.
		language_use.text_focus = language_name;//Устанавливаем ссылку текст кнопки, для функции фокусировки, которая изменит цвет текста кнопки при наведении мыши.
		language_use.language = go_text.languages[i];//Устанавливаем на под кнопку обозначения языка этой подкнопки.
		language_use_arr[language_use_arr.length] = language_use;//Добавляем подкнопку в массив, для функций развертывания и своертования меню из подкнопок языков.
		let obj = this;//Делаем ссылку на сам объект go_button(Button) который содержит все кнопки, для разных функций внутри кнопки, которые используют другой this.
		language_use.onmouseover = function(event){
			obj.on_focus.call(this);//Вешаем на кнопку событие появления над ней курсора мыши.
			if(this.language == go_text.language){//Если подкнопка текущего языка(основная).
				language_use_arr.forEach(function(item){//Перебираем все подкнопки.
					if(go_text.language != item.language){//Все подкнопки кроме основной подкнопки текущего языка.
						if(!this.language.contains(item))this.language.appendChild(item);//Делаем подкнопку видемой, то есть, развертываем подменю.
					}
				},obj);
			}
		}
		language_use.onmouseout = function(event){
			this.off_focus.call(language_use);//Вешаем на кнопку событие ухода курсора мыши с кнопки. Функция которая вызывается с this подкнопки.
			if(event.relatedTarget.language != undefined)event.stopPropagation();//Если переход осуществлен с одной подкнопки на другую, то останавливаем событие, чтоб не свернулось всплывающее меню. 
		}.bind(this);
		language_use.onclick =  function(event){//Событие клика мыши на подкнопки.На кнопки текущего языка которая основная, происходит свертывание/развертование всплывающего меню с кнопками языков, на не основной кнопке клик, меняет кнопку на которой клик с текущей(основной), меняет язык генерируя при этом событие смены языка, и свертывает меню подкнопок языков.
			if(this.language == go_text.language){//Если подкнопка текущего языка(основная).
				language_use_arr.forEach(function(item){//Перебираем все подкнопки.
					if(go_text.language != item.language){//Все подкнопки кроме основной подкнопки текущего языка.
						if(this.language.contains(item)){//Если кнопка уже отображена, то есть, меню подкнопок развернуто.
							this.language.removeChild(item);//Удаляем подкнопку кнопку из видемого слоя основной кнопки.
						}else{//Если подкнопки нет в видемом слое всей кнопки, то есть, меню свернуто.
							this.language.appendChild(item);//Делаем подкнопку видемой, то есть, развертываем подменю.
						}
					}
				},obj);
			}else{//Если нажата была не основная кнопка, то есть, надо сменить язык.
				language_use_arr.forEach(function(item){//Перебираем все подкнопки.
					if(go_text.language == item.language){//Если подкнопка основная.
						
						item.setAttribute("transform", this.getAttribute("transform"));//Смещаем основную подкнопку на место нажатой.
						this.setAttribute("transform", "translate(0, 0)");//Нажатую подкнопку ставим на место основной.
						
					}
				},this);
				go_text.language = this.language;//Устанавливаем новый язык.
				language_use_arr.forEach(function(item){//Перебираем все подкнопки.
					if(go_text.language != item.language){//Если кнопка не основная, то есть, нажатая которая стала основной.
						if(obj.language.contains(item))obj.language.removeChild(item);//Если кнопка отображается, удаляем её из видимого слоя меню. Свертываем меню.
					}
				},this);
				go_event_target.dispatchEvent(new Event('my_language_change'));//Генерируем событие смены языка, чтобы везде где нужно тексты были обновлены.
			}
		}
		if(go_text.language == go_text.languages[i]){//Если основная подкнопка(текущего языка).
			f--;
			this.language.appendChild(language_use);
		}else{//Если не основная подкнопка.
			language_use.setAttribute("transform", "translate(0, "+((i+f) * (go_sizes.b_h + go_sizes.b_w_stroke))+")");
		}
	}
	this.language.onmouseout = function(event){//Если курсор покинул все подкнопки языков то свертываем всплывающее меню с подкнопками.
		language_use_arr.forEach(function(item){
			if(go_text.language != item.language){//Убераем все кнопки из видимости кроме той что отображает текущей язык.
				if(this.language.contains(item)){
					this.language.removeChild(item);
				}
			}
		},this);
	}.bind(this);
	this.language.set_pos = function(x, y){//Метод устанавливает позицию кнопки.
		this.setAttribute("transform", "translate("+x+", "+y+")");
	}
	//###############################################
	
	//##############Кнопка звука.##############
	let volume_factor = go_sizes.b_h / 30;//Кнопка громности кратна высоте кнопок go_sizes.b_h//коэффициент.
	let new_volume = function(name_var_go_sizes){
		let picture_volume = document.createElementNS(svgns, "path");
		picture_volume.setAttributeNS(null, "d", "M2,10 H8 L17,1 V29 L8,20 H2 z");
		picture_volume.setAttributeNS(null, "fill", go_colors.b_frame);
		picture_volume.setAttributeNS(null, "stroke", "none");
		picture_volume.setAttributeNS(null, "stroke-width", 5);
		if(name_var_go_sizes != "volume_all")picture_volume.setAttribute("transform", "matrix(0.8 0 0 0.8 3.4 3)");
		
		let picture_volume_indicator = document.createElementNS(svgns, "path");
		picture_volume_indicator.setAttributeNS(null, "d", "M20,10 L30,20 M20,20 L30,10");
		picture_volume_indicator.setAttributeNS(null, "fill", "none");
		picture_volume_indicator.setAttributeNS(null, "stroke", go_colors.b_frame);
		picture_volume_indicator.setAttributeNS(null, "stroke-linecap", "round");
		picture_volume_indicator.setAttributeNS(null, "stroke-width", 3);
		if(name_var_go_sizes != "volume_all")picture_volume_indicator.setAttribute("transform", "matrix(0.8 0 0 0.8 3.4 3)");
		
		let volume_text = document.createElementNS(svgns, "text");
		volume_text.setAttributeNS(null,'fill', go_colors.text);
		volume_text.setAttributeNS(null, "dx", "120");
		volume_text.setAttributeNS(null, "dy", "1.25em");
		volume_text.setAttributeNS(null, "text-anchor", "start");
		volume_text.setAttributeNS(null, "pointer-events", "none");
		
		let backing_volume_rect = document.createElementNS(svgns, "path");
		backing_volume_rect.setAttributeNS(null, "d", "M0,0 H 120 V30 H0 z");
		backing_volume_rect.setAttributeNS(null, "fill", "none");
		backing_volume_rect.setAttributeNS(null, "pointer-events", "visible");
		backing_volume_rect.offset_x_svg = 0;
	
		let slider_volume_path = document.createElementNS(svgns, "path");
		slider_volume_path.setAttributeNS(null, "d", "M40,15 h 70");
		slider_volume_path.setAttributeNS(null, "fill", "none");
		slider_volume_path.setAttributeNS(null, "stroke", go_colors.b_frame);
		slider_volume_path.setAttributeNS(null, "stroke-linecap", "round");
		if(name_var_go_sizes != "volume_all"){
			slider_volume_path.setAttributeNS(null, "stroke-width", 1.5);
		}else{
			slider_volume_path.setAttributeNS(null, "stroke-width", 3);
		}
		slider_volume_path.setAttributeNS(null, "pointer-events", "none");
	
		let slider_volume_circle = document.createElementNS(svgns, "circle");
		slider_volume_circle.setAttributeNS(null, "cx", "40");
		slider_volume_circle.setAttributeNS(null, "cy", "15");
		if(name_var_go_sizes != "volume_all"){
			slider_volume_circle.setAttributeNS(null, "r", "5");
		}else{
			slider_volume_circle.setAttributeNS(null, "r", "6.3");
		}
		slider_volume_circle.setAttributeNS(null, "fill", go_colors.focus);
		slider_volume_circle.setAttributeNS(null, "pointer-events", "none");
		slider_volume_circle.indicator = 40 + (go_sizes[name_var_go_sizes] * 70)
		
		let volume = document.createElementNS(svgns, "g");
		let set_volume = function(value){
			slider_volume_circle.setAttributeNS(null, "cx", value);
			go_sizes[name_var_go_sizes] = (value - 40) / 70;
			volume.flag_change = true;
			if(value > 65){
				picture_volume_indicator.setAttributeNS(null, "d", "M20,10 A 7,7 0 0 1 20,20 M20,2 A 15,15 0 0 1 20,28");
			}else if(value > 47){
				picture_volume_indicator.setAttributeNS(null, "d", "M20,10 A 7,7 0 0 1 20,20");
			}else if(value > 40){
				picture_volume_indicator.setAttributeNS(null, "d", "");
			}else{
				picture_volume_indicator.setAttributeNS(null, "d", "M20,10 L30,20 M20,20 L30,10");
				slider_volume_circle.indicator = 39;
			}
		}
		set_volume(slider_volume_circle.indicator);
		volume.flag_change = false;
		
		backing_volume_rect.onmousedown = function(event){
			let offsetX = (event.clientX - (svg.getBoundingClientRect().left + backing_volume_rect.offset_x_svg))/volume_factor;//Для совместимости разных браузеров которые по разному понимают event.offsetX
			if(event.buttons == 1 && offsetX >= 40 && offsetX <= 110){
				set_volume(offsetX);
			}
		}
		backing_volume_rect.onmousemove = backing_volume_rect.onmousedown;
		backing_volume_rect.onclick = function(event){
			let offsetX = (event.clientX - (svg.getBoundingClientRect().left + backing_volume_rect.offset_x_svg))/volume_factor;//Для совместимости разных браузеров которые по разному понимают event.offsetX
			if(offsetX < 40){
				if(slider_volume_circle.getAttributeNS(null, "cx") == 40){
					if(slider_volume_circle.indicator == 39){
						slider_volume_circle.indicator = 40;
					}else if(slider_volume_circle.indicator == 40){
						set_volume(90);
					}else{
						set_volume(slider_volume_circle.indicator);
					}
					
				}else{
					let indicator = slider_volume_circle.getAttributeNS(null, "cx");
					set_volume(40);
					slider_volume_circle.indicator = indicator;
				}
			}
		}
		
		volume.setAttributeNS(null, "pointer-events", "visible");
		volume.backing_fill = picture_volume;
		volume.backing_stroke = picture_volume_indicator;
		volume.appendChild(picture_volume);
		volume.appendChild(picture_volume_indicator);
		
		if(name_var_go_sizes != "volume_all"){
			volume.appendChild(backing_volume_rect);
			volume.appendChild(slider_volume_path);
			volume.appendChild(slider_volume_circle);
			volume.appendChild(volume_text);
			volume.onmouseover = this.on_focus;
			volume.onmouseout = this.off_focus;
		}else{
			volume.slider_volume_path = slider_volume_path;
			volume.slider_volume_circle = slider_volume_circle;
		}
		volume.backing_volume_rect = backing_volume_rect;
		volume.text = volume_text;
		return volume;
	}.bind(this);
	
	
	let music_volume = new_volume("volume_music");
	music_volume.text.textContent = go_text.volume_music;
	music_volume.setAttribute("transform", "translate(0 -30)");
	let effect_volume = new_volume("volume_effect");
	effect_volume.text.textContent = go_text.volume_effect;
	effect_volume.setAttribute("transform", "translate(0 -60)");
	
	let all_volume = new_volume("volume_all");
	all_volume.text.textContent = go_text.volume_all;
	
	all_volume.onmouseover = function(event){
		if(!all_volume.contains(all_volume.backing_volume_rect)){
			all_volume.appendChild(all_volume.backing_volume_rect);
			all_volume.appendChild(all_volume.slider_volume_path);
			all_volume.appendChild(all_volume.slider_volume_circle);
			all_volume.appendChild(all_volume.text);
			all_volume.appendChild(music_volume);
			all_volume.appendChild(effect_volume);
		}
		this.on_focus.call(all_volume);
	}.bind(this);
	all_volume.onmouseout = function(event){
		if(!all_volume.contains(event.relatedTarget) && all_volume.contains(all_volume.backing_volume_rect)){
			all_volume.removeChild(all_volume.backing_volume_rect);
			all_volume.removeChild(all_volume.slider_volume_path);
			all_volume.removeChild(all_volume.slider_volume_circle);
			all_volume.removeChild(all_volume.text);
			all_volume.removeChild(music_volume);
			all_volume.removeChild(effect_volume);
		}
		if(all_volume.flag_change){
			manager_data.volume_all = go_sizes.volume_all;
			all_volume.flag_change = false;
		}
		if(music_volume.flag_change){
			manager_data.volume_music = go_sizes.volume_music;
			music_volume.flag_change = false;
		}
		if(effect_volume.flag_change){
			manager_data.volume_effect = go_sizes.volume_effect;
			effect_volume.flag_change = false;
		}
		this.off_focus.call(all_volume);
	}.bind(this);
	
	this.volume = document.createElementNS(svgns, "g");//Сама кнопка.
	this.volume.appendChild(all_volume);
	this.volume.set_pos = function(x, y){//Метод устанавливает позицию кнопки.
		this.setAttribute("transform", "matrix("+volume_factor+" 0 0 "+volume_factor+" "+x+" "+y+")");
		all_volume.backing_volume_rect.offset_x_svg = x;
		music_volume.backing_volume_rect.offset_x_svg = x;
		effect_volume.backing_volume_rect.offset_x_svg = x;
	}
	//#########################################
	
	//##############Кнопки меню.##############
	let new_button = function(name_title, func){
		func = func || function(){out("Функция кнопки \""+go_text[name_title]+"\" не определена.");};
		
		let button_backing = document.createElementNS(svgns, "rect");
		button_backing.setAttributeNS(null, "width", go_sizes.b_menu_w);
		button_backing.setAttributeNS(null, "height", go_sizes.b_h);
		button_backing.setAttributeNS(null, "fill", "none");
		button_backing.setAttributeNS(null, "pointer-events", "visible");
		button_backing.setAttributeNS(null, "stroke", go_colors.b_frame);
		button_backing.setAttributeNS(null, "stroke-width", go_sizes.b_w_stroke);
		
		let text = document.createElementNS(svgns, "text");
		text.setAttributeNS(null,'fill', go_colors.text);
		text.setAttributeNS(null, "dx", go_sizes.b_menu_w / 2);
		text.setAttributeNS(null, "dy", "1.25em");
		text.setAttributeNS(null, "text-anchor", "middle");
		text.setAttributeNS(null, "pointer-events", "none");
		text.textContent = go_text[name_title];
		
		let button = document.createElementNS(svgns, "g");
		button.appendChild(button_backing);
		button.appendChild(text);
		button.text = text;
		
		button.backing_stroke = button_backing;
		button.text_focus = text;
		
		
		button.onmouseover = this.on_focus;
		button.onmouseout = this.off_focus;
		button.onclick = func;
		button.set_pos = function(x, y){//Метод устанавливает позицию кнопки.
			button.setAttribute("transform", "translate("+x+", "+y+")");
		}
		
		return button;
	}.bind(this);
	
	this.new_game = new_button("new_game", function(){
		go_menu.off();
		go_main_menu.off();
		this.onmouseout();
		f_new_game();
	});
	this.load = new_button("load");
	this.save = new_button("save");
	this.continue_game = new_button("continue_game");
	this.end_game = new_button("end_game");
	this.grid = new_button("grid");
	this.full_screen_menu = new_button("full_screen", f_full_screen);
	this.menu = new_button("menu", function(){go_menu.on();});
	this.menu.backing_stroke.setAttributeNS(null, "width", 50);
	this.menu.backing_stroke.setAttributeNS(null, "height", 20);
	this.menu.text.setAttributeNS(null, "y", "10");
	this.menu.text.setAttributeNS(null, "dy", "0.5ex");
	this.menu.text.setAttributeNS(null, "dx", 50/2);
	
	this.main_menu = new_button("main_menu", function(){
		this.onmouseout();
		go_menu.off();
		go_interf.off();
		go_main_menu.on();
		});
	
	//########################################
	
	//Методы, для всех кнопок.//Нужен для кнопки свернуть/развернуть на весь экран.
	this.full_screen_change = function(event){//Вызывается, специально созданным событием, при свертывании или развертывании на весь экран окна игры.
		if(document.fullscreenElement){//При развертывании игры на весь экран.
			title_b_f_s.textContent = go_text.exit_full_screen;
			picture_b_f_s.setAttributeNS(null, "d", picture_on_full);
			this.full_screen_menu.text.textContent = go_text.exit_full_screen_2;
		}else{//При свертовании(выходе из полноэкранного режима).
			title_b_f_s.textContent = go_text.full_screen;
			picture_b_f_s.setAttributeNS(null, "d", picture_off_full);
			this.full_screen_menu.text.textContent = go_text.full_screen;
		}
	}.bind(this);
	go_event_target.addEventListener('my_full_screen_change', this.full_screen_change);//Добавляем слушатель, специально созданного события, которое вызывается при свертывании или развертывании игры на весь экран.
	this.language_change = function(event){//Вызывается, специально созданным событием, при смене языка.
		if(document.fullscreenElement){//При развернутой игры на весь экран.
			title_b_f_s.textContent = go_text.exit_full_screen;
			this.full_screen_menu.text.textContent = go_text.exit_full_screen_2;
		}else{//При не развернутой игре.
			title_b_f_s.textContent = go_text.full_screen;
			this.full_screen_menu.text.textContent = go_text.full_screen;
		}
		all_volume.text.textContent = go_text.volume_all;
		music_volume.text.textContent = go_text.volume_music;
		effect_volume.text.textContent = go_text.volume_effect;
		this.new_game.text.textContent = go_text.new_game;
		this.load.text.textContent = go_text.load;
		this.save.text.textContent = go_text.save;
		this.continue_game.text.textContent = go_text.continue_game;
		this.end_game.text.textContent = go_text.end_game;
		this.grid.text.textContent = go_text.grid;
		this.menu.text.textContent = go_text.menu;
		this.main_menu.text.textContent = go_text.main_menu;
	}.bind(this);
	go_event_target.addEventListener('my_language_change', this.language_change);//Добавляем слушатель, специально созданного события, которое вызывается при смене языка.
}