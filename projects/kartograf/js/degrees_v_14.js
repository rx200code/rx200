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
		//
		m_tracks.f_move(coor_bot_left, coor_top_right);
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
		{t:"10 km", i:10000, f:1000, p:"km", z:8.5},
		{t:"50 km", i:50000, f:1000, p:"km", z:5.8},
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
		if(i >= 1 && i <= 10){
			if(n < 0){
				n *= -1;
				if(n > 0)text += "-";//if(n > 0.0013)text += "-";// Возможно избавляемся от -0
			}
			let sec_n = Math.round(n * 3600);
			let seconds = sec_n % 60;
			let minutes = ((sec_n - seconds) / 60) % 60;
			let degrees = sec_n / 3600 | 0;
			text += (degrees < 10 ? "0"+degrees: degrees)+"°"+(minutes < 10 ? "0"+minutes: minutes)+"'"+(seconds < 10 ? "0"+seconds: seconds)+'"';
		}else if(i == 12)text += n < 10 ? "0"+n.toFixed(5)+"°": n.toFixed(5)+"°";
		else if(i == 13)text += Math.round(n * 60)+"'";
		else if(i == 14)text += Math.round(n * 60 * 60)+'"';
		else if(i == 15)text += n+"rad";
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
		let input_opacity = createElement("input", ["type", "range"], ["class", "r_color"], ["min", "0"], ["max", "1"], ["step", ".01"], ["value", .5]);
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
		let a = Math.atan2(y, x) - angle;
		let r = (x ** 2 + y ** 2) ** .5;
		c[0] = (center[0] + r * Math.cos(a));
		c[1] = (center[1] + r * Math.sin(a));
	};
	let grid_center;
	let z_s;
	let con_m;
	let a_f_g;// a_f_grid
	let w_g = 0;// w_grid
	let arr_c_g = [];// arr_c_grid
	let f_grid_2 = (interval_E, interval_N, offset_E, offset_N, limit_E, limit_N, limit, coor_top_l, coor_bot_r, sc, coor_c, a) => {
		/* Вынести за пределы функции.
		// Находим зону, ось в центре если есть. И координаты новой проекции в центре.
		grid_center = sc.f_to(coor_c);
		// Сохраняем номер зоны, ось если есть.
		z_s = grid_center.slice(2);
		// Находим угол сближение меридианов con_m
		let Q_2 = sc.f_to([coor_c[0], coor_c[1] + 1, ...z_s]);
		con_m = Math.atan2(grid_center[0] - Q_2[0], Q_2[1] - grid_center[1]);//con_m = Math.atan2(Q_2[0] - grid_center[0], Q_2[1] - grid_center[1]) * -1;
		////*/
		// Сооздаем, копируем(чтоб не менять входных данных) координаты углов.
		let c_top_l = [coor_top_l[0], coor_top_l[1], ...z_s];
		let c_top_r = [coor_bot_r[0], coor_top_l[1], ...z_s];
		let c_bot_l = [coor_top_l[0], coor_bot_r[1], ...z_s];
		let c_bot_r = [coor_bot_r[0], coor_bot_r[1], ...z_s];
		// Защита от неправильной работы функций возврата координат UTM и Гаусса Крюгера, когда они дают сбой и возвращают черезмерно большие значения. на мелком масштабе.
		if(sc.limit){
			if(c_top_r[0] - c_top_l[0] > sc.limit * 2){
				c_top_r[0] = coor_c[0] + sc.limit;
				c_bot_r[0] = c_top_r[0];
				c_top_l[0] = coor_c[0] - sc.limit;
				c_bot_l[0] = c_top_l[0];
			}
		}
		// Если есть угол
		let c_centr = [(coor_bot_r[0] - coor_top_l[0]) / 2 + coor_top_l[0], (coor_bot_r[1] - coor_top_l[1]) / 2 + coor_top_l[1]];
		if(sc.f_a){
			// Вычисляем наклон каждой точки относительно центра.
			a_f_g = sc.f_a(grid_center);
			point_to_angle(c_top_l, c_centr, a_f_g);
			point_to_angle(c_top_r, c_centr, a_f_g);
			point_to_angle(c_bot_l, c_centr, a_f_g);
			point_to_angle(c_bot_r, c_centr, a_f_g);
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
		/// Настраиваем угол.
		// 1 Находим центр экрана.
		let c_centr_s = sc.f_to([...c_centr, ...z_s]);
		let x_p = c_centr_s[0] - grid_center[0];
		let y_p = c_centr_s[1] - grid_center[1];
		// 2. поворачиваем на угол.
		let a_p = Math.atan2(y_p, x_p) + a;
		let r_p = (x_p ** 2 + y_p ** 2) ** .5;
		x_p = r_p * Math.cos(a_p);
		y_p = r_p * Math.sin(a_p);
		x_p += grid_center[0];
		y_p += grid_center[1];
		// 3. находим ближайшую точку.
		let offset_x = x_p % interval_E;
		if(x_p > 0 && offset_x > interval_E / 2)x_p += interval_E;
		if(x_p < 0 && offset_x < interval_E / -2)x_p -= interval_E;
		//x_p -= offset_x;
		x_p += offset_E % interval_E - offset_x;
		let offset_y = y_p % interval_N;
		if(y_p > 0 && offset_y > interval_N / 2)y_p += interval_N;
		if(y_p < 0 && offset_y < interval_N / -2)y_p -= interval_N;
		//y_p -= offset_y;
		y_p += offset_N % interval_N - offset_y;
		x_p -= grid_center[0];
		y_p -= grid_center[1];
		// 4. поворачиваем обратно.
		a_p = Math.atan2(y_p, x_p) - a;
		r_p = (x_p ** 2 + y_p ** 2) ** .5;
		x_p = r_p * Math.cos(a_p);
		y_p = r_p * Math.sin(a_p);
		x_p += grid_center[0];
		y_p += grid_center[1];
		// Находим начало i, j и конечные i, j
		let i_s = (x_p - left) / -interval_E | 0;
		let i_e = (right - x_p) / interval_E | 0;
		
		w_g = i_e - i_s + 1;
		if(w_g > limit_E)w_g = limit_E;
		
		let j_s = (y_p - bot) / -interval_N | 0;
		let j_e = (top - y_p) / interval_N | 0;
		// Находим смещения шага.
		let cos_E = interval_E * Math.cos(a);
		let sin_E = interval_E * Math.sin(a);
		let cos_N = interval_N * Math.cos(a);
		let sin_N = interval_N * Math.sin(a);
		// Запускаем цыклы формирования сетки.
		// Дополнительные переменные формирования сетки.
		let i = 0;
		let coor = [0, 0, ...z_s];
		// Запускаем цыклы формирования сетки.
		for(let jy = j_s; jy <= j_e && limit_N > 0; jy++){
			let limit_x = limit_E;
			for(let ix = i_s; ix <= i_e && limit_x > 0 && limit > 0; ix++){
				coor[0] = x_p + ix * cos_E + jy * sin_N;
				coor[1] = y_p + jy * cos_N - ix * sin_E;
				arr_c_g[i] = map.map.getPixelFromCoordinate(sc.f_from(coor));
				i++;
				limit_x--;
				limit--;
			}
			limit_N--;
		}
		
		
		arr_c_g.length = i;
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
		let coor_t_l, coor_b_r, coor_c, _draw, out_n;
		
		let angle = 0;
		let n_angle = 0;
		let a_plus = 0;
		let a_equals = 0;
		
		let interval_E = 500000;
		let interval_N = interval_E;
		let offset_E = 0;
		let offset_N = 0;
		let limit_E = 300;
		let limit_N = 300;
		let limit = 100000;
		let axis = 0;
		let _sc;//sc[arr_id_sc[select_cs.selectedIndex - 1]]
		// Настраиваем площади для смены интервала.
		let max_WM = Math.PI * 2 * crs.ell.wgs_84.a;
		let f_z_to_area = z => (c_b_r[0] - c_t_l[0]) * (c_b_r[1] - c_t_l[1]) * (max_WM / (2 ** (z + 7.999999))) ** 2;// в идеале к z прибавлять 8(это 2 ^ 8 = 256), но из за погрешностей правилнее работает с чуть меньшим числом.
		//for(let i = delimiter_step + 1; i < arr_grid_step.length; i++)if(arr_grid_step[i].hasOwnProperty("z"))arr_grid_step[i].z_a = f_z_to_area(arr_grid_step[i].z);
		for(let i = delimiter_step + 1; i < arr_grid_step.length; i++)if(arr_grid_step[i].hasOwnProperty("z"))arr_grid_step[i].z_a = arr_grid_step[i].z === 0 ? Infinity: f_z_to_area(arr_grid_step[i].z);// Infinity для увелечения сетки за пределы, максимальных значений. и после включения сетки.
		
		let flag_off = true;// Флаг первого включения, так как при первом включении рамка всегда в центре появляется.
		let t_data = "";// Данные сетки.
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
		/// НУМЕРАЦИЯ.
		// Варимнт Canvas Вариант показал лучшие результаты.
		let layer_n = createElement("canvas", ["width", width_map], ["height", height_map], ["style", "position: absolute; top:0px; left:0px; pointer-events: none;"]);
		let ctx = layer_n.getContext("2d");
		/// МЕНЮ
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
		//span.insertAdjacentText('beforeend', " ");
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
		span.insertAdjacentText('beforeend', " Шаг сетки : ");
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
		_sc = sc[arr_id_sc[select_cs.selectedIndex - 1]];
		span.append(select_cs);
		// Угол
		span.insertAdjacentText('beforeend', " ");
		let input_angle = createElement("input", ["type", "text"], ["size", 5], ["value", angle]);
		input_angle.style.display = "none";
		span.append(input_angle);
		let span_angle = createElement("span", ["class", "span_angle"]);
		span_angle.style.display = "none";
		span.append(span_angle);
		let svg_a = create_input_a(a => {
			input_angle.value = toDeg(a);
			angle = a;
			_draw();
		}, angle);
		svg_a.style.display = "none";
		span.append(svg_a);
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
		let input_opacity = createElement("input", ["type", "range"], ["class", "r_color"], ["min", "0"], ["max", "1"], ["step", ".01"], ["value", 1]);
		s_addition.append(input_opacity);
		// Шаг сетки по N
		s_addition.insertAdjacentHTML('beforeend', "<br>Шаг сетки N:");
		let select_step_N = createElement("select", ["disabled", true]);
		for(let i = 0; i < arr_grid_step.length; i++){
			let op = createElement("option");
				op.textContent = arr_grid_step[i].t;
			if(arr_grid_step[i].d)op.disabled = true;
			select_step_N.append(op);
			if(i === 0)i = delimiter_step;
		}
		//select_step_N.disabled = true;
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
		s_addition.insertAdjacentHTML('beforeend', "<br><br>Смещение шага сетки E:");
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
		s_addition.insertAdjacentHTML('beforeend', "<br>Смещение шага сетки N:");
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
		let input_t_l = createElement("input", ["type", "text"], ["class", "frame_a"], ["disabled", true]);
		s_addition.append(input_t_l);
		s_addition.insertAdjacentHTML('beforeend', "<br>Правый нижний угол рамки N, E: ");
		let input_b_r = createElement("input", ["type", "text"], ["class", "frame_a"], ["disabled", true]);
		s_addition.append(input_b_r);
		// Центр.
		s_addition.insertAdjacentHTML('beforeend', "<br>Центр N, E: ");
		let label_fix_center = createElement("label");
			label_fix_center.insertAdjacentText('beforeend', " зафиксировать:");
		let input_fix_center = createElement("input", ["type", "checkbox"]);
		label_fix_center.append(input_fix_center);
		s_addition.append(label_fix_center);
		let label_fix_center_s = createElement("label");
			label_fix_center_s.insertAdjacentText('beforeend', "по экрану:");
		let input_fix_center_s = createElement("input", ["type", "checkbox"]);
		label_fix_center_s.append(input_fix_center_s);
		s_addition.append(label_fix_center_s);
		let text_center = createElement("input", ["type", "text"], ["class", "frame_a"], ["disabled", true]);
		s_addition.append(text_center);
		// Ось и Зона проекции
		s_addition.insertAdjacentHTML('beforeend', "<br><br>Осевой меридиан и зона:<br>");
		let label_fix_zone = createElement("label");
			label_fix_zone.insertAdjacentText('beforeend', " зафиксировать:");
		let input_fix_zone = createElement("input", ["type", "checkbox"]);
		label_fix_zone.append(input_fix_zone);
		s_addition.append(label_fix_zone);
		let label_fix_zone_s = createElement("label");
			label_fix_zone_s.insertAdjacentText('beforeend', "по экрану:");
		let input_fix_zone_s = createElement("input", ["type", "checkbox"]);
		label_fix_zone_s.append(input_fix_zone_s);
		s_addition.append(label_fix_zone_s);
		let label_fix_zone_c = createElement("label");
			label_fix_zone_c.insertAdjacentText('beforeend', "по центру:");
		let input_fix_zone_c = createElement("input", ["type", "checkbox"]);
		label_fix_zone_c.append(input_fix_zone_c);
		s_addition.append(label_fix_zone_c);
		s_addition.insertAdjacentHTML('beforeend', "<br>Осевой меридиан: ");
		let input_axial_m  = createElement("input", ["type", "text"], ["size", 5], ["disabled", true]);
		s_addition.append(input_axial_m);
		s_addition.insertAdjacentText('beforeend', " Зона: ");
		let input_zone  = createElement("input", ["type", "text"], ["size", 5], ["disabled", true]);
		s_addition.append(input_zone);
		// Угол наклона сетки
		s_addition.insertAdjacentHTML('beforeend', "<br><br>Сближение меридианов в центре:<br>");
		let span_angle_c = createElement("span");
		s_addition.append(span_angle_c);
		s_addition.insertAdjacentHTML('beforeend', "<br>+ ");
		let input_plus_a = createElement("input", ["type", "text"], ["size", 20], ["disabled", true]);
		s_addition.append(input_plus_a);
		let label_fix_plus_a = createElement("label");
			label_fix_plus_a.insertAdjacentText('beforeend', " 📌");
		let input_fix_plus_a = createElement("input", ["type", "checkbox"]);
		label_fix_plus_a.append(input_fix_plus_a);
		s_addition.append(label_fix_plus_a);
		s_addition.insertAdjacentHTML('beforeend', "<br>= ");
		let input_equals_a = createElement("input", ["type", "text"], ["size", 20], ["disabled", true]);
		s_addition.append(input_equals_a);
		let label_fix_equals_a = createElement("label");
			label_fix_equals_a.insertAdjacentText('beforeend', " 📌");
		let input_fix_equals_a = createElement("input", ["type", "checkbox"]);
		label_fix_equals_a.append(input_fix_equals_a);
		s_addition.append(label_fix_equals_a);
		let label_fix_compass = createElement("label");
			label_fix_compass.insertAdjacentText('beforeend', " 🧭");
		let input_fix_compass = createElement("input", ["type", "checkbox"]);
		label_fix_compass.append(input_fix_compass);
		s_addition.append(label_fix_compass);
		// Отображения компаса и сближение мередиан.
		let svg_a_c = create_input_a_c(a => {
			input_equals_a.value = toDeg(a);
			a_equals = a;
			_draw();
		}, () => {
			input_fix_compass.checked = false;
			input_fix_plus_a.checked = false;
			input_plus_a.disabled = true;
			input_fix_equals_a.checked = true;
			input_equals_a.disabled = false;
		});
		svg_a_c.style.display = "none";
		s_addition.append(svg_a_c);
		// Данные сетки, для сохранения и загрузки.
		s_addition.insertAdjacentHTML('beforeend', "<br><br>Данные сетки:<br>");
		let textarea_data = createElement("textarea", ["disabled", true], ["spellcheck", false], ["class", "t_data"]);
		s_addition.append(textarea_data);
		let b_load = createElement("span", ["class", "button"]);
		b_load.insertAdjacentText('beforeend', "Загрузить");
		s_addition.append(b_load);
		s_addition.insertAdjacentHTML('beforeend', "<br><br>");
		s_addition.insertAdjacentText('beforeend', " ");
		let b_save = createElement("span", ["class", "button"]);
		b_save.insertAdjacentText('beforeend', "Сохранить");
		s_addition.append(b_save);
		s_addition.insertAdjacentHTML('beforeend', "<br><br>");
		/// НУМЕРАЦИЯ.
		span.insertAdjacentHTML('beforeend', "<hr><center>Нумерация</center>");
		// вкл/выкл нумерации.
		let label_on_n = createElement("label");
			label_on_n.insertAdjacentText('beforeend', "Отобразить:");
		let input_on_n = createElement("input", ["type", "checkbox"]);
		label_on_n.append(input_on_n);
		span.append(label_on_n);
		// Выбираем тип нумерации, или угол начала.
		span.insertAdjacentText('beforeend', " Начало в: ");
		let select_a_g = createElement("select");
		elm = createElement("option", ["disabled", true]);
		elm.textContent = "Угол сетки";
		select_a_g.append(elm);
		// Левый верхний
		elm = createElement("option");
		elm.textContent = "N W";
		select_a_g.append(elm);
		// Правый верхний
		elm = createElement("option");
		elm.textContent = "N E";
		select_a_g.append(elm);
		// Правый нижний
		elm = createElement("option");
		elm.textContent = "S E";
		select_a_g.append(elm);
		// Левый нижний
		elm = createElement("option");
		elm.textContent = "S W";
		select_a_g.append(elm);
		// Или в системе координат.
		elm = createElement("option", ["disabled", true]);
		elm.textContent = "система координат";
		select_a_g.append(elm);
		elm = createElement("option");
		elm.textContent = "Сетки";
		select_a_g.append(elm);
		for(let i = 0; i < sc.length; i++){
			elm = createElement("option");
			elm.textContent = sc[i].name;
			select_a_g.append(elm);
		}
		span.append(select_a_g);
		span.insertAdjacentHTML('beforeend', "<br>");
		// Спан для настройке если нумерация по углу.
		let span_n_a = createElement("span");
		span_n_a.insertAdjacentHTML('beforeend', "<br>");
		// По горизонтали
		let input_n_g = createElement("input", ["type", "checkbox"], ["checked", true]);
		span_n_a.append(input_n_g);
		let input_n_t_g = createElement("input", ["type", "text"], ["size", 5], ["value", "A"]);
		span_n_a.append(input_n_t_g);
		span_n_a.insertAdjacentText('beforeend', " ");
		// По вертикали
		let input_n_v = createElement("input", ["type", "checkbox"], ["checked", true]);
		span_n_a.append(input_n_v);
		let input_n_t_v = createElement("input", ["type", "text"], ["size", 5], ["value", "1"]);
		span_n_a.append(input_n_t_v);
		span.append(span_n_a);
		// Спан нумерации координатами.
		let span_n_c = createElement("span");
		span_n_c.insertAdjacentHTML('beforeend', "<br>");
		// Тип едениц измерения.
		let select_n_t = createElement("select");
		elm = createElement("option", ["disabled", true]);
		elm.textContent = "Формат";
		select_n_t.append(elm);
		elm = createElement("option");
		elm.textContent = "dd.ddddd°";
		elm.value = Math.PI / 180;
		select_n_t.append(elm);
		for(let i = delimiter_step + 1; i < arr_grid_step.length; i++)if(!arr_grid_step[i].hasOwnProperty("i") && !arr_grid_step[i].hasOwnProperty("d")){
			elm = createElement("option");
			elm.textContent = arr_grid_step[i].t;
			elm.value = arr_grid_step[i].f;
			select_n_t.append(elm);
		}
		span_n_c.append(select_n_t);
		// Настройка вывода/ввода угла, если система координат с углом для нумирации.
		span_n_c.insertAdjacentText('beforeend', " ");
		let input_n_angle = createElement("input", ["type", "text"], ["size", 5], ["value", n_angle]);
		input_n_angle.style.display = "none";
		span_n_c.append(input_n_angle);
		let span_n_angle = createElement("span", ["class", "span_angle"]);
		span_n_angle.style.display = "none";
		span_n_c.append(span_n_angle);
		let svg_n_a = create_input_a(a => {
			input_n_angle.value = toDeg(a);
			n_angle = a;
			out_n();
		}, n_angle);
		svg_n_a.style.display = "none";
		span_n_c.append(svg_n_a);
		span_n_c.insertAdjacentHTML('beforeend', "<br><br>");
		span_n_c.insertAdjacentText('beforeend', " ");
		// Настройка какую часть координат отображать.
		// Смещение от начала числа.
		let span_before = createElement("span");
		span_before.textContent = "0 ";
		span_n_c.append(span_before);
		let input_before = createElement("input", ["type", "range"], ["class", "r_color"], ["min", "0"], ["max", "12"], ["step", "1"], ["value", 0]);
		span_n_c.append(input_before);
		span_n_c.insertAdjacentText('beforeend', ",");
		// Длина знаков в числе.
		let input_after = createElement("input", ["type", "range"], ["class", "r_color"], ["min", "0"], ["max", "12"], ["step", "1"], ["value", 5]);
		span_n_c.append(input_after);
		span_n_c.insertAdjacentText('beforeend', " ");
		let span_after = createElement("span");
		span_after.textContent = "5";
		span_n_c.append(span_after);
		span_n_c.style.display = "none";
		span.append(span_n_c);
		span.insertAdjacentHTML('beforeend', "<br>");
		// Дополнительные настройки нумерации
		let n_b_addition = createElement("span", ["class", "plus"], ["checked", false]);
		n_b_addition.insertAdjacentText('beforeend', "(Дополнительно)");
		span.append(n_b_addition);
		let n_s_addition = createElement("span", ["style", "display:none;"]);
		n_s_addition.insertAdjacentHTML('beforeend', "<br>");
		//Цвет и прозрачность фона нумерации.
		n_s_addition.insertAdjacentHTML('beforeend', "Фон:&nbsp;&nbsp;");
		let input_n_color = createElement("input", ["type", "color"], ["value", "#ffffff"]);
		n_s_addition.insertAdjacentText('beforeend', " ");
		n_s_addition.append(input_n_color);
		let input_n_opacity = createElement("input", ["type", "range"], ["class", "r_color"], ["min", "0"], ["max", 0xFF], ["step", "1"], ["value", 0x88]);
		n_s_addition.append(input_n_opacity);
		// Множитель размера нумерации
		n_s_addition.insertAdjacentHTML('beforeend', " Размер:");
		let input_n_size = createElement("input", ["type", "range"], ["class", "r_color"], ["min", ".1"], ["max", "3"], ["step", ".1"], ["value", 1]);
		n_s_addition.append(input_n_size);
		n_s_addition.insertAdjacentText('beforeend', " ");
		let span_n_size = createElement("span");
		span_n_size.textContent = "1";
		n_s_addition.append(span_n_size);
		//Цвет и прозрачность текста нумерации.
		n_s_addition.insertAdjacentHTML('beforeend', "<br>Текст: ");
		let input_n_color_t = createElement("input", ["type", "color"], ["value", "#000000"]);
		n_s_addition.insertAdjacentText('beforeend', " ");
		n_s_addition.append(input_n_color_t);
		let input_n_opacity_t = createElement("input", ["type", "range"], ["class", "r_color"], ["min", "0"], ["max", 0xFF], ["step", "1"], ["value", 0xFF]);
		n_s_addition.append(input_n_opacity_t);
		span.append(n_s_addition);
		span.insertAdjacentHTML('beforeend', "<hr>");
		/// СОХРАНЕНИЕ И ЗАГРУЗКА СЕТКИ.
		let b_save_track = createElement("span", ["class", "button"]);
		b_save_track.insertAdjacentText('beforeend', "Сохранить");
		span.append(b_save_track);
		
		let b_load_track = createElement("span", ["class", "button"]);
		b_load_track.insertAdjacentText('beforeend', "Загрузить");
		span.append(b_load_track);
		
		let b_in_track = createElement("span", ["class", "button"]);
		b_in_track.insertAdjacentText('beforeend', "В треки");
		span.append(b_in_track);
		// Дополнительные настройки сохранения загрузки.
		span.insertAdjacentHTML('beforeend', "<br>");
		let save_b_addition = createElement("span", ["class", "plus"], ["checked", false]);
		save_b_addition.insertAdjacentText('beforeend', "(Дополнительно)");
		span.append(save_b_addition);
		let save_s_addition = createElement("span", ["style", "display:none;"]);
		save_s_addition.insertAdjacentHTML('beforeend', "<br>");
		// Формат.
		let select_format = createElement("select");
		elm = createElement("option", ["disabled", true]);
		elm.textContent = "Формат";
		select_format.append(elm);
		elm = createElement("option");
		elm.textContent = ".gpx";
		select_format.append(elm);
		select_format.selectedIndex = 1;
		save_s_addition.append(select_format);
		// Система координат.
		let select_save_sc = createElement("select");
		elm = createElement("option", ["disabled", true]);
		elm.textContent = "система координат";
		select_save_sc.append(elm);
		elm = createElement("option");
		elm.textContent = sc[0].name;
		select_save_sc.append(elm);
		select_save_sc.selectedIndex = 1;
		save_s_addition.append(select_save_sc);
		// точки треки.
		save_s_addition.insertAdjacentText('beforeend', " точки:");
		let input_s_points = createElement("input", ["type", "checkbox"], ["checked", true]);
		save_s_addition.append(input_s_points);
		save_s_addition.insertAdjacentText('beforeend', " треки:");
		let input_s_tracks = createElement("input", ["type", "checkbox"], ["checked", true]);
		save_s_addition.append(input_s_tracks);
		
		// знаков после запятой.
		save_s_addition.insertAdjacentHTML('beforeend', "<br><br>Знаков после запятой координат:");
		let span_seve_d = createElement("span");
		span_seve_d.textContent = " 6";
		save_s_addition.append(span_seve_d);
		let input_seve_d = createElement("input", ["type", "range"], ["class", "r_color"], ["min", "0"], ["max", "14"], ["step", "1"], ["value", 6]);
		save_s_addition.append(input_seve_d);
		// Флаг доп информации сетки.
		save_s_addition.insertAdjacentHTML('beforeend', "<br>Включить в файл доп. информацию: ");
		let input_save_dop = createElement("input", ["type", "checkbox"]);
		save_s_addition.append(input_save_dop);
		
		
		
		
		
		
		
		
		span.append(save_s_addition);
		
		span.insertAdjacentHTML('beforeend', "<hr>");
		
		span.insertAdjacentHTML('beforeend', "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>");
		menu.append(span);
		/// ФУНКЦИИ
		let f_coor = () => {
			coor_t_l = map.map.getCoordinateFromPixel(c_t_l);
			coor_b_r = map.map.getCoordinateFromPixel(c_b_r);
		};
		let f_c = () => {
			c_t_l = map.map.getPixelFromCoordinate(coor_t_l);
			c_b_r = map.map.getPixelFromCoordinate(coor_b_r);
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
		};
		//rail_draw();
		// Функция ввода донных сетки.
		let f_in_grid = t => {
			try{
				let obj = JSON.parse(t);
				if(typeof obj === 'object'){
					/// Настраиваем/вводим данные.
					// Система координат.
					if(obj.hasOwnProperty("sc")){
						// Если система координат с компасом, подменяем её на систему Хотине, так как с компасом зависит от даты.
						if(obj.sc === 3 || obj.sc === 6)obj.sc--;
						select_cs.selectedIndex = obj.sc;
					}
					// Центер
					if(obj.hasOwnProperty("c_c")){
						input_fix_center.checked = true;
						input_fix_center_s.checked = false;
						text_center.disabled = false;
						coor_c = from_wgs_84([toRad(obj.c_c[1]), toRad(obj.c_c[0])]);
						map.view.setCenter(coor_c);
					}
					// Углы рамки сетки.
					if(obj.hasOwnProperty("c_tl") && obj.hasOwnProperty("c_br")){
						coor_t_l = from_wgs_84([toRad(obj.c_tl[1]), toRad(obj.c_tl[0])]);
						coor_b_r = from_wgs_84([toRad(obj.c_br[1]), toRad(obj.c_br[0])]);
						if(coor_t_l[0] > coor_b_r[0])coor_b_r[0] = coor_t_l[0];
						if(coor_t_l[1] < coor_b_r[1])coor_b_r[1] = coor_t_l[1];
						f_c();
						input_to_map.checked = true;
					}
					// Шаг сктеи.
					if(obj.hasOwnProperty("s_E")){
						input_auto.checked = false;
						select_step.disabled = false;
						interval_E = obj.s_E;
						let i = delimiter_step + 1;
						while(i < arr_grid_step.length){
							if(arr_grid_step[i].hasOwnProperty("i")){
								if(interval_E === arr_grid_step[i].i){
									input_step.style.display = "none";
									break;
								}
							}else if(arr_grid_step[i].hasOwnProperty("f") && 1 === arr_grid_step[i].f){// Метры.
								input_step.style.display = "inline";
								input_step.value = interval_E;
								break;
							}
							i++;
						}
						select_step.selectedIndex = i - delimiter_step;
					}
					if(obj.hasOwnProperty("s_N")){
						input_auto_N.checked = false;
						select_step_N.disabled = false;
						interval_N = obj.s_N;
						let i = delimiter_step + 1;
						while(i < arr_grid_step.length){
							if(arr_grid_step[i].hasOwnProperty("i")){
								if(interval_N === arr_grid_step[i].i){
									input_step_N.style.display = "none";
									break;
								}
							}else if(arr_grid_step[i].hasOwnProperty("f") && 1 === arr_grid_step[i].f){// Метры.
								input_step_N.style.display = "inline";
								input_step_N.value = interval_N;
								break;
							}
							i++;
						}
						select_step_N.selectedIndex = i - delimiter_step;
					}else{
						input_auto_N.checked = true;
						select_step_N.disabled = true;
						select_step_N.selectedIndex = select_step.selectedIndex;
						input_step_N.style.display = "none";
						interval_N = interval_E;
					}
					// Смещение шага сетки.
					select_units.selectedIndex = 2;
					if(obj.hasOwnProperty("o_E"))input_offset_E.value = obj.o_E;
					else input_offset_E.value = 0;
					if(obj.hasOwnProperty("o_N"))input_offset_N.value = obj.o_N;
					else input_offset_N.value = 0;
					// Наклон системы координат.
					if(obj.hasOwnProperty("a_sc")){
						angle = obj.a_sc;
						svg_a.f_a(angle);
						input_angle.value = toDeg(angle);
					}
					// Наклон сетки.
					input_fix_compass.checked = false;
					input_fix_plus_a.checked = false;
					input_plus_a.disabled = true;
					if(obj.hasOwnProperty("a_g")){
						input_fix_equals_a.checked = true;
						input_equals_a.disabled = false;
						a_equals = obj.a_g;
						input_equals_a.value = toDeg(obj.a_g);
					}else{
						input_fix_equals_a.checked = false;
						input_equals_a.disabled = true;
						a_plus = 0;
					}
					// Осевой меридиан.
					input_fix_zone_s.checked = false;
					input_fix_zone_c.checked = false;
					if(obj.hasOwnProperty("ax")){
						input_fix_zone.checked = true;
						input_axial_m.disabled = false;
						input_zone.disabled = false;
						axis = obj.ax;
					}else{
						input_fix_zone.checked = false;
						input_axial_m.disabled = true;
						input_zone.disabled = true;
					}
				}
			}finally{
				select_cs.onchange();
			}
		};
		
		let draw_out = () => {
			if(_sc.angle)hotine_a = angle;
			//* Вынесено из функции f_grid_2.
			// Находим зону, ось в центре если есть. И координаты новой проекции в центре.
			grid_center = _sc.f_to(coor_c);
			// Сохраняем номер зоны, ось если есть.
			z_s = grid_center.slice(2);
			// Находим угол сближение меридианов con_m
			let Q_2 = _sc.f_to([coor_c[0], coor_c[1] + 1, ...z_s]);
			con_m = Math.atan2(grid_center[0] - Q_2[0], Q_2[1] - grid_center[1]);//con_m = Math.atan2(Q_2[0] - grid_center[0], Q_2[1] - grid_center[1]) * -1;
			////*/
			// Выводим Сближение меридианов в центре и настраиваем компас.
			span_angle_c.textContent = toDeg(con_m);
			let a_c = compass_angle(to_wgs_84(coor_c));
			svg_a_c.f_c(a_c);
			if(input_fix_equals_a.checked){
				a_plus = a_equals - con_m;
			}else if(input_fix_compass.checked){
				a_equals = a_c;
				a_plus = a_equals - con_m;
			}else{
				a_equals = con_m + a_plus;
			}
			input_equals_a.value = toDeg(a_equals);
			input_plus_a.value = toDeg(a_plus);
			svg_a_c.f_m(con_m);
			svg_a_c.f_a(a_equals);
			f_grid_2(interval_E, interval_N, offset_E, offset_N, limit_E, limit_N, limit, coor_t_l, coor_b_r, _sc, coor_c, a_plus);
			span_angle.textContent = " ∠"+toDeg(a_f_g).toFixed(2)+"°";
			let d_path = "";
			let i = 0;
			for(let i = 0; i < arr_c_g.length; i++){
				d_path += (i % w_g === 0 ? "M": "L")+arr_c_g[i][0]+","+arr_c_g[i][1];
			}
			for(let i = 0; i < w_g; i++){
				for(let j = i; j < arr_c_g.length; j += w_g){
					d_path += (j == i ? "M": "L")+arr_c_g[j][0]+","+arr_c_g[j][1];
				}
			}
			line.setAttributeNS(null, "d", d_path);
			
			if(arr_c_g.length > 0){
				span_limit_E.textContent = w_g > arr_c_g.length ? arr_c_g.length: w_g;
				span_limit_N.textContent = arr_c_g.length / w_g | 0;
			}else{
				span_limit_E.textContent = "0";
				span_limit_N.textContent = "0";
			}
			span_limit.textContent = arr_c_g.length;
		};
		/// ФУНКЦИИ Нумерации
		// переменные нумерации.
		let type_n_g, type_n_v, offset_n_g, offset_n_v;
		let out_n_d = "";// Разделитель нумерации запятая в случае если по вертикали и горизонатали схожие типы нумерации.
		type_n_g = 2;// тип нумерации по гормзонтали.
		type_n_v = 1;// тип нумерации по вертикали.
		offset_n_g = 1;// начало нумерации по горизонтали.
		offset_n_v = 1;// начало нумерации по вертикали.
		let remainder_n_w, h_g;// Остаток нумерации если сработал лимит, и высота.
		//(i % w_g); вертикали.
		//(w_g - i % w_g - 1)
		//(i / w_g | 0); горизонтали
		//((remainder_n_w === 0 ? h_g - 1: h_g) - (i / w_g | 0))
		// Верхний левый угол. N W
		let f_out_n_i_NW = i => number_in_text(i % w_g + offset_n_g, type_n_g)+out_n_d+number_in_text((remainder_n_w === 0 ? h_g - 1: h_g) - (i / w_g | 0) + offset_n_v, type_n_v);
		let f_out_n_i_NW_v = i => {
			let h = i % w_g;
			return number_in_text(h_g - (i / w_g | 0) + h_g * h + (h < remainder_n_w ? h: remainder_n_w - 1) + offset_n_v, type_n_v);
		};
		let f_out_n_i_NW_g = i => {
			if(i + 1 > w_g * h_g)return number_in_text(remainder_n_w - (arr_c_g.length - i) + offset_n_g, type_n_g);
			else return number_in_text(arr_c_g.length - i + w_g - (w_g - (i % w_g)) * 2 + offset_n_g, type_n_g);
		};
		// Верхний правый угол. N E
		let f_out_n_i_NE = i => number_in_text(w_g - i % w_g - 1 + offset_n_g, type_n_g)+out_n_d+number_in_text((remainder_n_w === 0 ? h_g - 1: h_g) - (i / w_g | 0) + offset_n_v, type_n_v);
		let f_out_n_i_NE_v = i => {
			let h = i % w_g;
			return number_in_text(arr_c_g.length - ((i / w_g + 1 | 0) + h_g * h + (h > remainder_n_w ? remainder_n_w: h)) + offset_n_v, type_n_v);
		};
		let f_out_n_i_NE_g = i => number_in_text(arr_c_g.length - (i + 1) + offset_n_g, type_n_g);
		// Нижний правый угол. S E
		let f_out_n_i_SE = i => number_in_text(w_g - i % w_g - 1 + offset_n_g, type_n_g)+out_n_d+number_in_text((i / w_g | 0) + offset_n_v, type_n_v);
		let f_out_n_i_SE_v = i => {
			let h = i % w_g;
			return number_in_text(arr_c_g.length - (h_g - (i / w_g | 0) + h_g * h + (h < remainder_n_w ? h + 1: remainder_n_w)) + offset_n_v, type_n_v);
		};
		let f_out_n_i_SE_g = i => {
			if(i + 1 > w_g * h_g)return number_in_text(arr_c_g.length - (remainder_n_w - (arr_c_g.length - i) + 1) + offset_n_g, type_n_g);
			else return number_in_text(arr_c_g.length - (arr_c_g.length - i + w_g - ((w_g - (i % w_g)) * 2) + 1) + offset_n_g, type_n_g);
		};
		// Нижний левый угол. S W
		let f_out_n_i_SW = i => number_in_text(i % w_g + offset_n_g, type_n_g)+out_n_d+number_in_text((i / w_g | 0) + offset_n_v, type_n_v);
		let f_out_n_i_SW_v = i => {
			let h = i % w_g;
			return number_in_text((i / w_g | 0) + h_g * h + (h > remainder_n_w ? remainder_n_w: h) + offset_n_v, type_n_v);
		};
		let f_out_n_i_SW_g = i => number_in_text(i + offset_n_g, type_n_g);
		// Пустая.
		let f_out_n_i_b = () => "   ";
		// Функция вызова при нумерации.
		let f_out_n_i = f_out_n_i_NW;
		// Функция нумерации координатами.
		let _sc_n;// Система координат нумерации
		let n_end_mod = 0;// Знаков от десятичной точки.
		let n_start_mod = 0;// Знаков от десятичной точки.
		let n_c_div = 1;// На что поделить метры(радианы в случае угловой) чтоб получить нужные еденицы измерения.
		let n_z_s;// Данные центра.
		// Математический метод.
		let f_out_n_c = c => {
			// 1. получаем координаты.
			let coor = _sc_n.f_to([...map.map.getCoordinateFromPixel(c), ...n_z_s]);
			// 2. переводим в нужные еденицы измерения.
			coor[0] /= n_c_div;
			coor[1] /= n_c_div;
			// 3. вычисляем через логорифм сколько знаков до запятой.
			let z_0 = Math.log10(Math.abs(coor[0])) | 0;
			let z_1 = Math.log10(Math.abs(coor[1])) | 0;
			// 4. находим максимальное число знаков до запятой.
			let z_max = Math.max(z_0, z_1);
			// 5. Вычисляем делитель по модулю.
			// вычисляем стартовый знак до запятой
			n_start_mod = z_max + 1 - input_before.valueAsNumber;
			let n_mod = 10 ** n_start_mod;
			// 6. делим по модулю.
			coor[0] %= n_mod;
			coor[1] %= n_mod;
			// 7. вычисляем конечный знак, изходя из длины. и в зависимости до или после запятой. решаем как округлить.
			n_end_mod = n_start_mod - input_after.valueAsNumber;
			if(n_end_mod < 0){
				// Округляем.
				// 7.2 ограничиваем 12 знаков.
				if(n_end_mod < -12)n_end_mod = -12;
				coor[0] = coor[0].toFixed(Math.abs(n_end_mod));
				coor[1] = coor[1].toFixed(Math.abs(n_end_mod));
			}else{
				if(z_0 >= n_end_mod){
					coor[0] = coor[0] / (10 ** n_end_mod);
					coor[0] = coor[0].toFixed();
				}else coor[0] = "";
				if(z_1 >= n_end_mod){
					coor[1] = coor[1] / (10 ** n_end_mod);
					coor[1] = coor[1].toFixed();
				}else coor[1] = "";
			}
			// 8. если начало отсчета после точки, то обрезаем перед числа.
			if(n_start_mod < 0){
				coor[0] = coor[0].slice(Math.abs(n_start_mod) + 2);
				coor[1] = coor[1].slice(Math.abs(n_start_mod) + 2);
			}else if(n_start_mod === 0){
				coor[0] = coor[0].slice(Math.abs(n_start_mod) + 1);
				coor[1] = coor[1].slice(Math.abs(n_start_mod) + 1);
			}
			return coor;
		};
		// Функция определения ида последнего нумеруемого.
		let f_n_last_i_NW = i => w_g > i ? i - 1: w_g - 1;
		let f_n_last_i = f_n_last_i_NW;
		let flag_out_n = true;// Флаг определяет нумерация обычная или координатная.
		let n_size = 1;// множитель размера вывода нумерации.
		let n_color = "#ffffff88";// цвет и прозрачность фона.
		let n_color_t = "#000000ff";// Цвет и прозрачность текста.
		// ОСНОВНАЯ Функция вывода нумерации.
		out_n = () => {
			ctx.clearRect(0, 0, width_map, height_map);
			if(arr_c_g.length < 2)return;
			let l = ((arr_c_g[1][0] - arr_c_g[0][0]) ** 2 + (arr_c_g[1][1] - arr_c_g[0][1]) ** 2) ** .5;
			l *= n_size;
			if(l < 15)return;// Если слишком мелкий текст то невыводим.
			//let time = performance.now();// Для теста скорости.
			if(flag_out_n){// Вариант обычеой нумерации
				remainder_n_w = arr_c_g.length % w_g;// Определяем остаток если сработал лимит.
				h_g = (arr_c_g.length - remainder_n_w) / w_g;// определяем высоту
				// опрнднляем количество знаков в нумерации.
				let l_t = f_out_n_i(f_n_last_i(arr_c_g.length)).length;
				// Расчитываем шрифт и другие величины ширены и высоты текста нумерации.
				let height_t = l / 3 | 0;
				height_t = height_t / ((l_t < 4 ? 4: l_t) / 4) | 0;
				ctx.font = height_t+"px monospace";
				let width_t_0 = height_t * .6;
				height_t *= .62;
				let height_t_2 = height_t / 2;
				let width_t = width_t_0 * l_t;
				let width_t_2 = width_t / 2;
				// Рисуем рамки.
				ctx.fillStyle = n_color;
				for(let i = 0; i < arr_c_g.length; i++){
					if(arr_c_g[i][0] < 0 || arr_c_g[i][0] > width_map)continue;
					if(arr_c_g[i][1] < height_t_2 || arr_c_g[i][1] > height_map + height_t_2)continue;
					ctx.fillRect(arr_c_g[i][0] - width_t_2, arr_c_g[i][1] - height_t, width_t, height_t);
				}
				// Рисуем текст.
				ctx.fillStyle = n_color_t;
				ctx.textAlign = "center";
				for(let i = 0; i < arr_c_g.length; i++){
					if(arr_c_g[i][0] < 0 || arr_c_g[i][0] > width_map)continue;
					if(arr_c_g[i][1] < height_t_2 || arr_c_g[i][1] > height_map + height_t_2)continue;
					ctx.fillText(f_out_n_i(i), arr_c_g[i][0], arr_c_g[i][1]);
				}
			}else{// Вариант координатами нумерации
				if(input_after.valueAsNumber === 0)return;// Если длина текста ноль то невыводим.
				// Расчитываем длину текста в символах.
				let n_input = input_after.valueAsNumber + 1;
				// Расчитываем шрифт и другие величины ширены и высоты текста нумерации.
				let height_t = l / 3;
				height_t = height_t / ((n_input < 7 ? 7: n_input) / 4) | 0;
				ctx.font = height_t+"px monospace";
				let width_t_0 = height_t * .6;
				height_t *= .62;
				let height_t_2 = height_t / 2;
				// Определяем систему координат, её параметры в центре и угол если есть.
				if(select_a_g.selectedIndex === 6)n_z_s = z_s;
				else{
					if(_sc_n.angle)hotine_a = n_angle;angle
					let n_grid_center = _sc_n.f_to(coor_c);
					n_z_s = n_grid_center.slice(2);
					if(_sc_n.f_a && _sc_n.angle === undefined)span_n_angle.textContent = " ∠"+toDeg(_sc_n.f_a(n_grid_center)).toFixed(2)+"°";
				}
				// Находим первую координату сетки, для определения, с точкой или без будет координата, чтоб учесть точку в длине в символах.
				let c = f_out_n_c(arr_c_g[0]);
				if(!(n_end_mod < 0 && n_start_mod >= 0))n_input--;
				// Расчитываем ширену текстовых полей в пикселях
				let width_t = width_t_0 * n_input;
				let width_t_2 = width_t / 2;
				// Рисуем рамки.
				ctx.fillStyle = n_color;
				let height_2t = height_t * 2;
				for(let i = 0; i < arr_c_g.length; i++){
					if(arr_c_g[i][0] < 0 || arr_c_g[i][0] > width_map)continue;
					if(arr_c_g[i][1] < height_t_2 || arr_c_g[i][1] > height_map + height_t_2)continue;
					ctx.fillRect(arr_c_g[i][0] - width_t_2, arr_c_g[i][1] - height_t, width_t, height_2t);
				}
				// Рисуем текст. Сначала первую координату отдельно.
				ctx.fillStyle = n_color_t;
				ctx.textAlign = "end";
				if(arr_c_g[0][0] >= 0 && arr_c_g[0][0] <= width_map && arr_c_g[0][1] >= height_t_2 && arr_c_g[0][1] <= height_map + height_t_2){
					ctx.fillText(c[1], arr_c_g[0][0] + width_t_2, arr_c_g[0][1]);
					ctx.fillText(c[0], arr_c_g[0][0] + width_t_2, arr_c_g[0][1] + height_t);
				}
				for(let i = 1; i < arr_c_g.length; i++){
					if(arr_c_g[i][0] < 0 || arr_c_g[i][0] > width_map)continue;
					if(arr_c_g[i][1] < height_t_2 || arr_c_g[i][1] > height_map + height_t_2)continue;
					c = f_out_n_c(arr_c_g[i]);
					ctx.fillText(c[1], arr_c_g[i][0] + width_t_2, arr_c_g[i][1]);
					ctx.fillText(c[0], arr_c_g[i][0] + width_t_2, arr_c_g[i][1] + height_t);
				}
			}
			// Для расчета и тестов скорости рисования нумерации.
			//time = performance.now() - time;
			//document.getElementById("test_grid").textContent = time;
		};
		// Настраивает еденицы в которых отображать нумерацию координатами.
		let s_n_t_children = select_n_t.children;
		let f_out_n_format = m => {
			if(m){
				s_n_t_children[1].style.display = "none";
				for(let i = 2; i < s_n_t_children.length; i++)s_n_t_children[i].style.display = "block";
				if(select_n_t.selectedIndex < 2){
					select_n_t.selectedIndex = 2;
					n_c_div = s_n_t_children[2].value;
				}
			}else{
				s_n_t_children[1].style.display = "block";
				for(let i = 2; i < s_n_t_children.length; i++)s_n_t_children[i].style.display = "none";
				select_n_t.selectedIndex = 1;
				n_c_div = s_n_t_children[1].value;
			}
		};
		// Выбор типа нумерации, с какого угла, или, тип нумерации координатами, и настройка в соответствии с типом.
		let f_out_selector = () => {
			if(select_a_g.selectedIndex < 5){// Типы нумерации с углов
				span_n_c.style.display = "none";
				span_n_a.style.display = "inline";
				flag_out_n = true;
				if(select_a_g.selectedIndex === 1){// Верхний левый угол. N W
					if(input_n_v.checked && input_n_g.checked)f_out_n_i = f_out_n_i_NW;
					else if(input_n_v.checked)f_out_n_i = f_out_n_i_NW_v;
					else if(input_n_g.checked)f_out_n_i = f_out_n_i_NW_g;
					else f_out_n_i = f_out_n_i_b;
					f_n_last_i = f_n_last_i_NW;
				}else if(select_a_g.selectedIndex === 2){// Верхний правый угол. N E
					if(input_n_v.checked && input_n_g.checked)f_out_n_i = f_out_n_i_NE;
					else if(input_n_v.checked)f_out_n_i = f_out_n_i_NE_v;
					else if(input_n_g.checked)f_out_n_i = f_out_n_i_NE_g;
					else f_out_n_i = f_out_n_i_b;
					f_n_last_i = i => 0;
				}else if(select_a_g.selectedIndex === 3){// Нижний правый угол. S E
					if(input_n_v.checked && input_n_g.checked)f_out_n_i = f_out_n_i_SE;
					else if(input_n_v.checked)f_out_n_i = f_out_n_i_SE_v;
					else if(input_n_g.checked)f_out_n_i = f_out_n_i_SE_g;
					else f_out_n_i = f_out_n_i_b;
					f_n_last_i = i => remainder_n_w !== 0 ? i - remainder_n_w: i - w_g;
				}else if(select_a_g.selectedIndex === 4){// Нижний левый угол. S W
					if(input_n_v.checked && input_n_g.checked)f_out_n_i = f_out_n_i_SW;
					else if(input_n_v.checked)f_out_n_i = f_out_n_i_SW_v;
					else if(input_n_g.checked)f_out_n_i = f_out_n_i_SW_g;
					else f_out_n_i = f_out_n_i_b;
					f_n_last_i = i => i - 1;
				}
			}else{// Типы нумерации координатами
				span_n_a.style.display = "none";
				span_n_c.style.display = "inline";
				flag_out_n = false;
				if(select_a_g.selectedIndex === 6)_sc_n = _sc;
				else _sc_n = crs.sc[select_a_g.selectedIndex - 7];
				f_out_n_format(_sc_n.metre);
				if(_sc_n.angle){
					input_n_angle.style.display = "inline";
					svg_n_a.style.display = "inline";
				}else{
					input_n_angle.style.display = "none";
					svg_n_a.style.display = "none";
				}
				if(_sc_n.angle === undefined && _sc_n.f_a)span_n_angle.style.display = "inline";
				else span_n_angle.style.display = "none";
			}
			if(input_on.checked && input_on_n.checked)out_n();
		};
		// Устанавливает разделитель, в нумерации, и возможно выводим нумерацию, запускается из текстовых полей нумерации.
		let f_out_d = () => {
			if((type_n_g <= 1 && type_n_v <= 1) || ((type_n_g === 2 || type_n_g === 4) && (type_n_v === 2 || type_n_v === 4)) || ((type_n_g === 3 || type_n_g === 5) && (type_n_v === 3 || type_n_v === 5)))out_n_d = ",";
			else out_n_d = "";
			if(input_on.checked && input_on_n.checked)out_n();
		};
		/// КОНЕЦ функций для НУМЕРАЦИИ.
		// Общая для внешнй и внутренний функции _draw() и draw() вызывается только ими.
		let draw_dop = () => {
			rail_draw();
			if(input_center.checked)p_center.setAttributeNS(null, "d", "M"+map.map.getPixelFromCoordinate(coor_c)+"h0");//p_center.setAttributeNS(null, "d", "M"+((c_t_l[0] + c_b_r[0]) / 2)+","+((c_t_l[1] + c_b_r[1]) / 2)+"h0");
			if(input_fix_zone.checked){
				coor_c[2] = axis;
				input_axial_m.value = toDeg(coor_c[2]);
				input_zone.value = _sc.f_z_a(coor_c[2]);
			}else if(input_fix_zone_s.checked){
				coor_c[2] = f_axis(_sc.op.to_c([(coor_bot_right[0] - coor_top_left[0]) / 2 + coor_top_left[0], (coor_bot_right[1] - coor_top_left[1]) / 2 + coor_top_left[1]])[0]);
				input_axial_m.value = toDeg(coor_c[2]);
				input_zone.value = _sc.f_z_a(coor_c[2]);
			}else if(input_fix_zone_c.checked){
				//coor_c[2] = _sc.op.to_c([(coor_b_r[0] - coor_t_l[0]) / 2 + coor_t_l[0], (coor_b_r[1] - coor_t_l[1]) / 2 + coor_t_l[1]])[0];
				coor_c[2] = _sc.op.to_c(coor_c)[0];
				input_axial_m.value = toDeg(coor_c[2]);
				input_zone.value = _sc.f_z_a(coor_c[2]);
			}else{
				//coor_c.length = 2;// в функции для переключений. // Можно включить в доп. функции.
				axis = f_axis(_sc.op.to_c(coor_c)[0]);
				input_axial_m.value = toDeg(axis);
				input_zone.value = _sc.f_z_a(axis);
			}
			draw_out();
			// Формируем информацию о сетки для сохранения.
			t_data = '{"sc":'+select_cs.selectedIndex+',"c_c":['+text_center.value+'],"c_tl":['+input_t_l.value+'],"c_br":['+input_b_r.value+'],"s_E":'+interval_E;
			if(interval_E !== interval_N)t_data += ',"s_N":'+interval_N;
			if(offset_E !== 0)t_data += ',"o_E":'+offset_E;
			if(offset_N !== 0)t_data += ',"o_N":'+offset_N;
			if(_sc.f_a)t_data += ',"a_sc":'+a_f_g;
			if(a_plus !== 0)t_data += ',"a_g":'+a_equals;
			if(coor_c.length > 2)t_data += ',"ax":'+coor_c[2];
			t_data += '}';
			textarea_data.value = t_data;
			
			if(input_on_n.checked)out_n();
		};
		_draw = () => {// Внутриняя функция срабатывающас при переключениях.
			if(input_on.checked){
				f_coor();
				input_t_l.value = to_wgs_84_N_E(coor_t_l);
				input_b_r.value = to_wgs_84_N_E(coor_b_r);
				if(input_auto.checked)f_auto_step();
				// Находим центр
				if(!input_fix_center.checked){
					if(input_fix_center_s.checked)coor_c = [(coor_bot_right[0] - coor_top_left[0]) / 2 + coor_top_left[0], (coor_bot_right[1] - coor_top_left[1]) / 2 + coor_top_left[1]];
					else coor_c = [(coor_b_r[0] - coor_t_l[0]) / 2 + coor_t_l[0], (coor_b_r[1] - coor_t_l[1]) / 2 + coor_t_l[1]];
				}else coor_c.length = 2;// Можно включить в доп. функции. // в функции для переключений.
				text_center.value = to_wgs_84_N_E(coor_c);
				draw_dop();
			}
		};
		let draw = () => {// Внешняя функция срабатывающас при движении карты.
			if(input_on.checked){
				if(input_to_map.checked){
					f_c();
					// Находим центр
					if(input_fix_center_s.checked){
						coor_c = [(coor_bot_right[0] - coor_top_left[0]) / 2 + coor_top_left[0], (coor_bot_right[1] - coor_top_left[1]) / 2 + coor_top_left[1]];
						text_center.value = to_wgs_84_N_E(coor_c);
					}
				}else{
					f_coor();
					input_t_l.value = to_wgs_84_N_E(coor_t_l);
					input_b_r.value = to_wgs_84_N_E(coor_b_r);
					if(input_auto.checked)f_auto_step();
					// Находим центр
					if(input_fix_center_s.checked){
						coor_c = [(coor_bot_right[0] - coor_top_left[0]) / 2 + coor_top_left[0], (coor_bot_right[1] - coor_top_left[1]) / 2 + coor_top_left[1]];
						text_center.value = to_wgs_84_N_E(coor_c);
					}else if(!input_fix_center.checked){
						coor_c = [(coor_b_r[0] - coor_t_l[0]) / 2 + coor_t_l[0], (coor_b_r[1] - coor_t_l[1]) / 2 + coor_t_l[1]];
						text_center.value = to_wgs_84_N_E(coor_c);
					}
				}
				draw_dop();
			}
		};
		/// Код настройки.
		map.map.once('postrender', () => {
			f_coor();
			coor_c = [(coor_b_r[0] - coor_t_l[0]) / 2 + coor_t_l[0], (coor_b_r[1] - coor_t_l[1]) / 2 + coor_t_l[1]];
		});
		/// События
		// SVG
		rail_t_l.onmousedown = e => {
			m_down(e, e => {
				c_t_l[0] += e.movementX;
				c_t_l[1] += e.movementY;
				if(c_t_l[0] > c_b_r[0])c_b_r[0] = c_t_l[0];
				if(c_t_l[1] > c_b_r[1])c_b_r[1] = c_t_l[1];
				_draw();
			});
		};
		rail_t.onmousedown = e => {
			m_down(e, e => {
				c_t_l[1] += e.movementY;
				if(c_t_l[1] > c_b_r[1])c_b_r[1] = c_t_l[1];
				_draw();
			});
		};
		rail_t_r.onmousedown = e => {
			m_down(e, e => {
				c_b_r[0] += e.movementX;
				c_t_l[1] += e.movementY;
				if(c_t_l[0] > c_b_r[0])c_t_l[0] = c_b_r[0];
				if(c_t_l[1] > c_b_r[1])c_b_r[1] = c_t_l[1];
				_draw();
			});
		};
		rail_r.onmousedown = e => {
			m_down(e, e => {
				c_b_r[0] += e.movementX;
				if(c_t_l[0] > c_b_r[0])c_t_l[0] = c_b_r[0];
				_draw();
			});
		};
		rail_b_r.onmousedown = e => {
			m_down(e, e => {
				c_b_r[0] += e.movementX;
				c_b_r[1] += e.movementY;
				if(c_t_l[0] > c_b_r[0])c_t_l[0] = c_b_r[0];
				if(c_t_l[1] > c_b_r[1])c_t_l[1] = c_b_r[1];
				_draw();
			});
		};
		rail_b.onmousedown = e => {
			m_down(e, e => {
				c_b_r[1] += e.movementY;
				if(c_t_l[1] > c_b_r[1])c_t_l[1] = c_b_r[1];
				_draw();
			});
		};
		rail_b_l.onmousedown = e => {
			m_down(e, e => {
				c_t_l[0] += e.movementX;
				c_b_r[1] += e.movementY;
				if(c_t_l[0] > c_b_r[0])c_b_r[0] = c_t_l[0];
				if(c_t_l[1] > c_b_r[1])c_t_l[1] = c_b_r[1];
				_draw();
			});
		};
		rail_l.onmousedown = e => {
			m_down(e, e => {
				c_t_l[0] += e.movementX;
				if(c_t_l[0] > c_b_r[0])c_b_r[0] = c_t_l[0];
				_draw();
			});
		};
		// MENU
		// Выровнить рамку сетки.
		b_align.onclick = () => {
			c_t_l = [offset, offset];
			c_b_r = [width_map - offset, height_map - offset];
			if(input_on.checked)_draw();
			else f_coor();
		};
		// Вкл./Выкл.
		input_on.onchange = () => {
			if(input_on.checked){
				textarea_data.disabled = false;
				if(flag_off){
					flag_off = false;
					input_t_l.disabled = false;
					input_b_r.disabled = false;
					b_align.onclick();
				}else{
					if(input_to_map.checked)f_c();
					_draw();
				}
				svg.appendChild(layer);
				svg_a_c.style.display = "inline";
			}else{
				span_angle.textContent = "";
				span_n_angle.textContent = "";
				span_limit_E.textContent = "";
				span_limit_N.textContent = "";
				span_limit.textContent = "";
				span_angle_c.textContent = "";
				input_t_l.value = "";
				input_b_r.value = "";
				text_center.value = "";
				input_axial_m.value = "";
				input_zone.value = "";
				input_equals_a.value = "";
				input_plus_a.value = "";
				svg_a_c.style.display = "none";
				textarea_data.value = "";
				textarea_data.disabled = true;
				ctx.clearRect(0, 0, width_map, height_map);
				if(svg.contains(layer))svg.removeChild(layer);
			}
			
		};
		// Центр.
		input_center.onchange = () => {
			if(input_center.checked){
				if(input_on.checked)p_center.setAttributeNS(null, "d", "M"+map.map.getPixelFromCoordinate(coor_c)+"h0");
				layer.appendChild(p_center);
			}else if(layer.contains(p_center))layer.removeChild(p_center);
			
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
			_sc = sc[arr_id_sc[select_cs.selectedIndex - 1]];
			if(select_a_g.selectedIndex === 6)_sc_n = _sc;
			if(_sc.angle){
				input_angle.style.display = "inline";
				svg_a.style.display = "inline";
			}else{
				input_angle.style.display = "none";
				svg_a.style.display = "none";
			}
			if(_sc.angle === undefined && _sc.f_a)span_angle.style.display = "inline";
			else span_angle.style.display = "none";
			if(input_on.checked)_draw();//draw_out();
		};
		// Авто смена шага
		input_auto.onchange = () => {
			if(input_auto.checked){
				input_step.style.display = "none";
				select_step.disabled = true;
				if(flag_off){
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
				_draw();
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
				_draw();
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
			_draw();
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
			_draw();
		};
		// Текстовая смена шага
		input_step.onblur = () => {
			let n = parseFloat(input_step.value);
			if(isFinite(n) && n != 0){
				interval_E = n * arr_grid_step[select_step.selectedIndex + delimiter_step].f;
				if(input_auto_N.checked)interval_N = interval_E;
				_draw();
			}else input_step.value = interval_E / arr_grid_step[select_step.selectedIndex + delimiter_step].f;
		};
		input_step.onkeydown = f_enter;
		input_step.onfocus = f_focus;
		// Текстовая смена шага N
		input_step_N.onblur = () => {
			let n = parseFloat(input_step_N.value);
			if(isFinite(n) && n != 0){
				interval_N = n * arr_grid_step[select_step_N.selectedIndex + delimiter_step].f;
				_draw();
			}else input_step_N.value = interval_N / arr_grid_step[select_step_N.selectedIndex + delimiter_step].f;
		};
		input_step_N.onkeydown = f_enter;
		input_step_N.onfocus = f_focus;
		// Поле для задания угла.
		input_angle.onblur = () => {
			let n = parseFloat(input_angle.value);
			if(isFinite(n)){
				angle = toRad(n);
				svg_a.f_a(angle);
				_draw();
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
				_draw();
			}else input_offset_E.value = offset_E / select_units.value;
		};
		input_offset_E.onkeydown = f_enter;
		input_offset_E.onfocus = f_focus;
		// Сдвиг N
		input_offset_N.onblur = () => {
			let n = parseFloat(input_offset_N.value);
			if(isFinite(n)){
				offset_N = n * select_units.value;
				_draw();
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
				_draw();
			}else input_limit_E.value = limit_E;
		};
		input_limit_E.onkeydown = f_enter;
		input_limit_E.onfocus = f_focus;
		input_limit_N.onblur = () => {
			let n = parseFloat(input_limit_N.value);
			if(isFinite(n) && n > 0){
				limit_N = n;
				_draw();
			}else input_limit_N.value = limit_N;
		};
		input_limit_N.onkeydown = f_enter;
		input_limit_N.onfocus = f_focus;
		input_limit.onblur = () => {
			let n = parseFloat(input_limit.value);
			if(isFinite(n) && n > 0){
				limit = n;
				_draw();
			}else input_limit.value = limit;
		};
		input_limit.onkeydown = f_enter;
		input_limit.onfocus = f_focus;
		// Позиционирование рамки.
		input_t_l.onblur = () => {
			let c = input_t_l.value.split(/[^-0-9\.]+/m, 2).map(toRad);
			let n_N = parseFloat(c[0]);
			let n_E = parseFloat(c[1]);
			if(isFinite(n_N) && isFinite(n_E)){
				coor_t_l = from_wgs_84([c[1], c[0]]);
				if(coor_t_l[0] > coor_b_r[0])coor_b_r[0] = coor_t_l[0];
				if(coor_t_l[1] < coor_b_r[1])coor_b_r[1] = coor_t_l[1];
				f_c();
				_draw();
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
				f_c();
				_draw();
			}else input_b_r.value = to_wgs_84_N_E(coor_b_r);
		};
		input_b_r.onkeydown = f_enter;
		input_b_r.onfocus = f_focus;
		// Центр Позиционирование.
		text_center.onblur = () => {
			let c = text_center.value.split(/[^-0-9\.]+/m, 2).map(toRad);
			let n_N = parseFloat(c[0]);
			let n_E = parseFloat(c[1]);
			if(isFinite(n_N) && isFinite(n_E)){
				coor_c = from_wgs_84([c[1], c[0]]);
				
				_draw();
			}else text_center.value = to_wgs_84_N_E(coor_b_r);
		};
		text_center.onkeydown = f_enter;
		text_center.onfocus = f_focus;
		// Центр зафиксировать
		input_fix_center.onchange = () => {
			if(input_fix_center.checked){
				text_center.disabled = false;
				input_fix_center_s.checked = false;
			}else{
				text_center.disabled = true;
				_draw();
			}
		};
		// Центр по экрану
		input_fix_center_s.onchange = () => {
			if(input_fix_center_s.checked){
				input_fix_center.checked = false;
				text_center.disabled = true;
				_draw();
			}else{
				_draw();
			}
		};
		// Ось и Зона проекции
		// Зафиксировать ось
		input_fix_zone.onchange = () => {
			if(input_fix_zone.checked){
				input_fix_zone_s.checked = false;
				input_fix_zone_c.checked = false;
				input_axial_m.disabled = false;
				input_zone.disabled = false;
				axis = toRad(input_axial_m.value);
			}else{
				input_axial_m.disabled = true;
				input_zone.disabled = true;
				_draw();
			}
		};
		// Зафиксировать ось по экрану
		input_fix_zone_s.onchange = () => {
			if(input_fix_zone_s.checked){
				input_fix_zone.checked = false;
				input_fix_zone_c.checked = false;
				input_axial_m.disabled = true;
				input_zone.disabled = true;
				//axis = toRad(input_axial_m.value);
				_draw();
			}else{
				_draw();
			}
		};
		// Зафиксировать ось по центру
		input_fix_zone_c.onchange = () => {
			if(input_fix_zone_c.checked){
				input_fix_zone_s.checked = false;
				input_fix_zone.checked = false;
				input_axial_m.disabled = true;
				input_zone.disabled = true;
				//axis = toRad(input_axial_m.value);
				_draw();
			}else{
				_draw();
			}
		};
		// Текстовый ввод оси
		input_axial_m.onblur = () => {
			let n = parseFloat(input_axial_m.value);
			if(isFinite(n)){
				axis = toRad(n);
				input_zone.value = _sc.f_z_a(axis);
				_draw();
			}else input_axial_m.value = toDeg(axis);
		};
		input_axial_m.onkeydown = f_enter;
		input_axial_m.onfocus = f_focus;
		// Текстовый ввод зоны
		input_zone.onblur = () => {
			let n = parseFloat(input_zone.value);
			if(isFinite(n)){
				axis = _sc.f_a_z(n);
				input_axial_m.value = toDeg(axis);
				_draw();
			}else input_zone.value = _sc.f_z_a(axis);
		};
		input_zone.onkeydown = f_enter;
		input_zone.onfocus = f_focus;
		// Настройка угла наклона сетки.
		input_fix_plus_a.onchange = () => {
			if(input_fix_plus_a.checked){
				input_fix_compass.checked = false;
				input_fix_equals_a.checked = false;
				input_equals_a.disabled = true;
				input_plus_a.disabled = false;
			}else{
				a_plus = 0;
				input_plus_a.disabled = true;
				_draw();
			}
		};
		input_fix_equals_a.onchange = () => {
			if(input_fix_equals_a.checked){
				input_fix_compass.checked = false;
				input_fix_plus_a.checked = false;
				input_equals_a.disabled = false;
				input_plus_a.disabled = true;
			}else{
				a_plus = 0;
				input_equals_a.disabled = true;
				_draw();
			}
		};
		input_fix_compass.onchange = () => {
			if(input_fix_compass.checked){
				input_fix_equals_a.checked = false;
				input_fix_plus_a.checked = false;
				input_equals_a.disabled = true;
				input_plus_a.disabled = true;
				_draw();
			}else{
				a_plus = 0;
				_draw();
			}
		};
		// Текстовый ввод угла
		input_plus_a.onblur = () => {
			let n = parseFloat(input_plus_a.value);
			if(isFinite(n)){
				a_plus = toRad(n);
				_draw();
			}else input_plus_a.value = toDeg(a_plus);
		};
		input_plus_a.onkeydown = f_enter;
		input_plus_a.onfocus = f_focus;
		input_equals_a.onblur = () => {
			let n = parseFloat(input_equals_a.value);
			if(isFinite(n)){
				a_equals = toRad(n);
				_draw();
			}else input_equals_a.value = toDeg(a_equals);
		};
		input_equals_a.onkeydown = f_enter;
		input_equals_a.onfocus = f_focus;
		// Данные карты
		textarea_data.onchange = () => {
			f_in_grid(textarea_data.value);
		};
		textarea_data.onkeydown = f_enter;
		textarea_data.onfocus = f_focus;
		b_load.onclick = () => {
			f_load(f_in_grid, () => {
				if(!input_on.checked){
					flag_off = false;
					input_on.checked = true;
					svg.appendChild(layer);
					svg_a_c.style.display = "inline";
					input_t_l.disabled = false;
					input_b_r.disabled = false;
					textarea_data.disabled = false;
				}
			});
		};
		b_save.onclick = () => {
			if(input_on.checked){
				// Сохраняем.
				download(textarea_data.value, "grid", 'application/json');
			}
		};
		/// НУМЕРАЦИЯ.
		input_on_n.onchange = () => {
			if(input_on_n.checked){
				document.body.append(layer_n);
				if(input_on.checked)out_n();
			}else{
				span_n_angle.textContent = "";
				if(document.body.contains(layer_n))document.body.removeChild(layer_n);
			}
		};
		// Выбор вида нумерации.
		select_a_g.onchange = f_out_selector;
		// поля нумерации.
		input_n_g.onchange = () => {
			if(input_n_g.checked)input_n_t_g.disabled = false;
			else input_n_t_g.disabled = true;
			f_out_selector();
		};
		input_n_v.onchange = () => {
			if(input_n_v.checked)input_n_t_v.disabled = false;
			else input_n_t_v.disabled = true;
			f_out_selector();
		};
		input_n_t_g.onblur = () => {
			let arr_n = text_in_number(input_n_t_g.value);
			offset_n_g = arr_n[0];
			type_n_g = arr_n[1];
			input_n_t_g.value = number_in_text(offset_n_g, type_n_g);
			f_out_d();
		};
		input_n_t_g.onkeydown = f_enter;
		input_n_t_g.onfocus = f_focus;
		input_n_t_v.onblur = () => {
			let arr_n = text_in_number(input_n_t_v.value);
			offset_n_v = arr_n[0];
			type_n_v = arr_n[1];
			input_n_t_v.value = number_in_text(offset_n_v, type_n_v);
			f_out_d();
		};
		input_n_t_v.onkeydown = f_enter;
		input_n_t_v.onfocus = f_focus;
		// Выбераем еденицы измерения при нумерации координатами
		select_n_t.onchange = () => {
			n_c_div = select_n_t.value;
			if(input_on.checked && input_on_n.checked)out_n();
		};
		// Поле для задания угла нумерации.
		input_n_angle.onblur = () => {
			let n = parseFloat(input_n_angle.value);
			if(isFinite(n)){
				n_angle = toRad(n);
				svg_n_a.f_a(n_angle);
				if(input_on.checked && input_on_n.checked)out_n();
			}else input_n_angle.value = toDeg(n_angle);
		};
		input_n_angle.onkeydown = f_enter;
		input_n_angle.onfocus = f_focus;
		// Настройка сколько знаков выводить в нумерации координатами.
		input_before.oninput = () => {
			span_before.textContent = input_before.value+(input_before.valueAsNumber < 10 ? " ": "");
			out_n();
		};
		input_after.oninput = () => {
			span_after.textContent = input_after.value;
			out_n();
		};
		// Дополнительные настройки нумерации
		n_b_addition.onclick = () => {
			n_b_addition.setAttribute("checked", n_b_addition.getAttribute("checked") === "false");
			if(n_b_addition.getAttribute("checked") === "true")n_s_addition.style.display = "inline";
			else n_s_addition.style.display = "none";
		};
		// Размер нумерации
		input_n_size.oninput = () => {
			span_n_size.textContent = input_n_size.value;
			n_size = input_n_size.valueAsNumber;
			if(input_on.checked && input_on_n.checked)out_n();
		};
		// Цвет фона нумерации
		input_n_color.onchange = () => {
			n_color = input_n_color.value+n_color.slice(7);
			if(input_on.checked && input_on_n.checked)out_n();
		};
		// Прозрачность фона нумерации
		input_n_opacity.oninput = () => {
			n_color = n_color.slice(0, 7)+(input_n_opacity.valueAsNumber <= 0xF ? "0": "")+input_n_opacity.valueAsNumber.toString(0x10);
			if(input_on.checked && input_on_n.checked)out_n();
		};
		// Цвет текста нумерации
		input_n_color_t.onchange = () => {
			n_color_t = input_n_color_t.value+n_color_t.slice(7);
			if(input_on.checked && input_on_n.checked)out_n();
		};
		// Прозрачность текста нумерации
		input_n_opacity_t.oninput = () => {
			n_color_t = n_color_t.slice(0, 7)+(input_n_opacity_t.valueAsNumber <= 0xF ? "0": "")+input_n_opacity_t.valueAsNumber.toString(0x10);
			if(input_on.checked && input_on_n.checked)out_n();
		};
		/// СОХРАНЕНИЕ И ЗАГРУЗКА СЕТКИ.
		
		
		// Дополнительные настройки нумерации
		save_b_addition.onclick = () => {
			save_b_addition.setAttribute("checked", save_b_addition.getAttribute("checked") === "false");
			if(save_b_addition.getAttribute("checked") === "true")save_s_addition.style.display = "inline";
			else save_s_addition.style.display = "none";
		};
		// Сколько знаков после запятой сохранять
		input_seve_d.oninput = () => {
			span_seve_d.textContent = (input_seve_d.valueAsNumber < 10 ? " ": "")+input_seve_d.value;
		};
		
		
		
		
		
		
		// TEST
		let path = createElementNS("path", ["fill", "none"], ["stroke-width", 4], ["stroke-opacity", .5], ["stroke", "#00f"]);
		svg.appendChild(path);
		
		b_in_track.onclick = () => {
			//let obj = {};
			//obj.wpts_WM = [];
			
			//for(let i = 0; i < arr_c_g.length; i++)obj.wpts_WM.push(map.map.getCoordinateFromPixel(arr_c_g[i]));
			// TEST
			
			//let d += (j == i ? "M": "L")+arr_c_g[j][0]+","+arr_c_g[j][1];
			//d += "M100,100L200,200"
			let d = "";
			// Начальные переменные.
			let w = w_g;// w_g // ширина сетки в точках.
			let w_1 = w - 1;// Ширина сетки в шагах.
			let l = arr_c_g.length;// общее количество точек.
			let rem = l % w;// Остаток сетки в точуих, если сработал лимит.
			let h = (l - rem) / w;// Высота сетки в точках.
			let f_even = i => {// определяет пропуски в построении сетки, в шахматном порядке, возвращает логическое значение.
				
			};
			// 1. Вариант без остатка.
			// определяем начальное положение.
			let s_1 = (w / 2) | 0;// Первый сдвиг.
			let s_2 = s_1 - 1;// Второй обратный сдвиг.
			let s_h = w * h - w;// сдвиг по высоте.
			let i = w - (s_1 + 1);// начальное положение.
			
			d += "M"+arr_c_g[i][0]+","+arr_c_g[i][1];
			//d += "M"+arr_c_g[i][0]+","+arr_c_g[i][1]+"l50,50";
			//d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
			//*
			while(true){
				i += s_h;// проходим в верх.
				if(i < 0 || i >= l)break;
				d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
				
				i += s_1;// идем впередх.
				if(i < 0 || i >= l)break;
				d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
				
				
				i -= s_h;// проходим в низ.
				if(i < 0 || i >= l)break;
				d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
				
				if(i === w_1)break;// угол.
				
				i -= s_2;// отступаем назад.
				if(i < 0 || i >= l)break;
				d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
				
				
			}//*/
			i -= w_1;// 0 // угол.
			d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
			
			// Сдвиги по вертикали.
			let h_s_1 = ((h / 2) | 0) * w;
			let h_s_2 = h_s_1 - w;
			
			//*
			while(true){
				
				i += h_s_1;// в верх.
				if(i < 0 || i >= l)break;
				d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
				if(i === l - w)break;// угол
				
				
				i += w_1;// вперед
				if(i < 0 || i >= l)break;
				d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
				
				i -= h_s_2;// в низ
				if(i < 0 || i >= l)break;
				d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
				
				i -= w_1;// назад
				if(i < 0 || i >= l)break;
				d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
				
				
				
			}//*/
			// достраиваем вертикали.
			//*
			while(true){
				i += s_1;// идем впередх.
				if(i < 0 || i >= l)break;
				d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
				
				i -= s_h;// проходим в низ.
				if(i < 0 || i >= l)break;
				d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
				
				i -= s_2;// отступаем назад.
				
				if(i === w - (s_1 + 1))break;// конец.
				
				if(i < 0 || i >= l)break;
				d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
				
				i += s_h;// проходим в верх.
				if(i < 0 || i >= l)break;
				d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
				
				
			}//*/
			
			
			/*
			// Начальная точка.
			let i = arr_c_g.length - 1;
			d += "M"+arr_c_g[i][0]+","+arr_c_g[i][1];
			// первый возврат, с пропуском. если не целая то отступ на часть.
			let w_g_1 = (w_g - 1);
			
			
			if(remainder_w > 0)i -= (remainder_w - 1);
			else i -= w_g_1;
			
			if(i >= 0 && remainder_w !== 1) d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
			
			
			let step = 2;
			let first_step = 2;// первый шаг.
			let trend = 1;
			
			let first_pass = true;
			
			while(true){
				// смещаешся вниз на одну.
				i -= w_g;
				if(i < 0)break;
				else d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
				
				
				// движемся в обратном направлении по шагам.
				let end_n = i + (w_g - 1) * trend;
				// Если последняя движемся непошагово.
				if(i - w_g < 0){
					i = end_n;
					d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
					break;
				}
				let flag_end = false;
				let flag_start = true;
				while(!flag_end){
					if(flag_start){
						flag_start = false;
						i += first_step * trend;
					}else i += step * trend;
					if((trend > 0 && i >= end_n) || (trend < 0 && i <= end_n)){
						flag_end = true;
						if((trend > 0 && i > end_n) || (trend < 0 && i < end_n)){
							i -= trend;
							first_step = 2;
						}else first_step = 1;
						d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
					}else{
						if(first_pass && remainder_w > 0 && i > ((end_n - w_g_1) + (remainder_w - 2)))continue;
						d += "L"+arr_c_g[i][0]+","+arr_c_g[i][1];
					}
				}
				
				trend *= -1;
				first_pass = false;
				
			}
			// Настройка и вертикальные проходы.
			//*/
			
			
			
			
			
			
			
			
			
			path.setAttributeNS(null, "d", d);
			
			
			
			
			
			
			
			
			
			
			
			
			// END TEST
			//m_tracks.f_track_test(obj);
		};
		
		
		
		
		
		/// EXTRA
		return draw;
	};
	
	var f_draw_grid = grid();
	
	
	
	
	// TEST
	
}




































