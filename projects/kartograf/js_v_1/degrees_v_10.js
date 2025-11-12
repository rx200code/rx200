function Degrees(){
	let svg = document.getElementById("svg");// слой для рисования.
	let menu = document.getElementById("content_degrees");// Все настройки меню разметки и сеток.
	let degrees_text = createElementNS("g");// Контейнер для вывода текста.
	let scale_text = 1;// Коэфицент масштаба текста.
	let size_t = 18 * scale_text;// Размер текста.
	let bot_y = height_map - 30 * scale_text;// Вертикальный отступ с низу для текста в углах.
	let sc = crs.get_cs();
	// точка в центре
	let p_center = createElementNS("path", ["fill", "none"], ["stroke-width", 5], ["stroke-opacity", 1], ["stroke", "#00f"], ["stroke-linecap", "round"], ["d", "M"+(width_map / 2)+","+(height_map / 2)+"h0"]);
	if(document.getElementById("p_center").checked)svg.appendChild(p_center);
	// доп.
	let f_enter = e => {if(e.keyCode === 13)e.target.blur();};
	let f_focus = e => {e.target.select();};
	// Создаем тексты для углов карты.
	let create_text_a = (x, y, align) => degrees_text.appendChild(create_text(['filter', 'url(#bord_t)'], ['font-size', size_t+"px"], ['x', x], ['y', y], ["text-anchor", align]));
	let create_tspan_a = parent => parent.appendChild(createElementNS("tspan", ['x', parent.getAttributeNS(null, 'x')], ['dy', 14 * scale_text+'px']));
	let top_left_text = create_text_a(0, 0, "start");
	let top_left_text_F = create_tspan_a(top_left_text);
	let top_left_text_L = create_tspan_a(top_left_text);
	let top_right_text = create_text_a(width_map, 0, "end");
	let top_right_text_F = create_tspan_a(top_right_text);
	let top_right_text_L = create_tspan_a(top_right_text);
	let bot_left_text = create_text_a(0, bot_y, "start");
	let bot_left_text_F = create_tspan_a(bot_left_text);
	let bot_left_text_L = create_tspan_a(bot_left_text);
	let bot_right_text = create_text_a(width_map, bot_y, "end");
	let bot_right_text_F = create_tspan_a(bot_right_text);
	let bot_right_text_L = create_tspan_a(bot_right_text);
	let format_d = document.getElementById("format_d").selectedIndex;// Хранит номер индекса формата отображения координат.
	// Функция подготовки вывода текста в соответствии с форматом вывода.
	let f_number_in_format_d = (n, east) => {
		let text = "";
		if(format_d < 8)n = toDeg(n);
		if(east){
			text += "E:";
			if(format_d < 8){
				n = d_360(n);
			}
		}else{
			if(n < 0){
				if(format_d < 8)n *= -1;
				text += "S:";
			}else text += "N:";
		}
		/*## TEST ## // Похоже решение в том что эта функция для углов, а при выводе текста на линиях нужно округлять как раньше Math.round или n.toFixed(11); без использования | 0;
		let np = .0000000009;
		if(format_d < 8)np = .0000000000009;
		if(n < 0)n -= np;
		else n += np;
		//##########*/
		if(format_d == 1){
			let degrees = n | 0;
			text += (degrees < 10 ? "0"+degrees: degrees)+"°";
			let minutes = (n - degrees) * 60 | 0;
			text += (minutes < 10 ? "0"+minutes: minutes)+"'";
			let seconds = n * 3600 % 60 | 0;
			text += (seconds < 10 ? "0"+seconds: seconds)+'"';
		}else if(format_d == 2){
			let degrees = n | 0;
			text += (degrees < 10 ? "0"+degrees: degrees)+"°";
			let minutes = ((n - degrees) * 6000 | 0) / 100;
			text += minutes < 10 ? "0"+minutes: minutes;
			if(text.length == 7)text += ".00'";
			else if(text.length == 9)text += "0'";
			else text += "'";
		}else if(format_d == 3)text += n < 10 ? "0"+n.toFixed(5)+"°": n.toFixed(5)+"°";
		else if(format_d == 4)text += n < 10 ? "0"+n.toFixed(7)+"°": n.toFixed(7)+"°";
		else if(format_d == 5)text += n < 10 ? "0"+n.toFixed(9)+"°": n.toFixed(9)+"°";
		else if(format_d == 6)text += n < 10 ? "0"+n.toFixed(11)+"°": n.toFixed(11)+"°";
		else if(format_d == 7){
			let degrees = n | 0;
			text += (degrees < 10 ? "0"+degrees: degrees)+"°";
			let minutes = (n - degrees) * 60 | 0;
			text += (minutes < 10 ? "0"+minutes: minutes)+"'";
			let seconds = n * 3600 % 60;
			text += (seconds < 10 ? "0"+seconds.toFixed(5): seconds.toFixed(5))+'"';
		}else if(format_d == 8)text += n+"rad";
		else if(format_d == 9)text += (n / 1000 | 0)+"km";//Math.round(n / 1000)+"km";
		else if(format_d == 10)text += (n | 0)+"m";
		else if(format_d == 11)text += n.toFixed(2)+"m";
		else if(format_d == 12)text += (n / 0.3048006096 | 0)+"ft";// Геодезический фут 0.3048006096 метра.
		else if(format_d == 13)text += (n / 0.3048 | 0)+"ft";// Международный фут 0.3048 метра.
		else if(format_d == 14)text += (n / 0.9144 | 0)+"yd";// Ярд 0.9144 метра.
		else if(format_d == 15)text += (n / 1609.344 | 0)+"mile";// Миля 1609.344 метра.
		else if(format_d == 16)text += (n / 1855.3248465545596 | 0)+"gm";// Географическая миля 1855.3248465545596 метра, вычесленная для WGS 84.
		else if(format_d == 17)text += (n / 1852 | 0)+"nm";// Морская миля 1852 метра.
		else text += "Error";
		return text;
	};
	/// Настройка СК/проекции.
	let options_format_d = document.getElementById("format_d").children;
	let f_to_xy = () => {
		for(let i = 1; i < 9; i++)options_format_d[i].style.display = "none";
		for(let i = 9; i < options_format_d.length; i++)options_format_d[i].style.display = "block";
		if(document.getElementById("format_d").selectedIndex < 9)format_d = document.getElementById("format_d").selectedIndex = 9;
	}
	let f_to_fl = () => {
		for(let i = 1; i < 9; i++)options_format_d[i].style.display = "block";
		for(let i = 9; i < options_format_d.length; i++)options_format_d[i].style.display = "none";
		if(document.getElementById("format_d").selectedIndex > 8)format_d = document.getElementById("format_d").selectedIndex = 1;
	}
	/// Для проекции Хотини с углом.
	let elm_angle = document.getElementById("text_angle");
	elm_angle.style.display = "none";
	let value_angle = toRad(elm_angle.value);
	
	let elm_span_angle = document.getElementById("span_angle");
	elm_span_angle.style.display = "none";
	
	
	
	/// Заполняем список проекций
	for(let i = 0; i < sc.length; i++){
		let op = document.createElement("option");
		//op.innerHTML = sc[i].name;
		op.textContent = sc[i].name;
		//op.insertAdjacentText('beforeend', sc[i].name);
		document.getElementById("sys_c").append(op);
	}
	let sys_c_ind = 0;
	let f_sys_c = () => {
		sys_c_ind = document.getElementById("sys_c").selectedIndex - 1;
		if(sc[sys_c_ind].metre)f_to_xy();
		else f_to_fl();
		if(sc[sys_c_ind].angle){
			elm_span_angle.style.display = "none";
			elm_angle.style.display = "inline";
		}else{
			elm_angle.style.display = "none";
			if(sc[sys_c_ind].f_a)elm_span_angle.style.display = "inline";
			else elm_span_angle.style.display = "none";
		}
	}
	/// Переменные и функция отслеживания координат на углах карты.
	let coor_top_left = [50000000, 30000000];// 50 и 30 млн. начальные координаты которых не может быть, чтобы функция выполнилась в начале.
	let coor_bot_right = [0, 0];
	let coor_top_right = [0, 0];
	let coor_bot_left = [0, 0];
	let f_move = () => {
		let coor_top_left_test = map.map.getCoordinateFromPixel([0,0]);
		if(coor_top_left[0] == coor_top_left_test[0] && coor_top_left[1] == coor_top_left_test[1])return;
		coor_top_left[0] = coor_top_left_test[0];
		coor_top_left[1] = coor_top_left_test[1];
		coor_bot_right = map.map.getCoordinateFromPixel([width_map,height_map]);
		coor_top_right = [coor_bot_right[0], coor_top_left[1]];
		coor_bot_left = [coor_top_left[0], coor_bot_right[1]];
		if(document.getElementById("markings_corners").checked)f_out_angles_text();
		/// TEST
		f_draw_1();
		f_draw_2();
		f_draw_grid();
	};
	let f_out_text_z = c => sc[sys_c_ind].f_s(c) ? "z:"+sc[sys_c_ind].f_z(c)+" S": "z:"+sc[sys_c_ind].f_z(c)+" N";
	let f_out_angles_text = () => {
		let centr_op = [];
		if(sc[sys_c_ind].center){
			if(sc[sys_c_ind].angle)hotine_a = value_angle;
			centr_op = sc[sys_c_ind].f_to([(coor_bot_right[0] - coor_top_left[0]) / 2 + coor_top_left[0], (coor_bot_right[1] - coor_top_left[1]) / 2 + coor_top_left[1]]).slice(2);
		}
		// Переводим координаты в нужную систему/проекцию координат
		let c_top_left_out = sc[sys_c_ind].f_to([...coor_top_left, ...centr_op]);
		let c_top_right_out = sc[sys_c_ind].f_to([...coor_top_right, ...centr_op]);
		let c_bot_left_out = sc[sys_c_ind].f_to([...coor_bot_left, ...centr_op]);
		let c_bot_right_out = sc[sys_c_ind].f_to([...coor_bot_right, ...centr_op]);
		// Переводим в нужный формат и отображаем координаты.
		let z = sc[sys_c_ind].zone;// Истина если есть функция зоны.
		
		
		
		let a = sc[sys_c_ind].f_a ? " ∠"+toDeg(sc[sys_c_ind].f_a(c_top_left_out)).toFixed(2)+"°": "";
		if(document.getElementById("markings_corners").checked)elm_span_angle.textContent = a;
		
		
		top_left_text_F.textContent = f_number_in_format_d(c_top_left_out[1], false)+(z ? " "+f_out_text_z(c_top_left_out): "");
		top_left_text_L.textContent = f_number_in_format_d(c_top_left_out[0], true)+a;
		top_right_text_F.textContent = (z ? f_out_text_z(c_top_right_out): "")+f_number_in_format_d(c_top_right_out[1], false);
		top_right_text_L.textContent = f_number_in_format_d(c_top_right_out[0], true);
		bot_left_text_F.textContent = f_number_in_format_d(c_bot_left_out[1], false)+(z ? " "+f_out_text_z(c_bot_left_out): "");
		bot_left_text_L.textContent = f_number_in_format_d(c_bot_left_out[0], true);
		bot_right_text_F.textContent = (z ? f_out_text_z(c_bot_right_out): "")+ f_number_in_format_d(c_bot_right_out[1], false);
		bot_right_text_L.textContent = f_number_in_format_d(c_bot_right_out[0], true);
	};
	///#########################
	menu.onchange = function(e){
		if(e.target.id == "markings_corners"){
			f_move();// Необходимо установить координаты до выполнения функций f_on_auto_step(1) в которой draw_grid(id); с метрическими данными зависает.
			f_sys_c();// Определяем проекцию
			if(document.getElementById("markings_corners").checked){// Вкл/выкл отображения координат на углах карты.
				svg.appendChild(degrees_text);// Подключаем поля текстов.
				document.querySelector(".ol-attribution").style.display = "none";// Убираем с низу с права отображения ссылки на поставщика карт.
				f_out_angles_text();//отображаем.
			}else{
				if(svg.contains(degrees_text)){// Если поля текста отображаются.
					svg.removeChild(degrees_text);// Убираем поля текста
					document.querySelector(".ol-attribution").style.display = "inline-block";// Выводим с низу с права отображения ссылки на поставщика карт.
				}
				elm_span_angle.textContent = "";
			}
		}else if(e.target.id == "format_d"){
			format_d = e.target.selectedIndex;// Устанавливаем формат отображения координат в углу карты.
			f_out_angles_text();
		}else if(e.target.id == "sys_c"){
			f_sys_c();// Устанавливаем проекцию для отображения в углах карты.
			f_out_angles_text();
		}else if(e.target.id == "p_center"){
			if(e.target.checked)svg.appendChild(p_center);
			else if(svg.contains(p_center))svg.removeChild(p_center);
		}
	};
	map.map.once('postrender', () => menu.onchange({target:{id:"markings_corners"}}));
	map.map.on("postrender", f_move);// пока самая надежная "postrender"
	// Доп слушатели. Для проекции Хотине.
	elm_angle.onblur = () => {
		let n = parseFloat(elm_angle.value);
		if(isFinite(n)){
			value_angle = toRad(n);
			f_out_angles_text();
		}else elm_angle.value = toDeg(value_angle);
	};
	elm_angle.onkeydown = f_enter;
	elm_angle.onfocus = f_focus;
	///#####################################
	let w_grid = 0;
	let arr_c_grid = [];
	let arr_c_x = [];
	let arr_c_y = [];
	let a_f_grid = 0;
	let f_grid = (interval, coor_top_l, coor_bot_r, sc, plus = true) => {
		// Находим центр
		let c_centr = [(coor_bot_r[0] - coor_top_l[0]) / 2 + coor_top_l[0], (coor_bot_r[1] - coor_top_l[1]) / 2 + coor_top_l[1]];
		// Находим зону, ось в центре если есть. И координаты новой проекции в центре.
		let centr_to = sc.f_to(c_centr);
		// Сохраняем номер зоны, ось если есть.
		let z_s = centr_to.slice(2);
		// Сооздаем, копируем(чтоб не менять входных данных) координаты углов.
		let c_top_l = [coor_top_l[0], coor_top_l[1], ...z_s];
		let c_top_r = [coor_bot_r[0], coor_top_l[1], ...z_s];
		let c_bot_l = [coor_top_l[0], coor_bot_r[1], ...z_s];
		let c_bot_r = [coor_bot_r[0], coor_bot_r[1], ...z_s];
		// Защита от неправильной работы функций возврата координат UTM и Гаусса Крюгера, когда они дают сбой и возвращают черезмерно большие значения. на мелком масштабе.
		if(sc.limit){
			if(c_top_r[0] - c_top_l[0] > sc.limit * 2){
				c_top_r[0] = c_centr[0] + sc.limit;
				c_bot_r[0] = c_top_r[0];
				c_top_l[0] = c_centr[0] - sc.limit;
				c_bot_l[0] = c_top_l[0];
			}
		}
		// Находим координаты углов в новой проекции. Учитывая зону, ось если есть.
		let c_top_left_to = sc.f_to(c_top_l);
		let c_top_right_to = sc.f_to(c_top_r);
		let c_bot_left_to = sc.f_to(c_bot_l);
		let c_bot_right_to = sc.f_to(c_bot_r);
		// Определяем крайние положения в новой проекции.
		let left, right, top, bot;
		
		if(sc.center){// Если проекция вращается. Хотя код ниже подходит и для остальных. корректнее опроеделять по sc.f_a
			// Определяем центр по краям так как некоторые проекции изогнуты.
			let c_1 = sc.f_to([c_top_r[0], c_centr[1], ...z_s]);
			let c_2 = sc.f_to([c_top_l[0], c_centr[1], ...z_s]);
			let c_3 = sc.f_to([c_centr[0], c_bot_r[1], ...z_s]);
			let c_4 = sc.f_to([c_centr[0], c_top_r[1], ...z_s]);
			// Определяем края по каждой точки, так как некоторые проекции можно вращать, и даже переворачивать. по этому определение максимумов и минимумов только по крайним точкам недостаточно.
			left = Math.min(c_top_right_to[0], c_bot_right_to[0], c_top_left_to[0], c_bot_left_to[0], c_1[0], c_2[0], c_3[0], c_4[0]);
			right = Math.max(c_top_right_to[0], c_bot_right_to[0], c_top_left_to[0], c_bot_left_to[0], c_1[0], c_2[0], c_3[0], c_4[0]);
			top = Math.max(c_top_right_to[1], c_bot_right_to[1], c_top_left_to[1], c_bot_left_to[1], c_1[1], c_2[1], c_3[1], c_4[1]);
			bot = Math.min(c_top_right_to[1], c_bot_right_to[1], c_top_left_to[1], c_bot_left_to[1], c_1[1], c_2[1], c_3[1], c_4[1]);
			// Сохраняем угол.
			if(sc.f_a)a_f_grid = sc.f_a(centr_to);
			
		}else if(!plus){// TEST ДОДЕЛАТЬ
			left = Math.max(c_top_left_to[0], c_bot_left_to[0], sc.f_to([c_top_l[0], c_centr[1], ...z_s])[0]);
			right = Math.min(c_top_right_to[0], c_bot_right_to[0], sc.f_to([c_top_r[0], c_centr[1], ...z_s])[0]);
			top = Math.min(c_top_right_to[1], c_top_left_to[1], sc.f_to([c_centr[0], c_top_r[1], ...z_s])[1]);
			bot = Math.max(c_bot_left_to[1], c_bot_right_to[1], sc.f_to([c_centr[0], c_bot_r[1], ...z_s])[1]);
		}else{// Вобщем то можно использовать код выше.
			left = Math.min(c_top_left_to[0], c_bot_left_to[0], sc.f_to([c_top_l[0], c_centr[1], ...z_s])[0]);
			right = Math.max(c_top_right_to[0], c_bot_right_to[0], sc.f_to([c_top_r[0], c_centr[1], ...z_s])[0]);
			top = Math.max(c_top_right_to[1], c_top_left_to[1], sc.f_to([c_centr[0], c_top_r[1], ...z_s])[1]);
			bot = Math.min(c_bot_left_to[1], c_bot_right_to[1], sc.f_to([c_centr[0], c_bot_r[1], ...z_s])[1]);
		}
		// Устанавливаем ограничения для севера и юга, Чтоб если заходили за пределы карты не перескакивали на другой полюс.
		let top_limit = top;
		let bot_limit = bot;
		// чтоб сетка была внутри заданных координат, независимо от того в каком полушарии.
		if(left > 0)left += interval;
		if(right < 0)right -= interval;
		if(top < 0)top -= interval;
		if(bot > 0)bot += interval;
		// Убираем дробную часть интервала.
		left -= left % interval;
		right -= right % interval;
		top -= top % interval;
		bot -= bot % interval;
		// на один шаг сдвигаем значения, чтоб охватывали всю область просмотра, чуть выходя за область просмотра.
		if(plus){
			left -= interval;
			right += interval;
			top += interval;
			bot -= interval;
		}
		// чуть чуть увеличиваем, ограничения, до которых строить сетку.
		top += interval * .1;
		right += interval * .1;
		// Дополнительные переменные формирования сетки.
		let i = 0;
		let j = 0;
		let coor = [0, 0, ...z_s];
		w_grid = (right - left + interval) / interval | 0;
		//arr_c_x.length = w_grid;
		// Запускаем цыклы формирования сетки.
		while(bot <= top){
			coor[1] = bot;
			// Если выходит за пределы север, юг, чтоб не создавать лишние точки.
			if(plus){
				if(coor[1] <= bot_limit){
					if(i != 0){
						bot += interval;
						continue;
					}else coor[1] = bot_limit;
				}else if(coor[1] >= top_limit){
					if(coor[1] - interval >= top_limit)break;
					coor[1] = top_limit;
				}
			}
			arr_c_y[j++] = coor[1];
			for(let x = left; x <= right; x += interval){
				if(i < w_grid)arr_c_x[i] = x;
				coor[0] = x;
				arr_c_grid[i] = map.map.getPixelFromCoordinate(sc.f_from(coor));
				i++;
			}
			bot += interval;
		}
		//arr_c_y.length = j;
		arr_c_grid.length = i;
	};
	marking.count = 0;
	arr_grid_step = [// let let z = map.view.getZoom();
		{t:"шаг", d:true},
		{t:'1" arcsec', i:toRad(1 / 60 / 60), f:Math.PI / (180 * 60 * 60), p:'"'},
		{t:'10" arcsec', i:toRad(1 / 60 / 6), f:Math.PI / (180 * 60 * 60), p:'"'},
		{t:'30" arcsec', i:toRad(1 / 60 / 2), f:Math.PI / (180 * 60 * 60), p:'"'},
		{t:"1' arcmin", i:toRad(1 / 60), f:Math.PI / (180 * 60), p:"'"},
		{t:"10' arcmin", i:toRad(1 / 6), f:Math.PI / (180 * 60), p:"'"},
		{t:"30' arcmin", i:toRad(1 / 2), f:Math.PI / (180 * 60), p:"'"},
		{t:"1° deg", i:toRad(1), f:Math.PI / 180, p:"°", z:7},// zoom > z
		{t:"6° deg for zones", i:toRad(6), f:Math.PI / 180, p:"°"},// Зоны.
		{t:"10° deg", i:toRad(10), f:Math.PI / 180, p:"°", z:2},
		{t:"20° deg", i:toRad(20), f:Math.PI / 180, p:"°", z:0},
		{t:"Свой в", d:true},
		{t:"градусы(deg)", f:Math.PI / 180, p:"°"},
		{t:"минуты(arcmin)", f:Math.PI / (180 * 60), p:"'"},
		{t:"секунды(arcsec)", f:Math.PI / (180 * 60 * 60), p:'"'},
		{t:"радианы(rad)", f:1, p:"rad", delimiter:true},
		{t:"10 m", i:10, f:1, p:"m"},
		{t:"25 m", i:25, f:1, p:"m"},
		{t:"50 m", i:50, f:1, p:"m"},
		{t:"100 m", i:100, f:1, p:"m"},
		{t:"250 m", i:250, f:1, p:"m", z:15},
		{t:"500 m", i:500, f:1, p:"m", z:12.8},
		{t:"1 km", i:1000, f:1000, p:"km", z:11.5},
		{t:"2 km", i:2000, f:1000, p:"km"},
		{t:"4 km", i:4000, f:1000, p:"km", z:10},
		{t:"10 km", i:10000, f:1000, p:"km"},
		{t:"50 km", i:50000, f:1000, p:"km", z:7},
		{t:"500 km", i:500000, f:1000, p:"km", z:0},
		{t:"Свой в", d:true},
		{t:"km(километры)", f:1000, p:"km"},
		{t:"m(метры)", f:1, p:"m"},
		{t:"ft(футы, геодезические)", f:0.3048006096, p:"ft"},// Геодезический фут 0.3048006096 метра.
		{t:"ft(футы, международный)", f:0.3048, p:"ft"},// Международный фут 0.3048 метра.
		{t:"yd(ярды)", f:0.9144, p:"yd"},// Ярд 0.9144 метра.
		{t:"mile(мили)", f:1609.344, p:"mile"},// Миля 1609.344 метра.
		{t:"gm(географическая мили)", f:1855.3248465545596, p:"gm"},// Географическая миля 1855.3248465545596 метра, вычесленная для WGS 84.
		{t:"nm(морские мили)", f:1852, p:"nm"}// Морская миля 1852 метра.
	];
	let delimiter_step = arr_grid_step.findIndex(el => el.delimiter);//let delimiter_step = 14;
	let f_select_step = (select_children, m) => {
		for(let i = 1; i < select_children.length; i++)select_children[i].style.display = i <= delimiter_step ? (m ? "none": "block"): (m ? "block": "none");
	};
	let z = map.view.getZoom();
	map.view.on('change:resolution', () => {z = map.view.getZoom();});
	let f_interval = (m, select_step) => {
		let lim = m ? arr_grid_step.length: delimiter_step + 1;
		for(let i = m ? delimiter_step + 1: 1; i < lim; i++)if(arr_grid_step[i].hasOwnProperty("z") && z >= arr_grid_step[i].z){
			if(select_step)select_step.selectedIndex = i;
			return arr_grid_step[i].i;
		}
	};
	// Функции отображения текста по сторонам
	let f_format_t_b = (n, east, i) => {
		let text = "";
		if(i < delimiter_step){
			n = toDeg(n)
			if(east)n = d_360(n);
		}
		if(i >= 1 && i <= 9){
			if(n < 0){
				n *= -1;
				if(n > 0)text += "-";//if(n > 0.0013)text += "-";// Возможно избавляемся от -0
			}
			let sec_n = Math.round(n * 3600);
			let seconds = sec_n % 60;
			let minutes = ((sec_n - seconds) / 60) % 60;
			let degrees = sec_n / 3600 | 0;
			text += (degrees < 10 ? "0"+degrees: degrees)+"°"+(minutes < 10 ? "0"+minutes: minutes)+"'"+(seconds < 10 ? "0"+seconds: seconds)+'"';
		}else if(i == 11)text += n < 10 ? "0"+n.toFixed(5)+"°": n.toFixed(5)+"°";
		else if(i == 12)text += Math.round(n * 60)+"'";
		else if(i == 13)text += Math.round(n * 60 * 60)+'"';
		else if(i == 14)text += n+"rad";
		else text += Math.round(n / arr_grid_step[i].f)+arr_grid_step[i].p;
		return text;
	};
	let intersection = (Ax, Ay, Bx, By, os, h) => {
		if(Ax == os && Ay >= 1 && Ay <= h){
			return Ay;
		}else if(Bx == os && By >= 1 && By <= h){
			return By;
		}else if(Ax < os && Bx > os){
			let c = By - ((By - Ay) * (1 / (Bx - Ax) * (Bx - os)));
			if(c >= 1 && c <= h){
				return c;
			}
		}else if(Bx < os && Ax > os){
			let c = Ay - ((Ay - By) * (1 / (Ax - Bx) * (Ax - os)));
			if(c >= 1 && c <= h){
				return c;
			}
		}
		return 0;
	};
	let size_t_bord = 12;
	let create_t_bord = () => create_text(['filter', 'url(#bord_t_2)'], ['font-size', size_t_bord+"px"], ['font-weight', 900]);
	let side_t_b = (elm, side, c) => {
		switch(side){
			case "l":
				elm.setAttributeNS(null, "text-anchor", "start");
				elm.setAttributeNS(null,'x', 0);
				elm.setAttributeNS(null,'y', c);
				break;
			case "r":
				elm.setAttributeNS(null, "text-anchor", "end");
				elm.setAttributeNS(null,'x', width_map);
				elm.setAttributeNS(null,'y', c);
				break;
			case "t":
				elm.setAttributeNS(null, "text-anchor", "middle");
				elm.setAttributeNS(null,'x', c);
				elm.setAttributeNS(null,'y', size_t_bord * .8);
				break;
			case "b":
				elm.setAttributeNS(null, "text-anchor", "middle");
				elm.setAttributeNS(null,'x', c);
				elm.setAttributeNS(null,'y', height_map - size_t_bord * .2);
				break;
		}
	};
	function marking(options){
		let id = ++marking.count;
		/// Данные
		let interval = 500000;
		let angle = 0;
		let {
			id_sc = 0,
			color = "#000000"// Цвет линии разметки
		} = options;
		if(id_sc >= sc.length)id_sc = 0;
		/// Объекты графики
		// Общей слой svg
		let layer = createElementNS("g");
		// Линия разметки
		let line = createElementNS("path", ["fill", "none"], ["stroke-width", 1], ["stroke-opacity", .5], ["stroke", color]);
		layer.appendChild(line);
		svg.appendChild(layer);
		// Слой текста на линиях разметки.
		let text_layer = createElementNS("g");
		svg.appendChild(text_layer);
		/// Объекты меню
		let span = createElement("span");
		let label_on = createElement("label");
			label_on.insertAdjacentText('beforeend', "Отображать разметку "+id+":");
		let input_on = createElement("input", ["type", "checkbox"]);
		label_on.append(input_on);
		span.append(label_on);
		let input_color = createElement("input", ["type", "color"], ["value", color]);
		span.insertAdjacentText('beforeend', " ");
		span.append(input_color);
		let input_opacity = createElement("input", ["type", "range"], ["style", "width:85px"], ["min", "0"], ["max", "1"], ["step", ".01"], ["value", .5]);
		span.append(input_opacity);
		span.insertAdjacentHTML('beforeend', "<br>Отображать в: ");
		let select_step = createElement("select", ["disabled", true]);
		for(let i = 0; i < arr_grid_step.length; i++){
			let op = createElement("option");
				op.textContent = arr_grid_step[i].t;
			if(arr_grid_step[i].d)op.disabled = true;
			select_step.append(op);
		}
		span.append(select_step);
		let label_auto = createElement("label");
			label_auto.insertAdjacentText('beforeend', " авто ");
		let input_auto = createElement("input", ["type", "checkbox"], ["checked", true]);
		label_auto.append(input_auto);
		span.append(label_auto);
		span.insertAdjacentText('beforeend', " ");
		let input_step = createElement("input", ["type", "text"], ["size", 5], ["value", 1]);
		input_step.style.display = "none";
		span.append(input_step);
		span.insertAdjacentHTML('beforeend', "<br>Отображать в: ");
		let select_cs = createElement("select");
		let elm = createElement("option", ["disabled", true]);
			elm.insertAdjacentText('beforeend', "система координат");
		select_cs.append(elm);
		for(let i = 0; i < sc.length; i++){
			let op = createElement("option");
			op.insertAdjacentText('beforeend', sc[i].name);
			select_cs.append(op);
		}
		select_cs.selectedIndex = id_sc + 1;
		span.append(select_cs);
		let label_t = createElement("label");
			label_t.insertAdjacentText('beforeend', " text ");
		let input_t = createElement("input", ["type", "checkbox"]);
		label_t.append(input_t);
		span.append(label_t);
		span.insertAdjacentText('beforeend', " ");
		let input_angle = createElement("input", ["type", "text"], ["size", 5], ["value", angle]);
		input_angle.style.display = "none";
		span.append(input_angle);
		let span_angle = createElement("span", ["class", "span_angle"]);
		span_angle.style.display = "none";
		span.append(span_angle);
		span.insertAdjacentHTML('beforeend', "<hr>");
		menu.append(span);
		/// Методы
		let count_t_b = 0;// text_bord(t_b)
		let arr_t_b = [];
		let out_t = (side, t, c) => {
			let elm = null;
			if(arr_t_b.length <= count_t_b){
				elm = create_t_bord();
				arr_t_b[arr_t_b.length] = elm;
				count_t_b++;
			}else elm = arr_t_b[count_t_b++];
			elm.textContent = t;
			side_t_b(elm, side, c);
			if(!text_layer.contains(elm))text_layer.appendChild(elm);
		};
		let remove_t = () => {
			for(let i = count_t_b; i < arr_t_b.length; i++){
				if(text_layer.contains(arr_t_b[i]))text_layer.removeChild(arr_t_b[i]);
				else break;
			}
		};
		let remove_t_all = () => {
			count_t_b = 0;
			remove_t();
			if(arr_t_b.length > 1500)arr_t_b.length = 1500;//чтоб не грузить память.
		};
		let out_t_b = () => {
			if(input_t.checked){
				count_t_b = 0;
				let offset = 1;
				let flag_l = false;
				let flag_r = false;
				let flag_d = false;// Потом добавить условие, например от 50 градусов.
				let c;
				for(let i = w_grid; i < arr_c_grid.length - w_grid; i++){
					if(i % w_grid !== 0){
						if(!flag_l){
							c = intersection(arr_c_grid[i - 1][0], arr_c_grid[i - 1][1], arr_c_grid[i][0], arr_c_grid[i][1], offset, height_map);
							if(c !== 0){
								out_t("l", f_format_t_b(arr_c_y[i / w_grid | 0], false, select_step.selectedIndex), c);
								flag_l = true;
							}else if(flag_d){
								c = intersection(arr_c_grid[i - 1][1], arr_c_grid[i - 1][0], arr_c_grid[i][1], arr_c_grid[i][0], offset, width_map);
								if(c !== 0){
									out_t("t", f_format_t_b(arr_c_y[i / w_grid | 0], true, select_step.selectedIndex), c);
									flag_l = true;
								}
							}
						}
						if(!flag_r){
							c = intersection(arr_c_grid[i - 1][0], arr_c_grid[i - 1][1], arr_c_grid[i][0], arr_c_grid[i][1], width_map - offset, height_map);
							if(c !== 0){
								out_t("r", f_format_t_b(arr_c_y[i / w_grid | 0], false, select_step.selectedIndex), c);
								flag_r = true;
							}else if(flag_d){
								c = intersection(arr_c_grid[i - 1][1], arr_c_grid[i - 1][0], arr_c_grid[i][1], arr_c_grid[i][0], height_map - offset, width_map);
								if(c !== 0){
									out_t("b", f_format_t_b(arr_c_y[i / w_grid | 0], true, select_step.selectedIndex), c);
									flag_r = true;
								}
							}
						}
					}else{
						flag_l = false;
						flag_r = false;
					}
				}
				let flag_t = false;
				let flag_b = false;
				for(let i = 1; i < w_grid - 1; i++){
					for(let j = i; j < arr_c_grid.length; j += w_grid){
						if(j >= w_grid){
							if(!flag_t){
								c = intersection(arr_c_grid[j][1], arr_c_grid[j][0], arr_c_grid[j - w_grid][1], arr_c_grid[j - w_grid][0], offset, width_map);
								if(c !== 0){
									out_t("t", f_format_t_b(arr_c_x[i], true, select_step.selectedIndex), c);
									flag_t = true;
								}else if(flag_d){
									c = intersection(arr_c_grid[j][0], arr_c_grid[j][1], arr_c_grid[j - w_grid][0], arr_c_grid[j - w_grid][1], offset, height_map);
									if(c !== 0){
										out_t("l", f_format_t_b(arr_c_x[i], false, select_step.selectedIndex), c);
										flag_t = true;
									}
								}
							}
							if(!flag_b){
								c = intersection(arr_c_grid[j][1], arr_c_grid[j][0], arr_c_grid[j - w_grid][1], arr_c_grid[j - w_grid][0], height_map - offset, width_map);
								if(c !== 0){
									out_t("b", f_format_t_b(arr_c_x[i], true, select_step.selectedIndex), c);
									flag_b = true;
								}else if(flag_d){
									c = intersection(arr_c_grid[j][0], arr_c_grid[j][1], arr_c_grid[j - w_grid][0], arr_c_grid[j - w_grid][1], width_map - offset, height_map);
									if(c !== 0){
										out_t("r", f_format_t_b(arr_c_x[i], false, select_step.selectedIndex), c);
										flag_b = true;
									}
								}
							}
						}else{
							flag_t = false;
							flag_b = false;
						}
					}
				}
				remove_t();
			}
		};
		let f_auto_step = () => {
			interval = f_interval(sc[select_cs.selectedIndex - 1].metre, select_step);
		};
		let f_draw = () => {
			if(input_on.checked){
				if(sc[id_sc].angle)hotine_a = angle;
				f_grid(interval, coor_top_left, coor_bot_right, sc[select_cs.selectedIndex - 1]);
				span_angle.textContent = " ∠"+toDeg(a_f_grid).toFixed(2)+"°";
				let d_path = "";
				for(let i = w_grid; i < arr_c_grid.length - w_grid; i++){
					d_path += (i % w_grid === 0 ? "M": "L")+arr_c_grid[i][0]+","+arr_c_grid[i][1];
				}
				for(let i = 1; i < w_grid - 1; i++){
					for(let j = i; j < arr_c_grid.length; j += w_grid){
						d_path += (j == i ? "M": "L")+arr_c_grid[j][0]+","+arr_c_grid[j][1];
					}
				}
				line.setAttributeNS(null, "d", d_path);
				out_t_b();
			}
		};
		/// Слушатели меню
		// Цвет.
		input_color.onchange = () => {
			line.setAttributeNS(null, "stroke", input_color.value);
		};
		// Прозрачность
		input_opacity.oninput = () => {
			line.setAttributeNS(null, "stroke-opacity", input_opacity.value);
		};
		// Авто смена шага
		input_auto.onchange = () => {
			if(input_auto.checked){
				input_step.style.display = "none";
				select_step.disabled = true;
				if(input_on.checked)map.view.on('change:resolution', f_auto_step);
				f_auto_step();
				f_draw();
			}else{
				select_step.disabled = false;
				if(input_on.checked)map.view.un('change:resolution', f_auto_step);
			}
		};
		// Вкл./Выкл.
		input_on.onchange = () => {
			if(input_on.checked){
				if(input_auto.checked){
					map.view.on('change:resolution', f_auto_step);
					f_auto_step();
				}else if(f_interval(sc[select_cs.selectedIndex - 1].metre) - interval * 10 > 0){
					input_step.style.display = "none";
					f_auto_step();// Если разница большая то авто выбор делаем интервала.
				}
				f_draw();
			}else{
				span_angle.textContent = "";
				if(input_auto.checked)map.view.un('change:resolution', f_auto_step);
				line.setAttributeNS(null, "d", "");
				if(input_t.checked)remove_t_all();
			}
		};
		// Смена src
		select_cs.onchange = () => {
			if(sc[id_sc].metre !== sc[select_cs.selectedIndex - 1].metre){
				input_step.style.display = "none";
				f_auto_step();
			}
			id_sc = select_cs.selectedIndex - 1;
			f_select_step(select_step.children, sc[id_sc].metre);
			if(sc[id_sc].angle)input_angle.style.display = "inline";
			else input_angle.style.display = "none";
			if(sc[id_sc].angle === undefined && sc[id_sc].f_a)span_angle.style.display = "inline";
			else span_angle.style.display = "none";
			f_draw();
		};
		// Смена шага
		select_step.onchange = () => {
			if(arr_grid_step[select_step.selectedIndex].hasOwnProperty("i")){
				input_step.style.display = "none";
				interval = arr_grid_step[select_step.selectedIndex].i;
			}else{//else if(arr_grid_step[select_step.selectedIndex].hasOwnProperty("f")){
				input_step.style.display = "inline";
				input_step.value = interval / arr_grid_step[select_step.selectedIndex].f;
			}
			f_draw();
		};
		// Текстовая смена шага
		input_step.onblur = () => {
			let n = parseFloat(input_step.value);
			if(isFinite(n) && n != 0){
				interval = n * arr_grid_step[select_step.selectedIndex].f;
				f_draw();
			}else input_step.value = interval / arr_grid_step[select_step.selectedIndex].f;
		};
		input_step.onkeydown = f_enter;
		input_step.onfocus = f_focus;
		// Поле для задания угла.
		input_angle.onblur = () => {
			let n = parseFloat(input_angle.value);
			if(isFinite(n)){
				angle = toRad(n);
				f_draw();
			}else input_angle.value = toDeg(angle);
		};
		input_angle.onkeydown = f_enter;
		input_angle.onfocus = f_focus;
		// Отображать текст по сторонам.
		input_t.onchange = () => {
			if(input_t.checked)f_draw();
			else if(input_on.checked)remove_t_all();
		}
		/// EXTRA
		f_auto_step();
		f_select_step(select_step.children, sc[id_sc].metre);
		return f_draw;
	}
	var f_draw_1 = marking({id_sc:1});
	var f_draw_2 = marking({color:"#ff5050"});
	///#####################################
	
	
	
	
	
	/// СЕТКА
	// Функция, наклона координат, относительно центра на заданный угол.
	let point_to_angle = (c, center, angle) => {
				let x = c[0] - center[0];
				let y = c[1] - center[1];
				let a;
				if(x === 0) a = (y > 0) ? 0 : Math.PI;
				else{
					a = Math.atan(y / x);
					if(x < 0)a += Math.PI;
				}
				let r = (x ** 2 + y ** 2) ** .5;
				a -= angle;
				c[0] = (center[0] + r * Math.cos(a));
				c[1] = (center[1] + r * Math.sin(a));
	};
	
	let f_grid_2 = (interval_E, interval_N, offset_E, offset_N, limit_E, limit_N, limit, coor_top_l, coor_bot_r, sc, coor_c) => {
		// Находим центр
		// TEST
		let c_centr = [coor_c[0], coor_c[1]];//[(coor_bot_r[0] - coor_top_l[0]) / 2 + coor_top_l[0], (coor_bot_r[1] - coor_top_l[1]) / 2 + coor_top_l[1]];
		// Находим зону, ось в центре если есть. И координаты новой проекции в центре.
		let centr_to = sc.f_to(c_centr);
		// Сохраняем номер зоны, ось если есть.
		let z_s = centr_to.slice(2);
		// Сооздаем, копируем(чтоб не менять входных данных) координаты углов.
		let c_top_l = [coor_top_l[0], coor_top_l[1], ...z_s];
		let c_top_r = [coor_bot_r[0], coor_top_l[1], ...z_s];
		let c_bot_l = [coor_top_l[0], coor_bot_r[1], ...z_s];
		let c_bot_r = [coor_bot_r[0], coor_bot_r[1], ...z_s];
		// Защита от неправильной работы функций возврата координат UTM и Гаусса Крюгера, когда они дают сбой и возвращают черезмерно большие значения. на мелком масштабе.
		if(sc.limit){
			if(c_top_r[0] - c_top_l[0] > sc.limit * 2){
				c_top_r[0] = c_centr[0] + sc.limit;
				c_bot_r[0] = c_top_r[0];
				c_top_l[0] = c_centr[0] - sc.limit;
				c_bot_l[0] = c_top_l[0];
			}
		}
		// Если есть угол
		if(sc.f_a){
			// TEST
			c_centr = [(coor_bot_r[0] - coor_top_l[0]) / 2 + coor_top_l[0], (coor_bot_r[1] - coor_top_l[1]) / 2 + coor_top_l[1]];
			// Вычисляем наклон каждой точки относительно центра.
			a_f_grid = sc.f_a(centr_to);
			point_to_angle(c_top_l, c_centr, a_f_grid);
			point_to_angle(c_top_r, c_centr, a_f_grid);
			point_to_angle(c_bot_l, c_centr, a_f_grid);
			point_to_angle(c_bot_r, c_centr, a_f_grid);
		}
		// Находим координаты углов в новой проекции. Учитывая зону, ось если есть.
		let c_top_left_to = sc.f_to(c_top_l);
		let c_top_right_to = sc.f_to(c_top_r);
		let c_bot_left_to = sc.f_to(c_bot_l);
		let c_bot_right_to = sc.f_to(c_bot_r);
		// Определяем крайние положения в новой проекции.
		let left = Math.max(c_top_left_to[0], c_bot_left_to[0]);
		let right = Math.min(c_top_right_to[0], c_bot_right_to[0]);
		let top = Math.min(c_top_right_to[1], c_top_left_to[1]);
		let bot = Math.max(c_bot_left_to[1], c_bot_right_to[1]);
		// Устанавливаем ограничения для севера и юга, Чтоб если заходили за пределы карты не перескакивали на другой полюс.
		let top_limit = top;
		let bot_limit = bot;
		// чтоб сетка была внутри заданных координат, независимо от того в каком полушарии.
		if(left > 0)left += interval_E;
		if(right < 0)right -= interval_E;
		if(top < 0)top -= interval_N;
		if(bot > 0)bot += interval_N;
		// Убираем дробную часть интервала.
		left -= left % interval_E;
		right -= right % interval_E;
		top -= top % interval_N;
		bot -= bot % interval_N;
		// Добавляем смещение в пределах шага.
		left += offset_E % interval_E;
		right += offset_E % interval_E;
		top += offset_N % interval_N;
		bot += offset_N % interval_N;
		// чуть чуть увеличиваем, ограничения, до которых строить сетку.
		top += interval_N * .1;
		right += interval_E * .1;
		// Дополнительные переменные формирования сетки.
		let i = 0;
		let j = 0;
		let coor = [0, 0, ...z_s];
		w_grid = (right - left + interval_E) / interval_E | 0;
		if(w_grid > limit_E)w_grid = limit_E;
		//arr_c_x.length = w_grid;
		// Запускаем цыклы формирования сетки.
		while(bot <= top && limit_N > 0){
			coor[1] = bot;
			// Если выходит за пределы север, юг, чтоб не создавать лишние точки.
			arr_c_y[j++] = coor[1];
			let limit_x = limit_E;
			for(let x = left; x <= right && limit_x > 0 && limit > 0; x += interval_E){
				if(i < w_grid)arr_c_x[i] = x;
				coor[0] = x;
				arr_c_grid[i] = map.map.getPixelFromCoordinate(sc.f_from(coor));
				i++;
				limit_x--;
				limit--;
			}
			bot += interval_N;
			limit_N--;
		}
		//arr_c_y.length = j;
		arr_c_grid.length = i;
	};
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
	let rail_down = (e, f) => {
		e.preventDefault();
		let onMouseUp = () => {
			document.removeEventListener('mouseup', onMouseUp);
			document.removeEventListener('mousemove', f);
		};
		document.addEventListener('mousemove', f);
		document.addEventListener('mouseup', onMouseUp);
		
	};
	let f_interval_g = (a, select_step) => {// TEST
		for(let i = delimiter_step + 1; i < arr_grid_step.length; i++)if(arr_grid_step[i].hasOwnProperty("z_a") && a <= arr_grid_step[i].z_a){
			if(select_step)select_step.selectedIndex = i - delimiter_step;
			return arr_grid_step[i].i;
		}
	};
	let grid = () => {
		/// Настройки
		let width = 20;
		let offset = 100;//50;// + width;
		
		let c_t_l = [offset, offset];//coor_top_left
		let c_b_r = [width_map - offset, height_map - offset];//coor_bot_right
		let coor_t_l, coor_b_r, coor_c;
		
		let angle = 0;
		
		let interval_E = 500000;
		let interval_N = interval_E;
		let offset_E = 0;
		let offset_N = 0;
		let limit_E = 300;
		let limit_N = 300;
		let limit = 100000;
		// Настраиваем площади для смены интервала.
		let max_WM = Math.PI * 2 * crs.ell.wgs_84.a;
		let f_z_to_area = z => (c_b_r[0] - c_t_l[0]) * (c_b_r[1] - c_t_l[1]) * (max_WM / (2 ** (z + 7.999999))) ** 2;// в идеале к z прибавлять 8(это 2 ^ 8 = 256), но из за погрешностей правилнее работает с чуть меньшим числом.
		//for(let i = delimiter_step + 1; i < arr_grid_step.length; i++)if(arr_grid_step[i].hasOwnProperty("z"))arr_grid_step[i].z_a = f_z_to_area(arr_grid_step[i].z);
		for(let i = delimiter_step + 1; i < arr_grid_step.length; i++)if(arr_grid_step[i].hasOwnProperty("z"))arr_grid_step[i].z_a = arr_grid_step[i].z === 0 ? Infinity: f_z_to_area(arr_grid_step[i].z);// Infinity для увелечения сетки за пределы, максимальных значений. и после включения сетки.
		
		
		/// SVG
		let layer = createElementNS("g");
		// Рамка.
		let rail_t_l = create_rail();
		layer.appendChild(rail_t_l);
		let rail_t = create_rail();
		layer.appendChild(rail_t);
		let rail_t_r = create_rail();
		layer.appendChild(rail_t_r);
		let rail_r = create_rail();
		layer.appendChild(rail_r);
		let rail_b_r = create_rail();
		layer.appendChild(rail_b_r);
		let rail_b = create_rail();
		layer.appendChild(rail_b);
		let rail_b_l = create_rail();
		layer.appendChild(rail_b_l);
		let rail_l = create_rail();
		layer.appendChild(rail_l);
		// Точка в центре сетки.
		let p_center = createElementNS("path", ["fill", "none"], ["stroke-width", 5], ["stroke-opacity", 1], ["stroke", "#ff5050"], ["stroke-linecap", "round"]);
		// Линия сетки
		let line = createElementNS("path", ["fill", "none"], ["stroke-width", 1], ["stroke-opacity", 1], ["stroke", "#000"]);
		layer.appendChild(line);
		
		
		
		
		
		/// Меню
		let span = createElement("span");
		span.insertAdjacentHTML('beforeend', "<center>Сетка</center>");
		// Вкл. / Выкл.
		let label_on = createElement("label");
			label_on.insertAdjacentText('beforeend', "Отобразить:");
		let input_on = createElement("input", ["type", "checkbox"]);
		label_on.append(input_on);
		span.append(label_on);
		// Центр.
		let label_center = createElement("label");
			label_center.insertAdjacentHTML('beforeend', ' Центер <b style="color:#ff5050;">•</b> ');
		let input_center = createElement("input", ["type", "checkbox"]);
		label_center.append(input_center);
		span.append(label_center);
		// Выровнить рамку сетки.
		span.insertAdjacentText('beforeend', " ");
		let b_align = createElement("span", ["class", "button"]);
		b_align.insertAdjacentText('beforeend', "Выровнить");
		span.append(b_align);
		// рамка на карте / экране.
		span.insertAdjacentHTML('beforeend', "<br>");
		let label_to_map = createElement("label");
			label_to_map.insertAdjacentText('beforeend', "Рамка двигается вместе с картой ");
		let input_to_map = createElement("input", ["type", "checkbox"], ["checked", true]);
		label_to_map.append(input_to_map);
		span.append(label_to_map);
		span.insertAdjacentHTML('beforeend', "<br>");
		// Шаг сетки
		span.insertAdjacentHTML('beforeend', " Шаг сетки : ");
		let select_step = createElement("select");//, ["disabled", true]);
		for(let i = 0; i < arr_grid_step.length; i++){
			let op = createElement("option");
				op.textContent = arr_grid_step[i].t;
			if(arr_grid_step[i].d)op.disabled = true;
			select_step.append(op);
			if(i === 0)i = delimiter_step;
		}
		select_step.disabled = true;
		span.append(select_step);
		let label_auto = createElement("label");
			label_auto.insertAdjacentText('beforeend', " авто ");
		let input_auto = createElement("input", ["type", "checkbox"], ["checked", true]);
		label_auto.append(input_auto);
		span.append(label_auto);
		span.insertAdjacentText('beforeend', " ");
		let input_step = createElement("input", ["type", "text"], ["size", 5], ["value", 1]);
		input_step.style.display = "none";
		span.append(input_step);
		span.insertAdjacentHTML('beforeend', "<br>");
		// Выбор cs
		let arr_id_sc = [1, 2, 3, 5, 6, 7];// Иды систем координат, которые используются для построения сеток.
		span.insertAdjacentText('beforeend', "Координаты: ");
		let select_cs = createElement("select");
		let elm = createElement("option", ["disabled", true]);
			elm.insertAdjacentText('beforeend', "система координат");
		select_cs.append(elm);
		
		for(let i = 0; i < arr_id_sc.length; i++){
			let op = createElement("option");
			op.insertAdjacentText('beforeend', sc[arr_id_sc[i]].name);
			select_cs.append(op);
		}
		select_cs.selectedIndex = 1;
		span.append(select_cs);
		// Угол
		span.insertAdjacentText('beforeend', " ");
		let input_angle = createElement("input", ["type", "text"], ["size", 5], ["value", angle]);
		input_angle.style.display = "none";
		span.append(input_angle);
		let span_angle = createElement("span", ["class", "span_angle"]);
		span_angle.style.display = "none";
		span.append(span_angle);
		span.insertAdjacentHTML('beforeend', "<br>");
		// Дополнительные настройки
		let b_addition = createElement("span", ["class", "plus"], ["checked", false]);
		b_addition.insertAdjacentText('beforeend', "(Дополнительно)");
		span.append(b_addition);
		let s_addition = createElement("span", ["style", "display:none;"]);
		s_addition.insertAdjacentHTML('beforeend', "<br>");
		span.append(s_addition);
		// Цвет и прозрачность
		s_addition.insertAdjacentHTML('beforeend', "Цвет и прозрачность: &ensp;&emsp;");
		let input_color = createElement("input", ["type", "color"], ["value", "#000"]);
		s_addition.insertAdjacentText('beforeend', " ");
		s_addition.append(input_color);
		let input_opacity = createElement("input", ["type", "range"], ["style", "width:85px"], ["min", "0"], ["max", "1"], ["step", ".01"], ["value", 1]);
		s_addition.append(input_opacity);
		// Шаг сетки по N
		s_addition.insertAdjacentHTML('beforeend', "<br>Шаг сетки N:");
		let select_step_N = createElement("select");//, ["disabled", true]);
		for(let i = 0; i < arr_grid_step.length; i++){
			let op = createElement("option");
				op.textContent = arr_grid_step[i].t;
			if(arr_grid_step[i].d)op.disabled = true;
			select_step_N.append(op);
			if(i === 0)i = delimiter_step;
		}
		select_step_N.disabled = true;
		s_addition.append(select_step_N);
		let label_auto_N = createElement("label");
			label_auto_N.insertAdjacentText('beforeend', " авто ");
		let input_auto_N = createElement("input", ["type", "checkbox"], ["checked", true]);
		label_auto_N.append(input_auto_N);
		s_addition.append(label_auto_N);
		s_addition.insertAdjacentText('beforeend', " ");
		let input_step_N = createElement("input", ["type", "text"], ["size", 5], ["value", 1]);
		input_step_N.style.display = "none";
		s_addition.append(input_step_N);
		// Устанавливаем начальный шаг
		for(let i = delimiter_step + 1; i < arr_grid_step.length; i++)if(arr_grid_step[i].hasOwnProperty("z") && z >= arr_grid_step[i].z){
			select_step.selectedIndex = i - delimiter_step;
			select_step_N.selectedIndex = i - delimiter_step;
			interval_E = arr_grid_step[i].i;
			interval_N = interval_E;
			break;
		}
		// Смещение шага сетки offset_E
		s_addition.insertAdjacentHTML('beforeend', "<br><br>Смещение шага сетки E: ");
		let input_offset_E = createElement("input", ["type", "text"], ["size", 5], ["value", offset_E]);
		s_addition.append(input_offset_E);
		// Единицы
		s_addition.insertAdjacentText('beforeend', " ");
		let select_units = createElement("select");
		elm = createElement("option", ["disabled", true]);
		elm.textContent = "единицы";
		select_units.append(elm);
		for(let i = delimiter_step + 1; i < arr_grid_step.length; i++)if(!arr_grid_step[i].hasOwnProperty("i") && !arr_grid_step[i].hasOwnProperty("d")){
			let op = createElement("option");
				op.textContent = arr_grid_step[i].t;
				op.value = arr_grid_step[i].f;
			select_units.append(op);
		}
		select_units.selectedIndex = 2;// Метры
		s_addition.append(select_units);
		// Смещение сетки offset_N
		s_addition.insertAdjacentHTML('beforeend', "<br>Смещение шага сетки N: ");
		let input_offset_N = createElement("input", ["type", "text"], ["size", 5], ["value", offset_N]);
		s_addition.append(input_offset_N);
		
		
		
		// Лимит точек(шагов) E и N // limit_E
		s_addition.insertAdjacentHTML('beforeend', "<br><br>Лимит точек по E: ");
		let input_limit_E = createElement("input", ["type", "text"], ["size", 5], ["value", limit_E]);
		s_addition.append(input_limit_E);
		s_addition.insertAdjacentText('beforeend', " ");
		let span_limit_E = createElement("span");
		s_addition.append(span_limit_E);
		s_addition.insertAdjacentHTML('beforeend', "<br>Лимит точек по N: ");
		let input_limit_N = createElement("input", ["type", "text"], ["size", 5], ["value", limit_N]);
		s_addition.append(input_limit_N);
		s_addition.insertAdjacentText('beforeend', " ");
		let span_limit_N = createElement("span");
		s_addition.append(span_limit_N);
		s_addition.insertAdjacentHTML('beforeend', "<br>Лимит всех точек: ");
		let input_limit = createElement("input", ["type", "text"], ["size", 5], ["value", limit]);
		s_addition.append(input_limit);
		s_addition.insertAdjacentText('beforeend', " ");
		let span_limit = createElement("span");
		s_addition.append(span_limit);
		
		// Позиционирование рамки.
		s_addition.insertAdjacentHTML('beforeend', "<br><br>Левый верхний угол рамки N, E: ");
		let input_t_l = createElement("input", ["type", "text"], ["class", "frame_a"]);
		s_addition.append(input_t_l);
		s_addition.insertAdjacentHTML('beforeend', "<br>Правый нижний угол рамки N, E: ");
		let input_b_r = createElement("input", ["type", "text"], ["class", "frame_a"]);
		s_addition.append(input_b_r);
		
		
		// Центр.
		s_addition.insertAdjacentHTML('beforeend', "<br>Центр N, E: ");
		
		let text_center = createElement("input", ["type", "text"], ["class", "frame_a"]);
		s_addition.append(text_center);
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		s_addition.insertAdjacentHTML('beforeend', "<br><br><hr>");
		
		
		
		menu.append(span);
		/// Функции
		let f_coor = () => {
			coor_t_l = map.map.getCoordinateFromPixel(c_t_l);
			coor_b_r = map.map.getCoordinateFromPixel(c_b_r);
		};
		
		
		let f_auto_step = () => {// Определяет интервал.
			//interval_E = f_interval_g(select_step);
			let area = (coor_b_r[0] - coor_t_l[0]) * (coor_t_l[1] - coor_b_r[1]);// Площадь области сетки в системе координат WM по ней и будем определять шаг.
			interval_E = f_interval_g(area, select_step);
			if(input_auto_N.checked){
				interval_N = interval_E;
				select_step_N.selectedIndex = select_step.selectedIndex;
			}
			//document.getElementById("test_grid").innerHTML = f_z_to_area(z)+"<br>"+area+"<br>"+coor_t_l+"<br>"+coor_b_r+"<br>"+f_interval_g(area);
			
		};
		
		
		//map.map.once('precompose', f_coor);
		//f_coor();
		let rail_draw = () => {
			rail_t_l.setAttributeNS(null, "d", "M"+c_t_l[0]+","+c_t_l[1]+"h-"+width+"v-"+width+"h"+width+"z");
			rail_t.setAttributeNS(null, "d", "M"+c_t_l[0]+","+c_t_l[1]+"v-"+width+"h"+(c_b_r[0] - c_t_l[0])+"v"+width+"z");
			rail_t_r.setAttributeNS(null, "d", "M"+c_b_r[0]+","+c_t_l[1]+"v-"+width+"h"+width+"v"+width+"z");
			rail_r.setAttributeNS(null, "d", "M"+c_b_r[0]+","+c_t_l[1]+"h"+width+"v"+(c_b_r[1] - c_t_l[1])+"h-"+width+"z");
			rail_b_r.setAttributeNS(null, "d", "M"+c_b_r[0]+","+c_b_r[1]+"h"+width+"v"+width+"h-"+width+"z");
			rail_b.setAttributeNS(null, "d", "M"+c_b_r[0]+","+c_b_r[1]+"v"+width+"h-"+(c_b_r[0] - c_t_l[0])+"v-"+width+"z");
			rail_b_l.setAttributeNS(null, "d", "M"+c_t_l[0]+","+c_b_r[1]+"v"+width+"h-"+width+"v-"+width+"z");
			rail_l.setAttributeNS(null, "d", "M"+c_t_l[0]+","+c_b_r[1]+"h-"+width+"v-"+(c_b_r[1] - c_t_l[1])+"h"+width+"z");
			
			if(input_center.checked)p_center.setAttributeNS(null, "d", "M"+((c_t_l[0] + c_b_r[0]) / 2)+","+((c_t_l[1] + c_b_r[1]) / 2)+"h0");
		};
		//rail_draw();
		
		
		let draw_out = () => {
			if(sc[arr_id_sc[select_cs.selectedIndex - 1]].angle)hotine_a = angle;
			f_grid_2(interval_E, interval_N, offset_E, offset_N, limit_E, limit_N, limit, coor_t_l, coor_b_r, sc[arr_id_sc[select_cs.selectedIndex - 1]], coor_c);
			span_angle.textContent = " ∠"+toDeg(a_f_grid).toFixed(2)+"°";
			let d_path = "";
			let i = 0;
			for(let i = 0; i < arr_c_grid.length; i++){
				d_path += (i % w_grid === 0 ? "M": "L")+arr_c_grid[i][0]+","+arr_c_grid[i][1];
			}
			for(let i = 0; i < w_grid; i++){
				for(let j = i; j < arr_c_grid.length; j += w_grid){
					d_path += (j == i ? "M": "L")+arr_c_grid[j][0]+","+arr_c_grid[j][1];
				}
			}
			line.setAttributeNS(null, "d", d_path);
			
			if(arr_c_grid.length > 0){
				span_limit_E.textContent = w_grid > arr_c_grid.length ? arr_c_grid.length: w_grid;
				span_limit_N.textContent = arr_c_grid.length / w_grid | 0;
			}else{
				span_limit_E.textContent = "0";
				span_limit_N.textContent = "0";
			}
			span_limit.textContent = arr_c_grid.length;
		};
		
		let draw = (flag_m = true) => {
			if(input_on.checked){
				if(input_to_map.checked && flag_m){
					c_t_l = map.map.getPixelFromCoordinate(coor_t_l);
					c_b_r = map.map.getPixelFromCoordinate(coor_b_r);
				}else{
					f_coor();
					input_t_l.value = to_wgs_84_N_E(coor_t_l);
					input_b_r.value = to_wgs_84_N_E(coor_b_r);
					if(input_auto.checked)f_auto_step();
					
					
					// Находим центр
					coor_c = [(coor_b_r[0] - coor_t_l[0]) / 2 + coor_t_l[0], (coor_b_r[1] - coor_t_l[1]) / 2 + coor_t_l[1]];
					text_center.value = to_wgs_84_N_E(coor_c);
				}
				rail_draw();
				
				
				
				draw_out();
				
				
				
				
				
			}
		};
		/// События
		// SVG
		rail_t_l.onmousedown = e => {
			rail_down(e, e => {
				c_t_l[0] += e.movementX;
				c_t_l[1] += e.movementY;
				if(c_t_l[0] > c_b_r[0])c_b_r[0] = c_t_l[0];
				if(c_t_l[1] > c_b_r[1])c_b_r[1] = c_t_l[1];
				draw(false);
			});
		};
		rail_t.onmousedown = e => {
			rail_down(e, e => {
				c_t_l[1] += e.movementY;
				if(c_t_l[1] > c_b_r[1])c_b_r[1] = c_t_l[1];
				draw(false);
			});
		};
		rail_t_r.onmousedown = e => {
			rail_down(e, e => {
				c_b_r[0] += e.movementX;
				c_t_l[1] += e.movementY;
				if(c_t_l[0] > c_b_r[0])c_t_l[0] = c_b_r[0];
				if(c_t_l[1] > c_b_r[1])c_b_r[1] = c_t_l[1];
				draw(false);
			});
		};
		rail_r.onmousedown = e => {
			rail_down(e, e => {
				c_b_r[0] += e.movementX;
				if(c_t_l[0] > c_b_r[0])c_t_l[0] = c_b_r[0];
				draw(false);
			});
		};
		rail_b_r.onmousedown = e => {
			rail_down(e, e => {
				c_b_r[0] += e.movementX;
				c_b_r[1] += e.movementY;
				if(c_t_l[0] > c_b_r[0])c_t_l[0] = c_b_r[0];
				if(c_t_l[1] > c_b_r[1])c_t_l[1] = c_b_r[1];
				draw(false);
			});
		};
		rail_b.onmousedown = e => {
			rail_down(e, e => {
				c_b_r[1] += e.movementY;
				if(c_t_l[1] > c_b_r[1])c_t_l[1] = c_b_r[1];
				draw(false);
			});
		};
		rail_b_l.onmousedown = e => {
			rail_down(e, e => {
				c_t_l[0] += e.movementX;
				c_b_r[1] += e.movementY;
				if(c_t_l[0] > c_b_r[0])c_b_r[0] = c_t_l[0];
				if(c_t_l[1] > c_b_r[1])c_t_l[1] = c_b_r[1];
				draw(false);
			});
		};
		rail_l.onmousedown = e => {
			rail_down(e, e => {
				c_t_l[0] += e.movementX;
				if(c_t_l[0] > c_b_r[0])c_b_r[0] = c_t_l[0];
				draw(false);
			});
		};
		// Вкл./Выкл.
		input_on.onchange = () => {
			if(input_on.checked){
				if(coor_t_l === undefined){
					draw(false);
				}else{
					draw();
					input_t_l.value = to_wgs_84_N_E(coor_t_l);
					input_b_r.value = to_wgs_84_N_E(coor_b_r);
					text_center.value = to_wgs_84_N_E(coor_c);
				}
				svg.appendChild(layer);
			}else{
				span_angle.textContent = "";
				span_limit_E.textContent = "";
				span_limit_N.textContent = "";
				span_limit.textContent = "";
				input_t_l.value = "";
				input_b_r.value = "";
				text_center.value = "";
				if(svg.contains(layer))svg.removeChild(layer);
			}
			
		};
		// Центр.
		input_center.onchange = () => {
			if(input_center.checked){
				p_center.setAttributeNS(null, "d", "M"+((c_t_l[0] + c_b_r[0]) / 2)+","+((c_t_l[1] + c_b_r[1]) / 2)+"h0");
				layer.appendChild(p_center);
			}else if(layer.contains(p_center))layer.removeChild(p_center);
			
		};
		// Выровнить рамку сетки.
		b_align.onclick = () => {
			if(coor_t_l !== undefined){
				c_t_l = [offset, offset];
				c_b_r = [width_map - offset, height_map - offset];
				draw(false);
			};
		};
		// рамка на карте / экране.
		input_to_map.onchange = () => {
			if(input_to_map.checked){
				f_coor();
			}
		};
		// Дополнительные настройки
		b_addition.onclick = () => {
			b_addition.setAttribute("checked", b_addition.getAttribute("checked") === "false");
			if(b_addition.getAttribute("checked") === "true")s_addition.style.display = "inline";
			else s_addition.style.display = "none";
		};
		// Выбор cs
		select_cs.onchange = () => {
			if(sc[arr_id_sc[select_cs.selectedIndex - 1]].angle)input_angle.style.display = "inline";
			else input_angle.style.display = "none";
			if(sc[arr_id_sc[select_cs.selectedIndex - 1]].angle === undefined && sc[arr_id_sc[select_cs.selectedIndex - 1]].f_a)span_angle.style.display = "inline";
			else span_angle.style.display = "none";
			if(input_on.checked)draw_out();
		};
		// Авто смена шага
		input_auto.onchange = () => {
			if(input_auto.checked){
				input_step.style.display = "none";
				select_step.disabled = true;
				if(coor_t_l === undefined){
					for(let i = delimiter_step + 1; i < arr_grid_step.length; i++)if(arr_grid_step[i].hasOwnProperty("z") && z >= arr_grid_step[i].z){
						select_step.selectedIndex = i - delimiter_step;
						interval_E = arr_grid_step[i].i;
						if(input_auto_N.checked){
							select_step_N.selectedIndex = i - delimiter_step;
							interval_N = interval_E;
						}
						break;
					}
				}else if(!input_on.checked)f_auto_step();
				draw(false);
			}else{
				select_step.disabled = false;
				//if(input_on.checked)map.view.un('change:resolution', f_auto_step);
			}
		};
		// Авто смена шага N
		input_auto_N.onchange = () => {
			if(input_auto_N.checked){
				input_step_N.style.display = "none";
				select_step_N.disabled = true;
				select_step_N.selectedIndex = select_step.selectedIndex;
				interval_N = interval_E;
				draw(false);
			}else{
				select_step_N.disabled = false;
				if(!arr_grid_step[select_step_N.selectedIndex + delimiter_step].hasOwnProperty("i")){
					input_step_N.style.display = "inline";
					input_step_N.value = interval_E / arr_grid_step[select_step_N.selectedIndex + delimiter_step].f;
				}
			}
		};
		// Смена шага
		select_step.onchange = () => {
			if(arr_grid_step[select_step.selectedIndex + delimiter_step].hasOwnProperty("i")){
				input_step.style.display = "none";
				interval_E = arr_grid_step[select_step.selectedIndex + delimiter_step].i;
				if(input_auto_N.checked){
					interval_N = interval_E;
					select_step_N.selectedIndex = select_step.selectedIndex;
				}
			}else{//else if(arr_grid_step[select_step.selectedIndex].hasOwnProperty("f")){
				input_step.style.display = "inline";
				input_step.value = interval_E / arr_grid_step[select_step.selectedIndex + delimiter_step].f;
				if(input_auto_N.checked)select_step_N.selectedIndex = select_step.selectedIndex;
			}
			draw(false);
		};
		// Смена шага N
		select_step_N.onchange = () => {
			if(arr_grid_step[select_step_N.selectedIndex + delimiter_step].hasOwnProperty("i")){
				input_step_N.style.display = "none";
				interval_N = arr_grid_step[select_step_N.selectedIndex + delimiter_step].i;
			}else{
				input_step_N.style.display = "inline";
				input_step_N.value = interval_N / arr_grid_step[select_step_N.selectedIndex + delimiter_step].f;
			}
			draw(false);
		};
		// Текстовая смена шага
		input_step.onblur = () => {
			let n = parseFloat(input_step.value);
			if(isFinite(n) && n != 0){
				interval_E = n * arr_grid_step[select_step.selectedIndex + delimiter_step].f;
				if(input_auto_N.checked)interval_N = interval_E;
				draw(false);
			}else input_step.value = interval_E / arr_grid_step[select_step.selectedIndex + delimiter_step].f;
		};
		input_step.onkeydown = f_enter;
		input_step.onfocus = f_focus;
		// Текстовая смена шага N
		input_step_N.onblur = () => {
			let n = parseFloat(input_step_N.value);
			if(isFinite(n) && n != 0){
				interval_N = n * arr_grid_step[select_step_N.selectedIndex + delimiter_step].f;
				draw(false);
			}else input_step_N.value = interval_N / arr_grid_step[select_step_N.selectedIndex + delimiter_step].f;
		};
		input_step_N.onkeydown = f_enter;
		input_step_N.onfocus = f_focus;
		// Поле для задания угла.
		input_angle.onblur = () => {
			let n = parseFloat(input_angle.value);
			if(isFinite(n)){
				angle = toRad(n);
				draw(false);
			}else input_angle.value = toDeg(angle);
		};
		input_angle.onkeydown = f_enter;
		input_angle.onfocus = f_focus;
		// Цвет.
		input_color.onchange = () => {
			line.setAttributeNS(null, "stroke", input_color.value);
		};
		// Прозрачность
		input_opacity.oninput = () => {
			line.setAttributeNS(null, "stroke-opacity", input_opacity.value);
		};
		// Сдвиг E
		input_offset_E.onblur = () => {
			let n = parseFloat(input_offset_E.value);
			if(isFinite(n)){
				offset_E = n * select_units.value;
				draw(false);
			}else input_offset_E.value = offset_E / select_units.value;
		};
		input_offset_E.onkeydown = f_enter;
		input_offset_E.onfocus = f_focus;
		// Сдвиг N
		input_offset_N.onblur = () => {
			let n = parseFloat(input_offset_N.value);
			if(isFinite(n)){
				offset_N = n * select_units.value;
				draw(false);
			}else input_offset_N.value = offset_N / select_units.value;
		};
		input_offset_N.onkeydown = f_enter;
		input_offset_N.onfocus = f_focus;
		// Смена едениц сдвига
		select_units.onchange = () => {
			input_offset_E.value = offset_E / select_units.value;
			input_offset_N.value = offset_N / select_units.value;
		};
		// Лимит шагов E и N // limit_E
		input_limit_E.onblur = () => {
			let n = parseFloat(input_limit_E.value);
			if(isFinite(n) && n > 0){
				limit_E = n;
				draw(false);
			}else input_limit_E.value = limit_E;
		};
		input_limit_E.onkeydown = f_enter;
		input_limit_E.onfocus = f_focus;
		input_limit_N.onblur = () => {
			let n = parseFloat(input_limit_N.value);
			if(isFinite(n) && n > 0){
				limit_N = n;
				draw(false);
			}else input_limit_N.value = limit_N;
		};
		input_limit_N.onkeydown = f_enter;
		input_limit_N.onfocus = f_focus;
		input_limit.onblur = () => {
			let n = parseFloat(input_limit.value);
			if(isFinite(n) && n > 0){
				limit = n;
				draw(false);
			}else input_limit.value = limit;
		};
		input_limit.onkeydown = f_enter;
		input_limit.onfocus = f_focus;
		// Позиционирование рамки и центер.
		input_t_l.onblur = () => {
			let c = input_t_l.value.split(/[^-0-9\.]+/m, 2).map(toRad);
			let n_N = parseFloat(c[0]);
			let n_E = parseFloat(c[1]);
			if(isFinite(n_N) && isFinite(n_E)){
				coor_t_l = from_wgs_84([c[1], c[0]]);
				if(coor_t_l[0] > coor_b_r[0])coor_b_r[0] = coor_t_l[0];
				if(coor_t_l[1] < coor_b_r[1])coor_b_r[1] = coor_t_l[1];
				c_t_l = map.map.getPixelFromCoordinate(coor_t_l);
				c_b_r = map.map.getPixelFromCoordinate(coor_b_r);
				draw(false);
			}else input_t_l.value = to_wgs_84_N_E(coor_t_l);
		};
		input_t_l.onkeydown = f_enter;
		input_t_l.onfocus = f_focus;
		input_b_r.onblur = () => {
			let c = input_b_r.value.split(/[^-0-9\.]+/m, 2).map(toRad);
			let n_N = parseFloat(c[0]);
			let n_E = parseFloat(c[1]);
			if(isFinite(n_N) && isFinite(n_E)){
				coor_b_r = from_wgs_84([c[1], c[0]]);
				if(coor_t_l[0] > coor_b_r[0])coor_t_l[0] = coor_b_r[0];
				if(coor_t_l[1] < coor_b_r[1])coor_t_l[1] = coor_b_r[1];
				c_t_l = map.map.getPixelFromCoordinate(coor_t_l);
				c_b_r = map.map.getPixelFromCoordinate(coor_b_r);
				draw(false);
			}else input_b_r.value = to_wgs_84_N_E(coor_b_r);
		};
		input_b_r.onkeydown = f_enter;
		input_b_r.onfocus = f_focus;
		// Центр.
		text_center.onblur = () => {
			let c = text_center.value.split(/[^-0-9\.]+/m, 2).map(toRad);
			let n_N = parseFloat(c[0]);
			let n_E = parseFloat(c[1]);
			if(isFinite(n_N) && isFinite(n_E)){
				coor_c = from_wgs_84([c[1], c[0]]);
				
				draw(false);
			}else text_center.value = to_wgs_84_N_E(coor_b_r);
		};
		text_center.onkeydown = f_enter;
		text_center.onfocus = f_focus;
		/// EXTRA
		return draw;
	};
	
	var f_draw_grid = grid();
	
	
	
	
	// TEST
	
}




































