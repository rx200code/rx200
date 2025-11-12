function Degrees(){
	let svg = document.getElementById("svg");// слой для рисования.
	let menu = document.getElementById("content_degrees");// Все настройки меню разметки и сеток.
	let degrees_text = createElementNS("g");// Контейнер для вывода текста.
	let scale_text = 1;// Коэфицент масштаба текста.
	let size_t = 18 * scale_text;// Размер текста.
	let bot_y = height_map - 30 * scale_text;// Вертикальный отступ с низу для текста в углах.
	let sc = crs.get_cs();
	// Создаем тексты для углов карты.
	let create_text_a = (x, y, align) => {
		let elm = create_text();
		elm.setAttributeNS(null,'filter', 'url(#bord_t)');
		elm.setAttributeNS(null,'font-size', size_t+"px");
		elm.setAttributeNS(null,'x', x);
		elm.setAttributeNS(null,'y', y);
		elm.setAttributeNS(null, "text-anchor", align);
		degrees_text.appendChild(elm);
		return elm;
	};
	let create_tspan_a = parent => {
		let elm = createElementNS("tspan");
		elm.setAttributeNS(null,'x', parent.getAttributeNS(null, 'x'));
		elm.setAttributeNS(null,'dy', 14 * scale_text+'px');
		parent.appendChild(elm);
		return elm;
	};
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
		}else if(format_d == 8)text += (n / 1000 | 0)+"km";//Math.round(n / 1000)+"km";
		else if(format_d == 9)text += (n | 0)+"m";
		else if(format_d == 10)text += n.toFixed(2)+"m";
		else if(format_d == 11)text += (n / 0.3048006096 | 0)+"ft";// Геодезический фут 0.3048006096 метра.
		else if(format_d == 12)text += (n / 0.3048 | 0)+"ft";// Международный фут 0.3048 метра.
		else if(format_d == 13)text += (n / 0.9144 | 0)+"yd";// Ярд 0.9144 метра.
		else if(format_d == 14)text += (n / 1609.344 | 0)+"mile";// Миля 1609.344 метра.
		else if(format_d == 15)text += (n / 1855.3248465545596 | 0)+"gm";// Географическая миля 1855.3248465545596 метра, вычесленная для WGS 84.
		else if(format_d == 16)text += (n / 1852 | 0)+"nm";// Морская миля 1852 метра.
		else text += "Error";
		return text;
	};
	
	
	
	
	
	
	
	// #### TEST Вывода текста но сторонам. ####
	let f_number_in_format_d_t = (n, east, id) => {
		let text = "";
		let format_d_t = document.getElementById("grid_step_"+id).selectedIndex;
		if(format_d_t < 12){
			n = toDeg(n)
			if(east)n = d_360(n);
		}
		/*## TEST ## // Похоже решение в том что эта функция для углов, а при выводе текста на линиях нужно округлять как раньше Math.round или n.toFixed(11); без использования | 0;
		let np = .0000000009;
		if(format_d_t < 8)np = .0000000000009;
		if(n < 0)n -= np;
		else n += np;
		//##########*/
		if(format_d_t >= 1 && format_d_t <= 7){
			if(n < 0){
				n *= -1;
				if(n > 0.0013)text += "-";
			}
			let sec_n = Math.round(n * 3600);
			let seconds = sec_n % 60;
			//let minutes = ((sec_n - seconds) / 60) % 60;
			//let degrees = (sec_n - seconds - minutes * 60) / 3600;
			let minutes = ((sec_n - seconds) / 60) % 60;
			let degrees = sec_n / 3600 | 0;
			text += (degrees < 10 ? "0"+degrees: degrees)+"°"+(minutes < 10 ? "0"+minutes: minutes)+"'"+(seconds < 10 ? "0"+seconds: seconds)+'"';
			/*
			let degrees = Math.round(n);// ошибка показывает например 21.20 и следои 22.30 хотя должен 21.30
			text += (degrees < 10 ? "0"+degrees: degrees)+"°";
			let minutes = Math.round(n * 60) % 60;
			text += (minutes < 10 ? "0"+minutes: minutes)+"'";
			let seconds = Math.round(n * 3600) % 60;
			text += (seconds < 10 ? "0"+seconds: seconds)+'"';
			//*/
		}else if(format_d_t == 9)text += n < 10 ? "0"+n.toFixed(5)+"°": n.toFixed(5)+"°";
		else if(format_d_t == 10)text += Math.round(n * 60)+"'";
		else if(format_d_t == 11)text += Math.round(n * 60 * 60)+'"';
		else if(format_d_t == 12)text += n+"rad";
		else if((format_d_t >= 13 && format_d_t <= 18) || format_d_t == 26)text += Math.round(n)+"m";
		else if((format_d_t >= 19 && format_d_t <= 23) || format_d_t == 25)text += Math.round(n / 1000)+"km";//Math.round(n / 1000)+"km";
		else if(format_d_t == 27)text += Math.round(n / 0.3048006096 | 0)+"ft";// Геодезический фут 0.3048006096 метра.
		else if(format_d_t == 28)text += Math.round(n / 0.3048)+"ft";// Международный фут 0.3048 метра.
		else if(format_d_t == 29)text += Math.round(n / 0.9144)+"yd";// Ярд 0.9144 метра.
		else if(format_d_t == 30)text += Math.round(n / 1609.344)+"mile";// Миля 1609.344 метра.
		else if(format_d_t == 31)text += Math.round(n / 1855.3248465545596)+"gm";// Географическая миля 1855.3248465545596 метра, вычесленная для WGS 84.
		else if(format_d_t == 32)text += Math.round(n / 1852)+"nm";// Морская миля 1852 метра.
		else text += "Error";
		return text;
	};
	//##########################################
	
	
	
	
	
	
	
	
	
	
	
	
	/// Настройка СК/проекции.
	let options_format_d = document.getElementById("format_d").children;
	let f_to_xy = () => {
		for(let i = 1; i < 8; i++)options_format_d[i].style.display = "none";
		for(let i = 8; i < options_format_d.length; i++)options_format_d[i].style.display = "block";
		if(document.getElementById("format_d").selectedIndex < 8)format_d = document.getElementById("format_d").selectedIndex = 8;
	}
	let f_to_fl = () => {
		for(let i = 1; i < 8; i++)options_format_d[i].style.display = "block";
		for(let i = 8; i < options_format_d.length; i++)options_format_d[i].style.display = "none";
		if(document.getElementById("format_d").selectedIndex > 7)format_d = document.getElementById("format_d").selectedIndex = 1;
	}
	/// Заполняем список проекций
	for(let i = 0; i < sc.length; i++){
		let op = document.createElement("option");
		op.innerHTML = sc[i].name;
		document.getElementById("sys_c").append(op);
		// sys_grid_0
		op = document.createElement("option");
		op.innerHTML = sc[i].name;
		document.getElementById("sys_grid_0").append(op);
		// sys_grid_1
		op = document.createElement("option");
		op.innerHTML = sc[i].name;
		document.getElementById("sys_grid_1").append(op);
	}
	document.getElementById("sys_grid_0").selectedIndex = 2;
	let sys_c_ind = 0;
	let f_sys_c = () => {
		sys_c_ind = document.getElementById("sys_c").selectedIndex - 1;
		if(sc[sys_c_ind].metre)f_to_xy();
		else f_to_fl();
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
		if(document.getElementById("draw_grid_0").checked)draw_grid(0);
		if(document.getElementById("draw_grid_1").checked)draw_grid(1);
		/// TEST
		f_draw_1();
		f_draw_2();
	};
	let f_out_text_z = c => c[3] ? "z:"+sc[sys_c_ind].f_z(c[2])+" S": "z:"+sc[sys_c_ind].f_z(c[2])+" N";
	let f_out_angles_text = () => {
		// Переводим координаты в нужную систему/проекцию координат
		let c_top_left_out = sc[sys_c_ind].f_to(coor_top_left);
		let c_top_right_out = sc[sys_c_ind].f_to(coor_top_right);
		let c_bot_left_out = sc[sys_c_ind].f_to(coor_bot_left);
		let c_bot_right_out = sc[sys_c_ind].f_to(coor_bot_right);
		// Переводим в нужный формат и отображаем координаты.
		//let z = c_top_left_out.length > 2;// Истина если массив длинее чем две координаты, что значит что он содержит третьим значением зону
		let z = sc[sys_c_ind].zone;// Истина если есть функция зоны.
		top_left_text_F.textContent = f_number_in_format_d(c_top_left_out[1], false)+(z ? " "+f_out_text_z(c_top_left_out): "");
		top_left_text_L.textContent = f_number_in_format_d(c_top_left_out[0], true);
		top_right_text_F.textContent = (z ? f_out_text_z(c_top_right_out): "")+f_number_in_format_d(c_top_right_out[1], false);
		top_right_text_L.textContent = f_number_in_format_d(c_top_right_out[0], true);
		bot_left_text_F.textContent = f_number_in_format_d(c_bot_left_out[1], false)+(z ? " "+f_out_text_z(c_bot_left_out): "");
		bot_left_text_L.textContent = f_number_in_format_d(c_bot_left_out[0], true);
		bot_right_text_F.textContent = (z ? f_out_text_z(c_bot_right_out): "")+ f_number_in_format_d(c_bot_right_out[1], false);
		bot_right_text_L.textContent = f_number_in_format_d(c_bot_right_out[0], true);
	};
	///#### Создание сетки. ####
	// 1. Создаем path
	let createPathGrid = () => {
		let elm = createElementNS("path");
		elm.setAttributeNS(null, "fill", "none");
		elm.setAttributeNS(null, "stroke-width", 1);
		elm.setAttributeNS(null, "stroke-opacity", .7);
		return elm;
	}
	let path_grid = [createPathGrid(), createPathGrid()];
	path_grid[0].setAttributeNS(null, "stroke", document.getElementById("grid_color_0").value);
	svg.appendChild(path_grid[0]);
	
	path_grid[1].setAttributeNS(null, "stroke", document.getElementById("grid_color_1").value);
	svg.appendChild(path_grid[1]);
	// #### TEST Вывода текста но сторонам. ####
	//##########################################
	let test_size_text = 10;
	let create_text_test = () => {
		let elm = create_text();
		elm.setAttributeNS(null,'filter', 'url(#bord_t_2)');
		elm.setAttributeNS(null,'font-size', test_size_text+"px");
		return elm;
	};
	let att_t_bord_c = [0, 0];
	let att_t_bord = [[], []];
	let f_out_test = (side, n, c, id) => {
		let elm = null;
		if(att_t_bord[id].length <= att_t_bord_c[id]){
			elm = create_text_test();
			att_t_bord[id][att_t_bord[id].length] = elm;
			att_t_bord_c[id]++;
		}else elm = att_t_bord[id][att_t_bord_c[id]++];
		elm.textContent = n;
		switch(side){
			case "left":
				elm.setAttributeNS(null, "text-anchor", "start");
				elm.setAttributeNS(null,'x', 0);
				elm.setAttributeNS(null,'y', c);
				break;
			case "right":
				
				elm.setAttributeNS(null, "text-anchor", "end");
				elm.setAttributeNS(null,'x', width_map);
				elm.setAttributeNS(null,'y', c);
				break;
			case "top":
				
				elm.setAttributeNS(null, "text-anchor", "middle");
				elm.setAttributeNS(null,'x', c);
				elm.setAttributeNS(null,'y', test_size_text * .8);
				break;
			case "bot":
				elm.setAttributeNS(null, "text-anchor", "middle");
				elm.setAttributeNS(null,'x', c);
				elm.setAttributeNS(null,'y', height_map - test_size_text * .2);
				break;
		}
		
		if(!svg.contains(elm))svg.appendChild(elm);
		
		//if(side == "right")alert(c);
	};
	let f_remove_test = (id) => {
		for(let i = att_t_bord_c[id]; i < att_t_bord[id].length; i++){
			if(svg.contains(att_t_bord[id][i]))svg.removeChild(att_t_bord[id][i]);
			else break;
		}
	};
	let f_remove_test_all = (id) => {
		att_t_bord_c[id] = 0;
		for(let i = att_t_bord_c[id]; i < att_t_bord[id].length; i++){
			if(svg.contains(att_t_bord[id][i]))svg.removeChild(att_t_bord[id][i]);
			else break;
		}
		if(att_t_bord[id].length > 1500)att_t_bord[id].length = 1500;//чтоб не грузить память.
	};
	let f_out_test_2 = (side, n, Ax, Ay, Bx, By, os, h, id) => {
		let flag = false;
		if(Ax == os && Ay >= 0 && Ay <= h){
			f_out_test(side, n, Ay, id);
			flag = true;
		}else if(Bx == os && By >= 0 && By <= h){
			f_out_test(side, n, By, id);
			flag = true;
		}else if(Ax < os && Bx > os){
			let c = By - ((By - Ay) * (1 / (Bx - Ax) * (Bx - os)));
			//if(side == "top")alert(c);
			if(c >= 1 && c <= h){
				f_out_test(side, n, c, id);
				flag = true;
			}
		}
		
		//if(side == "top" && (Ax < os))alert(1);
		//if(side == "top")alert(Ax+" "+os+" "+Bx);
		
		return flag;
	};
	let f_out_test_1 = (side, n, c_1, c_2, id) => {
		let flag = false;
		let p = 1;
		switch(side){
			case "left":
				flag = f_out_test_2(side, f_number_in_format_d_t(n, false, id), c_1[0], c_1[1], c_2[0], c_2[1], p, height_map, id);
				break;
			case "right":
				flag = f_out_test_2(side, f_number_in_format_d_t(n, false, id), c_1[0], c_1[1], c_2[0], c_2[1], width_map-p, height_map, id);
				
				//if(flag)alert(c_1+"\n"+c_2);
				
				
				break;
			case "top":
				
				flag = f_out_test_2(side, f_number_in_format_d_t(n, true, id), c_2[1], c_2[0], c_1[1], c_1[0], p, width_map, id);
				
				//if(flag)alert(c_1+"\n"+c_2);
				
				break;
			case "bot":
				flag = f_out_test_2(side, f_number_in_format_d_t(n, true, id), c_2[1], c_2[0], c_1[1], c_1[0], height_map-p, width_map, id);
				break;
		}
		return flag;
	};
	
	//##########################################
	
	// Функция построения сеток.
	let interval = [500000, 500000];
	let draw_grid = function(id){
		// Находим центр
		let coor_centr = [(coor_bot_right[0] - coor_top_left[0]) / 2 + coor_top_left[0], (coor_bot_right[1] - coor_top_left[1]) / 2 + coor_top_left[1]];
		// Устанавливаем тип проекции.
		ind_sys_grid = document.getElementById("sys_grid_"+id).selectedIndex - 1;
		// Устанавливаем функции перевода координат
		let f_to = sc[ind_sys_grid].f_to;
		let f_from = sc[ind_sys_grid].f_from;
		// Находим зону, ось в центре если есть. И координаты новой проекции в центре.
		let coor_centr_to = f_to(coor_centr);
		// Сохраняем номер зоны, ось если есть.
		let z_s = coor_centr_to.slice(2);
		// Устанавливаем интервал, в градусах или метрах.
		//let interval = interval[id];
		// Находим координаты углов в новой проекции. Учитывая зону, ось если есть.
		let c_top_left_to = f_to(coor_top_left.concat(z_s));
		let c_top_right_to = f_to(coor_top_right.concat(z_s));
		let c_bot_left_to = f_to(coor_bot_left.concat(z_s));
		let c_bot_right_to = f_to(coor_bot_right.concat(z_s));
		// Определяем крайние положения в новой проекции.
		let left = Math.min(c_top_left_to[0], c_bot_left_to[0], f_to([coor_top_left[0], coor_centr[1]].concat(z_s))[0]);
		let right = Math.max(c_top_right_to[0], c_bot_right_to[0], f_to([coor_top_right[0], coor_centr[1]].concat(z_s))[0]);
		let top = Math.max(c_top_right_to[1], c_top_left_to[1], f_to([coor_centr[0], coor_top_right[1]].concat(z_s))[1]);
		let bot = Math.min(c_bot_left_to[1], c_bot_right_to[1], f_to([coor_centr[0], coor_bot_right[1]].concat(z_s))[1]);
		// Устанавливаем ограничения для севера и юга, Чтоб если заходили за пределы карты не перескакивали на другой полюс.
		let top_limit = top;
		let bot_limit = bot;
		// Убираем дробную часть интервала.
		left -= left % interval[id];
		right -= right % interval[id];
		top -= top % interval[id];
		bot -= bot % interval[id];
		// на один шаг сдвигаем значения, чтоб по возможности охватывали всю область просмотра.
		left -= interval[id];
		right += interval[id];
		top += interval[id];
		bot -= interval[id];
		// Дополнительные переменные формирования сетки.
		let line_h_arr = [];
		let i = 0;
		let coor = [0, 0].concat(z_s);
		let d_path = "";
		// Запускаем цыклы формирования сетки.
		// #### TEST Вывода текста но сторонам. ####
		f_remove_test_all(id);
		let cc_x_arr = null;
		let ccc = 0;
		//##########################################
		for(let y = bot; y <= top + (interval[id] * .1); y += interval[id]){
			coor[1] = y;
			i = 0;
			let limit = true;
			if(coor[1] < bot_limit){coor[1] = bot_limit;limit = false;}
			else if(coor[1] > top_limit){coor[1] = top_limit;limit = false;}
			// #### TEST Вывода текста но сторонам. ####
			let cc_y = null;
			let cc_x_arr_2 = [];
			//##########################################
			for(let x = left; x <= right + (interval[id] * .1); x += interval[id]){
				coor[0] = x;
				let c_WM = f_from(coor);
				let c_pixel = map.map.getPixelFromCoordinate(c_WM);
				if(limit)d_path += i == 0 ? "M"+c_pixel[0]+","+c_pixel[1]: "L"+c_pixel[0]+","+c_pixel[1];
				if(y == bot)line_h_arr[i] = "M"+c_pixel[0]+","+c_pixel[1];
				else line_h_arr[i] += "L"+c_pixel[0]+","+c_pixel[1];
				i++;
				// #### TEST Вывода текста но сторонам. ####
				if(document.getElementById("test_step_"+id).checked){
					if(cc_y != null){
						f_out_test_1("left", y, cc_y, c_pixel, id);
						f_out_test_1("right", y, cc_y, c_pixel, id);
					}
					cc_y = c_pixel;
					ccc++;
					//alert(c_pixel+"\n"+ccc);
					
					
					c_pixel.push(x);
					cc_x_arr_2.push(c_pixel);
				}
				//##########################################
			}
			// #### TEST Вывода текста но сторонам. ####
			if(document.getElementById("test_step_"+id).checked){
				if(cc_x_arr != null){
					for(let k = 0; k < cc_x_arr.length; k++){
						//if(cc_x_arr_2[k][1] < 0)alert(cc_x_arr_2[k][1]);
						f_out_test_1("top", cc_x_arr[k][2], cc_x_arr[k], cc_x_arr_2[k], id);
						f_out_test_1("bot", cc_x_arr[k][2], cc_x_arr[k], cc_x_arr_2[k], id);
					}
					
				}
				cc_x_arr = cc_x_arr_2.slice();
			}
			//##########################################
			
		}
		// #### TEST Вывода текста но сторонам. ####
		f_remove_test(id);
		//##########################################
		// Отображаем сетку.
		path_grid[id].setAttributeNS(null, "d", d_path+line_h_arr.join(''));
	};
	/// Шаг сеток.
	let arr_grid_step = [
		'1" arcsec',
		'10" arcsec',
		"1' arcmin",
		"10' arcmin",
		"1° deg",
		"10° deg",
		"20° deg",
		"Свой в",
		"градусы(deg)",
		"минуты(arcmin)",
		"секунды(arcsec)",
		"радианы(rad)",
		"10 m",
		"25 m",
		"50 m",
		"100 m",
		"250 m",
		"500 m",
		"1 km",
		"2 km",
		"4 km",
		"50 km",
		"500 km",
		"Свой в",
		"km(километры)",
		"m(метры)",
		"ft(футы, геодезические)",
		"ft(футы, международный)",
		"yd(ярды)",
		"mile(мили)",
		"gm(географическая мили)",
		"nm(морские мили)"
	];
	for(let i = 0; i < arr_grid_step.length; i++){
		// grid_step_0
		let op = document.createElement("option");
		if(i == 7 || i == 23)op.disabled = true;
		op.innerHTML = arr_grid_step[i];
		document.getElementById("grid_step_0").append(op);
		// grid_step_1
		op = document.createElement("option");
		if(i == 7 || i == 23)op.disabled = true;
		op.innerHTML = arr_grid_step[i];
		document.getElementById("grid_step_1").append(op);
	}
	document.getElementById("auto_step_0").checked = true;
	document.getElementById("auto_step_1").checked = true;
	
	
	
	document.getElementById("text_step_0").style.display = "none";
	document.getElementById("text_step_1").style.display = "none";
	let grid_step = [document.getElementById("grid_step_0"), document.getElementById("grid_step_1")];
	grid_step[0].disabled = true;
	grid_step[1].disabled = true;
	
	let f_auto_step_id = (id) => {
		let z = map.view.getZoom();
		if(sc[document.getElementById("sys_grid_"+id).selectedIndex - 1].metre){
			if(z > 19){
				interval[id] = 10;
				grid_step[id].selectedIndex = 13;
			}else if(z > 17){
				interval[id] = 25;
				grid_step[id].selectedIndex = 14;
			}else if(z > 16){
				interval[id] = 50;
				grid_step[id].selectedIndex = 15;
			}else if(z > 15){
				interval[id] = 100;
				grid_step[id].selectedIndex = 16;
			}else if(z > 13.5){
				interval[id] = 250;
				grid_step[id].selectedIndex = 17;
			}else if(z > 12.5){
				interval[id] = 500;
				grid_step[id].selectedIndex = 18;
			}else if(z > 11.5){
				interval[id] = 1000;
				grid_step[id].selectedIndex = 19;
			}else if(z > 10.5){
				interval[id] = 2000;
				grid_step[id].selectedIndex = 20;
			}else if(z > 9.5){
				interval[id] = 4000;
				grid_step[id].selectedIndex = 21;
			}else if(z > 6){
				interval[id] = 50000;
				grid_step[id].selectedIndex = 22;
			}else{
				interval[id] = 500000;
				grid_step[id].selectedIndex = 23;
			}
		}else{
			if(z > 18){
				interval[id] = toRad(1 / 60 / 60);
				grid_step[id].selectedIndex = 1;
			}else if(z > 15){
				interval[id] = toRad(1 / 60 / 6);
				grid_step[id].selectedIndex = 2;
			}else if(z > 12){
				interval[id] = toRad(1 / 60);
				grid_step[id].selectedIndex = 3;
			}else if(z > 9){
				interval[id] = toRad(1 / 6);
				grid_step[id].selectedIndex = 4;
			}else if(z > 6){
				interval[id] = toRad(1);
				grid_step[id].selectedIndex = 5;
			}else{
				interval[id] = toRad(10);
				grid_step[id].selectedIndex = 6;
			}
		}
		//document.getElementById("test_out_2").innerHTML = "<br>"+map.view.getZoom();
	}
	let f_auto_step2 = [() => {f_auto_step_id(0);}, () => {f_auto_step_id(1);}];
	
	
	
	let options_step = [document.getElementById("grid_step_0").children, document.getElementById("grid_step_1").children];
	let f_step_options = id => {
		let b = "block";
		let n = "none";
		let flag_m = sc[document.getElementById("sys_grid_"+id).selectedIndex - 1].metre;
		if(flag_m){
			b = "none";
			n = "block";
		}
		for(let i = 1; i < 13; i++)options_step[id][i].style.display = b;
		for(let i = 13; i < options_step[id].length; i++)options_step[id][i].style.display = n;
		if(grid_step[id].selectedIndex < 13 && flag_m){
			document.getElementById("text_step_"+id).style.display = "none";
			f_auto_step_id(id);
		}else if(grid_step[id].selectedIndex > 13 && !flag_m){
			document.getElementById("text_step_"+id).style.display = "none";
			f_auto_step_id(id);
		}
	};
	let f_on_auto_step = id => {
		if(document.getElementById("auto_step_"+id).checked){
			grid_step[id].disabled = true;
			document.getElementById("text_step_"+id).style.display = "none";
			f_auto_step2[id]();
			if(document.getElementById("draw_grid_"+id).checked){
				map.view.on('change:resolution', f_auto_step2[id]);
				draw_grid(id);
			}else map.view.un('change:resolution', f_auto_step2[id]);
		}else{
			f_step_options(id);
			grid_step[id].disabled = false;
			if(document.getElementById("draw_grid_"+id).checked){
				map.view.un('change:resolution', f_auto_step2[id]);
				draw_grid(id);
			}
		}
	};
	let f_step_t = (id, value) => {
		document.getElementById("text_step_"+id).style.display = "inline";
		document.getElementById("text_step_"+id).value = value;
	};
	let f_grid_step = id => {
		document.getElementById("text_step_"+id).style.display = "none";
		switch(grid_step[id].selectedIndex){
			case 1:
				interval[id] = toRad(1 / 60 / 60);
				break;
			case 2:
				interval[id] = toRad(1 / 60 / 6);
				break;
			case 3:
				interval[id] = toRad(1 / 60)
				break;
			case 4:
				interval[id] = toRad(1 / 6);
				break;
			case 5:
				interval[id] = toRad(1);
				break;
			case 6:
				interval[id] = toRad(10);
				break;
			case 7:
				interval[id] = toRad(20);
				break;
			case 9:
				f_step_t(id, toDeg(interval[id]));
				break;
			case 10:
				f_step_t(id, toDeg(interval[id]) * 60);
				break;
			case 11:
				f_step_t(id, toDeg(interval[id]) * 60 * 60);
				break;
			case 12:
				f_step_t(id, interval[id]);
				break;
			case 13:
				interval[id] = 10;
				break;
			case 14:
				interval[id] = 25;
				break;
			case 15:
				interval[id] = 50;
				break;
			case 16:
				interval[id] = 100;
				break;
			case 17:
				interval[id] = 250;
				break;
			case 18:
				interval[id] = 500;
				break;
			case 19:
				interval[id] = 1000;
				break;
			case 20:
				interval[id] = 2000;
				break;
			case 21:
				interval[id] = 4000;
				break;
			case 22:
				interval[id] = 50000;
				break;
			case 23:
				interval[id] = 500000;
				break;
			case 25:
				f_step_t(id, interval[id] / 1000);
				break;
			case 26:
				f_step_t(id, interval[id]);
				break;
			case 27:
				f_step_t(id, interval[id] / 0.3048006096);
				break;
			case 28:
				f_step_t(id, interval[id] / 0.3048);
				break;
			case 29:
				f_step_t(id, interval[id] / 0.9144);
				break;
			case 30:
				f_step_t(id, interval[id] / 1609.344);
				break;
			case 31:
				f_step_t(id, interval[id] / 1855.3248465545596);
				break;
			case 32:
				f_step_t(id, interval[id] / 1852);
				break;
			default:
				interval[id] = 500000;
		}
		if(document.getElementById("draw_grid_"+id).checked)draw_grid(id);
	};
	let f_out_step_n = (id, n) => {
		switch(grid_step[id].selectedIndex){
			case 9:
				interval[id] = toRad(n);
				break;
			case 10:
				interval[id] = toRad(n / 60);
				break;
			case 11:
				interval[id] = toRad(n / 60 / 60);
				break;
			case 12:
				interval[id] = n;
				break;
			case 25:
				interval[id] = n * 1000;
				break;
			case 26:
				interval[id] = n;
				break;
			case 27:
				interval[id] = n *  0.3048006096;
				break;
			case 28:
				interval[id] = n *  0.3048;
				break;
			case 29:
				interval[id] = n *  0.9144;
				break;
			case 30:
				interval[id] = n *  1609.344;
				break;
			case 31:
				interval[id] = n *  1855.3248465545596;
				break;
			case 32:
				interval[id] = n *  1852;
				break;
		}
		draw_grid(id);
	};
	
	
	function select_input(){this.select();};
	document.getElementById("text_step_0").onfocus = select_input;
	document.getElementById("text_step_1").onfocus = select_input;
	
	let cc = 0;//test
	let f_input_step = (id) => {
		let n = parseFloat(document.getElementById("text_step_"+id).value);
		
		if(isFinite(n) && n != 0)f_out_step_n(id, n);
		else f_grid_step(id);
		
		//document.getElementById("test_out_deg").innerHTML = ++cc+" "+id;//test
	};
	
	document.getElementById("text_step_0").onblur = () => {f_input_step(0);};
	document.getElementById("text_step_1").onblur = () => {f_input_step(1);};
	document.getElementById("text_step_0").onkeydown = (e) => {if(e.keyCode === 13)e.target.blur();};
	document.getElementById("text_step_1").onkeydown = (e) => {if(e.keyCode === 13)e.target.blur();};
	
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
			}
			f_on_auto_step(0);
			f_on_auto_step(1);
		}else if(e.target.id == "format_d"){
			format_d = e.target.selectedIndex;// Устанавливаем формат отображения координат в углу карты.
			f_out_angles_text();
		}else if(e.target.id == "sys_c"){
			f_sys_c();// Устанавливаем проекцию для отображения в углах карты.
			f_out_angles_text();
		}else if(e.target.id == "draw_grid_0"){
			if(e.target.checked){
				document.getElementById("auto_step_0").checked = true;
				f_on_auto_step(0);
			}else{
				// #### TEST Вывода текста но сторонам. ####
				f_remove_test_all(0);
				//##########################################
				f_on_auto_step(0);
				path_grid[0].setAttributeNS(null, "d", "");// Иначе убераем.
			}
		}else if(e.target.id == "draw_grid_1"){
			if(e.target.checked){
				document.getElementById("auto_step_1").checked = true;
				f_on_auto_step(1);
			}else{
				// #### TEST Вывода текста но сторонам. ####
				f_remove_test_all(1);
				//##########################################
				f_on_auto_step(1);
				path_grid[1].setAttributeNS(null, "d", "");// Иначе убераем.
			}
		}else if(e.target.id == "sys_grid_0"){
			f_on_auto_step(0);
		}else if(e.target.id == "sys_grid_1"){
			f_on_auto_step(1);
		}else if(e.target.id == "grid_color_0")path_grid[0].setAttributeNS(null, "stroke", e.target.value);// Цвет для первой сетки.
		else if(e.target.id == "grid_color_1")path_grid[1].setAttributeNS(null, "stroke", e.target.value);
		else if(e.target.id == "auto_step_0")f_on_auto_step(0);
		else if(e.target.id == "auto_step_1")f_on_auto_step(1);
		else if(e.target.id == "grid_step_0")f_grid_step(0);
		else if(e.target.id == "grid_step_1")f_grid_step(1);
		// #### TEST Вывода текста но сторонам. ####
		else if(e.target.id == "test_step_0"){
			if(e.target.checked)draw_grid(0)
			else f_remove_test_all(0);
		}else if(e.target.id == "test_step_1"){
			if(e.target.checked)draw_grid(1)
			else f_remove_test_all(1);
		}
		//##########################################
	};
	map.map.once('postrender', () => menu.onchange({target:{id:"markings_corners"}}));
	map.map.on("postrender", f_move);// пока самая надежная "postrender"
	
	
	
	/// TESTS
	
	// Рисуем точку.
	
	/*
	let line = new ol.Feature({
		geometry: new ol.geom.Point(ol.proj.fromLonLat([83, 55])),
	});
	//*/
	/*
	line.setStyle(
		new ol.style.Style({
			image: new ol.style.Circle({
				radius: 9,
				fill: new ol.style.Fill({color: 'red'}),
			}),
		})
	);
	//*/
	/*
	let arr_p = [[55.36960700,34.86192600],[55.36657800,35.05114500],[55.36208700,35.05091300],[55.36511600,34.86171600],[55.36062600,34.86150500],[55.35759700,35.05068100],[55.35310700,35.05044900],[55.35613500,34.86129400],[55.35164400,34.86108300],[55.34861700,35.05021700],[55.34412700,35.04998500],[55.34715400,34.86087300],[55.34266300,34.86066200],[55.33963700,35.04975300],[55.33514700,35.04952100],[55.33817300,34.86045100],[55.33368200,34.86024100],[55.33065700,35.04928900],[55.32616700,35.04905700],[55.32919100,34.86003100],[55.32470100,34.85982000],[55.32167700,35.04882600],[55.31718700,35.04859400],[55.32021000,34.85961000],[55.31572000,34.85940000],[55.31269700,35.04836200],[55.30820600,35.04813100],[55.31122900,34.85919000],[55.30673800,34.85897900],[55.30371600,35.04789900],[55.29922600,35.04766800],[55.30224800,34.85876900],[55.29775700,34.85855900],[55.29473600,35.04743700],[55.29024600,35.04720600],[55.29326700,34.85834900],[55.28877600,34.85814000],[55.28575600,35.04697400],[55.28126600,35.04674300],[55.28428500,34.85793000],[55.27979500,34.85772000],[55.27677600,35.04651200],[55.27228500,35.04628100],[55.27530400,34.85751000],[55.27081300,34.85730100],[55.26779500,35.04605000],[55.26330500,35.04581900],[55.26632300,34.85709100],[55.26183200,34.85688200],[55.25881500,35.04558900],[55.25432500,35.04535800],[55.25734100,34.85667200],[55.25285100,34.85646300],[55.24983500,35.04512700],[55.36657800,35.05114500],[55.36671000,35.04326200],[55.24996600,35.03726700],[55.25009700,35.02940700],[55.36684100,35.03537900],[55.36697200,35.02749500],[55.25022800,35.02154600],[55.25035800,35.01368600],[55.36710300,35.01961100],[55.36723300,35.01172800],[55.25048700,35.00582500],[55.25061600,34.99796500],[55.36736200,35.00384400],[55.36749100,34.99596000],[55.25074400,34.99010400],[55.25087200,34.98224300],[55.36762000,34.98807600],[55.36774800,34.98019300],[55.25100000,34.97438200],[55.25112700,34.96652100],[55.36787500,34.97230900],[55.36800200,34.96442500],[55.25125300,34.95866000],[55.25137900,34.95079900],[55.36812900,34.95654000],[55.36825500,34.94865600],[55.25150500,34.94293800],[55.25162900,34.93507700],[55.36838000,34.94077200],[55.36850500,34.93288800],[55.25175400,34.92721600],[55.25187800,34.91935500],[55.36863000,34.92500300],[55.36875300,34.91711900],[55.25200100,34.91149300],[55.25212400,34.90363200],[55.36887700,34.90923500],[55.36900000,34.90135000],[55.25224600,34.89577100],[55.25236800,34.88790900],[55.36912200,34.89346500],[55.36924400,34.88558100],[55.25249000,34.88004800],[55.25261100,34.87218600],[55.36936500,34.87769600],[55.36948600,34.86981100],[55.25273100,34.86432400],[55.25285100,34.85646300],[55.36960700,34.86192600],[55.36741600,34.70402500],[55.36523600,34.85383200],[55.36074500,34.85362200],[55.36292500,34.70383200],[55.35843500,34.70363900],[55.35625500,34.85341200],[55.35176400,34.85320200],[55.35394400,34.70344600],[55.34945300,34.70325300],[55.34727400,34.85299200],[55.34278300,34.85278200],[55.34496200,34.70306000],[55.34047100,34.70286800],[55.33829200,34.85257300],[55.33380200,34.85236300],[55.33598000,34.70267500],[55.33148900,34.70248200],[55.32931100,34.85215400],[55.32482100,34.85194400],[55.32699800,34.70229000],[55.32250700,34.70209700],[55.32033000,34.85173500],[55.31583900,34.85152600],[55.31801600,34.70190500],[55.31352500,34.70171200],[55.31134900,34.85131600],[55.30685800,34.85110700],[55.30903400,34.70152000],[55.30454300,34.70132800],[55.30236700,34.85089800],[55.29787700,34.85068900],[55.30005200,34.70113600],[55.29556100,34.70094300],[55.29338600,34.85048000],[55.28889500,34.85027100],[55.29107000,34.70075100],[55.28657900,34.70055900],[55.28440500,34.85006200],[55.27991400,34.84985300],[55.28208800,34.70036700],[55.27759700,34.70017500],[55.27542300,34.84964400],[55.27093300,34.84943500],[55.27310600,34.69998300],[55.26861500,34.69979100],[55.26644200,34.84922700],[55.26195100,34.84901800],[55.26412400,34.69960000],[55.25963300,34.69940800],[55.25746100,34.84880900],[55.25297000,34.84860100],[55.25514200,34.69921600],[55.25065000,34.69902500],[55.24847900,34.84839200],[55.24398900,34.84818400],[55.24615900,34.69883300],[55.24166800,34.69864100],[55.23949800,34.84797600],[55.23500700,34.84776700],[55.23717700,34.69845000],[55.23268600,34.69825900],[55.23051700,34.84755900],[55.22602600,34.84735100],[55.22819500,34.69806700],[55.22370400,34.69787600],[55.22153500,34.84714300],[55.21704500,34.84693500],[55.21921300,34.69768500],[55.21472200,34.69749300],[55.21255400,34.84672700],[55.36523600,34.85383200],[55.36535500,34.84594700],[55.21267200,34.83887300],[55.21279100,34.83101900],[55.36547400,34.83806300],[55.36559200,34.83017900],[55.21290800,34.82316500],[55.21302500,34.81531100],[55.36571000,34.82229500],[55.36582800,34.81441100],[55.21314200,34.80745700],[55.21325800,34.79960300],[55.36594400,34.80652600],[55.36606100,34.79864200],[55.21337400,34.79174800],[55.21348900,34.78389400],[55.36617600,34.79075700],[55.36629200,34.78287300],[55.21360400,34.77604000],[55.21371800,34.76818500],[55.36640600,34.77498800],[55.36652100,34.76710400],[55.21383100,34.76033100],[55.21394400,34.75247600],[55.36663400,34.75921900],[55.36674800,34.75133400],[55.21405700,34.74462200],[55.21416900,34.73676700],[55.36686000,34.74345000],[55.36697300,34.73556500],[55.21428100,34.72891300],[55.21439200,34.72105800],[55.36708400,34.72768000],[55.36719600,34.71979500],[55.21450200,34.71320300],[55.21461200,34.70534800],[55.36730600,34.71191000],[55.36741600,34.70402500],[55.21472200,34.69749300]]; // track 1 segment 1
	
	
	let points = [];//[new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([83, 55])))];
	
	for(let i = 0; i < arr_p.length; i++){
		points[i] = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([arr_p[i][1], arr_p[i][0]])));
	}
	
	
	let layer_points = new ol.layer.Vector({
			source: new ol.source.Vector({
				features: points,
			}),
			style: new ol.style.Style({
				image: new ol.style.Circle({
					radius: 5,
					fill: new ol.style.Fill({color: 'red'}),
				}),
			}),
		});
	layer_points.setMap(map.map);
	//*/
	//*
	//let arr_p = [[55.36960700,34.86192600],[55.36657800,35.05114500],[55.36208700,35.05091300],[55.36511600,34.86171600],[55.36062600,34.86150500],[55.35759700,35.05068100],[55.35310700,35.05044900],[55.35613500,34.86129400],[55.35164400,34.86108300],[55.34861700,35.05021700],[55.34412700,35.04998500],[55.34715400,34.86087300],[55.34266300,34.86066200],[55.33963700,35.04975300],[55.33514700,35.04952100],[55.33817300,34.86045100],[55.33368200,34.86024100],[55.33065700,35.04928900],[55.32616700,35.04905700],[55.32919100,34.86003100],[55.32470100,34.85982000],[55.32167700,35.04882600],[55.31718700,35.04859400],[55.32021000,34.85961000],[55.31572000,34.85940000],[55.31269700,35.04836200],[55.30820600,35.04813100],[55.31122900,34.85919000],[55.30673800,34.85897900],[55.30371600,35.04789900],[55.29922600,35.04766800],[55.30224800,34.85876900],[55.29775700,34.85855900],[55.29473600,35.04743700],[55.29024600,35.04720600],[55.29326700,34.85834900],[55.28877600,34.85814000],[55.28575600,35.04697400],[55.28126600,35.04674300],[55.28428500,34.85793000],[55.27979500,34.85772000],[55.27677600,35.04651200],[55.27228500,35.04628100],[55.27530400,34.85751000],[55.27081300,34.85730100],[55.26779500,35.04605000],[55.26330500,35.04581900],[55.26632300,34.85709100],[55.26183200,34.85688200],[55.25881500,35.04558900],[55.25432500,35.04535800],[55.25734100,34.85667200],[55.25285100,34.85646300],[55.24983500,35.04512700],[55.36657800,35.05114500],[55.36671000,35.04326200],[55.24996600,35.03726700],[55.25009700,35.02940700],[55.36684100,35.03537900],[55.36697200,35.02749500],[55.25022800,35.02154600],[55.25035800,35.01368600],[55.36710300,35.01961100],[55.36723300,35.01172800],[55.25048700,35.00582500],[55.25061600,34.99796500],[55.36736200,35.00384400],[55.36749100,34.99596000],[55.25074400,34.99010400],[55.25087200,34.98224300],[55.36762000,34.98807600],[55.36774800,34.98019300],[55.25100000,34.97438200],[55.25112700,34.96652100],[55.36787500,34.97230900],[55.36800200,34.96442500],[55.25125300,34.95866000],[55.25137900,34.95079900],[55.36812900,34.95654000],[55.36825500,34.94865600],[55.25150500,34.94293800],[55.25162900,34.93507700],[55.36838000,34.94077200],[55.36850500,34.93288800],[55.25175400,34.92721600],[55.25187800,34.91935500],[55.36863000,34.92500300],[55.36875300,34.91711900],[55.25200100,34.91149300],[55.25212400,34.90363200],[55.36887700,34.90923500],[55.36900000,34.90135000],[55.25224600,34.89577100],[55.25236800,34.88790900],[55.36912200,34.89346500],[55.36924400,34.88558100],[55.25249000,34.88004800],[55.25261100,34.87218600],[55.36936500,34.87769600],[55.36948600,34.86981100],[55.25273100,34.86432400],[55.25285100,34.85646300],[55.36960700,34.86192600],[55.36741600,34.70402500],[55.36523600,34.85383200],[55.36074500,34.85362200],[55.36292500,34.70383200],[55.35843500,34.70363900],[55.35625500,34.85341200],[55.35176400,34.85320200],[55.35394400,34.70344600],[55.34945300,34.70325300],[55.34727400,34.85299200],[55.34278300,34.85278200],[55.34496200,34.70306000],[55.34047100,34.70286800],[55.33829200,34.85257300],[55.33380200,34.85236300],[55.33598000,34.70267500],[55.33148900,34.70248200],[55.32931100,34.85215400],[55.32482100,34.85194400],[55.32699800,34.70229000],[55.32250700,34.70209700],[55.32033000,34.85173500],[55.31583900,34.85152600],[55.31801600,34.70190500],[55.31352500,34.70171200],[55.31134900,34.85131600],[55.30685800,34.85110700],[55.30903400,34.70152000],[55.30454300,34.70132800],[55.30236700,34.85089800],[55.29787700,34.85068900],[55.30005200,34.70113600],[55.29556100,34.70094300],[55.29338600,34.85048000],[55.28889500,34.85027100],[55.29107000,34.70075100],[55.28657900,34.70055900],[55.28440500,34.85006200],[55.27991400,34.84985300],[55.28208800,34.70036700],[55.27759700,34.70017500],[55.27542300,34.84964400],[55.27093300,34.84943500],[55.27310600,34.69998300],[55.26861500,34.69979100],[55.26644200,34.84922700],[55.26195100,34.84901800],[55.26412400,34.69960000],[55.25963300,34.69940800],[55.25746100,34.84880900],[55.25297000,34.84860100],[55.25514200,34.69921600],[55.25065000,34.69902500],[55.24847900,34.84839200],[55.24398900,34.84818400],[55.24615900,34.69883300],[55.24166800,34.69864100],[55.23949800,34.84797600],[55.23500700,34.84776700],[55.23717700,34.69845000],[55.23268600,34.69825900],[55.23051700,34.84755900],[55.22602600,34.84735100],[55.22819500,34.69806700],[55.22370400,34.69787600],[55.22153500,34.84714300],[55.21704500,34.84693500],[55.21921300,34.69768500],[55.21472200,34.69749300],[55.21255400,34.84672700],[55.36523600,34.85383200],[55.36535500,34.84594700],[55.21267200,34.83887300],[55.21279100,34.83101900],[55.36547400,34.83806300],[55.36559200,34.83017900],[55.21290800,34.82316500],[55.21302500,34.81531100],[55.36571000,34.82229500],[55.36582800,34.81441100],[55.21314200,34.80745700],[55.21325800,34.79960300],[55.36594400,34.80652600],[55.36606100,34.79864200],[55.21337400,34.79174800],[55.21348900,34.78389400],[55.36617600,34.79075700],[55.36629200,34.78287300],[55.21360400,34.77604000],[55.21371800,34.76818500],[55.36640600,34.77498800],[55.36652100,34.76710400],[55.21383100,34.76033100],[55.21394400,34.75247600],[55.36663400,34.75921900],[55.36674800,34.75133400],[55.21405700,34.74462200],[55.21416900,34.73676700],[55.36686000,34.74345000],[55.36697300,34.73556500],[55.21428100,34.72891300],[55.21439200,34.72105800],[55.36708400,34.72768000],[55.36719600,34.71979500],[55.21450200,34.71320300],[55.21461200,34.70534800],[55.36730600,34.71191000],[55.36741600,34.70402500],[55.21472200,34.69749300]]; // track 1 segment 1
	// GNSS
	
	let arr_p = [];//[[48.83592070523207,2.3349398013683715,'OPMT'],[43.75473852808908,6.920574431239439,'GRAS'],[43.75473850707345,6.920574421786691,'GRAS'],[43.75473850835074,6.920574448778486,'GRAS'],[43.75473853726972,6.920574498116203,'GRAS'],[43.5607739967078,1.480761301406766,'TOUL'],[43.56077406095074,1.4807612357792086,'TOUL'],[43.56069545389444,1.480891627284118,'TLSE'],[43.56069546693146,1.4808916364885294,'TLSE'],[43.56069548138911,1.4808915667656308,'TLSE'],[48.380494363315705,-4.4965935319710075,'BRST'],[48.38049432398256,-4.496593512009909,'BRST'],[48.380494326747346,-4.4965934704411845,'BRST'],[48.38049438095969,-4.496593526194471,'BRST'],[48.38049432541303,-4.496593461216532,'BRST'],[48.44460444607767,-4.411818846821399,'GUIP'],[48.444604448612836,-4.411818911700137,'GUIP'],[48.44460443107219,-4.411818761216187,'GUIP'],[43.7032648676284,7.2272624810048045,'NICA'],[43.70326491216241,7.227262550187947,'NICA'],[50.99365484361032,2.344753136664378,'DGLG'],[50.99365486105974,2.3447530917400132,'DGLG'],[46.13346362820905,-0.40769862195702944,'CHIZ'],[46.158943012288006,-1.2193155853423907,'LROC'],[46.158943032429974,-1.2193155953945463,'LROC'],[49.58066226223739,-1.7779593978914687,'HEAU'],[46.530030054866046,-1.805787280112516,'SABL'],[46.530030075048124,-1.8057872124618346,'SABL'],[47.6480085158332,-3.507979966859458,'GROI'],[47.64800845171973,-3.507980565929744,'GROI'],[43.27877051311707,5.353788500550946,'MARS'],[43.2787705596869,5.353788453862577,'MARS'],[43.278770536267196,5.353788538190684,'MARS'],[43.278770542436014,5.353788437804966,'MARS'],[43.27877057219268,5.3537885661229145,'MARS'],[43.47196428567981,-1.5369104257384352,'BIAZ'],[43.471964311031414,-1.53691047692339,'BIAZ'],[41.927458134938874,8.762615901098288,'AJAC'],[41.92745815129186,8.76261579713913,'AJAC'],[41.927458129522144,8.76261590438145,'AJAC'],[42.51532403120365,3.1367034856829292,'BEAR'],[42.51532398627805,3.136703566173156,'BEA2'],[42.5153239633183,3.1367034721840814,'BEAR'],[44.645954941298676,-1.2488313279119208,'FERR'],[43.39523551930994,-1.681677539105783,'SCOA'],[43.39523551151747,-1.6816775271390714,'SCOA'],[43.395235528236974,-1.681677365976606,'SCOA'],[43.554582289989014,7.015726435679406,'CNNS'],[43.55458229563881,7.01572643560328,'CNNS'],[45.87908518348976,4.676576671742959,'SJDV'],[45.879085184653135,4.676576676447178,'SJDV'],[55.739020201006376,12.50002552346137,'BUDP'],[57.59110096794144,9.967547358872276,'HIRS'],[62.02329680429788,-6.764516037844683,'TORS'],[62.02329682675732,-6.764516115667263,'TORS'],[55.46027244776529,8.439772626638403,'ESBH'],[55.46027238216815,8.439772521643775,'ESBH'],[55.46027241262155,8.439772641823183,'ESBH'],[54.57443041305913,11.92292767437517,'GESR'],[61.9973708409668,-6.783523325794366,'ARGI'],[55.49356636407856,8.456826761823317,'ESBC'],[64.13878493731393,-21.955486302928207,'REYK'],[64.13878497619544,-21.955486356799984,'REYK'],[64.1387850390132,-21.955486439435457,'REYK'],[64.13878504376692,-21.955486443173548,'REYK'],[64.13878504245478,-21.955486382467765,'REYK'],[64.13878506264474,-21.95548634968612,'REYK'],[64.138785099474,-21.955486497825397,'REYK'],[64.13878513163563,-21.955486500265632,'REYK'],[64.1387942453697,-21.95547655391648,'REYZ'],[64.13879429269176,-21.955476609514673,'REYZ'],[64.1387943386644,-21.95547665629692,'REYZ'],[64.13879434138613,-21.955476644956907,'REYZ'],[64.26729275362547,-15.197919396030748,'HOFN'],[64.26729270656935,-15.19791944059691,'HOFN'],[64.2672926389377,-15.197919193145749,'HOFN'],[64.26729264391062,-15.19791922016831,'HOFN'],[64.2672926289653,-15.197919334114014,'HOFN'],[64.267292552695,-15.197919079278584,'HOFN'],[69.66274935897194,18.93833171258686,'TROM'],[69.66271886074972,18.93964858052437,'TRO1'],[69.66271883440244,18.939648427842247,'TRO1'],[69.66271888465317,18.939648587933757,'TRO1'],[69.66271884253514,18.939648383607505,'TRO1'],[69.6627188477549,18.939648405139675,'TRO1'],[69.6627188437474,18.93964843429347,'TRO1'],[59.73658761709854,10.367758736627382,'OSLS'],[59.736587635064524,10.367758765060856,'OSLS'],[78.92958538338465,11.865089100768436,'NYAL'],[78.92955544763778,11.865311830418644,'NYAC'],[78.92958546310744,11.865088926929669,'NYAL'],[78.92958547544988,11.865088962211722,'NYAL'],[78.92958549706734,11.86508902483788,'NYAL'],[78.92958544179929,11.865088883516535,'NYAL'],[78.92955542712296,11.865311956260737,'NYA1'],[78.92955544704013,11.865311814754136,'NYA1'],[58.006377411513476,7.554755858422061,'TGDE'],[70.33637360939562,31.031196959311888,'VARS'],[70.33637363503246,31.031196977703516,'VARS'],[70.33637361439139,31.031197088457198,'VARS'],[59.01771276476812,5.598625478249837,'STAS'],[59.01771277303684,5.598625568166872,'STAS'],[59.017712736508585,5.598625576285406,'STAS'],[63.37138449086015,10.319158665031146,'TRDS'],[63.37138451309468,10.319158741387016,'TRDS'],[69.27837411717985,16.008697712977785,'ANDO'],[69.2783741392841,16.00869765059908,'ANDO'],[57.39529955515252,11.92551877671812,'ONSA'],[57.39529955970971,11.925518771828338,'ONSA'],[57.39529955491119,11.925518781256214,'OS0G'],[57.39529956158754,11.925518766350338,'OS0G'],[67.85735226045996,20.968449242889584,'KIRU'],[67.85735224869227,20.968449149214216,'KIRU'],[67.85735227542473,20.96844919795193,'KIRU'],[67.85735228431867,20.968449130346183,'KIRU'],[67.85735226213042,20.968449179044,'KIRU'],[60.59514447893965,17.25852810432,'MAR6'],[67.87757653747943,21.060242193076064,'KIR0'],[57.653870597920076,18.367318667388382,'VIS0'],[64.69784830319776,16.559932824396725,'VIL0'],[64.69784831800052,16.559932889556638,'VIL0'],[64.69784830324069,16.5599328249409,'VIL0'],[64.69784831813031,16.559932894061593,'VIL0'],[57.71495934017929,12.891350640923356,'SPT0'],[57.71495934182303,12.891350649595946,'SPT0'],[64.8791981191502,21.048292179305744,'SKE0'],[64.87919810337426,21.04829218928549,'SKE0'],[64.8791981294857,21.048292278085288,'SKE0'],[64.87919811865457,21.048292225652915,'SKE0'],[60.21748060130714,24.39533254287234,'METZ'],[60.217472743889296,24.395322093134023,'METS'],[60.21747285759362,24.39532203111664,'METS'],[60.217472751064804,24.395322058143094,'METS'],[60.217472777189535,24.395322095050044,'METS'],[60.2038502263554,24.96115732919775,'SG40'],[62.961193883814865,21.77063822533504,'VAAS'],[62.39117400830512,30.096160622136818,'JOEN'],[60.200186652701404,25.04655217104554,'SG02'],[55.715355902630506,21.11888627640809,'KLPD'],[47.06713067926991,15.493481644076558,'GRAZ'],[47.067130652549174,15.493481656824239,'GRAZ'],[47.06713066993591,15.493481750294103,'GRAZ'],[47.06713065416669,15.49348166877006,'GRAZ'],[47.06713063370803,15.493481706536585,'GRAZ'],[47.06713066790965,15.493481649364268,'GRAZ'],[47.067130686787884,15.493481659032652,'GRAZ'],[47.31290560995776,11.386093571965352,'HFLK'],[47.31290565509826,11.386093621755142,'HFLK'],[47.31290568251632,11.38609360376279,'HFLK'],[42.556095154687235,23.394734081552667,'SOFI'],[42.556095151579505,23.39473411432044,'SOFI'],[42.556095176894125,23.394734095388948,'SOFI'],[47.78960376292373,19.281530247360493,'PENC'],[47.789603785782866,19.281530253334566,'PENC'],[47.789603776114,19.281530232069755,'PENC'],[44.463945440048,26.12574201338845,'BUCU'],[44.463945400088036,26.125742025310014,'BUCU'],[44.463945393730796,26.125742040450646,'BUCU'],[49.91370535040955,14.785623713505158,'GOPE'],[49.91370532849875,14.785623794289146,'GOPE'],[49.91370535283292,14.78562374070668,'GOPE'],[49.91370530575537,14.78562379425858,'GOPE'],[49.91370537258482,14.785623746420898,'GOPE'],[49.913705368043225,14.785623723537796,'GOPE'],[49.034714112997676,20.322937117981372,'GANP'],[49.03471417897579,20.32293717316762,'GANP'],[49.13378594128155,13.724179763889305,'VACO'],[43.50664154783756,16.438453501153553,'SPLT'],[43.50664151982489,16.438453397212907,'SPLT'],[52.097275583309504,21.031540387756525,'JOZE'],[52.09727559646233,21.03154034648069,'JOZE'],[52.09783648652404,21.032352696502265,'JOZ2'],[52.09783650793141,21.032352620350245,'JOZ2'],[52.27695743123182,17.07345782332284,'BOR1'],[52.276957445493885,17.073457873171225,'BOR1'],[52.47594835084544,21.035345342117285,'BOGO'],[52.475948360168786,21.035345225040178,'BOGO'],[52.475948362041436,21.03534520359207,'BOGO'],[53.892400819766806,20.669943496579215,'LAMA'],[53.892400805930826,20.669943406381414,'LAMA'],[53.892400842001784,20.66994338326953,'LAMA'],[51.11326162279431,17.062041661497734,'WROC'],[51.1132616218421,17.0620416092703,'WROC'],[51.11326160807934,17.062041486396186,'WROC'],[51.11326159122593,17.06204164688854,'WROC'],[51.11326160164722,17.062041619003423,'WROC'],[54.796760049950535,18.418754156813154,'WLAD'],[54.47238010840257,17.11752895727175,'REDZ'],[39.079939671473355,17.125034882029713,'KROT'],[48.631978418899045,22.297620172267653,'UZHL'],[48.63197838742086,22.297620114710202,'UZHL'],[48.6319783976409,22.297620063021732,'UZHL'],[48.63197835715584,22.297620192350678,'UZHL'],[56.9486202870313,24.05877539934595,'RIGA'],[56.94862028815628,24.058775475872267,'RIGA'],[56.9486202856007,24.058775400740142,'RIGA'],[56.94862030535222,24.058775375662336,'RIGA'],[56.948620268768245,24.058775414592883,'RIGA'],[56.94862027266903,24.05877539224656,'RIGA'],[56.02748053355882,37.22359121701659,'MDVO'],[56.027480597037474,37.22359115109282,'MDVO'],[56.02748064045901,37.223591293167274,'MDVO'],[56.02149287208279,37.21450581611476,'MDVJ'],[40.22645591981336,44.502928511340535,'NSSP'],[40.22645594048785,44.50292856503333,'NSSP'],[52.21902394207296,104.3162422467638,'IRKT'],[52.21902393749294,104.31624224528717,'IRKM'],[52.219023935474425,104.31624232842057,'IRKM'],[52.2190239350902,104.31624231961172,'IRKT'],[52.21902036711966,104.31618414101943,'IRKJ'],[52.219020367114105,104.31618419591736,'IRKJ'],[50.005102886102435,36.239009381771076,'KHAR'],[50.005102819052254,36.2390093632729,'KHAR'],[50.00510282029384,36.23900940375481,'KHAR'],[50.005102791638436,36.23900933087664,'KHAR'],[54.84061104565565,83.23544639404375,'NVSK'],[41.32804934597412,69.29556786353737,'TASH'],[41.32804935046038,69.29556786896522,'TASH'],[41.32804935066844,69.2955678922786,'TASH'],[41.32804938972108,69.29556791853054,'TASH'],[47.02973452694588,142.71672088581207,'YSSK'],[47.0297345184195,142.7167209101835,'YSSK'],[47.02973441483268,142.71672096261094,'YSSK'],[47.02973441943107,142.71672106855272,'YSSK'],[47.0297344296253,142.71672102421152,'YSSK'],[47.02973442277235,142.71672105256744,'YSSK'],[47.02973441958489,142.71672102375936,'YSSK'],[55.69928380339807,36.758630166499756,'ZWEN'],[55.699283817931594,36.758630202482856,'ZWEN'],[55.69928383501631,36.758630121485744,'ZWEN'],[55.69928380126036,36.75863022825733,'ZWEN'],[55.69928375231459,36.75863025653377,'ZWEN'],[55.6992832046636,36.75839126316727,'ZWE2'],[55.69928324144982,36.75839126084851,'ZWE2'],[39.13476714101881,66.88544696843684,'KIT3'],[39.134767114628076,66.88544685970074,'KIT3'],[46.972785160383,31.97284209828672,'MIKL'],[49.602614462461375,34.542932020903905,'POLV'],[49.60261450406674,34.54293199213256,'POLV'],[44.41326027104859,33.99098371913213,'CRAO'],[44.413260234105536,33.99098370002113,'CRAO'],[44.39288967043683,33.96946584355692,'KTVL'],[51.76970498318097,102.23498535703973,'BADG'],[51.769705053881836,102.23498535217671,'BADG'],[51.769705027403695,102.23498537643142,'BADG'],[51.76970502808181,102.23498540564587,'BADG'],[42.67977021885801,74.6942667451884,'POL2'],[42.67977025628581,74.69426675256919,'POL2'],[42.67977027258432,74.69426679116988,'POL2'],[42.67977027149883,74.69426671096018,'POL2'],[55.99324970694,92.79383361267338,'KSTU'],[55.99324966982366,92.79383363523547,'KSTU'],[55.99324971889752,92.79383354767717,'KSTU'],[55.99324973436214,92.7938335945607,'KSTU'],[55.9932497049649,92.79383361833408,'KRSN'],[55.993249669782166,92.79383364280909,'KRSN'],[55.993249713924364,92.79383354334428,'KRSN'],[55.99324973040358,92.79383360264137,'KRSN'],[60.532862617188954,29.78087688414708,'SVTL'],[60.53286249726617,29.78087688192686,'SVTL'],[60.53286268664611,29.78087692989403,'SVTL'],[60.532862650989536,29.780876924574418,'SVTL'],[43.788393392091514,41.56506778538917,'ZECK'],[43.7883934080244,41.56506782316021,'ZECK'],[43.78839340353023,41.56506779989191,'ZECK'],[43.78839341140043,41.565067834384294,'ZECK'],[43.178732263069726,77.01689996629825,'SELE'],[43.17873230127462,77.01689999700012,'SELE'],[43.17873229645781,77.01689995506781,'SELE'],[62.0309594732704,129.68030507097555,'YAKT'],[62.030959459087086,129.6803049514386,'YAKT'],[59.57575240891881,150.77002311925747,'MAG0'],[59.57575263123019,150.77002189587517,'MAG0'],[59.57575264673039,150.77002191702988,'MAG0'],[59.57575285437642,150.7700223472214,'MAG0'],[59.575752854671315,150.77002241007258,'MAG0'],[59.57575290489084,150.77002238538364,'MAG0'],[53.0667315112564,158.60707681794287,'PETP'],[53.06673148061638,158.607076898431,'PETP'],[53.066731587376324,158.6070766669615,'PETP'],[53.06673162597132,158.60707664705777,'PETP'],[53.06673159082283,158.60707664921995,'PETP'],[53.06673160162021,158.60707660095002,'PETP'],[53.06673165119492,158.60707653906252,'PETP'],[53.02329977243379,158.6501338539982,'PETS'],[53.02329976030164,158.65013391399822,'PETS'],[53.02329978025719,158.6501338362705,'PETS'],[53.023299820051726,158.65013373359886,'PETS'],[53.0232998445812,158.65013377217312,'PETS'],[53.023299877823135,158.65013376343254,'PETS'],[50.36418339293611,30.496733814487296,'GLSV'],[50.36418334298396,30.496733917946425,'GLSV'],[50.364183340492886,30.496733919788714,'GLSV'],[71.63447305734051,128.86642297267053,'TIXI'],[71.63447305321634,128.86642286056235,'TIXG'],[71.63447302914568,128.86642290981285,'TIXI'],[71.63447305441736,128.8664228414372,'TIXI'],[71.63446296197584,128.8663945365637,'TIXJ'],[71.63446306640836,128.86639452001563,'TIXJ'],[48.521453821020465,135.04615692933086,'KHAJ'],[48.52145380158963,135.04615696188213,'KHAJ'],[48.52145377453277,135.04615700589983,'KHAJ'],[48.52145374399093,135.04615711313497,'KHAJ'],[56.42982183879017,58.56045882467246,'ARTU'],[68.07612881914436,166.43796376766642,'BILI'],[68.0653131447674,166.4533827122545,'BILB'],[69.36183324090356,88.35978344910748,'NRIL'],[55.114879611279534,36.56952670205115,'MOBN'],[55.11488276399467,36.56971530457842,'MOBJ'],[55.114882781807815,36.56971530157917,'MOBJ'],[55.114882808653384,36.569715287529625,'MOBJ'],[49.835589211156105,24.014489606488098,'SULP'],[49.83558922740981,24.014489595263278,'SULP'],[49.835589216195785,24.0144895379035,'SULP'],[55.030500982843684,82.90948965295831,'NOVM'],[55.03050096096966,82.90948972962367,'NOVM'],[38.078553398902386,23.932434070835473,'DYNG'],[35.951480956968304,27.78078221188346,'KATC'],[35.53319002817627,24.0705594308026,'TUC2'],[35.53318999394584,24.070559474387473,'TUC2'],[40.56681881299728,23.00371933464306,'AUT1'],[40.56681877881512,23.003719322614486,'AUT1'],[38.283655999715336,21.78674996650249,'PAT0'],[38.283655977551675,21.786749937855575,'PAT0'],[35.49977512118953,12.605657654937724,'LAMP'],[35.49977502963341,12.605657658917803,'LAMP'],[35.4997750120864,12.605657743703667,'LAMP'],[35.49977509329783,12.605657723750912,'LAMP'],[35.499775048015906,12.605657727036641,'LAMP'],[44.519957086383165,11.646817507484673,'MEDI'],[44.51995808041101,11.646816259709626,'MEDI'],[44.51995806948286,11.646816248049157,'MEDI'],[44.41938834075022,8.921144412376073,'GENO'],[36.87611112286281,14.989811148470665,'NOTO'],[36.87611109905154,14.989811125315816,'NOTO'],[36.87584531091144,14.98978843378537,'NOT1'],[45.70975776015945,13.763521434158864,'TRIE'],[45.01513313079231,7.639406204318204,'IENG'],[45.06336825574416,7.661282612542754,'TORI'],[45.063368239703074,7.661282566337493,'TORI'],[39.13591262285614,8.972753751422172,'CAGL'],[39.13591262544787,8.972753791586577,'CAGL'],[39.135890652411504,8.972759632416219,'CAGZ'],[40.64913252366352,16.70446075791926,'MATE'],[40.64913251873203,16.704460733940437,'MATE'],[40.649132543213966,16.704460736407288,'MATE'],[40.64913252896122,16.704460784527267,'MATE'],[40.64913255691742,16.70446074421844,'MATE'],[40.64906295158921,16.70454753026914,'MAT1'],[40.649062913344935,16.70454756185452,'MAT1'],[45.436983065309185,12.331985799891157,'VENE'],[45.43698302755187,12.331985812888131,'VENE'],[45.43698302828433,12.331985802731753,'VENE'],[45.43698306718512,12.331985850977167,'VENE'],[45.43698304874574,12.331985853216846,'VENE'],[45.43698307607029,12.331985829524838,'VENE'],[45.411154403215725,11.896063303915268,'PADO'],[45.40671918168016,11.877934503887044,'UPAD'],[45.406719198406584,11.877934515095546,'UPAD'],[45.41115438667906,11.896063298204734,'PADO'],[43.119392234468435,12.355704470999767,'UNPG'],[43.11939223501928,12.355704465193863,'UNPG'],[43.119392229303216,12.355704455259843,'UNPG'],[43.11939216893315,12.35570448821451,'UNPG'],[43.11939213838442,12.355704481321133,'UNPG'],[43.11939224061148,12.355704381325353,'UNPG'],[38.108322636638135,15.651032937359894,'TGRC'],[38.10832268299171,15.651032920776917,'TGRC'],[38.1083227931627,15.651032945021493,'TGRC'],[50.79781879567778,4.3592204208042755,'BRUS'],[50.79781875534158,4.3592204169359094,'BRUS'],[50.79781872836208,4.359220499419522,'BRUS'],[50.798063224454154,4.358564216746872,'BRUX'],[50.79806321517386,4.358564196649717,'BRUX'],[50.00150278138838,5.144884082673074,'REDU'],[50.00150277372802,5.144884065803737,'REDU'],[51.225408678453064,2.922290360416556,'OOST'],[18.343331305208665,-64.96921329692583,'VITH'],[51.3358601814814,3.2082267064281798,'ZEEB'],[51.335860175534386,3.208226709800993,'ZEEB'],[50.867314489131104,0.3362726287984378,'HERS'],[50.86731450800024,0.3362726841796821,'HERS'],[50.867314492452344,0.33627316025354276,'HERS'],[50.86731453556489,0.33627268292595996,'HERS'],[50.86731456279572,0.3362726642733838,'HERS'],[50.86748019437566,0.33435452136854693,'HERT'],[50.86748021462179,0.33435452554704326,'HERT'],[55.00741967225932,-1.4398651915636773,'NSTG'],[55.00741962983385,-1.4398651067130115,'NSTG'],[55.0074196423723,-1.4398651297651308,'NSTG'],[55.00741964115189,-1.4398651138967722,'NSTG'],[55.00741964566996,-1.4398651120286463,'NSTG'],[55.00741963200997,-1.4398650979753072,'NSTG'],[55.008909177310095,-1.432566648071354,'NSLG'],[55.924786427226046,-3.294787852461945,'EDIN'],[55.92478645355642,-3.2947878098612726,'EDIN'],[50.41647103420875,-4.126180838411271,'PMTH'],[50.41647102600059,-4.126180898955165,'PMTH'],[57.144008847684894,-2.080219360378264,'ABER'],[57.14400880289241,-2.0802193859230678,'ABER'],[57.14400887669015,-2.080219325532149,'ABER'],[57.14400880584368,-2.0802191505220886,'ABER'],[52.473225720364624,1.7501976295714379,'LOWE'],[53.44969663565477,-3.0182254011444103,'LIVE'],[53.44969658183874,-3.018225369178268,'LIVE'],[53.44969624545623,-3.018225353773495,'LIVE'],[53.44969631529571,-3.0182255305862933,'LIVE'],[53.44969670158126,-3.018225360329231,'LIVE'],[51.42098148986979,-0.339635574872173,'NPLD'],[51.420981411269906,-0.339635656079964,'NPLD'],[51.453744264533455,-1.2838889940827418,'HRM1'],[51.445681504221405,0.7434122935509782,'SHEE'],[51.44568151825698,0.7434122306068748,'SHEE'],[51.445681537819596,0.7434121440885777,'SHEE'],[51.44568165644103,0.7434121030129047,'SHEE'],[51.445681791744924,0.743412238971287,'SHEE'],[54.98375652312654,-7.336647458478669,'FOYL'],[50.10303007708946,-5.542787140923143,'NEWL'],[50.10303000479927,-5.542787190320532,'NEWL'],[50.10302985115353,-5.542787302029754,'NEWL'],[37.69720914732282,-123.00076867013938,'FARB'],[37.697208938409524,-123.00076869939964,'FARB'],[37.69720896977218,-123.0007686694557,'FARB'],[50.802329833895904,-1.1112024959255615,'PMTG'],[50.80232987433616,-1.1112024186370306,'PMTG'],[50.80232986518149,-1.1112024106257474,'PMTG'],[50.80232987455869,-1.1112024301755976,'PMTG'],[55.21279109246757,-1.6854951546171677,'MORP'],[55.212791107076974,-1.6854951346750133,'MORP'],[55.21279106396625,-1.685495118278634,'MORP'],[55.212791079692565,-1.685494920564607,'MORP'],[55.21279103259793,-1.6854951288537945,'MORP'],[55.21279107270782,-1.6854951324571181,'MORP'],[36.148176731422744,-5.3649880208388145,'GIBR'],[36.14817665384369,-5.3649881481615775,'GIBR'],[36.464346276474565,-6.2056447408201505,'SFER'],[36.46434631373642,-6.20564476714442,'SFER'],[36.46434632854969,-6.205644750705345,'SFER'],[36.464346299776494,-6.205644719167619,'SFER'],[36.46434623923802,-6.205644670170656,'SFER'],[36.464346301867984,-6.2056447721147,'SFER'],[36.464346288311084,-6.205644848641927,'SFER'],[36.464346381545184,-6.205644776122164,'SFER'],[36.464268421329784,-6.206263661827008,'ROAP'],[40.44359403923445,-3.951978124939214,'VILL'],[40.44359404064681,-3.9519781216311776,'VILL'],[40.443594042375956,-3.9519780932925213,'VILL'],[40.44359404195801,-3.951978106264742,'VILL'],[40.44359410983758,-3.951977981066976,'VILL'],[40.443594075433644,-3.951978110437865,'VILL'],[40.4435940634702,-3.951978113148873,'VILL'],[40.429162483959466,-4.249657339873621,'MAD2'],[40.4291627154931,-4.249657901350622,'MADR'],[40.42916280454144,-4.249657857626134,'MAD2'],[40.42916275216591,-4.249657918714614,'MADR'],[40.42916250952472,-4.249657275277765,'MAD2'],[40.42916247885861,-4.24965735883448,'MADR'],[40.42916280502626,-4.249657895762452,'MAD2'],[40.429162796236774,-4.2496578519106825,'MADR'],[40.42916249471637,-4.24965730120907,'MADR'],[40.42916256323139,-4.24965733567945,'MAD2'],[40.42916279285233,-4.249657898970959,'MADR'],[40.42916272321162,-4.249657920642933,'MAD2'],[40.429162567844415,-4.249657344897935,'MADR'],[40.42916277157313,-4.2496579416637354,'MAD2'],[40.429162732398225,-4.249657915855367,'MADR'],[40.429162720329366,-4.249657956633294,'MAD2'],[40.42916277153585,-4.249657925063425,'MADR'],[40.42916272161185,-4.2496579395638285,'MAD2'],[40.42916272134586,-4.249657938650711,'MADR'],[40.42916273198061,-4.249657936188075,'MAD2'],[40.42916273262895,-4.249657916354062,'MADR'],[40.42916273387648,-4.249657956815309,'MADR'],[40.45342914092894,-4.367852586025036,'CEBR'],[40.45342914076652,-4.367852547116854,'CEBR'],[40.820888859607344,0.4923632776148876,'EBRE'],[40.82088884027208,0.4923632856369434,'EBRE'],[40.82088883193178,0.49236326536467057,'EBRE'],[40.82088887122737,0.4923633096854685,'EBRE'],[40.52490129888292,-3.0886251112488723,'YEBE'],[41.599618997284466,1.4011416380807131,'BELL'],[41.599618999593254,1.4011416626175321,'BELL'],[38.33892126276591,-0.4812282495710914,'ALAC'],[38.338921276639205,-0.4812283172357117,'ALAC'],[38.338921285716,-0.48122826345901276,'ALAC'],[43.364384335149644,-8.398931586838573,'ACOR'],[43.364384389980444,-8.398931528445216,'ACOR'],[43.364384367744776,-8.39893156125806,'ACOR'],[42.693576479452396,0.9756673876348391,'ESCO'],[42.47812813667913,1.973052791092085,'LLIV'],[42.47812815358375,1.9730527726545855,'LLIV'],[36.85253489861348,-2.4594455856053057,'ALME'],[36.852534897715906,-2.4594456027110345,'ALME'],[43.47198079926819,-3.798062213880203,'CANT'],[43.47198083138487,-3.798062248894267,'CANT'],[43.47198082443242,-3.798062270354114,'CANT'],[43.471980876803784,-3.7980621877529206,'CANT'],[39.48082877833262,-0.33764673094367786,'VALE'],[39.480828783244014,-0.337646700649686,'VALE'],[39.480828735604454,-0.33764669939153985,'VALE'],[36.72611573879492,-4.393528875617593,'MALA'],[36.726115757029845,-4.393528837844457,'MALA'],[39.552627381241905,2.6245555003966574,'MALL'],[39.552627373721236,2.624555516455127,'MALL'],[39.552627313914904,2.6245552075558196,'MALL'],[39.5526273367002,2.624555692881081,'MALL'],[35.89605297478317,-5.311331406322373,'CEUT'],[35.89605305771469,-5.31133143040021,'CEUT'],[35.896053030077496,-5.311331417705981,'CEUT'],[35.89197312383664,-5.3063896771897605,'CEU1'],[42.18398092370129,-8.813067772985614,'VIGO'],[42.18398091740949,-8.813067773050454,'VIGO'],[37.199982352597786,-6.9202953646407295,'HUEL'],[38.91124888827696,1.4489664667261828,'IBIZ'],[38.91124888532188,1.4489665181834124,'IBIZ'],[52.17842752072657,5.809645256908335,'KOSG'],[52.178427461529594,5.809645217982988,'KOSG'],[52.914611791136,6.604506682989666,'WSRT'],[52.91461178758789,6.604506695020788,'WSRT'],[53.36273939966715,5.219390462032501,'TERS'],[53.362739411047535,5.219390445326383,'TERS'],[53.36273937512613,5.219390401464086,'TERS'],[52.461974731210745,4.556062425459061,'IJMU'],[51.44287871965405,3.5973292124087424,'VLIS'],[41.1060233955457,-8.589089081700623,'GAIA'],[41.10602338785731,-8.589089082565042,'GAIA'],[41.10602340905959,-8.589089112194053,'GAIA'],[37.09893909846389,-8.668376228472777,'LAGO'],[37.09893909966912,-8.668376223426783,'LAGO'],[38.69341590522054,-9.418519843100203,'CASC'],[38.69341587838964,-9.418519880133005,'CASC'],[38.69341588316493,-9.418519846544752,'CASC'],[32.647948646469544,-16.907615096509904,'FUNC'],[32.6479486268371,-16.90761510882793,'FUNC'],[46.87709825522015,7.46527805721998,'ZIMM'],[46.87709825411566,7.465278066135098,'ZIMM'],[46.87714140134728,7.465104640356982,'ZIMJ'],[46.87714139424955,7.465104638966729,'ZIMJ'],[46.87709448585177,7.465031971724698,'ZIM2'],[46.87709448073616,7.465031966119654,'ZIM2'],[46.87709444097783,7.465031932010678,'ZIM2'],[46.923747735386996,7.464252464612977,'WAB2'],[52.379298067156114,13.066092646567753,'POTS'],[52.379298054817475,13.066092663786927,'POTS'],[52.3792980567579,13.066092708594928,'POTS'],[52.379298077860035,13.066092686469279,'POTS'],[52.37929810157988,13.06609269383137,'POTS'],[49.14419915197729,12.87891113190534,'WTZR'],[49.14419915706448,12.878911162179918,'WTZR'],[49.144229752628625,12.878942207680376,'WTZT'],[49.14422976260033,12.878942225182666,'WTZT'],[49.14422976618997,12.878942213303032,'WTZT'],[49.144229739747956,12.878942187754657,'WTZT'],[49.14420194422917,12.878934115212589,'WTZJ'],[49.14420190186107,12.87893414662172,'WTZJ'],[49.14420192696303,12.878934160830921,'WTZJ'],[49.14422632372884,12.878904516045724,'WTZA'],[49.14421296251781,12.878905379032457,'WTZZ'],[49.14421297546518,12.878905394872987,'WTZZ'],[49.14421296958608,12.87890542800418,'WTZZ'],[49.14478799828764,12.878629305649383,'WTZS'],[49.14478798443069,12.878629297096449,'WTZS'],[49.144788041961164,12.878629367880245,'WTZS'],[49.144788019783824,12.878629295686412,'WTZS'],[48.08616987368269,11.279868414427192,'OBER'],[48.086170549689214,11.279871656651528,'OBE2'],[48.086170643877814,11.279871624228388,'OBE2'],[48.08618454543598,11.279806277435805,'OBE3'],[48.086184598188176,11.279806273444015,'OBE3'],[48.086184577363824,11.279806234011858,'OBE3'],[49.011246061410176,8.411260330805884,'KARL'],[49.01124608066865,8.411260357542298,'KARL'],[49.01124612396939,8.411260363244992,'KARL'],[52.29619008731471,10.459747702022742,'PTBB'],[54.174482042579115,7.89309304840258,'HELG'],[54.17448204153179,7.893093045158598,'HELJ'],[53.56364285020163,6.747447941268982,'BORK'],[53.56364285888001,6.747447980126954,'BORK'],[53.56364285212398,6.747447944186299,'BORK'],[53.578908339628846,6.666431214376638,'BORJ'],[53.57890834767165,6.666431219985105,'BORJ'],[53.557426656181306,6.747918446564896,'TGBF'],[54.169789006385145,12.101426118169375,'WARN'],[54.169789033268735,12.101426162231366,'WARN'],[54.16978904254194,12.101426199770593,'WARN'],[51.035306391645015,6.4316286267312615,'TITZ'],[51.0353063803972,6.431628635766761,'TITZ'],[51.03530638251987,6.431628663882857,'TITZ'],[51.03530637219522,6.431628636225234,'TITZ'],[54.51359125774745,13.643293889449517,'SASS'],[54.51359127553011,13.643293898670445,'SASS'],[54.51359128380557,13.643293874197012,'SASS'],[54.75875277958657,8.293389438472918,'HOE2'],[54.75875279930658,8.293389445288453,'HOE2'],[54.37292295409578,10.156797833931915,'HOL2'],[54.372922945344904,10.156797785286459,'HOL2'],[53.32717173004506,7.030683229693074,'TGKN'],[53.32717171033892,7.030683229834825,'TGKN'],[53.32717171219017,7.03068319002399,'TGKN'],[54.73050743170573,8.68705499013203,'TGDA'],[54.12173574821946,8.859171328016,'TGBU'],[53.336769957424075,7.1862817017295875,'TGEM'],[53.77171004968759,8.092636837904692,'TGME'],[35.14098701467359,33.39644704288261,'NICO'],[35.14098702720671,33.39644699461297,'NICO'],[35.14098708070557,33.39644698099307,'NICO'],[35.14098708435619,33.3964469688607,'NICO'],[45.548109306264905,13.724556651260741,'KOPE'],[-15.482539690894036,168.15610738359743,'VATU'],[-15.482539676972962,168.15610735054273,'VATU'],[41.12731220438285,20.79405170508627,'ORID'],[41.12731218375913,20.79405170663619,'ORID'],[41.12731218614227,20.794051683358532,'ORID'],[41.12731214788488,20.794051672692085,'ORID'],[37.51360267982758,15.082083739582886,'EIIV'],[37.513602963050154,15.082083404256133,'EIIV'],[37.51360295823558,15.08208309967835,'EIIV'],[42.06401353631431,11.999955469541362,'TOLF'],[-45.883663241767394,170.59716639183748,'DUND'],[-45.88366323965292,170.597166374256,'DUND'],[-45.88366324101951,170.59716622583386,'DUND'],[-45.883663261298935,170.59716624896032,'DUND'],[58.458770924489095,-5.052333967381152,'KINL'],[58.458770921732366,-5.0523338871233845,'KINL'],[53.317731564519555,-4.642066791691353,'HOLY'],[53.31773148703026,-4.642066833938356,'HOLY'],[50.52178342763703,-2.4574830749110843,'PBIL'],[58.20758664468021,-6.388946439482661,'SWTG'],[58.207586712171704,-6.3889463712806505,'SWTG'],[60.15405554308644,-1.140270182704345,'LWTG'],[60.15405552428636,-1.1402699924017556,'LWTG'],[60.15405549865541,-1.1402705669628599,'LWTG'],[52.944866112009194,1.1303398903540516,'WEYB'],[52.94486610044985,1.1303398208438222,'WEYB'],[51.56555917856288,-3.9817647153426425,'SWAS'],[51.554788560839455,0.827019002428561,'SHOE'],[51.55478851199731,0.827019036950635,'SHOE'],[49.91455690238432,-6.295794076612625,'SCIL'],[36.008511588186686,-5.602616469456658,'TARI'],[43.32176553903601,-1.9315149376242011,'PASA'],[43.32176554679029,-1.9315149723294445,'PASA'],[43.321765568961396,-1.9315149709980037,'PASA'],[45.4305709102835,12.354079166443483,'VEN1'],[44.67690272097426,12.249436394167375,'GARI'],[49.65920204983675,-1.829609216349232,'BMHG'],[49.65920198651166,-1.8296091498260438,'BMHG'],[48.589933458355496,-2.075976579258353,'DIPL'],[48.58993341122799,-2.075976495562229,'DIPL'],[47.524487551753126,-2.7698076885956704,'SARZ'],[47.52448754519088,-2.769807656572505,'SARZ'],[77.18703708197441,-65.69462184628259,'MARG'],[77.18703711076627,-65.69462196521415,'MARG'],[43.27676112238228,5.372710721286099,'PRIE'],[43.276761142701915,5.372710750067373,'PRIE'],[43.27676113259976,5.372710733315801,'PRIE'],[51.02294879494074,2.374116942196846,'COUD'],[51.0229487135817,2.3741170223312977,'COUD'],[48.446261039931336,-4.760394833306097,'LPPZ'],[48.44626100668351,-4.760394764390885,'LPPZ'],[47.8657544939211,-3.902413697900341,'KONE'],[47.86575445657253,-3.90241360831152,'KONE'],[43.77443350505634,7.497286763121465,'EZEV'],[41.85832860031199,9.402507734556925,'SARI'],[50.680352583605,1.5675563931665077,'EQHE'],[50.68035264189813,1.5675563923327605,'EQHE'],[48.641082581705696,-2.027465990556137,'SMTG'],[48.71843692134941,-3.9657258885805966,'ROTG'],[48.71843690747192,-3.9657258805401607,'ROTG'],[43.397649274562326,3.6991175749049368,'SETE'],[43.39764922763589,3.6991176229393856,'SETE'],[69.32605824482148,16.13481852931227,'ANDE'],[69.32605825952677,16.13481848801047,'ANDE'],[69.3260582689351,16.134818543801316,'ANDE'],[49.859386162686654,0.9943268109882355,'AMBL'],[24.910677866408058,46.400569271776185,'SOLA'],[24.910677867599727,46.4005692621914,'SOLA'],[29.138867696942405,36.09991768505489,'HALY'],[19.211425554191084,42.04464769627551,'NAMA'],[16.699181685166543,42.10363570283059,'JIZN'],[33.34141555006877,44.43840320560328,'ISBA'],[33.34141554216542,44.438403182049626,'ISBA'],[33.3414155173333,44.43840320007793,'ISBA'],[35.69728290365031,51.3340942568574,'TEHN'],[37.7241158292878,-122.11931122984396,'CHAB'],[37.724115835242,-122.1193112103953,'CHAB'],[37.72411579178366,-122.11931115577063,'CHAB'],[25.649489026798253,57.76390020256804,'JASK'],[25.64948902013882,57.763900240739986,'JASK'],[25.64948895653022,57.76390021191682,'JASK'],[30.5976064048224,34.76314062777479,'RAMO'],[30.597606325244005,34.76314043507158,'RAMO'],[30.59760638672294,34.76314060957724,'RAMO'],[32.06799683348771,34.780898246916486,'TELA'],[32.06799682748673,34.780898302215114,'TELA'],[32.067996807764,34.78089821228589,'TELA'],[32.06799683705626,34.780898258440004,'TELA'],[32.77898574096089,35.02298474076895,'BSHM'],[32.77898571567511,35.02298465296293,'BSHM'],[32.778985731487374,35.02298471922054,'BSHM'],[32.77898577454201,35.022984765417405,'BSHM'],[29.509280289050622,34.920601317490714,'ELAT'],[29.509280307454922,34.9206013206823,'ELAT'],[29.50928028444939,34.920601344566535,'ELAT'],[29.509280300789253,34.920601327319346,'ELAT'],[32.9952471824425,35.6882848868608,'KATZ'],[32.99524768570807,35.68828520372129,'KATZ'],[32.995247186131046,35.68828485298793,'KATZ'],[32.479338277836234,35.416478867335,'GILB'],[32.4793382874423,35.416478844063455,'GILB'],[33.022816819625035,35.14505947011467,'KABR'],[33.02281679233185,35.14505944378243,'KABR'],[31.593201572172152,35.392071539694804,'DRAG'],[33.1820092876612,35.77065034219222,'ELRO'],[31.377823004041424,34.866310229243666,'LHAV'],[32.48825520072009,34.89018671344464,'CSAR'],[31.771154392673502,35.202453400586215,'JSLM'],[30.038419254500845,35.036042365326985,'NRIF'],[31.03691515069557,35.3688245077318,'DSEA'],[30.991570045636056,34.928269247247314,'YRCM'],[30.991570065072672,34.92826926188811,'YRCM'],[31.707937073385043,34.60664618239794,'ALON'],[39.887371628859086,32.758470109346945,'ANKR'],[39.887371601578494,32.758470147806634,'ANKR'],[39.887371606600766,32.758470183235424,'ANKR'],[39.887371653840994,32.75847008756729,'ANKR'],[39.88737170619438,32.75847002309802,'ANKR'],[39.88737170683774,32.75847006078027,'ANKR'],[39.88737172738477,32.75847006924011,'ANKR'],[39.88737179122117,32.75847002574146,'ANKR'],[40.786728861406985,29.4506770155456,'TUBI'],[40.786728807464385,29.450676954552556,'TUBI'],[40.78672576110167,29.450683381926936,'TUBI'],[40.786725714844565,29.45068338463549,'TUBI'],[41.104448317473654,29.01934107901387,'ISTA'],[40.99470864719362,39.77556302775636,'TRAB'],[36.56638926483448,34.255853164950715,'MERS'],[27.692724121959465,85.52121961156423,'NAGA'],[27.692724131638897,85.5212196544427,'NAGA'],[27.69272413401766,85.52121965631042,'NAGA'],[39.608600836097665,115.89248708774193,'BJFS'],[39.60860083885943,115.89248714935106,'BJFS'],[30.531652220265062,114.35726383269512,'WUHN'],[30.53165223419902,114.35726380083088,'WUHN'],[30.53165220264873,114.35726388673245,'WUHN'],[30.53165226005351,114.35726386956951,'WUHN'],[30.531652259280868,114.35726385441423,'WUHN'],[30.53165222578108,114.35726383510804,'WUHN'],[30.53165223663834,114.35726387811323,'WUHN'],[30.53165223766535,114.35726387054623,'WUHN'],[30.531652299306455,114.35726402347004,'WUHN'],[31.099641993869913,121.2004459964579,'SHAO'],[31.099641962826258,121.20044599149531,'SHAO'],[31.09964192420861,121.2004459781859,'SHAO'],[31.099641884601276,121.20044599741753,'SHAO'],[31.09964191175268,121.20044604878626,'SHAO'],[25.0295380583048,102.79719714462823,'KUNM'],[25.029538122366112,102.79719723189844,'KUNM'],[25.029537922910308,102.79719705954784,'KUNM'],[25.029537964368117,102.7971970959048,'KUNM'],[25.029537905756108,102.79719702280865,'KUNM'],[43.79068611976991,125.4442009037591,'CHAN'],[43.79068612377435,125.44420092286767,'CHAN'],[43.790686063656324,125.44420114191587,'CHAN'],[43.80794961716435,87.60066811448412,'URUM'],[43.807949639671925,87.60066805306306,'URUM'],[43.80794965835979,87.60066803092683,'URUM'],[43.80794963873545,87.60066800420957,'URUM'],[43.80794950639184,87.60066807004601,'URUM'],[43.47110795444014,87.17730869887289,'GUAO'],[43.47110795520441,87.17730873205126,'GUAO'],[43.471107953965735,87.17730873567518,'GUAO'],[29.657341392529606,91.10399266181273,'LHAS'],[29.657341406805735,91.10399267398138,'LHAS'],[29.657341374349453,91.10399268642637,'LHAS'],[29.657341399982208,91.10399268456105,'LHAS'],[29.657332709192552,91.10402773511083,'LHAZ'],[29.657332702544505,91.10402777270215,'LHAZ'],[29.657332699949965,91.10402784375856,'LHAZ'],[29.65733270193715,91.1040278755749,'LHAZ'],[29.65733268362165,91.10402788478434,'LHAZ'],[29.657332677381394,91.10402787847015,'LHAZ'],[29.65733268166249,91.104027890104,'LHAZ'],[34.36867088520057,109.22149569104533,'XIAN'],[34.36867125668852,109.22149518621951,'XIAN'],[34.36867093114977,109.22149555572024,'XIAN'],[34.36867095720944,109.22149561632115,'XIAN'],[40.245324925713476,116.22412883335828,'BJNM'],[35.9553728135075,140.65767432406028,'KSMV'],[35.9553727837475,140.65767435695946,'KSMV'],[35.9553723761087,140.6576823202498,'KSMV'],[35.95537232434855,140.6576823265624,'KSMV'],[39.13516986178327,141.1328256659069,'MIZU'],[39.13516986689416,141.13282574580953,'MIZU'],[39.13516995429045,141.13282563912009,'MIZU'],[39.13516989703255,141.13282570423732,'MIZU'],[39.135169939418375,141.1328257549733,'MIZU'],[39.13516987060131,141.13282586725342,'MIZU'],[39.13516984272926,141.13282487733898,'MIZU'],[39.13516982809002,141.13282484113117,'MIZU'],[39.13515918890507,141.13285011090866,'MIZU'],[39.1351591778457,141.13285015887664,'MIZU'],[39.13515918270064,141.1328500813271,'MIZU'],[35.71034187477295,139.4881207854013,'KGNI'],[35.71034187243418,139.4881207516149,'KGNI'],[35.71034182160128,139.48812072569302,'KGNI'],[35.71034183541277,139.48812075310929,'KGNI'],[35.71034241371514,139.48812340311335,'KGNI'],[35.706765150300434,139.48853215867786,'KGN0'],[35.70676514677031,139.48853212258544,'KGN0'],[35.70676509767176,139.48853208863048,'KGN0'],[34.144145481691794,135.1915376029385,'P117'],[34.14414542585247,135.19153757673297,'P117'],[34.144145536369244,135.19153794889863,'P117'],[33.57785478817669,135.93695407398624,'SMST'],[33.57785486910305,135.9369543355015,'SMST'],[33.577854814445246,135.93695435704862,'SMST'],[36.13311035203718,138.36204363065926,'USUD'],[36.13311032115511,138.36204360197658,'USUD'],[36.133110294800076,138.362043655561,'USUD'],[36.13311012663612,138.36204370139615,'USUD'],[36.13311057391713,138.36204624090092,'USUD'],[36.10567942392867,140.0874962231602,'TSKB'],[36.10567933199846,140.08749617774433,'TSKB'],[36.105679383699744,140.08749627210983,'TSKB'],[36.10567937483385,140.0874962519444,'TSKB'],[36.10567939660397,140.08749630315145,'TSKB'],[36.105679396812334,140.08749632387395,'TSKB'],[36.10567970252613,140.08750288210226,'TSKB'],[36.105679732084695,140.08750288612165,'TSKB'],[36.105679757365294,140.08750291819013,'TSKB'],[36.10557608406898,140.08711580473462,'TSK2'],[36.10557607739936,140.08711578212063,'TSK2'],[36.10557610339952,140.08711584909452,'TSK2'],[36.105576101015366,140.08711590753393,'TSK2'],[36.10557641058334,140.08712246760336,'TSK2'],[36.105576417927864,140.0871225004787,'TSK2'],[36.105576414529665,140.0871225528648,'TSK2'],[43.52864498994194,141.84481704237712,'STK2'],[43.52864424894629,141.84481820533858,'STK2'],[43.52864426668691,141.84481825501513,'STK2'],[43.52864403633788,141.8448184232811,'STK2'],[27.06753197291832,142.1950281071243,'CCJ2'],[27.067531963126537,142.1950281188631,'CCJ2'],[27.06753191550953,142.19502802431475,'CCJ2'],[27.06753190466454,142.19502800543358,'CCJ2'],[27.095583087962172,142.18457803254555,'CCJM'],[27.095583162380283,142.18457807079872,'CCJM'],[27.095583065645787,142.1845783255565,'CCJM'],[27.095583012983443,142.1845781745062,'CCJM'],[27.09394203940029,142.19460903762865,'P213'],[27.093941942036864,142.1946093073277,'P213'],[27.093941901338727,142.19460920594375,'P213'],[31.82406049059378,130.59959367674992,'AIRA'],[31.824060562721517,130.59959368844125,'AIRA'],[31.824060625846514,130.5995938266005,'AIRA'],[31.824060584955134,130.5995938513469,'AIRA'],[30.556443958229956,131.01556781491843,'GMSD'],[30.556444103798825,131.0155677965236,'GMSD'],[30.556443812987016,131.01556800797422,'GMSD'],[39.18556249535295,139.54766047032834,'0194'],[39.185562558060376,139.54766040666482,'0194'],[39.1855623076227,139.5476602982637,'0194'],[39.18556237754288,139.5476603922592,'0194'],[39.18556232965433,139.54766046986566,'0194'],[39.185559504590614,139.5476695947283,'0194'],[39.18555945630852,139.54766966199793,'0194'],[43.2095263281276,140.85830928043876,'P101'],[43.20952598367583,140.8583100997266,'P101'],[43.20952555408938,140.8583104564218,'P101'],[42.078786832483,139.48919353160878,'P102'],[42.07878681399382,139.48919371904395,'P102'],[42.07878606102368,139.48919480786515,'P102'],[40.89749553360245,140.8592067835775,'P103'],[40.89749554528112,140.85920682915173,'P103'],[40.89749557554714,140.8592067819791,'P103'],[40.897495540123764,140.85920681936983,'P103'],[40.89749332939447,140.85920968853324,'P103'],[39.94211528409259,139.70345838701496,'P104'],[39.942115260483156,139.7034583917693,'P104'],[39.94211525995709,139.70345842488751,'P104'],[39.94211228598402,139.70346495108248,'P104'],[38.5633392860499,139.54596154276004,'P105'],[38.56333927461854,139.5459615319248,'P105'],[38.56333923337977,139.54596151147862,'P105'],[38.56333923534539,139.54596154922274,'P105'],[38.563339208025255,139.54596149404472,'P105'],[38.56333920261193,139.54596154015343,'P105'],[38.56333919804941,139.54596156289986,'P105'],[38.56333920897744,139.54596165982133,'P105'],[38.563336865605905,139.54597342401013,'P105'],[37.83078808825988,140.96240523034157,'P106'],[37.83078809094661,140.96240522633474,'P106'],[37.83078808757522,140.9624052646805,'P106'],[37.83078820721311,140.96240548320424,'P106'],[37.830788184887716,140.9624054951518,'P106'],[37.83078807042376,140.9624057226293,'P106'],[37.83078805563089,140.9624057879448,'P106'],[37.830788058461664,140.96240576986904,'P106'],[37.83078807176392,140.962405839667,'P106'],[35.129383301008424,140.2494536547277,'P107'],[35.1293832430115,140.24945364119,'P107'],[35.12938325103128,140.24945361773774,'P107'],[35.12938332576406,140.24945451532798,'P107'],[35.129383306440396,140.24945455271086,'P107'],[35.129383215301765,140.24945455508302,'P107'],[35.129383206377334,140.2494545402924,'P107'],[35.16015391297279,139.61553263576633,'P108'],[35.160153891375764,139.61553261294364,'P108'],[35.160154111290666,139.61553375066987,'P108'],[37.81475791697429,138.28125428923525,'P109'],[37.81475791561341,138.2812542856403,'P109'],[37.81475788317595,138.28125426749142,'P109'],[37.814757820854034,138.28125433606152,'P109'],[37.814757709061446,138.2812544192156,'P109'],[37.81475743686341,138.28125907784107,'P109'],[37.356544506266104,138.5085154802195,'P110'],[37.35654445717911,138.5085154686387,'P110'],[37.356544324688095,138.50851595477667,'P110'],[37.35654496069334,138.5085150601677,'P110'],[37.35654492491053,138.50851990338546,'P110'],[37.4057284723212,136.900325038303,'P111'],[37.40572840008772,136.90032505289759,'P111'],[37.405728617573175,136.90032499587312,'P111'],[37.405728625736195,136.90032752021241,'P111'],[36.25458295759562,136.14884562360888,'P112'],[36.25458285979193,136.14884564453004,'P112'],[36.254573750361736,136.1488597815789,'P112'],[36.25457391942786,136.14886106794495,'P112'],[34.89548532078618,139.13295908127284,'P113'],[34.895485266749304,139.13295904914688,'P113'],[34.89548508889303,139.1329586672238,'P113'],[34.89548493322341,139.13295861715898,'P113'],[34.89548508181192,139.13295918921244,'P113'],[34.80689834126985,138.76420126596582,'P114'],[34.806898262416546,138.7642012180964,'P114'],[34.80689826015226,138.7642012850504,'P114'],[34.806898456391735,138.76420197469145,'P114'],[34.870669956552945,138.32741362972868,'P115'],[34.87066983898154,138.32741360010297,'P115'],[34.870669877394725,138.32741347086318,'P115'],[34.870670072084835,138.32741423239588,'P115'],[34.90396573435428,136.82384261999604,'P116'],[34.90396549533161,136.8238426466729,'P116'],[34.90396567135201,136.82384333530177,'P116'],[35.593686014580584,134.31593280989097,'P118'],[35.593685972268865,134.3159328284039,'P118'],[35.59368608460097,134.3159334645289,'P118'],[34.62758795531632,131.6046471353802,'P119'],[34.627587951809296,131.60464712325341,'P119'],[34.62758794633297,131.60464710325314,'P119'],[34.627588009260876,131.6046474202797,'P119'],[33.333499723517605,133.24350214750527,'P120'],[33.333499538038225,133.24350200801368,'P120'],[33.33349960913008,133.24350185197594,'P120'],[33.333499632738686,133.24350186011708,'P120'],[33.3334996839195,133.24350209705614,'P120'],[33.47307974251331,129.84929332166462,'P121'],[33.47307973564433,129.84929330085373,'P121'],[33.473079763724826,129.8492934263315,'P121'],[33.47307982440516,129.84929363975462,'P121'],[32.42862191030943,131.66960112295408,'P122'],[32.428621903753815,131.66960109238337,'P122'],[32.42862191581037,131.66960125315373,'P122'],[32.017408807120006,130.19106534383874,'P123'],[32.01740886799902,130.1910654895299,'P123'],[26.179469802267988,127.82467289984527,'P124'],[26.17946978995326,127.82467287072265,'P124'],[26.17946984088388,127.8246728353421,'P124'],[26.179469845840107,127.82467286463138,'P124'],[26.179469848063768,127.8246728854056,'P124'],[45.407820080029325,141.68533240123935,'P201'],[45.40781972603594,141.68533274068747,'P201'],[45.40781972488218,141.68533279134542,'P201'],[45.40781962460908,141.6853328817255,'P201'],[45.4078196149476,141.68533287297808,'P201'],[44.019411789577084,144.2857920772631,'P202'],[44.019411476978945,144.28579228490563,'P202'],[44.0194114056298,144.28579236938435,'P202'],[44.019411371953076,144.2857924152111,'P202'],[44.019411373775,144.28579245676235,'P202'],[44.01941138790004,144.2857925109748,'P202'],[44.019411404334825,144.28579258562544,'P202'],[44.019411361770395,144.28579255705307,'P202'],[42.975569597329034,144.3713948571761,'P203'],[42.97556996963646,144.37139710931487,'P203'],[42.975569806085744,144.37139721221305,'P203'],[42.97556976851654,144.37139742566268,'P203'],[42.975569738102294,144.3713975100921,'P203'],[42.975569742316125,144.3713975229127,'P203'],[42.97556975321686,144.37139755840187,'P203'],[42.97556991722165,144.37139766936735,'P203'],[41.78165794221966,140.72453352847666,'P204'],[41.781657941523186,140.72453393109424,'P204'],[41.78165657285048,140.7245351845223,'P204'],[34.91879141938677,139.8249183842481,'P206'],[34.91879141380196,139.82491843103335,'P206'],[34.918791298817496,139.8249187982861,'P206'],[34.918791402050566,139.82491860767954,'P206'],[34.91879146647852,139.8249191061781,'P206'],[36.762173888953306,137.22457502334743,'P207'],[36.76217381173531,137.22457503772145,'P207'],[36.76217385651537,137.22457497484493,'P207'],[36.762174033767266,137.22457721174501,'P207'],[33.475947178258785,135.77319126220945,'P208'],[33.47594711246869,135.77319105603274,'P208'],[33.47594717713088,135.77319130280057,'P208'],[34.89731185929115,132.06621414300326,'P209'],[34.89731185207957,132.0662141172891,'P209'],[34.89731193875532,132.06621449899583,'P209'],[32.73511746070227,129.86619898425053,'P210'],[32.735117626709815,129.86619893214538,'P210'],[32.73511770464421,129.86619913041497,'P210'],[31.576968296681407,131.4093044923394,'P211'],[31.576968251995808,131.40930458358028,'P211'],[26.21332553128383,127.66520812643634,'P212'],[26.213325523447683,127.66520810131175,'P212'],[26.213325564288787,127.66520808067548,'P212'],[26.213325580380364,127.66520810165895,'P212'],[26.213325618949877,127.66520814983686,'P212'],[24.290095141975073,153.97865730071,'MCIL'],[24.290095222679128,153.97865723995494,'MCIL'],[24.290095256532744,153.9786571846644,'MCIL'],[13.735914500627548,100.53392124177034,'CUSV'],[13.73591438118073,100.53392119515246,'CUSV'],[13.735914560603364,100.5339212669292,'CUSV'],[14.635719868264298,121.07773087447222,'PIMO'],[14.635719870237152,121.07773052139439,'PIMO'],[14.635719839440481,121.07773053519291,'PIMO'],[14.635719965891356,121.07773051506854,'PIMO'],[14.635719986670336,121.07773038931698,'PIMO'],[14.635719969903024,121.07773038135625,'PIMO'],[14.635720001732855,121.0777303835241,'PIMO'],[14.635720090019673,121.07773037144658,'PIMO'],[14.635720091442717,121.0777303946433,'PIMO'],[14.535441516011302,121.040766274016,'PTAG'],[14.535441526193514,121.04076628625673,'PTAG'],[14.535441522065552,121.04076630742563,'PTAG'],[13.98688058867602,120.97773899190565,'KAYT'],[13.986880404070076,120.97773871547949,'KAYT'],[13.986880449031068,120.9777387391085,'KAYT'],[13.986880404917887,120.9777386636232,'KAYT'],[13.986880447271846,120.97773871686393,'KAYT'],[13.986880346828611,120.97773855759196,'KAYT'],[13.986880289593008,120.97773844805225,'KAYT'],[32.02854717090245,35.879541006768804,'AMMN'],[32.028547152420586,35.87954100675441,'AMMN'],[26.912438332044417,80.9558917052627,'LCKI'],[26.912438295315894,80.9558917182562,'LCKI'],[13.021167556796499,77.57037759165587,'IISC'],[13.021167516929097,77.57037780609875,'IISC'],[13.021167519403775,77.57037779601352,'IISC'],[13.02116748774734,77.57037782923044,'IISC'],[13.034320383696278,77.51161883139739,'BAN2'],[13.03432034118485,77.51161904431325,'BAN2'],[13.034320370878385,77.51161905342775,'BAN2'],[13.034320325280055,77.51161909340179,'BAN2'],[17.417259789748467,78.55087102779522,'HYDE'],[17.41725976818268,78.55087110632837,'HYDE'],[17.417259692698778,78.55087109565643,'HYDE'],[17.417259646165697,78.55087113926632,'HYDE'],[11.637779584390975,92.71213630554236,'PBRI'],[11.63777934718969,92.71213632104701,'PBRI'],[11.637805835586983,92.71224547048364,'PBR2'],[11.637805607751291,92.71224549274746,'PBR2'],[10.609508961864437,92.53240721505964,'HUTB'],[10.609508950718723,92.53240727493524,'HUTB'],[10.609508900708656,92.53240727810253,'HUTB'],[10.609508610536624,92.53240731747371,'HUTB'],[1.345801773367363,103.67995886760394,'NTUS'],[1.3458018437057708,103.67995870025793,'NTUS'],[1.345801826165093,103.67995858092505,'NTUS'],[1.345801805455653,103.67995851052966,'NTUS'],[1.3458015672025774,103.67995833721797,'NTUS'],[1.3458015472661227,103.67995832108303,'NTUS'],[1.345801563141829,103.67995845107693,'NTUS'],[3.2615060481659732,113.06722234809206,'BINT'],[3.2615060867521706,113.06722234190842,'BINT'],[3.261506053948694,113.06722233504537,'BINT'],[6.22619218122719,102.10546631581096,'GETI'],[6.22619216104604,102.10546632619484,'GETI'],[6.226192163262498,102.10546630659678,'GETI'],[5.318888726468696,103.13914720115073,'KUAL'],[5.318888637139102,103.13914715590177,'KUAL'],[5.318888736007027,103.13914743265445,'KUAL'],[6.039232449644906,116.11203118490378,'UMSS'],[6.039232449211912,116.11203115234838,'UMSS'],[6.039232451327211,116.11203108674584,'UMSS'],[6.039232344578642,116.11203117789145,'UMSS'],[6.039232344824405,116.11203124796296,'UMSS'],[3.240317439266577,113.0943370746917,'BIN1'],[3.240317456163843,113.09433714898191,'BIN1'],[4.188684579106514,73.52628833245564,'MALD'],[4.188684934799143,73.52628834172364,'MALD'],[4.188684967635312,73.5262884605908,'MALD'],[-6.491054758580486,106.84891176336924,'BAKO'],[-6.491054742088735,106.84891178023314,'BAKO'],[-6.491054706172239,106.84891173614079,'BAKO'],[-6.491054772134816,106.848911699815,'BAKO'],[-6.491054748570636,106.8489116832338,'BAKO'],[-6.491054756105781,106.84891171124204,'BAKO'],[-6.491054744938985,106.84891169626688,'BAKO'],[-6.491054799791079,106.84891168496944,'BAKO'],[-6.49105476283633,106.84891169467804,'BAKO'],[-6.491054788330025,106.8489117028012,'BAKO'],[-6.491054751731367,106.84891167165767,'BAKO'],[3.6216113455672025,98.71472089594474,'SAMP'],[3.6216106274143085,98.71471905555259,'SAMP'],[3.6216093970525605,98.7147179903828,'SAMP'],[3.6216093820018016,98.71471803112755,'SAMP'],[3.621609253251026,98.71471789909344,'SAMP'],[3.6216091783934767,98.71471782951423,'SAMP'],[-0.03159681191166057,98.52622330866282,'PBAI'],[-0.03159689965325938,98.52622334979212,'PBAI'],[-0.03159740452169762,98.52622328570726,'PBAI'],[-0.03159749671638856,98.52622330463699,'PBAI'],[6.892074654308439,79.87417589648938,'SGOC'],[7.272754225667187,80.70262339604605,'PALK'],[7.272754180670725,80.70262345148114,'PALK'],[25.021330348632937,121.53654563163066,'TAIW'],[25.02133037467825,121.53654559743063,'TAIW'],[25.021330556792492,121.53654550795903,'TAIW'],[25.021330393251812,121.53654558000676,'TAIW'],[24.797954222003934,120.98734646662166,'TNML'],[24.797954194040653,120.98734643083549,'TNML'],[24.797954204511996,120.98734643882358,'TNML'],[24.7979542254572,120.98734646426057,'TNML'],[24.797985625713277,120.98739172438354,'TCMS'],[24.797985585789213,120.9873917243502,'TCMS'],[24.79798555930217,120.9873916843202,'TCMS'],[24.7979855709574,120.98739169620875,'TCMS'],[24.79798559442841,120.9873917216529,'TCMS'],[36.37442036011548,127.36608262442941,'TAEJ'],[36.39942819171944,127.37448074321772,'DAEJ'],[36.39942817320987,127.37448076449104,'DAEJ'],[36.39942819793106,127.37448103580277,'DAEJ'],[37.275514065114265,127.0542422968515,'SUWN'],[37.27551408787795,127.05424234101578,'SUWN'],[37.27551410479616,127.05424264432023,'SUWN'],[37.27551410419358,127.05424259134179,'SUWN'],[37.07756703590307,127.02403456430726,'OSN2'],[37.077567039594506,127.02403457200703,'OSN1'],[37.077567036195546,127.02403455800719,'OSN1'],[37.077567031324456,127.02403451548254,'OSN2'],[37.07756702653887,127.02403450926701,'OSN1'],[37.462517272548475,126.9555293872474,'SG26'],[29.3249694927772,47.97149582012806,'KUWT'],[29.32496949512359,47.971495884843236,'KUWT'],[47.865067487164104,107.05232723769016,'ULAB'],[47.86506748060343,107.05232729643791,'ULAB'],[47.86506769095133,107.05232709044297,'ULAB'],[47.865067658373455,107.05232698541633,'ULAB'],[47.8650677204241,107.05232709247215,'ULAB'],[26.20914270579496,50.60814736865064,'BHR2'],[26.209142701334486,50.60814736152731,'BHR1'],[26.209142701417957,50.6081473656139,'BAHR'],[26.209142678138353,50.60814735722057,'BAHR'],[26.209142682732736,50.60814735459868,'BHR1'],[26.20914268236534,50.608147355730395,'BHR2'],[22.186460791220952,56.11233653852772,'YIBL'],[22.186460758935763,56.11233643952872,'YIBL'],[22.18646077384212,56.112336447362175,'YIBL'],[40.372171549205504,49.81441392030036,'BAKU'],[42.99850126692256,74.75110025537684,'CHUM'],[42.998501274614775,74.75110022752801,'CHUM'],[42.99850127550408,74.75110025301684,'CHUM'],[50.713950589673225,78.61906519089787,'KRTV'],[50.71395057569059,78.6190652380807,'KRTV'],[41.863529600175305,78.19039433587383,'KUMT'],[41.863522511194176,78.19038942908098,'KUMT'],[41.86352247086043,78.19038939192527,'KUMT'],[42.62071410169658,75.31547162926431,'SHAS'],[42.620714015586394,75.31547184391499,'SHAS'],[44.20813150998976,73.99710899783967,'SUMK'],[44.208131474844805,73.99710901050769,'SUMK'],[44.208131487978825,73.9971090699493,'SUMK'],[44.20813137275862,73.99710911479217,'SUMK'],[42.445465239663314,72.21044901459206,'TALA'],[42.44546523803134,72.21044903853179,'TALA'],[42.44546524563324,72.21044912008752,'TALA'],[29.861547312547316,31.34339903385337,'PHLW'],[-25.890104038926207,27.686981257405872,'HRAO'],[-25.890104064961488,27.686981263381387,'HRAO'],[-25.890104083587197,27.686981331023105,'HRAO'],[-25.890104090205995,27.686981323918985,'HRAO'],[-25.89010407413132,27.686981319511606,'HRAO'],[-25.89010396191887,27.686981422260043,'HRAO'],[-25.890104139098515,27.68698148692329,'HRAO'],[-25.890104135460785,27.68698147595561,'HRAO'],[-25.88710689552824,27.7077599472989,'HARK'],[-25.887106885678406,27.707759984814004,'HARK'],[-25.886962091690005,27.707245425092957,'HARB'],[-25.886962115146243,27.707245430475176,'HARB'],[-33.95143445119315,18.46855094536227,'CTWN'],[-33.95143446638731,18.46855095211589,'CTWN'],[-33.95143444234737,18.46855097226643,'CTWN'],[-34.18793850653028,18.43957454905384,'SIMO'],[-34.18793852469064,18.439574550444654,'SIMO'],[-25.746344555634586,28.22403899703665,'PRE2'],[-25.746344551544176,28.22403899427905,'PRE1'],[-25.74634455114469,28.22403899588633,'PRE2'],[-25.74634445808205,28.224039038650147,'PRE1'],[-25.746344456078884,28.22403903565422,'PRE2'],[-25.74634454245815,28.224039022355246,'PRE1'],[-25.746344462574147,28.224039059722077,'PRE2'],[-25.746344543308986,28.224039024647002,'PRE2'],[-46.87645526539628,37.8609937852921,'MARN'],[-46.876455216036604,37.86099338120917,'MARN'],[-46.87645575156138,37.860994131059954,'MARN'],[-46.87645601702584,37.860994117230476,'MARN'],[-32.38020968339413,20.810463500388686,'SUTV'],[-32.38020970414827,20.810463490736403,'SUTH'],[-32.38020968226925,20.810463478016995,'SUTH'],[-32.38020967673569,20.810463497229893,'SUTH'],[-32.38143316648697,20.81091190758142,'SUTM'],[-32.38143314663683,20.810911931532587,'SUTM'],[-32.38143307937508,20.810911673258794,'SUTM'],[-28.795545607442914,32.0783852677017,'RBAY'],[-28.79554560535204,32.07838527926583,'RBAY'],[-30.665207100661398,23.992639466651507,'DEAR'],[-28.293117269497106,31.420924532428703,'ULDI'],[-29.66932461639143,17.879211387787453,'SBOK'],[-25.805015767198896,25.539972003551117,'MFKG'],[-25.805015806877602,25.53997200920991,'MFKG'],[-34.424630476717795,19.223062130997,'HNUS'],[-7.951213065884259,-14.412072662492928,'ASC1'],[-15.942534114293482,-5.667345852020623,'STHL'],[-40.348832026293756,-9.880715191712344,'GOUG'],[-40.34883212776827,-9.880714961233481,'GOUG'],[-40.348832088938266,-9.880715178631185,'GOUG'],[-7.2696839533974495,72.37024086674437,'DGAR'],[-7.269683834055753,72.37024103588669,'DGAV'],[-7.269683894686487,72.3702409232434,'DGAR'],[-7.26968386748248,72.37024099751119,'DGAV'],[-7.269683912689903,72.37024093222838,'DGAR'],[-7.269683833634618,72.37024103718497,'DGAR'],[-7.269683868622663,72.37024099583283,'DGAR'],[-6.76558535554296,39.207925409281465,'TANZ'],[-6.7655853711314755,39.20792539124296,'TANZ'],[-6.765585345358024,39.20792541610602,'TANZ'],[-6.765585331358442,39.20792543722744,'TANZ'],[-22.574919343738753,17.089432849787205,'WIND'],[-22.574919287168857,17.08943282514748,'WIND'],[-22.950353041879982,14.503544732424633,'FG08'],[-22.95035305101085,14.503544724960976,'FG08'],[57.89497445213699,-5.159368780780623,'ULLA'],[57.89497448680216,-5.159368784791375,'ULLA'],[27.763742070616953,-15.633274870179324,'MAS1'],[27.763742068532355,-15.633274878979597,'MAS1'],[27.763742086884267,-15.633274884877052,'MAS1'],[27.763742082084427,-15.633274891015894,'MAS1'],[27.763742140317902,-15.633274855413505,'MAS1'],[27.76374209872849,-15.633274897954209,'MAS1'],[27.764783494675836,-15.634269181603896,'GMAS'],[27.764783482116982,-15.634269179354947,'GMAS'],[27.764783526422942,-15.634269145633569,'GMAS'],[27.76478349692998,-15.634269174736518,'GMAS'],[28.146710095947007,-15.407607288058482,'PLUZ'],[28.477184609489544,-16.24115410905406,'TN01'],[28.477184647282833,-16.24115418911665,'TN01'],[28.47718463272555,-16.241154109433392,'TN01'],[9.035135730179624,38.7663039765947,'ADIS'],[9.019858714180893,38.762823638549975,'ETAD'],[12.066118261031495,40.071396885337506,'DA60'],[12.06611821147126,40.07139681068978,'DA60'],[37.747750122841396,-25.662762854286896,'PDEL'],[37.74775018006374,-25.66276282987357,'PDEL'],[37.74775020345484,-25.662762819982103,'PDEL'],[37.747750165500534,-25.662762840887815,'PDEL'],[39.45383544211118,-31.126388552490308,'FLRS'],[38.71899391024853,-27.15299144682631,'TERC'],[6.870560503418727,-5.240092749915343,'YKRO'],[6.870560498433792,-5.24009275467893,'YKRO'],[6.870560521717111,-5.240092703068929,'YKRO'],[6.384664656782274,2.4500220261285244,'BJCO'],[9.69206205076638,1.6616389661522506,'DJOU'],[0.3539073327879688,9.67212588413761,'NKLG'],[0.3539073663782343,9.672125927780945,'NKLG'],[9.55425645478825,-0.8617226493628103,'TAMA'],[12.356391107112316,-1.5124967265463887,'OUAG'],[-2.9959103657660875,40.194396572232904,'MALI'],[-2.9959103041121384,40.19439643329971,'MALI'],[-2.9959103362788,40.194396463081524,'MALI'],[-2.996054587828442,40.194143973411386,'MAL2'],[-2.996054600051976,40.19414403301189,'MAL2'],[-2.99605455298067,40.1941439440895,'MAL2'],[-1.2208295844025556,36.893481560295214,'RCMN'],[-19.018305751509843,47.22921202343008,'ABPO'],[16.252116963148953,-0.00600920183177948,'GAO1'],[-0.601468541865301,30.737876869852503,'MBAR'],[-0.6014685401268134,30.73787688664574,'MBAR'],[-0.6014685273101721,30.737876880514296,'MBAR'],[-1.9445511030690408,30.089682711005857,'NURK'],[-1.9445511127760093,30.089682665647874,'NURK'],[14.684545517803844,-17.46510347702612,'DAKA'],[14.684545578681572,-17.465103501815193,'DAKA'],[14.684545515992752,-17.465103479067174,'DAKA'],[14.721235165265245,-17.4394659117532,'DAKR'],[-15.425540010947824,28.31101308033208,'ZAMB'],[33.99810441870654,-6.854288472524442,'RABT'],[33.5396265274939,-5.108463690859316,'IFRN'],[35.56164472215725,-5.363012057899632,'TETN'],[35.561644739705265,-5.363012040019431,'TETN'],[35.56164470124053,-5.3630120631082185,'TETN'],[-20.29707539232643,57.49703707135699,'VACS'],[-20.297075397735586,57.497037052473424,'VACS'],[0.33766866027150305,6.732569038306723,'FG07'],[0.33766875730049445,6.732563374651097,'FG07'],[-4.673718698905803,55.479405347519105,'SEY1'],[-4.673718618186065,55.47940532911922,'SEY1'],[-4.673718570799942,55.47940539919331,'SEY1'],[-4.673718521161772,55.479405477449184,'SEY1'],[-4.673718520281244,55.47940546889716,'SEY1'],[-4.6737185061665025,55.4794054346862,'SEY1'],[47.59524048391865,-52.67775055982231,'STJO'],[47.59524052126578,-52.67775061065102,'STJO'],[47.59524053539958,-52.6777505367064,'STJO'],[47.595240475728666,-52.677750555907735,'STJO'],[47.59524045818097,-52.677750587943784,'STJO'],[47.59524043670932,-52.67775056847237,'STJO'],[47.59524046908236,-52.677750540047185,'STJO'],[47.59523225349086,-52.67830601238094,'STJ2'],[45.95580049087199,-78.07136926166376,'ALGO'],[45.95580043688,-78.07136918000549,'ALGO'],[45.95580047297936,-78.07136917929529,'ALGO'],[45.95580046993115,-78.07136918770325,'ALGO'],[45.95580044917569,-78.07136914292859,'ALGO'],[49.32261847694857,-119.62498316440126,'DRAO'],[49.32261847411518,-119.6249831911532,'DRAO'],[49.3226184774646,-119.62498316002016,'DRAO'],[45.454162660964876,-75.62382909465762,'NRC1'],[45.45416267252572,-75.62382907141934,'NRC1'],[45.454162691892364,-75.6238290689113,'NRC1'],[45.454162659141666,-75.62382903388817,'NRC1'],[44.68354988661507,-63.61128061923674,'HLFX'],[44.68354988834636,-63.611280637693845,'HLFX'],[50.87135130837709,-114.29349789455324,'PRDS'],[50.87135114671687,-114.29349791056677,'PRDS'],[50.8713512363173,-114.29349794738836,'PRDS'],[50.871351272748484,-114.29349794082535,'PRDS'],[50.871351241181785,-114.29349793365157,'PRDS'],[62.48089331096301,-114.48070323228507,'YELL'],[62.480893304025585,-114.48070324776198,'YELL'],[62.48089332868873,-114.48070322527126,'YELL'],[62.48089334058307,-114.48070318113822,'YELL'],[62.48132132298038,-114.48084579934007,'YEL2'],[62.48132129840721,-114.4808457948411,'YEL2'],[62.48132123416627,-114.48084592493719,'YEL2'],[62.48132131048884,-114.48084580383077,'YEL2'],[62.48132130607801,-114.48084582093797,'YEL2'],[58.75907755156631,-94.08872944930648,'CHUR'],[58.75907756259999,-94.08872943946265,'CHUR'],[58.75907760261988,-94.0887293544025,'CHUR'],[58.75907759958323,-94.0887293869013,'CHUR'],[58.759077625668134,-94.08872941361777,'CHUR'],[58.759077632189424,-94.08872944365658,'CHUR'],[58.75907762020761,-94.08872939293528,'CHUR'],[48.38978082385518,-123.48747112223272,'ALBH'],[48.38978082745476,-123.48747095495867,'ALBH'],[48.38978083171651,-123.48747100728022,'ALBH'],[48.38978082272925,-123.48747102649509,'ALBH'],[48.389780835387946,-123.48747096767995,'ALBH'],[48.648532615223544,-123.45112895562606,'PGC5'],[48.648532632119405,-123.45112895479635,'PGC5'],[48.648532634170664,-123.45112894006613,'PGC5'],[48.64853263000453,-123.45112897587198,'PGC5'],[48.648532635662825,-123.45112904952731,'PGC5'],[50.64035292762761,-128.13499850858906,'HOLB'],[50.64035290295297,-128.1349985057608,'HOLB'],[50.64035294081907,-128.13499849730505,'HOLB'],[50.640352965488795,-128.1349984862648,'HOLB'],[50.64035296313692,-128.13499853518482,'HOLB'],[50.64035295363156,-128.13499853079117,'HOLB'],[50.64035293441322,-128.13499851833197,'HOLB'],[50.64035291256084,-128.1349984808715,'HOLB'],[50.64035288571192,-128.13499844262108,'HOLB'],[50.640352873740206,-128.13499844660998,'HOLB'],[54.83208997501732,-66.83261752759867,'SCH2'],[54.83208994486235,-66.83261758134098,'SCH2'],[54.83209001039647,-66.83261761102823,'SCH2'],[52.236867326505006,-122.16781302460458,'WILL'],[52.23686733028965,-122.16781302157878,'WILL'],[52.23686731492463,-122.16781301062449,'WILL'],[52.236867310011405,-122.16781304497117,'WILL'],[54.725583791435454,-101.97803546412779,'FLIN'],[54.72558376157614,-101.97803543868397,'FLIN'],[54.72558378277887,-101.97803543035998,'FLIN'],[54.725583826990565,-101.97803541365975,'FLIN'],[60.75051118771878,-135.22211314151969,'WHIT'],[60.750511231926694,-135.22211322634345,'WHIT'],[60.75051122891415,-135.22211321561045,'WHIT'],[60.750511221401084,-135.22211324691497,'WHIT'],[60.7505112209855,-135.22211314167043,'WHIT'],[60.75051122987398,-135.2221130690721,'WHIT'],[60.75051120566164,-135.222113077971,'WHIT'],[50.25880877683238,-95.86618182846804,'DUBO'],[50.25880876859878,-95.86618174006156,'DUBO'],[50.25880876849178,-95.86618182210495,'DUBO'],[50.25880882444033,-95.866181801115,'DUBO'],[50.25880880095976,-95.86618181629638,'DUBO'],[49.29481009455294,-124.08647968409508,'NANO'],[49.29481009788223,-124.08647968487472,'NANO'],[49.29481013680016,-124.08647971232185,'NANO'],[49.29481013648585,-124.08647976489317,'NANO'],[49.29481011902723,-124.08647973916766,'NANO'],[48.29785477765766,-124.62490710911541,'NEAH'],[48.29785477113458,-124.62490709802437,'NEAH'],[48.29785475383391,-124.62490707827294,'NEAH'],[48.92563736172751,-125.54164095897603,'UCLU'],[48.925637357911434,-125.54164097817284,'UCLU'],[48.92563739023546,-125.54164098865371,'UCLU'],[48.92563737560097,-125.54164101450222,'UCLU'],[48.925637406176136,-125.54164099975341,'UCLU'],[50.1265388902535,-122.92119057859124,'WSLR'],[50.12653884926002,-122.9211905784513,'WSLR'],[50.12653883379791,-122.92119054206587,'WSLR'],[49.15660772989855,-122.00842759787598,'CHWK'],[49.156607725014574,-122.0084275862545,'CHWK'],[49.15660771362637,-122.00842765441196,'CHWK'],[49.1566077316011,-122.00842768304392,'CHWK'],[50.5442808584924,-126.8426428637046,'BCOV'],[50.54428087406453,-126.84264282086579,'BCOV'],[50.54428085613196,-126.84264280195896,'BCOV'],[45.93350729926355,-66.65988111783454,'FRDN'],[45.950209580880646,-66.64170575727822,'UNB1'],[45.95020956784994,-66.64170580148411,'UNB1'],[45.93350732456172,-66.65988116319416,'FRDN'],[45.9335072767208,-66.65988109028137,'FRDN'],[45.933507293695556,-66.6598811666154,'FRDN'],[45.95020956866718,-66.64170581604441,'UNBJ'],[45.95020957271805,-66.64170578948061,'UNBJ'],[45.9501380593258,-66.64233815564022,'SA26'],[45.58502088229738,-75.80732897052135,'CAGS'],[45.585020920915795,-75.80732896797922,'CAGS'],[70.73630360333797,-117.76123762932825,'HOLM'],[70.73630361300565,-117.76123771935471,'HOLM'],[74.69082019341751,-94.89369506225101,'RESO'],[74.69082019749887,-94.89369509198274,'RESO'],[68.30618472676149,-133.52696194900102,'INVK'],[68.30618471672926,-133.52696198359578,'INVK'],[49.18682666004241,-68.26332892784629,'BAIE'],[64.31781983041267,-96.00234672146017,'BAKE'],[64.31781985282579,-96.00234681408796,'BAKE'],[79.98853590133876,-85.93993062001206,'EURK'],[79.98853596984428,-85.93993098126256,'EURK'],[79.98894606168884,-85.93759497894153,'EUR2'],[79.98894601548965,-85.93759427318379,'EUR2'],[55.27836139961774,-77.74543656110731,'KUUJ'],[55.27836134578399,-77.74543655789303,'KUUJ'],[55.278361398784696,-77.74543656978459,'KUUJ'],[51.47980871789953,-90.16197542567191,'PICL'],[51.479808705460385,-90.16197535681415,'PICL'],[48.09705737185444,-77.56416752282207,'VALD'],[48.09705737378857,-77.56416753218764,'VALD'],[48.09705735669678,-77.56416749080826,'VALD'],[82.49429414114907,-62.34047089884048,'ALRT'],[71.99032489800047,-125.24986086122144,'SACH'],[56.5369760982069,-61.688718069471754,'NAIN'],[69.43823435112233,-132.9943509817424,'TUKT'],[69.4382343490134,-132.99435109236862,'TUKT'],[69.43823432789213,-132.99435072425038,'TUKT'],[67.55933955499167,-64.03366775738142,'QIKI'],[52.196254667439604,-106.39835550837248,'SASK'],[52.19625468125076,-106.39835559675244,'SASK'],[47.07340444835173,-64.79871136132786,'ESCU'],[47.073404490947176,-64.7987114011313,'ESCU'],[46.22069125325051,-64.55201106318574,'SHE2'],[46.22069123440134,-64.55201105938411,'SHE2'],[46.220691274222766,-64.55201100612126,'SHE2'],[48.835328905769074,-125.13510510326306,'BAMF'],[48.835328845271405,-125.13510512319137,'BAMF'],[49.15414277445726,-125.90783936839745,'TFNO'],[49.15414276194634,-125.90783939202305,'TFNO'],[49.15414275643001,-125.90783940783558,'TFNO'],[49.15414275580267,-125.90783938153214,'TFNO'],[63.75596407741059,-68.51049766259744,'IQAL'],[34.2048204130056,-118.1732280124682,'JPLM'],[34.204820343590946,-118.1732279212673,'JPLM'],[34.20482036188735,-118.17322786022788,'JPLM'],[34.204820622347235,-118.17322801690989,'JPLM'],[34.20482052908256,-118.17322794650724,'JPLM'],[34.20482052226921,-118.1732279756474,'JPLM'],[34.20158214576152,-118.17429903481221,'JPLV'],[34.20158215093522,-118.17429905858563,'JPLV'],[34.13670878043411,-118.12728612516034,'CIT1'],[34.13670894857518,-118.12728605921149,'CIT1'],[34.136708952535955,-118.12728608754641,'CIT1'],[34.184894476970996,-118.27705084769372,'BRAN'],[34.184894495247164,-118.27705080906645,'BRAN'],[34.18489448741091,-118.2770508426729,'BRAN'],[34.184894487103946,-118.27705085181098,'BRAN'],[33.7432905218639,-118.40424876144623,'PVEP'],[33.74329066129266,-118.40424876709997,'PVEP'],[33.74329067116705,-118.40424885514854,'PVEP'],[33.74329061853612,-118.40424871558284,'PVEP'],[33.74329063246476,-118.40424872856272,'PVEP'],[33.74329672982547,-118.40425626271912,'PVE3'],[33.743296738951074,-118.40425627426518,'PVE3'],[33.743296738488056,-118.40425630367244,'PVE3'],[33.743296695109706,-118.40425627445984,'PVE3'],[34.45818636763356,-117.84516235685557,'HOLC'],[34.4581863500178,-117.84516230837535,'HOLC'],[35.425155727538446,-116.88925077498092,'GOLD'],[35.425155735246264,-116.88925083937585,'GOL2'],[35.425155732876334,-116.88925082662443,'GOLD'],[35.42515570760617,-116.88925095210885,'GOLD'],[35.425155712698675,-116.88925095710218,'GOL2'],[35.425155703642865,-116.88925094910726,'GOL2'],[33.612156097725574,-116.45816119108133,'PIN1'],[33.61215611002579,-116.45816118259316,'PIN1'],[33.61215611371507,-116.45816118060573,'PIN1'],[33.61215629722749,-116.4581611096945,'PIN1'],[33.612156322053565,-116.45816112461507,'PIN1'],[33.61215630797781,-116.45816113085965,'PIN1'],[33.61215625590457,-116.45816114098469,'PIN1'],[33.61214801726688,-116.45761903751271,'PIN2'],[33.61214804049667,-116.45761903567498,'PIN2'],[64.97799877460594,-147.49924070519174,'FAIR'],[64.97799876893157,-147.49924071681718,'FAIR'],[64.97799827568329,-147.49924030499227,'FAIR'],[64.9779982671436,-147.4992403912196,'FAIR'],[64.97814465233091,-147.4985174134639,'FAIV'],[64.97814471060562,-147.49851712543852,'FAIV'],[57.61769190831713,-152.19343038423239,'KOD1'],[57.61769178929749,-152.19343028165966,'KOD1'],[57.6176918580242,-152.1934303341528,'KOD1'],[57.61769210446967,-152.1934303720468,'KOD5'],[57.73510606616349,-152.50137814972433,'KODK'],[57.617691907988174,-152.1934302718552,'KOD5'],[57.73510620331842,-152.50137824033231,'KODK'],[57.735105978847244,-152.5013781911297,'KODK'],[57.73510597335735,-152.5013782054711,'KODK'],[57.7351059721492,-152.50137822011706,'KODK'],[57.735105921407374,-152.50137839884295,'KODK'],[57.73510590212555,-152.50137821295633,'KODK'],[34.55631183669476,-120.61645180166454,'VNDP'],[34.55631184382921,-120.61645178450073,'VNDP'],[34.55631182329229,-120.616451810371,'VNDP'],[34.556311828267255,-120.61645175927812,'VNDP'],[34.55631186267178,-120.61645175784213,'VNDP'],[34.556311898829335,-120.616451794523,'VNDP'],[34.46940133768285,-120.6820677017153,'HARV'],[34.469401595399376,-120.68206766073996,'HARV'],[34.46940168477429,-120.68206785043975,'HARV'],[34.46940174727895,-120.68206776362143,'HARV'],[34.4694016903317,-120.68206783151221,'HARV'],[34.46940176949254,-120.68206778470821,'HARV'],[64.5644957978439,-165.37345865199077,'AB11'],[37.93687877052572,-75.46988256431322,'WLPS'],[55.349275870399815,-160.47675777902765,'AB07'],[55.349275903555764,-160.47675779307394,'AB07'],[55.34927582823455,-160.47675772727044,'AB07'],[22.126264345618477,-159.66493093086953,'KOKV'],[22.126264350527563,-159.6649308730556,'KOKB'],[22.12626433097825,-159.66493090453187,'KOKB'],[22.12626399537838,-159.66493108694155,'KOKB'],[22.12626434162999,-159.6649309340659,'KOKB'],[28.460227865088374,-80.54523208008797,'CCV3'],[28.45995780034417,-80.54547757948778,'CCV6'],[39.9745539444356,-120.94442913905715,'QUIN'],[39.974553980888,-120.94442918518452,'QUIN'],[39.97455398713282,-120.94442916627033,'QUIN'],[37.64463502656406,-118.89666436447735,'CASA'],[37.64463501748474,-118.8966643844131,'CASA'],[37.6446268348378,-118.89665742145608,'CASA'],[37.64463564373307,-118.89666476720097,'CASA'],[37.644635559383694,-118.89666470678115,'CASA'],[37.64463543043209,-118.89666467577496,'CASA'],[37.644635373086544,-118.89666467001803,'CASA'],[42.613335874793364,-71.49332783512921,'WES2'],[42.61333585676585,-71.49332776618243,'WES2'],[42.613335906224854,-71.49332782353824,'WES2'],[42.61333582015304,-71.49332777588259,'WES2'],[42.61333586761683,-71.49332779964045,'WES2'],[42.61333586857947,-71.49332789405653,'WES2'],[42.61333586930192,-71.49332779771585,'WES2'],[42.61333587644262,-71.49332788780906,'WES2'],[42.61333594652345,-71.49332790940022,'WES2'],[42.61333586958331,-71.49332778498362,'WES2'],[42.61333590648074,-71.49332790085577,'WES2'],[42.613335859577724,-71.49332790596682,'WES2'],[42.61333590641658,-71.49332785894498,'WES2'],[30.68051088114476,-104.01499367096352,'MDO1'],[30.68051091350725,-104.01499370407127,'MDO1'],[20.706656033626064,-156.25702702329806,'MAUI'],[38.91896292898461,-77.06622592323946,'USNO'],[38.92045069457444,-77.06622634781303,'WDC1'],[38.92045079197057,-77.06622623965765,'WDC1'],[38.920565149671134,-77.06627455642213,'USN3'],[38.92056619437826,-77.06629757541226,'WDC3'],[38.92056619303546,-77.06629757913332,'WDC4'],[39.021727767975115,-76.82683101491016,'GODE'],[39.02172776703664,-76.82683101483843,'GODZ'],[39.02172776169953,-76.82683100122595,'GODE'],[39.02172775842147,-76.82683099804434,'GODZ'],[39.0217277794004,-76.82683100438504,'GODE'],[39.021727770559814,-76.82683100359557,'GODZ'],[39.02172777561357,-76.82683100837922,'GODE'],[39.021727768047036,-76.82683100842722,'GODZ'],[39.02117842805468,-76.82709328089935,'GODN'],[39.02051742223381,-76.82732226608721,'GODS'],[38.82074714498274,-77.02440352638413,'NRL1'],[34.301505510432534,-108.1189277225563,'PIE1'],[34.30150561088302,-108.11892781370683,'PIE1'],[34.30150561618303,-108.1189278053337,'PIE1'],[47.65397675992907,-122.30947646103685,'SEAT'],[47.65397675404015,-122.30947644078202,'SEAT'],[47.653976731286654,-122.30947647719303,'SEAT'],[47.65397670346832,-122.30947653185768,'SEAT'],[34.05934296711355,-118.64616202839262,'SPK1'],[34.05934295644253,-118.64616202887805,'SPK1'],[32.864703964075,-117.25041063149045,'SIO3'],[32.86470393809747,-117.25041057842525,'SIO3'],[32.864703959714994,-117.25041066942013,'SIO3'],[32.86470394575994,-117.25041060144191,'SIO3'],[32.864703921960704,-117.25041060056756,'SIO3'],[32.864703738143824,-117.25041010751387,'SIO3'],[32.8647037022776,-117.25041006912696,'SIO3'],[32.8647037741915,-117.2504100453524,'SIO3'],[32.86470377970393,-117.25041005131881,'SIO3'],[32.86470375807763,-117.25041012272153,'SIO3'],[32.86470374711236,-117.2504102353423,'SIO3'],[32.84073473978402,-117.24968971879069,'SIO5'],[32.84073476150459,-117.24968971179344,'SIO5'],[32.84073474695949,-117.24968979249901,'SIO5'],[32.84073479941136,-117.24968988117604,'SIO5'],[33.979885017069876,-118.0311699931767,'WHC1'],[33.97988516893024,-118.03116994557088,'WHC1'],[33.97988514031521,-118.031169964454,'WHC1'],[33.9798851065302,-118.03116999410537,'WHC1'],[35.88835196619156,-120.43084077384158,'CARR'],[41.7715909030297,-91.57489623348637,'NLIB'],[35.98234332418677,-117.80889036667435,'COSO'],[35.982343285968334,-117.80889041935495,'COSO'],[35.98234331729517,-117.80889044520528,'COSO'],[35.98234326186514,-117.80889026839644,'COSO'],[38.80312409955031,-104.52459461974702,'AMC2'],[38.80312406467907,-104.52459465865871,'AMC2'],[38.8031240929982,-104.52459466971857,'AMC2'],[38.80312416108091,-104.5245946430102,'AMC2'],[48.13152353959864,-119.68263458846677,'BREW'],[33.856686218788546,-117.43681647592034,'MATH'],[33.85668623470684,-117.4368164800137,'MATH'],[19.801355406512688,-155.45634309304148,'MKEA'],[19.80135543057325,-155.45634319670378,'MKEA'],[33.61041480760075,-114.71485160029664,'BLYT'],[33.61041480605866,-114.71485154565724,'BLYT'],[33.61041480369285,-114.71485154196861,'BLYT'],[33.61041475504832,-114.71485147248865,'BLYT'],[33.610414657880725,-114.71485144017474,'BLYT'],[33.617935320406836,-117.803435858293,'TRAK'],[33.617935243794975,-117.80343581905436,'TRAK'],[33.617935309465054,-117.80343577869267,'TRAK'],[33.617935349802096,-117.80343577493196,'TRAK'],[33.61793530869647,-117.80343580500198,'TRAK'],[34.03905188747802,-117.09968322886587,'CRFP'],[34.039051893373795,-117.09968329565585,'CRFP'],[34.03905188752666,-117.09968326007318,'CRFP'],[34.03905205931057,-117.09968321479093,'CRFP'],[34.03905205945082,-117.0996831974966,'CRFP'],[34.15744402877203,-118.83031831028791,'AOA1'],[34.1574440405149,-118.83031833361044,'AOA1'],[34.02395142992344,-118.28511568854361,'USC1'],[34.02395120731125,-118.28511564087404,'USC1'],[34.023951212446086,-118.28511566897326,'USC1'],[34.069121415325164,-118.44191052962825,'UCLP'],[34.06912126756878,-118.44191072053209,'UCLP'],[34.069121262721474,-118.44191070676105,'UCLP'],[34.06912130772214,-118.441910716009,'UCLP'],[34.06912132656284,-118.44191069533221,'UCLP'],[33.95815219325439,-118.42760764594391,'WRHS'],[33.95815219177641,-118.42760769207698,'WRHS'],[33.95815220006883,-118.42760767079538,'WRHS'],[33.445772520587795,-118.48300880362221,'CAT1'],[33.44577253583809,-118.48300878469537,'CAT1'],[40.181592463060504,-104.72593824190864,'PLTC'],[32.89194022267888,-116.42235019916838,'MONP'],[32.89194020901608,-116.42235018365139,'MONP'],[32.89194025078573,-116.42235016217322,'MONP'],[32.89194025771619,-116.42235017402355,'MONP'],[32.891940236843794,-116.42235035176843,'MONP'],[32.89194030741859,-116.42235037941543,'MONP'],[32.8919402365848,-116.4223503819057,'MONP'],[32.89194029880873,-116.42235042055927,'MONP'],[25.614098048926436,-80.38406695308271,'RCMV'],[25.613779809033257,-80.38393218377698,'RCM5'],[25.61377981068543,-80.38393218874137,'RCM5'],[21.85615360128335,-102.28420372278809,'INEG'],[21.856153604245595,-102.28420370617353,'INEG'],[21.856153501795784,-102.2842034554875,'INEG'],[21.85615346711626,-102.28420344456003,'INEG'],[31.87126543742454,-116.66738506365344,'CICE'],[31.870678905891978,-116.66576318022692,'CIC1'],[31.870678946327075,-116.66576315088865,'CIC1'],[19.312697074563108,-99.18130287149873,'UNIP'],[19.31269726194643,-99.181302858581,'UNIP'],[19.31269721876994,-99.1813028925467,'UNIP'],[19.31269719046367,-99.18130289236655,'UNIP'],[31.045045388038098,-115.46586231201346,'SPMX'],[28.88405947388846,-118.28968452015854,'GUAX'],[19.844427099372613,-90.54016581854951,'CAM2'],[19.853457380713266,-90.52747276167962,'ICAM'],[19.8534573969199,-90.5274727799678,'ICAM'],[22.278320877435593,-97.86402742068807,'TAMP'],[17.078339839025567,-96.71673953105208,'OAX2'],[17.078339899392066,-96.71673947597039,'OAX2'],[17.07833986299963,-96.71673949593136,'OAX2'],[17.078339794938536,-96.71673955656726,'OAX2'],[25.715506499327194,-100.31290629977761,'MTY2'],[20.980045326013933,-89.62031754352815,'MERI'],[20.980045330416935,-89.62031755337419,'MERI'],[24.138798610121206,-110.31934886042943,'LPAZ'],[24.138798593325916,-110.31934886969033,'LPAZ'],[24.145272032788462,-110.33074427760243,'IPAZ'],[29.092546727695485,-110.96721556968426,'HER2'],[29.092546727561075,-110.96721551464476,'HER2'],[18.49527671898983,-88.29922484527577,'CHET'],[18.495276703784718,-88.2992248724524,'CHET'],[19.741238302442103,-99.18861128495742,'SG21'],[19.74123834212648,-99.18861132142546,'SG21'],[29.821653749514212,-109.68104985675701,'USMX'],[29.82165374934085,-109.68104980039043,'USMX'],[21.174653085591494,-86.82090007106099,'CNC0'],[21.174653072265333,-86.82090005354097,'CNC0'],[20.868502534393407,-86.86817443015273,'UNPM'],[20.679003466083174,-105.24920293231384,'MPR1'],[16.519968234123237,-96.05488419440904,'OXEC'],[16.51996818670739,-96.05488425504859,'OXEC'],[16.519968176890693,-96.05488427122096,'OXEC'],[19.1241049463828,-104.40152674535257,'UCOM'],[19.124104985328316,-104.40152668871086,'UCOM'],[23.160446455507167,-109.71764694403555,'MSD1'],[16.168429345574378,-95.19677689414614,'SLCR'],[5.544342156000297,-87.05583161114896,'ISCO'],[5.544342180719436,-87.05583161225626,'ISCO'],[9.945374569468584,-85.0311937452945,'LEPA'],[9.945374525357558,-85.03119379616773,'LEPA'],[9.945374475069212,-85.03119388958243,'LEPA'],[20.012063522818824,-75.76231663725062,'SCUB'],[20.012063518699275,-75.76231662468685,'SCUB'],[20.01206352573955,-75.76231660103181,'SCUB'],[20.012063547364967,-75.76231664734723,'SCUB'],[14.590404242485533,-90.5201826709061,'GUAT'],[14.590404244859585,-90.5201826817183,'GUAT'],[14.590404229696714,-90.52018268287235,'GUAT'],[14.590404281297893,-90.52018264124797,'GUAT'],[14.590404288544628,-90.52018256980065,'GUAT'],[16.916055991936872,-89.86761399402963,'ELEN'],[16.916056009413868,-89.86761402756314,'ELEN'],[16.916056026619096,-89.86761409590062,'ELEN'],[18.52867782022945,-72.30860525071193,'VOIL'],[12.148938954842887,-86.24899361196415,'MANA'],[12.14893897413384,-86.24899360860182,'MANA'],[12.1489389652991,-86.24899365355375,'MANA'],[12.14893889670089,-86.24899366160855,'MANA'],[12.148938924579708,-86.24899365792551,'MANA'],[13.099536494081214,-86.36212691097558,'ESTI'],[13.099536537545728,-86.36212688727998,'ESTI'],[13.099536557844882,-86.3621268535845,'ESTI'],[13.697085694000172,-89.11659548938775,'SSIA'],[13.697085580608196,-89.11659541856362,'SSIA'],[13.697085218446245,-89.11659523643634,'SSIA'],[13.697085228642697,-89.11659520259379,'SSIA'],[13.697085206589552,-89.11659510962866,'SSIA'],[13.697085117101038,-89.11659509974709,'SSIA'],[-34.57224328582257,-58.43931936352547,'IGM1'],[-34.57224331634397,-58.43931958235327,'IGM1'],[-34.57370076714551,-58.51929913427084,'BUE1'],[-34.57370067900509,-58.519299296944936,'BUE2'],[-34.573700616761904,-58.51929918947844,'BUE1'],[-34.57370070445311,-58.5192993019317,'BUE2'],[-34.573700723150225,-58.5192995384992,'BUE2'],[-34.57370069338888,-58.51929929134801,'BUE1'],[-34.57370070554022,-58.51929930214053,'BUE1'],[-34.5737007235476,-58.5192995382904,'BUE1'],[-53.78547149540503,-67.7511177113684,'RIOG'],[-53.78547146874246,-67.75111769222039,'RIOG'],[-53.785471470632835,-67.75111771641075,'RIOG'],[-53.785471478965995,-67.75111777213205,'RIOG'],[-53.78547147323602,-67.7511177664516,'RIO2'],[-53.785471491022584,-67.75111784030015,'RIO2'],[-34.90674471780705,-57.93229956088014,'LPGS'],[-34.9067447131209,-57.932299596103945,'LPGS'],[-34.90674472056906,-57.93229980711222,'LPGS'],[-34.906744714522574,-57.93229979092428,'LPGS'],[-34.90674469690385,-57.9322998075472,'LPGS'],[-38.70076778458681,-62.26922719284628,'VBCA'],[-38.70076772315017,-62.26922766043306,'VBCA'],[-43.29888027329849,-65.1072484341189,'RWSN'],[-43.29888017062378,-65.10724858442086,'RWSN'],[-24.727455952422574,-65.40764300809586,'UNSA'],[-24.727455933333932,-65.40764315988808,'UNSA'],[-24.72745591219561,-65.4076431796243,'UNSA'],[-24.727455923038264,-65.40764315760188,'UNSA'],[-24.727455885559795,-65.40764329056896,'UNSA'],[-24.727455921177423,-65.4076433773513,'UNSA'],[-54.83952453778275,-68.30356631628828,'AUTF'],[-31.602166689695164,-68.23264777274763,'CFAG'],[-31.602166885663266,-68.23264814334186,'CFAG'],[-38.002659150945966,-65.59524724039359,'LHCL'],[-38.002659018483584,-65.59524797127808,'LHCL'],[-38.00265905546434,-65.59524794083718,'LHCL'],[-26.843254740556635,-65.2303515366134,'TUCU'],[-26.843254728019858,-65.23035152075248,'TUCU'],[-26.843254783875917,-65.23035155645985,'TUCU'],[-38.03560306560271,-57.53114200852648,'MPLA'],[-28.470984609668413,-65.77412080213433,'CATA'],[-28.470984647782025,-65.77412087159435,'CATA'],[-38.00576691913137,-57.57129757355149,'MPL2'],[-35.77735110020007,-69.39792633691818,'MGUE'],[-3.8774444713890195,-38.42561290742655,'FORT'],[-3.8774446082534513,-38.42561285506403,'FORT'],[-3.8774445885312026,-38.42561284195982,'FORT'],[-3.877446236277339,-38.42553747937298,'BRFT'],[-3.877446159607701,-38.42553749379089,'BRFT'],[-3.877446236082202,-38.42553748073654,'BRFT'],[-3.877446152643592,-38.425537493893884,'BRFT'],[-3.8774462634273945,-38.425537482829036,'BRFT'],[-3.877446189794771,-38.42553749900073,'BRFT'],[-15.5552619171031,-56.069866846895295,'CUIB'],[-15.555261893016743,-56.06986687775043,'CUIB'],[-15.555261773115108,-56.069866967249354,'CUIB'],[-15.55526184460195,-56.06986687599332,'CUIB'],[-15.947474224871256,-47.877869325830716,'BRAZ'],[-15.947474225057341,-47.877869337089905,'BRAZ'],[-15.947474217903576,-47.8778693079835,'BRAZ'],[-15.947474210034883,-47.877869328630986,'BRAZ'],[-15.947474183673874,-47.8778694223424,'BRAZ'],[-15.94747420784784,-47.87786933070185,'BRAZ'],[-15.947474165079424,-47.877869422276085,'BRAZ'],[-15.947474174144737,-47.87786929441883,'BRAZ'],[-22.687145151550112,-44.985158565506836,'CHPI'],[-22.687145169936827,-44.98515858270724,'CHPI'],[-22.687145156565702,-44.98515858271331,'CHPI'],[-25.448367477761742,-49.23095513471525,'PARA'],[-25.448367484643136,-49.23095507743497,'UFPR'],[-25.448367503194653,-49.23095511009255,'UFPR'],[-22.119903593516305,-51.40853423061388,'UEPP'],[-22.119903574772042,-51.408534241759405,'PPTE'],[-22.119903585426478,-51.408534238823144,'PPTE'],[-22.119903606115617,-51.40853426502999,'PPTE'],[-13.25555733190843,-43.42173562713859,'BOMJ'],[-13.255557307370768,-43.42173564234922,'BOMJ'],[-13.255557270786452,-43.421735630227225,'BOMJ'],[-13.255557216452686,-43.42173564098353,'BOMJ'],[-13.255557189258393,-43.42173560661318,'BOMJ'],[-3.0229185967431835,-60.05501683825734,'NAUS'],[-3.022918786365343,-60.055016862656636,'NAUS'],[-3.02291864848772,-60.05501688731038,'NAUS'],[-5.49176506894573,-47.49723492840353,'IMPZ'],[-5.4917650712973005,-47.49723491820553,'IMPZ'],[-5.491765080554268,-47.49723491311343,'IMPZ'],[-5.491765107495545,-47.4972349515877,'IMPZ'],[-30.074041341792622,-51.1197650019128,'POAL'],[-30.07404146100771,-51.11976507656043,'POAL'],[-30.074041327834177,-51.11976499597382,'POAL'],[-30.074041356435025,-51.119765061995544,'POAL'],[-30.074041389941936,-51.11976505345245,'POAL'],[-8.050962641478709,-34.95151676503498,'RECF'],[-8.050962647824965,-34.9515167278001,'RECF'],[-8.050962669467348,-34.951516717678146,'RECF'],[-8.050962695378479,-34.95151681719607,'RECF'],[-8.050962671165438,-34.951516806809565,'RECF'],[-13.008668794854916,-38.51235947130407,'SALV'],[-25.020238189709634,-47.924968761064136,'NEIA'],[-25.02023815585441,-47.924968721342225,'NEIA'],[-25.02023815651924,-47.92496884288785,'NEIA'],[-25.020238147971032,-47.92496886213081,'NEIA'],[-1.40879424294846,-48.46254997767068,'BELE'],[-1.4087942297704807,-48.462549978307,'BELE'],[-8.709335526985612,-63.896320005041105,'POVE'],[0.046686838986030564,-51.097337102547904,'MAPA'],[0.04668680914141449,-51.09733714912786,'MAPA'],[0.046686921308309016,-51.09733710256093,'MAPA'],[0.046686838983103156,-51.09733708811267,'MAPA'],[-22.52330260682452,-52.95208867423989,'ROSA'],[-22.52330257973478,-52.952088678991174,'ROSA'],[-22.52330257405525,-52.95208871401506,'ROSA'],[-20.427783606683445,-51.343384980897476,'ILHA'],[-20.42778361612265,-51.343385010080944,'ILHA'],[-20.427783564610078,-51.34338503626434,'ILHA'],[2.845183476309338,-60.70111523493066,'BOAV'],[-20.310793327117835,-40.31945522160114,'CEFE'],[-20.31079334341091,-40.31945522932366,'CEFE'],[-28.234838344717925,-48.65572168385666,'IMBT'],[-28.234838367050173,-48.655721724427245,'IMBT'],[-28.234838337821646,-48.65572173471081,'IMBT'],[-0.14385336482403255,-67.05778132317793,'SAGA'],[-2.593458305262766,-44.212479234145064,'SALU'],[-2.5934582992203716,-44.212479207081394,'SALU'],[-2.593458312234408,-44.21247927337832,'SALU'],[-12.939245694998847,-38.43225405581565,'SAVO'],[-12.975157111813388,-38.5164850152586,'SSA1'],[-12.975157156568589,-38.51648498386655,'SSA1'],[-9.96545792621772,-67.80281190451616,'RIOB'],[-9.965457954653916,-67.80281204294371,'RIOB'],[-10.171052369049495,-48.33067942374399,'TOPL'],[-10.171052340441296,-48.3306793488922,'TOPL'],[-10.171052286753353,-48.330679495918226,'TOPL'],[-27.148209596138898,-109.38328626672343,'EISL'],[-27.148209601484943,-109.38328615614182,'EISL'],[-27.148209579969297,-109.38328617428999,'EISL'],[-27.124983030675065,-109.3444082444163,'ISPA'],[-27.12498303823215,-109.34440827210577,'ISPA'],[-33.15028745875972,-70.66855287090034,'SANT'],[-33.150287471094984,-70.66855296386925,'SANT'],[-33.15028878652254,-70.66855572123308,'SANT'],[-20.273540613510402,-70.13171268063984,'IQQE'],[-20.273540685771408,-70.13171332976337,'IQQE'],[-20.273540687242324,-70.13171340569748,'IQQE'],[-20.273540729697448,-70.13171812811665,'IQQE'],[-33.027929223567455,-71.63502446100233,'VALN'],[-33.027242509436164,-71.626090737047,'VALP'],[-33.02724252073948,-71.62609071410373,'VALP'],[-33.02792925970543,-71.63502449471468,'VALN'],[-33.02792928966429,-71.6350245652776,'VALN'],[-33.0272426272444,-71.62609149845055,'VALP'],[-33.02792955066909,-71.63502565215217,'VALN'],[-33.02724269919822,-71.62609152046457,'VALP'],[-33.027929550898456,-71.6350256726453,'VALN'],[-33.027242758904904,-71.62609155092805,'VALP'],[-33.02792951160557,-71.63502566645818,'VALN'],[-33.02792958179966,-71.63502571729644,'VALN'],[-37.33870223007761,-71.53204871264069,'ANTC'],[-37.33870050054564,-71.53205800215035,'ANTC'],[-27.384526147587547,-70.33823551230533,'COPO'],[-27.384526030880984,-70.33823568152259,'COPO'],[-27.384526091086066,-70.33823570608678,'COPO'],[-27.384526045030228,-70.33823569283204,'COPO'],[-27.384525964883757,-70.33823569035796,'COPO'],[-45.51434056880028,-71.89208102134462,'COYQ'],[-45.514340615534586,-71.89208083493898,'COYQ'],[-45.51434065431414,-71.89208083530855,'COYQ'],[-53.136954289754485,-70.87988175840283,'PARC'],[-53.13695428616723,-70.87988178690193,'PARC'],[-53.13695429587401,-70.87988176395525,'PARC'],[-53.136954317962115,-70.87988180819089,'PARC'],[-36.843760204644745,-73.02547954800636,'CONZ'],[-36.84376020755704,-73.02547960017486,'CONZ'],[-36.84376022112201,-73.02547960510469,'CONZ'],[-36.84376638673828,-73.02551262195654,'CONZ'],[-36.84376628635291,-73.02551315564519,'CONZ'],[-36.84376616417716,-73.02551343241716,'CONZ'],[-36.843766139385096,-73.02551339576674,'CONZ'],[-36.842838281156396,-73.02537650290358,'CONT'],[-36.84284448840946,-73.02540996343097,'CONT'],[-36.84284436013057,-73.02541024823601,'CONT'],[-23.67896651313971,-70.40926907655275,'UCNF'],[-23.678966508391884,-70.40926911509236,'UCNF'],[-23.67896716202707,-70.40926931807623,'UCNF'],[-23.678967138645508,-70.40926930233677,'UCNF'],[-22.017103012223412,-63.67998468694197,'YCBA'],[-22.017103008775933,-63.67998473507597,'YCBA'],[4.640073578803719,-74.08093964169329,'BOGT'],[4.640073539486381,-74.0809396533745,'BOGT'],[4.640073469474919,-74.08093957275092,'BOGT'],[4.640073544138213,-74.08093953123019,'BOGT'],[4.640073543444752,-74.0809395587043,'BOGT'],[4.640073525311636,-74.0809395330984,'BOGT'],[4.640073570926014,-74.08093956667763,'BOGT'],[4.640073553203429,-74.08093954586445,'BOGT'],[4.640073548440523,-74.08093952118517,'BOGT'],[10.391334761576264,-75.53385309897209,'CART'],[10.391334767418186,-75.53385311331562,'CART'],[10.391334790888944,-75.53385315002788,'CART'],[7.89845843469371,-72.48793963580513,'CUCU'],[3.8820231216151084,-77.01042037984294,'BUEN'],[3.8820231788411435,-77.01042039603628,'BUEN'],[-0.2151567142046556,-78.49360772435628,'QUI1'],[-0.21515668325248966,-78.49360775167273,'QUI2'],[-0.21515668419629172,-78.49360774494494,'QUI1'],[-0.7426946315288715,-90.30361610431497,'GALA'],[-0.7426945574833874,-90.30361609178054,'GALA'],[-0.742998944039269,-90.30366985236549,'GLPS'],[-0.7429989473132443,-90.30366987864696,'GLPS'],[-0.742998932339192,-90.30366989461302,'GLPS'],[-0.7429989240820563,-90.30366989403365,'GLPS'],[-1.6505951439945288,-78.65110681759185,'RIOP'],[-1.6505959796083647,-78.65110759863192,'RIOP'],[-1.650595513193509,-78.65110713758695,'RIOP'],[-1.6505954239376952,-78.65110710811966,'RIOP'],[-1.6505954594504073,-78.65110719633152,'RIOP'],[-16.465515499386754,-71.49279450764705,'AREV'],[-16.465515512063483,-71.49279452777822,'AREV'],[-16.465512511559353,-71.49279016007637,'AREQ'],[-16.46551549848772,-71.49279453075712,'AREV'],[-16.46551248415674,-71.49279021281131,'AREQ'],[-16.465515189128176,-71.49279423328032,'AREQ'],[-16.4655155378652,-71.49279448065914,'AREQ'],[-16.465515508369997,-71.4927945218428,'AREQ'],[-16.46551549703064,-71.49279452983585,'AREQ'],[-3.767345498537591,-73.26870870251618,'IQUI'],[-12.062875005512657,-77.14931975502286,'CALL'],[10.673979311201478,-71.62443029046898,'MARA'],[10.673979313849898,-71.62443019405023,'MARA'],[10.673979325066325,-71.62443018201422,'MARA'],[10.673979338880592,-71.62443024532674,'MARA'],[32.37039915217226,-64.69627375178867,'BRMU'],[32.37039910374222,-64.69627379226137,'BRMU'],[32.37039916442098,-64.69627374784157,'BRMU'],[17.939023835253856,-76.78087193306709,'JAMA'],[17.939023713645344,-76.78087175445971,'JAMA'],[76.53733757347324,-68.7880177391887,'THU1'],[76.53733753923427,-68.78801785821891,'THU1'],[76.53704777701667,-68.82504115577099,'THU3'],[76.53704777519836,-68.82504114940585,'THU2'],[76.53704778026591,-68.82504120636786,'THU3'],[76.53704778001733,-68.82504121076227,'THU2'],[76.53704776796556,-68.82504119783604,'THU2'],[76.5370477693412,-68.82504119563885,'THU3'],[65.5793354298875,-37.14935788802236,'KULU'],[65.579335392107,-37.14935795527146,'KULU'],[65.5793353487705,-37.149357908307444,'KULU'],[66.98741902043385,-50.944840307749246,'KELY'],[66.98741899228088,-50.94484027595695,'KELY'],[66.9874190210814,-50.94484026542987,'KELY'],[66.98741899633556,-50.94484032882304,'KELY'],[66.98741899074632,-50.94484041426491,'KELY'],[70.48533452242869,-21.950337696025787,'SCOR'],[60.7152640570889,-46.04776443265087,'QAQ1'],[60.7152640282511,-46.047764385982106,'QAQ1'],[60.71526404098973,-46.04776437255801,'QAQ1'],[60.71526406661994,-46.047764481593404,'QAQ1'],[60.71526406547732,-46.047764452068044,'QAQ1'],[60.71526402959772,-46.04776447940675,'QAQ1'],[76.35162064124654,-61.67766820488969,'DKSG'],[81.25271459457015,-63.527396415732085,'KMOR'],[66.86327965872003,-35.57631483317911,'KSNB'],[66.86327964694658,-35.576314872905144,'KSNB'],[74.58062479587916,-57.22705809791938,'KULL'],[64.4304804835645,-40.19805267722654,'LYNS'],[61.63187579552893,-44.901065685306534,'NNVN'],[66.89772702176336,-34.03345980124283,'PLPK'],[66.89772702075477,-34.03345979623075,'PLPK'],[66.89772700013695,-34.03345980955027,'PLPK'],[70.74040548545366,-52.6883731626346,'QAAR'],[70.74040549249357,-52.688373168390285,'QAAR'],[71.84849976180948,-50.9939623581023,'RINK'],[71.84849976326373,-50.99396235459544,'RINK'],[72.91067778457989,-54.39370467871092,'SRMP'],[72.91067779108148,-54.39370468222798,'SRMP'],[62.53554239202846,-42.286150433040476,'TIMM'],[62.53554238073533,-42.286150412239486,'TIMM'],[64.27706894064443,-41.37507648456903,'TREO'],[64.27706894137343,-41.37507649636677,'TREO'],[17.756898793595735,-64.58431935600375,'CRO1'],[17.756898788014094,-64.58431934926892,'CRO1'],[17.756898773654886,-64.58431934230934,'CRO1'],[17.7568987817404,-64.58431934318591,'CRO1'],[17.756898768224566,-64.58431933593111,'CRO1'],[17.756898763189614,-64.58431929189639,'CRO1'],[17.75689879509084,-64.58431931043481,'CRO1'],[17.756898792169356,-64.58431928077617,'CRO1'],[23.564049241406963,-75.87340186583452,'EXU0'],[25.052539100121777,-77.46225639763298,'NAS0'],[50.13249457162535,-125.33083137549359,'QUAD'],[37.7629679129423,-122.45815107146437,'UCSF'],[37.76296789867019,-122.45815109148889,'UCSF'],[37.76296787702558,-122.45815110299328,'UCSF'],[29.28513657707532,-94.78930135449873,'TXGV'],[39.100674407817664,-74.80289972977499,'NJCM'],[39.10067442389752,-74.8028997138135,'NJCM'],[38.92834616611633,-123.7261979024956,'P059'],[36.62167655645106,-121.90541059980987,'P231'],[36.62167653080155,-121.90541060759807,'P231'],[17.716182969638098,-64.79812517049035,'VIKH'],[59.34037553370621,-138.89881286304978,'AB42'],[59.34037556062254,-138.8988128417242,'AB42'],[59.34037557896271,-138.89881283437305,'AB42'],[34.08099520796152,-81.12167609219122,'COLA'],[34.08099521103841,-81.12167615370643,'COLA'],[34.08099523128996,-81.121676114065,'COLA'],[34.08099521720967,-81.12167619910036,'COLA'],[34.080995341913756,-81.12167630956104,'COLA'],[36.76530454882047,-121.4471866266941,'SAOB'],[51.86414943873386,-176.66264751651298,'AB21'],[51.86414947981799,-176.66264754935017,'AB21'],[51.864149512297324,-176.66264760536208,'AB21'],[51.86414946249053,-176.66264755043622,'AB21'],[51.86414943908416,-176.6626474944837,'AB21'],[33.93993397861991,-78.7352499216267,'SCHY'],[32.77947691721512,-79.92536488694584,'SCHA'],[40.71952616266393,-73.73007806235215,'NYQN'],[40.71952618329431,-73.73007801320436,'NYQN'],[40.013161128771614,-75.17633423658815,'PAPH'],[40.70106921141316,-74.0143232169171,'NYBP'],[39.474523790043015,-74.5308203347389,'NJGT'],[39.474523788255645,-74.53082034582782,'NJGT'],[31.987577581082842,-81.02290258168853,'GASK'],[31.98757755760806,-81.02290253580972,'GASK'],[31.987577575485016,-81.02290253914532,'GASK'],[42.300057172992446,-71.44191061718038,'FMTS'],[42.30005713804469,-71.441910674974,'FMTS'],[41.74559856620961,-124.18430078817485,'CACC'],[37.919404817231616,-122.15255405732668,'BRIB'],[30.249168813686047,-88.07797598097898,'ALDI'],[60.48133274910691,-149.72400727823558,'AC15'],[60.48133270031523,-149.72400717305416,'AC15'],[60.481332627623736,-149.72400706851778,'AC15'],[48.05954883979879,-123.50327897721931,'P435'],[48.05954886349663,-123.5032789624252,'P435'],[48.05954886236612,-123.50327902536749,'P435'],[29.265528259467853,-89.95730245217779,'GRIS'],[29.265528247719,-89.95730241615153,'GRIS'],[58.41677524703209,-134.54530145946924,'AB50'],[58.4167751385983,-134.54530150831388,'AB50'],[59.52803859058945,-135.2282984675126,'AB44'],[59.5280385519285,-135.2282984822863,'AB44'],[60.548704304880545,-145.74985964433938,'EYAC'],[41.899700659294325,-71.88913954607384,'CTPU'],[41.89970065406115,-71.88913951886482,'CTPU'],[41.33529689415015,-72.04971717831747,'CTGR'],[41.33529691648588,-72.04971708017632,'CTGR'],[41.33529692600045,-72.04971713119063,'CTGR'],[37.863896286196336,-122.219060648054,'P224'],[32.78292376478387,-79.93799602702342,'SCCC'],[32.78292376347718,-79.9379959944762,'SCCC'],[40.69109462531139,-124.23703723969902,'P162'],[40.69109459915936,-124.23703711244383,'P162'],[40.69109456833739,-124.2370369584147,'P162'],[40.68052963180859,-74.23440313142338,'SA22'],[40.68052954379214,-74.23440313243873,'SA22'],[39.25462802759281,-76.70935283970803,'SA15'],[53.87563432192206,-166.54183637464882,'AV09'],[29.631009398814662,-83.10815467855976,'XCTY'],[29.63100941744694,-83.10815466983865,'XCTY'],[30.469022737280838,-87.18941991125261,'PCLA'],[40.91467986792902,-73.12495890313409,'SG06'],[37.686219274474276,-122.41044269922547,'SBRN'],[37.68621927474189,-122.41044270056342,'SBRN'],[37.68621923827902,-122.41044267311491,'SBRN'],[37.686219288952216,-122.41044268735179,'SBRN'],[37.68621927077548,-122.41044269705854,'SBRN'],[37.34153254238314,-121.64257920200919,'MHCB'],[37.341532665352176,-121.6425790927835,'MHCB'],[39.56145210782689,-75.56998311207305,'RED5'],[43.395518201357696,-124.25348279239546,'P365'],[65.61498104568975,-168.0621252772781,'AB09'],[36.68544622871678,-97.48073834512697,'LMNO'],[36.68544620317886,-97.4807382815507,'LMNO'],[36.685446253860654,-97.48073830689596,'LMNO'],[34.97986569404253,-97.51925017561824,'PRCO'],[34.97986567201952,-97.51925014985285,'PRCO'],[34.97986569176213,-97.51925016199488,'PRCO'],[34.97986568046594,-97.51925014530133,'PRCO'],[34.97986566023192,-97.51925012570277,'PRCO'],[37.65264369967416,-122.14056897291314,'WINT'],[37.65264374503814,-122.1405690496271,'WINT'],[40.64016841775252,-114.17969853686049,'GOSH'],[40.64016843362014,-114.1796985152093,'GOSH'],[38.995184848298294,-123.0747287753341,'HOPB'],[38.995184828465675,-123.07472878316045,'HOPB'],[38.995184804183296,-123.0747287831849,'HOPB'],[37.89087543178205,-122.44760347485523,'TIBB'],[37.89087541974549,-122.44760347697189,'TIBB'],[37.89087542471342,-122.44760340483906,'TIBB'],[37.89087547442012,-122.44760336210568,'TIBB'],[37.99617562021769,-123.01872048222452,'PTRB'],[37.99617562022393,-123.01872049060698,'PTRB'],[37.99617561186491,-123.01872049805365,'PTRB'],[35.94523888192295,-120.5415585460085,'PKDB'],[35.94523888207543,-120.54155858278574,'PKDB'],[40.130932037753624,-105.23271312133753,'TMGO'],[40.130932037488215,-105.23271314040701,'TMGO'],[40.13093483807252,-105.23271171737807,'TMGO'],[32.61841167057954,-116.59086316293272,'POTR'],[32.61841155207318,-116.59086358169648,'POTR'],[31.76976567107158,-106.41393010181879,'PASO'],[29.913460816679578,-95.14575554201258,'LKHU'],[29.91346074678419,-95.14575561390345,'LKHU'],[29.91346074190922,-95.14575559667286,'LKHU'],[29.91346070067213,-95.1457555685327,'LKHU'],[29.913460730606115,-95.14575562847833,'LKHU'],[29.91346075600643,-95.14575559076341,'LKHU'],[29.91346073575684,-95.14575552525069,'LKHU'],[29.913460627060154,-95.14575549053153,'LKHU'],[29.91346059135937,-95.14575556692897,'LKHU'],[29.91346060030925,-95.14575554873394,'LKHU'],[43.28146546041049,-72.47757011934172,'VTSP'],[35.390484349253484,-85.37805405401356,'TN22'],[43.74611673808309,-111.110270541474,'IDDR'],[30.356280983728443,-89.61027833949305,'NDBC'],[30.356280864316727,-89.61027830206241,'NDBC'],[25.754603454468786,-80.37356831721117,'FLIU'],[37.2485408343307,-76.49945801266688,'GLPT'],[37.24854082847472,-76.49945802508006,'GLPT'],[37.24862148679075,-76.4993740799753,'VAGP'],[39.13399178015118,-77.22098214999056,'GAIT'],[32.22445578193228,-110.97187902067319,'COT1'],[32.224455773821866,-110.97187897712588,'COT1'],[39.160087732435365,-75.52360010049652,'DNRC'],[39.16008776990979,-75.52360010055007,'DNRC'],[34.82661478717927,-120.5635095563018,'VAN1'],[34.82661478735745,-120.56350958616211,'VAN1'],[34.82661484026516,-120.56350956814344,'VAN1'],[40.47149299356828,-74.01159785722187,'SHK1'],[40.47149306503096,-74.01159796545635,'SHK1'],[40.471492677314366,-74.01159839625916,'SHK1'],[40.471492704556375,-74.01159838119776,'SHK1'],[40.471492735638705,-74.0115983871924,'SHK1'],[40.47149272631646,-74.01159836104189,'SHK5'],[40.47149273986581,-74.01159836702175,'SHK5'],[40.471492706434745,-74.01159836932757,'SHK5'],[32.13860016395929,-81.69633599824974,'SAV1'],[43.62864447839478,-83.8377690420505,'SAG1'],[32.09026081703573,-87.39181356495878,'MLF1'],[32.09026080261514,-87.39181360397053,'MLF1'],[32.09026087543193,-87.39181361969919,'MLF1'],[31.897228166681668,-92.78191248600098,'WNFL'],[31.897228142360184,-92.78191247694673,'WNFL'],[36.07170764582219,-99.21731613588676,'VCIO'],[34.0902637456375,-88.86247982575308,'OKOM'],[39.995424824535654,-105.262252792801,'NISU'],[39.995424737933966,-105.26225280469944,'NISU'],[39.995425003837795,-105.26225277536726,'NISU'],[39.99542501393155,-105.26225269364082,'NISU'],[39.99506703957246,-105.26260504573042,'NIST'],[39.99506698765996,-105.26260501769758,'NIST'],[26.14864501906737,-81.77628998136683,'NAPL'],[29.301475307771806,-95.48507481876561,'ANG1'],[29.301475057887977,-95.48507475925891,'ANG1'],[29.301475107011328,-95.48507489199208,'ANG1'],[31.87392472939319,-102.3151650535655,'ODS5'],[29.779419187565427,-95.43299266336392,'HOUS'],[27.74079729822527,-97.44167875411216,'CORC'],[30.311695998674107,-97.75631837230111,'AUS5'],[30.31169598931193,-97.75631838388746,'AUS5'],[30.31169591805505,-97.75631831580598,'AUS5'],[30.311695876409388,-97.75631828485746,'AUS5'],[30.311695957207036,-97.75631845306323,'AUS5'],[29.491210928169547,-98.57664291943264,'ANTO'],[24.553690134661228,-81.75428228679354,'KWST'],[24.550479345608363,-81.80712760110356,'CHIN'],[24.550479380568383,-81.80712761323674,'CHIN'],[30.204594042587846,-85.67819464355247,'PNCY'],[30.48403808342455,-81.70148557588888,'JXVL'],[30.48403810478425,-81.70148556934328,'JXVL'],[46.84008501027737,-122.25651937419514,'CPXF'],[46.84008503724781,-122.25651936314941,'CPXF'],[33.4804520771448,-119.02973696329805,'BAR1'],[33.48045206840453,-119.02973701367513,'BAR1'],[33.480452062606695,-119.02973704296107,'BAR1'],[44.585535111648326,-123.30460493156956,'CORV'],[44.58553522842701,-123.30460487023848,'CORV'],[44.58553516352759,-123.30460489149203,'CORV'],[44.58553516800442,-123.30460488622447,'CORV'],[46.118177244916545,-122.89606954413311,'KELS'],[46.1181772372332,-122.89606958375553,'KELS'],[48.54619447479893,-123.00761100856386,'SC02'],[41.74325298613122,-70.8865915716024,'ACU6'],[41.74325284082889,-70.88659203951474,'ACU6'],[34.34464832314611,-77.87538832960409,'CASL'],[36.90463314504169,-75.71270085920231,'COVX'],[36.90463318378764,-75.71270082462988,'COVX'],[30.513075295743462,-90.46762664230185,'HAMM'],[30.51307531915475,-90.46762661289793,'HAMM'],[41.50984695268624,-71.32753788285363,'NPRI'],[41.50984698722726,-71.32753782522794,'NPRI'],[35.473529084825245,-79.15805618093214,'SNFD'],[35.473529094038426,-79.15805620749838,'SNFD'],[34.499981221034034,-119.71999734129189,'RCA2'],[34.49998125283277,-119.71999718940009,'RCA2'],[34.499981231800035,-119.71999733818379,'RCA2'],[35.31180429204912,-120.66109393911755,'USLO'],[35.31180434334233,-120.6610939405627,'USLO'],[35.311804398371265,-120.6610939356364,'USLO'],[33.31161686215002,-118.3338167449146,'CAT2'],[33.31161684201956,-118.33381679524686,'CAT2'],[34.00433601284331,-120.06522170136031,'SRS1'],[34.00433601664235,-120.06522169554275,'SRS1'],[34.038259133205706,-120.3513921722493,'MIG1'],[42.8360988461606,-124.56334602388802,'CABL'],[42.83609884075924,-124.56334604405463,'CABL'],[42.83609881195754,-124.56334604906812,'CABL'],[42.83609880223267,-124.56334605576096,'CABL'],[42.83609876547486,-124.56334607232367,'CABL'],[41.78274112384017,-124.25520005368725,'PTSG'],[41.78274112985431,-124.25519993318676,'PTSG'],[41.78274113068426,-124.25519992486545,'PTSG'],[41.782741151875484,-124.25519990959177,'PTSG'],[41.78274113031783,-124.25519990377231,'PTSG'],[27.84982171740735,-82.53232054444328,'MCD1'],[27.849821789585757,-82.5323205368271,'MCD5'],[40.74148269649223,-74.17770592704447,'NJI2'],[40.7414827450859,-74.17770579807505,'NJI2'],[58.41775644714696,-135.69705172641068,'GUS2'],[55.19027066521107,-162.70715955685472,'BAY1'],[55.190417359593376,-162.70676473153534,'BAY2'],[64.68793952913268,-147.11296878025158,'EIL1'],[64.68793953095242,-147.11296859370717,'EIL1'],[64.68793951529918,-147.11296857444515,'EIL1'],[64.68793846167053,-147.11296757928943,'EIL1'],[33.13060768123702,-117.04176904513415,'OGHS'],[56.8544922022849,-135.53929721438462,'BIS1'],[56.8544922907623,-135.5392972258609,'BIS5'],[56.854492326513075,-135.53929726156773,'BIS5'],[56.85449223313666,-135.53929724131328,'BIS1'],[56.85449225174012,-135.53929726334428,'BIS1'],[56.854492342454634,-135.53929730134305,'BIS5'],[34.029260118207205,-119.78481204829666,'CRU1'],[34.02926009599908,-119.78481207554671,'CRU1'],[47.77410381913182,-122.08015637388529,'DWH1'],[47.774103761276976,-122.0801563913299,'DWH1'],[43.88981709048934,-69.94657675532976,'BRU1'],[41.67120335719236,-69.95004777437524,'CHT1'],[43.07095825825606,-70.7098537103344,'POR2'],[43.07097854506239,-70.70982278961057,'POR2'],[43.07101901660374,-70.70952839223928,'POR4'],[41.067110121407346,-71.86044752734391,'MNP1'],[38.776788106982735,-75.08768803398438,'CHL1'],[36.18167761063221,-75.75133600887928,'NCDU'],[36.181677621344285,-75.75133600790377,'NCDU'],[36.92708058306882,-76.00637014407371,'CHR1'],[37.53790503543132,-77.42966441578842,'RIC1'],[32.75756635280182,-79.84287541578414,'CHA1'],[32.757566362528635,-79.84287540827012,'CHA1'],[24.58227262591156,-81.6530334719358,'KYW1'],[24.58227261474871,-81.6530334361065,'KYW1'],[24.58227266560891,-81.65303343936229,'KYW5'],[35.59945479372873,-82.5462053754826,'ASHV'],[45.65349399166211,-84.46564687669203,'CHB1'],[43.00253640442255,-87.8884491431867,'MIL1'],[30.227518489824686,-88.02410481830861,'MOB1'],[38.61108835953981,-89.7586899255647,'STL3'],[29.878962628698705,-89.94172883476459,'ENG1'],[44.30394889208371,-91.90330782700248,'STP1'],[46.70505591149743,-92.01521447803532,'WIS1'],[29.329880489811064,-94.73680987081664,'GAL1'],[29.32786797390822,-94.77263918718917,'TXGA'],[29.327868118291423,-94.7726392368977,'TXGA'],[31.778272615029877,-95.71851105978838,'PATT'],[35.68275426577869,-95.86338558863466,'HKLO'],[27.838351959225676,-97.05895913182032,'ARP7'],[27.838351483543775,-97.05895895796925,'ARP3'],[27.838351492676473,-97.05895994876892,'ARP3'],[27.838351555116187,-97.05895902417906,'ARP3'],[37.60835412179678,-75.687005945863,'VIMS'],[37.60835413221817,-75.68700597230911,'VIMS'],[37.60835415597562,-75.68700597624756,'VIMS'],[37.608354152732154,-75.6870059670306,'VIMS'],[37.608354115439,-75.68700596251897,'VIMS'],[32.40713621228655,-106.34983112757084,'WSMN'],[32.66542124634133,-117.2430301265261,'PLO5'],[32.665421226556404,-117.24303007358496,'PLO5'],[32.665421202133736,-117.2430301794675,'PLO5'],[37.18708623276216,-122.38995395073368,'PPT1'],[37.85305475815629,-122.4189488771043,'PBL1'],[37.853054742042836,-122.41894893758312,'PBL1'],[46.20488751123946,-123.95609483315408,'FTS1'],[46.20488756134013,-123.95609470173969,'FTS5'],[40.44177430287632,-124.39633525975353,'CME1'],[40.441774310851514,-124.39633522703882,'CME1'],[40.44177431883435,-124.39633507750733,'CME1'],[40.44177432542597,-124.39633498534793,'CME1'],[20.245888731616994,-155.8838178284759,'UPO1'],[20.24588871019577,-155.88381786816072,'UPO1'],[21.983494132759017,-159.75816917639415,'KOK1'],[21.98349412436575,-159.75816917553576,'KOK1'],[32.57931530762668,-116.97268271441068,'NSSS'],[32.579315328813784,-116.97268308060742,'NSSS'],[34.38184883280494,-117.67828276778613,'TABV'],[34.38184881278214,-117.67828266184634,'TABL'],[34.38184881688004,-117.67828279009939,'TABV'],[34.38184883103688,-117.67828276865426,'TABL'],[34.38184882158564,-117.67828278814159,'TABL'],[34.38184880278113,-117.67828279683005,'TABV'],[34.38184881814076,-117.67828278826872,'TABL'],[34.38184880184117,-117.67828279503931,'TABL'],[34.381848803209664,-117.67828279481049,'TABL'],[34.1346012342801,-118.32175561350977,'LEEP'],[34.13460127562545,-118.32175563701321,'LEEP'],[38.3189172100879,-76.45388093802637,'MDSI'],[38.31887682365041,-76.45389563630268,'SOL1'],[39.01028741727812,-76.60924919959078,'ANP5'],[38.98334882666507,-76.47938948496531,'USNA'],[38.98334880019782,-76.47938943675648,'USNA'],[39.010287372207856,-76.60924926290936,'ANP1'],[33.24787541159389,-119.52436607700992,'SNI1'],[33.247875391386295,-119.52436608343653,'SNI1'],[33.247875376740694,-119.52436606229465,'SNI1'],[33.247875373435754,-119.52436605464936,'SNI1'],[33.24787531474062,-119.52436618765269,'SNI1'],[33.79779836010015,-118.33060430220294,'TORP'],[33.7977983915556,-118.33060430776565,'TORP'],[33.797798387288644,-118.33060432290812,'TORP'],[33.79779839837945,-118.33060434268732,'TORP'],[33.797798374777294,-118.33060434053813,'TORP'],[38.58881687556901,-76.13037465450054,'HNPT'],[38.588816889223786,-76.13037465247824,'HNPT'],[38.58881686216811,-76.13037457531577,'HNPT'],[38.588816695946484,-76.1303744336196,'HNPT'],[38.58881672609267,-76.13037441441496,'HNPT'],[25.734691775367697,-80.16219971275112,'AOML'],[25.732810122838252,-80.16017090416678,'MIA3'],[25.732810175983907,-80.1601708595703,'MIA3'],[25.734691733877423,-80.1621996748754,'AOML'],[25.73280992642859,-80.16017075852389,'MIA1'],[32.91442750662653,-118.48793878492823,'SCIP'],[32.91442752097269,-118.4879387661952,'SCIP'],[32.91442750060376,-118.48793878656666,'SCIP'],[32.914427484831776,-118.48793886915821,'SCIP'],[33.934757115588944,-116.39178260604862,'WIDC'],[33.93475770565591,-116.39178238057085,'WIDC'],[33.93475754733583,-116.39178238085607,'WIDC'],[44.39504826085048,-68.22169135355846,'BARH'],[44.395048263961584,-68.22169128715701,'BARH'],[44.90871005881772,-66.99213214855214,'EPRT'],[44.908710072294596,-66.99213215046767,'EPRT'],[44.90871006307317,-66.99213214799126,'EPRT'],[44.90871006775989,-66.99213210272795,'EPRT'],[44.908710055799894,-66.99213209750842,'EPRT'],[44.90871009222143,-66.99213204019111,'EPRT'],[33.71264011471743,-118.29382379637282,'VTIS'],[33.71264011962935,-118.29382380126987,'VTIS'],[33.71264015395666,-118.29382380068382,'VTIS'],[33.71264014536591,-118.29382383546292,'VTIS'],[33.71264015924016,-118.29382383862304,'VTIS'],[21.30328974783726,-157.86454851935392,'HNLC'],[21.312989576809933,-157.9208259656285,'ZHN1'],[21.31298958732463,-157.9208260263451,'ZHN1'],[21.31298950663119,-157.92082592080757,'ZHN1'],[19.719184323676277,-155.05269731814903,'HILO'],[19.719184329017956,-155.0526973608715,'HILO'],[21.98456372541055,-159.3392576174226,'LHUE'],[32.706168985214426,-115.03180348502129,'IID2'],[32.706168964819746,-115.03180345686475,'IID2'],[32.7061689498903,-115.03180342643809,'IID2'],[32.70616879213094,-115.03180302102422,'IID2'],[60.67507781386096,-151.3501793986395,'KEN1'],[60.67507773382623,-151.3501796107082,'KEN1'],[60.675077585142894,-151.35018267408404,'KEN1'],[60.675077731651236,-151.3501833328287,'KEN1'],[55.06907175566282,-131.59953668624019,'AIS1'],[55.06907182544931,-131.59953649338158,'AIS5'],[55.06907184634584,-131.59953657696033,'AIS5'],[55.06907172911971,-131.5995366666369,'AIS1'],[55.069071742763484,-131.599536588003,'AIS1'],[55.06907174137299,-131.59953667260794,'AIS5'],[55.06907173096228,-131.59953666183455,'AIS1'],[55.06907168991693,-131.5995364373403,'AIS5'],[-35.399202171234045,148.97999923252155,'TID2'],[-35.39920217327445,148.97999923157195,'TIDB'],[-35.399202135665305,148.97999923032407,'TID1'],[-35.39920213570087,148.97999922736608,'TID1'],[-35.39920213250764,148.97999923263083,'TIDB'],[-35.39920213110428,148.9799992312926,'TID2'],[-35.399202153113514,148.9799992318787,'TIDB'],[-35.399202154171746,148.97999923169385,'TID1'],[-35.39920215189839,148.97999923528204,'TID2'],[-35.39920215284149,148.97999922451737,'TID2'],[-29.046552057890935,115.3469787995636,'YAR2'],[-29.046552061754266,115.3469787912616,'YAR1'],[-29.04655209535876,115.34697880928329,'YAR2'],[-29.046552095783994,115.34697880693894,'YAR1'],[-29.04655208422544,115.34697881450737,'YAR2'],[-29.04655207147239,115.34697880581496,'YAR2'],[-29.04655206856797,115.34697881948924,'YAR2'],[-29.046587032497577,115.34697585822383,'YARR'],[-29.04658700647277,115.34697585910288,'YARR'],[-29.046587004627636,115.34697587717217,'YARR'],[-29.04649292979419,115.34715327934025,'YAR3'],[-29.04649293298836,115.34715329462634,'YAR3'],[-29.046492921917675,115.34715325970721,'YAR3'],[-29.046492911599042,115.34715325580058,'YAR3'],[-32.99876478647137,148.26461186875838,'PARK'],[-32.99876478797755,148.26461189326164,'PARK'],[-34.7289956038132,138.64734751596092,'ADE1'],[-34.728995605459446,138.64734751747122,'ADE2'],[-42.80471025800641,147.4387352613258,'HOB2'],[-42.80471023810056,147.43873524084242,'HOB2'],[-42.80471022488277,147.43873523679446,'HOB2'],[-42.804710212661284,147.438735238224,'HOB2'],[-42.80471023514765,147.43873527448486,'HOB2'],[-35.31615851550264,149.0101556449921,'STR2'],[-35.316158495571976,149.01015566261535,'STR2'],[-35.316158537133084,149.01015564566913,'STR2'],[-35.315530869965016,149.01005345003549,'STR1'],[-35.31553089902512,149.0100534571645,'STR1'],[-35.31553056726226,149.0100540317387,'STR1'],[-35.315530522361115,149.01005403125464,'STR1'],[-35.3155308778815,149.01005347603964,'STR1'],[-35.31553086544177,149.0100535134456,'STR1'],[-33.780876717021044,151.15038043231053,'SYDN'],[-12.188345121093423,96.83397086211914,'COCO'],[-12.188345177256206,96.83397114633784,'COCO'],[-12.188345163795832,96.83397115936381,'COCO'],[-12.188345122600518,96.83397116140723,'COCO'],[-12.18834506225996,96.83397120396417,'COCO'],[-12.18834491156581,96.8339711633413,'COCO'],[-31.801963159084995,115.8852528987739,'PERT'],[-31.801963195023756,115.88525292154738,'PERT'],[-31.801963152656928,115.88525293808576,'PERT'],[-31.801963185135246,115.88525297499811,'PERT'],[-31.801963204218666,115.8852530184641,'PERT'],[-31.801963192182075,115.88525294993471,'PERT'],[-31.801963147769495,115.8852528369613,'PERT'],[-12.843702195518768,131.13274090201955,'DARW'],[-12.843702192158839,131.13274091158172,'DARR'],[-12.843702183931402,131.13274092158628,'DARW'],[-12.843702062375431,131.13274099118482,'DARR'],[-12.843702210345702,131.13274091866248,'DARR'],[-12.843702083144569,131.13274104365266,'DARW'],[-12.843702213707928,131.13274091909273,'DARW'],[-12.84370222977676,131.1327409317666,'DARR'],[-12.8437022291674,131.1327409327149,'DARW'],[-54.499528863463325,158.93583178380493,'MAC1'],[-54.49952885704786,158.93583178021868,'MAC1'],[-54.49952891049824,158.93583175271496,'MAC1'],[-54.49952911346567,158.9358315184289,'MAC1'],[-54.49952913295236,158.93583151654076,'MAC1'],[-12.658845742067305,132.89389970439922,'JAB1'],[-12.658845728772047,132.89389970997658,'JAB1'],[-12.658845684614626,132.8938996920503,'JAB1'],[-12.658845743094519,132.89389971816044,'JAB1'],[-12.658845694720009,132.89389970883016,'JAB1'],[-12.65884572875075,132.89389975123078,'JAB1'],[-12.658845698403978,132.89389973075043,'JAB1'],[-12.658845668301117,132.89389972476272,'JAB1'],[-12.65884565604907,132.8938997081558,'JAB1'],[-12.658845652733085,132.89389973572423,'JAB1'],[-12.66014869810379,132.89453573252393,'JAB2'],[-12.66014874780472,132.89453574829813,'JAB2'],[-23.670115465758222,133.88551850957373,'ALIC'],[-23.670115457571274,133.88551853920208,'ALIC'],[-31.86666293776854,133.80983167124154,'CEDU'],[-31.86666289695566,133.80983166957463,'CEDU'],[-20.981427830855164,117.09719300358081,'KARR'],[-20.98142781274017,117.09719299296789,'KARR'],[-20.98142780073381,117.09719298010613,'KARR'],[-20.98142778332074,117.0971929707687,'KARR'],[-19.269277541908746,147.05568947216682,'TOW2'],[-19.269277483711413,147.0556894942619,'TOW2'],[-31.825520932358405,115.7385841032732,'HIL1'],[-31.825520927480895,115.7385841668452,'HIL1'],[-31.825520943569945,115.73858421584313,'HIL1'],[-31.825520926281605,115.73858423438008,'HIL1'],[-31.825520932261245,115.73858425968214,'HIL1'],[-27.484890895601634,153.0353007621296,'SUNM'],[-27.48496128270137,153.0352716971948,'WOOL'],[-41.05006450413608,145.91485195403456,'BUR2'],[-34.47554675613331,150.91369831623302,'PTKL'],[-38.34439616822108,141.61347254360317,'PTLD'],[-38.344396122913594,141.61347247930163,'PTLD'],[-38.3443960955729,141.6134722333442,'PTLD'],[-38.37517948436181,145.21403728466169,'STNY'],[-42.54643816191301,147.9308502712688,'SPBY'],[-42.54643809421496,147.93085022964166,'SPBY'],[-18.003973146603837,122.20908660560855,'BRO1'],[-33.87431841695294,121.8943253513832,'ESPA'],[-35.0947019392032,138.4857162637729,'PTSV'],[-35.09470193702556,138.4857162762244,'PTSV'],[-31.0487326913323,116.19272000223226,'NNOR'],[-31.0487326864566,116.19271997011633,'NNOR'],[-37.829408303887476,144.9753389588264,'MOBS'],[-37.829408292776186,144.9753389821924,'MOBS'],[-10.449964213611697,105.68850068012517,'XMIS'],[-10.449964178282269,105.68850069497542,'XMIS'],[-10.44996410869552,105.68850062167819,'XMIS'],[-12.424008423648091,130.89149363294317,'DARM'],[-24.908221158435893,152.32100604805154,'BNDY'],[-29.0433453710697,167.93883256250558,'NORF'],[-34.950226506984784,117.81018705677468,'ALBY'],[-43.985702980837694,170.4649395227455,'MTJO'],[-43.98570294848996,170.46493957357896,'MTJO'],[-43.98570297804813,170.46493951121326,'MTJO'],[-43.98570300658626,170.4649394722287,'MTJO'],[-43.985703000266504,170.46493947488364,'MTJO'],[-43.95578378556587,-176.56584475843493,'CHAT'],[-43.95578373163826,-176.56584465551472,'CHAT'],[-41.27264570190325,174.77870413468227,'WEL2'],[-41.3234539932255,174.80589107269546,'WGTN'],[-41.272645711804785,174.77870409112242,'WEL1'],[-41.272645670820346,174.77870418840826,'WEL1'],[-41.32345404557948,174.8058911023255,'WGTN'],[-41.27264567031933,174.77870418949436,'WEL2'],[-41.272645736576045,174.77870446375698,'WEL2'],[-41.272645736598896,174.77870446602543,'WEL1'],[-41.32345404267946,174.80589111389617,'WGTN'],[-41.32345404259891,174.8058910733447,'WGTN'],[-41.32345412651783,174.8058912896194,'WGTN'],[-41.32345411376167,174.80589110492093,'WGTN'],[-41.323454119234036,174.80589081230207,'WGTN'],[-41.32345407877929,174.8058908467977,'WGTN'],[-41.29043648202626,174.78159263104345,'WGTT'],[-41.290436456917945,174.7815926828105,'WGTT'],[-41.290436425993136,174.78159274139054,'WGTT'],[-41.2904364983635,174.78159300252267,'WGTT'],[-41.29043647242677,174.78159287152505,'WGTT'],[-41.290436429155406,174.7815926061197,'WGTT'],[-41.290436360604424,174.78159267358674,'WGTT'],[-36.602840941118096,174.834385941758,'AUCK'],[-36.60284090326618,174.8343859846161,'AUCK'],[-36.602840900272895,174.83438597470501,'AUCK'],[-36.602840893770185,174.83438600677127,'AUCK'],[-36.60284090522339,174.83438601383244,'AUCK'],[-19.07652655669967,-169.92706795995235,'NIUM'],[-19.07652655664717,-169.92706798117982,'NIUM'],[-19.07652648165439,-169.92706809312213,'NIUM'],[-19.0765264333833,-169.92706815259652,'NIUM'],[-45.81431557538314,170.62940607564894,'DUNT'],[-45.869498796172714,170.51091660478556,'OUSD'],[-45.81431557202253,170.6294060385999,'DUNT'],[-45.869498794162084,170.51091657939094,'OUSD'],[-45.86949876556726,170.51091661222057,'OUSD'],[-45.81431554151696,170.6294060711369,'DUNT'],[-45.814315528604425,170.62940595375525,'DUNT'],[-45.86949875444848,170.51091664293062,'OUSD'],[-45.81431553905685,170.62940607366332,'DUNT'],[-45.86949874828635,170.51091644306075,'OUSD'],[-45.814315533190275,170.62940604065722,'DUNT'],[-45.86949875559238,170.5109164350327,'OUSD'],[-45.81431551488039,170.62940590144757,'DUNT'],[-45.814315526727654,170.6294058762803,'DUNT'],[-45.86947310712151,170.51093083476664,'OUS2'],[-45.86947308989834,170.51093082630297,'OUS2'],[-45.86947308071745,170.51093078841419,'OUS2'],[-45.869473056019196,170.51093082187708,'OUS2'],[-45.869473041166046,170.51093085450904,'OUS2'],[-45.86947304149755,170.51093085706057,'OUS2'],[-45.86947303996494,170.51093065909438,'OUS2'],[-45.869473045633434,170.51093056846514,'OUS2'],[-21.201025605654095,-159.80061320447774,'CKIS'],[-21.20102555415378,-159.80061320464793,'CKIS'],[-43.70273320427796,172.65470076231327,'MQZG'],[-43.60584122200878,172.72221953873836,'LYTT'],[-43.702733194197904,172.6547007612078,'MQZG'],[-43.605841235535095,172.72221957332363,'LYTT'],[-43.702733162895996,172.6547008161288,'MQZG'],[-43.605841239713286,172.7222195473654,'LYTT'],[-43.70273318279668,172.65470074806277,'MQZG'],[-43.60584088153824,172.7222188349289,'LYTT'],[-43.70273255461584,172.65469924933663,'MQZG'],[-43.60584293651618,172.72221715791812,'LYTT'],[-43.605844276336946,172.72221672542292,'LYTT'],[-43.70273298085988,172.6546990272447,'MQZG'],[-43.60584464558543,172.72221644132802,'LYTT'],[-43.70273318556432,172.65469887069563,'MQZG'],[-43.70273324753854,172.65469879247877,'MQZG'],[-36.843598508634564,174.76989452572093,'TAKL'],[-36.8437544899959,174.77042040258928,'AUKT'],[-39.18255369982557,174.1181740102689,'NPLY'],[-39.1825537043316,174.118174059212,'NPLY'],[-46.5850616993152,168.29208392558812,'BLUF'],[-46.58506170129621,168.2920838772585,'BLUF'],[-46.58506163204567,168.2920839560566,'BLUF'],[-46.58506162210725,168.29208392081378,'BLUF'],[-46.58506153172644,168.29208338215685,'BLUF'],[-43.735473341869444,-176.61711593806845,'CHTI'],[-36.43441054156785,174.66277995949693,'WARK'],[-43.6662387701069,169.85585336765982,'CNCL'],[-43.66623879019739,169.85585336226447,'CNCL'],[-43.66623874215045,169.85585342059085,'CNCL'],[-43.666238775592355,169.85585333336445,'CNCL'],[-43.66623879186112,169.85585330779023,'CNCL'],[-43.777327536852,170.10550937551835,'HORN'],[-43.7773275027777,170.10550941957854,'HORN'],[-43.777327526354185,170.1055092697149,'HORN'],[-43.77732756075946,170.10550928847957,'HORN'],[-43.60838542254021,169.77516151103868,'KARA'],[-43.608385381423,169.7751615566558,'KARA'],[-43.608385404158334,169.77516146750742,'KARA'],[-43.608385424572774,169.77516144688929,'KARA'],[-43.53167603717909,169.8158177871728,'QUAR'],[-43.5316759858342,169.8158178557008,'QUAR'],[-43.53167600242803,169.81581778544464,'QUAR'],[-43.53167602077353,169.81581777127096,'QUAR'],[1.3545832251859864,172.92289310306796,'KIRI'],[1.3545832042507715,172.92289312081573,'KIRI'],[1.3545831883936685,172.92289311535308,'KIRI'],[13.589329607606697,144.86836063627936,'GUAM'],[13.589329487730403,144.86836075010754,'GUAM'],[13.589329525955577,144.86836069606497,'GUAM'],[-14.326094321088165,-170.7224370586665,'ASPA'],[-14.326094288657314,-170.72243701123713,'ASPA'],[-14.326093660619163,-170.72243628591573,'ASPA'],[8.722208230891425,167.73023634155192,'KWJ1'],[15.229697230000204,145.74309191230844,'CNMR'],[15.229697439499441,145.74309157767863,'CNMR'],[15.229697441959749,145.74309162557387,'CNMR'],[-13.832212192592458,-171.9995298900093,'FALE'],[-13.832211606429011,-171.9995294989101,'FALE'],[-13.832211563606055,-171.9995294853587,'FALE'],[-13.849209379309803,-171.73842414188277,'SAMO'],[-13.849209367428777,-171.73842416804416,'SAMO'],[-13.849208598742244,-171.73842366029257,'SAMO'],[-0.5517294815194693,166.92554775502228,'NAUR'],[-0.5517294985462458,166.9255477098633,'NAUR'],[-0.5517294665119877,166.92554773887676,'NAUR'],[-17.608812326655613,177.4465810221972,'LAUT'],[-17.608812361619222,177.44658106902506,'LAUT'],[-17.608812344743363,177.44658105292223,'LAUT'],[-21.144713361187108,-175.17921790061578,'TONG'],[-21.144713364875177,-175.17921791973302,'TONG'],[-21.144713125536878,-175.17921734191646,'TONG'],[-21.144713081290135,-175.17921736344934,'TONG'],[-21.144713083552002,-175.17921735280424,'TONG'],[-21.144713142001066,-175.17921732483344,'TONG'],[-21.14471318661871,-175.17921734445923,'TONG'],[-21.144713182417078,-175.17921730925303,'TONG'],[-6.673705103101672,146.99318913685474,'LAE1'],[-6.673705182166625,146.99318905315627,'LAE1'],[-6.673705142651368,146.99318907862508,'LAE1'],[-6.6737053739404795,146.993189092983,'LAE1'],[-2.04322939839148,147.36600837508618,'PNGM'],[-2.0432294143286622,147.36600833402403,'PNGM'],[-2.0432293752910815,147.36600836905689,'PNGM'],[-2.0432294045376858,147.36600838991995,'PNGM'],[-2.04322938256247,147.3660083761624,'PNGM'],[-8.525289591052218,179.19655740211044,'TUVA'],[-8.525289584246726,179.19655741859796,'TUVA'],[-8.525289599755979,179.19655741666693,'TUVA'],[-8.525289588296213,179.19655742922484,'TUVA'],[-15.447137301771551,167.20320246567877,'SANC'],[-15.447137331063809,167.20320249823035,'SANC'],[-15.447137390613308,167.20320246608603,'SANC'],[-15.447137468445097,167.2032027341145,'SANC'],[-15.447137605780638,167.20320242153,'SANC'],[-15.447137588838284,167.20320237187028,'SANC'],[-15.447137557136662,167.2032024098223,'SANC'],[-15.447137573522674,167.20320244092107,'SANC'],[-15.447137589155071,167.2032024396052,'SANC'],[-17.728888332999556,168.31949332276906,'VILA'],[-17.743974438772824,168.31514728293243,'VANU'],[-17.728888608194296,168.31949216266972,'VILA'],[-17.743974417754195,168.31514725487966,'VANU'],[-17.74397443723564,168.31514720346033,'VANU'],[-17.72888859443528,168.31949211446005,'VILA'],[-17.74397446407115,168.3151472375587,'VANU'],[-17.72888861011276,168.31949207475938,'VILA'],[-17.743974449560113,168.31514722004675,'VANU'],[-17.72888863713911,168.31949211748295,'VILA'],[-17.74397445206867,168.31514717384624,'VANU'],[-17.728888612265983,168.31949209235938,'VILA'],[-17.74397447438426,168.31514705677557,'VANU'],[-17.728888623013713,168.31949209036173,'VILA'],[-17.72888865669475,168.3194919767725,'VILA'],[-17.743974483166376,168.3151469723722,'VANU'],[-17.743974515062245,168.3151469133437,'VANU'],[-17.7288886628625,168.3194919055251,'VILA'],[-17.743974745093336,168.31514651683196,'VANU'],[-17.728888687873628,168.31949184239627,'VILA'],[-17.72888891705917,168.31949139489268,'VILA'],[-17.743975183542595,168.31514606361247,'VANU'],[-17.74397524399164,168.3151461984782,'VANU'],[-17.728889346830837,168.3194909609808,'VILA'],[-17.728889413661634,168.31949109866838,'VILA'],[-15.643584683103652,167.09333553250312,'AVUN'],[-15.643584728193334,167.09333555774936,'AVUN'],[-14.96807100461072,168.05758611702208,'MAEW'],[-14.968070692321264,168.0575870609222,'MAEW'],[-14.968070675757566,168.0575870393198,'MAEW'],[-15.419518223247461,167.67930261873875,'AMBA'],[-15.97366770058947,167.19191856215159,'ESPI'],[7.119148896733984,171.36451982252837,'MAJU'],[7.1191489075691905,171.36451980908066,'MAJU'],[7.119148876661241,171.36451983247352,'MAJU'],[7.119148913021463,171.36451985093984,'MAJU'],[6.959945213993135,158.21011206390898,'POHN'],[6.959945256220523,158.2101120839178,'POHN'],[6.959945274406204,158.21011212037556,'POHN'],[6.9599452658255725,158.2101120607173,'POHN'],[-23.16098892161604,150.7900826934279,'RSBY'],[-10.590371613592323,142.29621197578547,'HNIS'],[-14.376000815154892,132.15327349645065,'KAT1'],[-14.375072918233872,132.15250597354964,'KAT2'],[-27.52615248807834,153.2665378855056,'CLEV'],[-27.526152501622818,153.2665378913054,'CLEV'],[-15.573157323444867,133.21275765241774,'LARR'],[-15.573157338791592,133.21275765397053,'LARR'],[-32.47029078646235,137.93432891453955,'SA45'],[-31.519884665077527,159.06120056767432,'LORD'],[-31.519884663666346,159.0612005616544,'LORD'],[-31.541458453041187,159.07852088523728,'LDHI'],[-77.83834984049152,166.6693303951514,'MCM4'],[-77.83834984954265,166.66933037535327,'MCM4'],[-77.83834985618863,166.66933040202926,'MCM4'],[-77.83834986437097,166.66933042018218,'MCM4'],[-77.84804430121063,166.66824560596706,'CRAR'],[-77.84804430164345,166.66824537080166,'CRAR'],[-67.60476669721992,62.87071485585444,'MAW1'],[-64.77508972997707,-64.05112117119215,'PALM'],[-64.7750896714497,-64.05112127723217,'PALV'],[-64.77508967339205,-64.05112116235789,'PALM'],[-64.77508966806909,-64.05112121623183,'PALV'],[-64.77508969384368,-64.05112128749171,'PALM'],[-64.7750896745852,-64.05112128188172,'PALM'],[-64.77508966925073,-64.05112121715162,'PALM'],[-69.00695709284047,39.58374299821601,'SYOG'],[-69.00695714045399,39.58374300409054,'SYOG'],[-69.00695712868963,39.583743004606816,'SYOG'],[-69.00695712592461,39.58374300211944,'SYOG'],[-69.00695713269374,39.583743033024426,'SYOG'],[-67.57138836385404,-68.12577563128683,'ROTH'],[-63.32072228931871,-57.90033708747683,'OHIG'],[-63.32108070853858,-57.90133131179671,'OHI2'],[-63.32108070393691,-57.901331232211476,'OHI2'],[-63.321080677281756,-57.901331295338146,'OHI2'],[-63.32108069096882,-57.9013312510052,'OHI2'],[-63.321080678844815,-57.90133113235788,'OHI2'],[-63.32108067811483,-57.90133110890859,'OHI2'],[-63.321092000217995,-57.90138458892307,'OHI3'],[-63.32109201308466,-57.901384715745145,'OHI3'],[-63.32109204396605,-57.901384636253084,'OHI3'],[-63.32109207254402,-57.90138460232341,'OHI3'],[-63.32109205498506,-57.90138460140166,'OHI3'],[-63.32109205358919,-57.9013844623781,'OHI3'],[-71.67379584670022,-2.841782843674846,'VESL'],[-71.67379583119128,-2.8417827968538565,'VESL'],[-71.67379583696179,-2.8417827774457196,'VESL'],[-68.5773233010188,77.9726129092663,'DAV1'],[-68.57732328366455,77.972612946892,'DAVR'],[-68.57732322960281,77.97261293571513,'DAVR'],[-68.57732329197717,77.97261290089224,'DAV1'],[-68.57732328529396,77.97261294500453,'DAV1'],[-68.57732322856101,77.97261292148077,'DAV1'],[-68.57732328584598,77.97261288047585,'DAV1'],[-66.28335991557933,110.51970617790609,'CAS1'],[-66.28335990590026,110.51970621857387,'CAS1'],[-66.28335991317677,110.51970626107126,'CAS1'],[-66.28335988296199,110.51970620350889,'CAS1'],[-66.28335985413456,110.51970623330749,'CAS1'],[-62.194101118914205,-58.980500378300995,'FREI'],[-65.2460051680823,-64.25416243124573,'VNAD'],[-77.53272993228322,160.27140962023884,'FLM5'],[-78.92767342105925,162.5647010397942,'FTP4'],[-77.03443926628287,163.19010948458416,'ROB4'],[-79.8456985208094,154.22011967664494,'WHN0'],[19.292948525012076,-81.3794472803755,'GCGT'],[-51.69841017337671,-57.85074260496413,'LKTH'],[-51.693652063800215,-57.87406736117858,'FALK'],[-51.69365205592634,-57.87406738265504,'FALK'],[-51.69365203439694,-57.87406739404872,'FALK'],[28.76387231793957,-17.893827395546058,'LPAL'],[28.76387237623846,-17.893827399512396,'LPAL'],[18.463192699393595,-67.0668357042859,'PUR6'],[18.46297715668577,-67.06695695259847,'PUR5'],[18.462977220448288,-67.0669569907678,'PUR3'],[17.97039799039033,-67.04537132303484,'PRMI'],[18.43133850423877,-65.9934752820609,'ZSU1'],[18.431338493126376,-65.99347522046288,'ZSU1'],[18.307439040489335,-65.28251572980722,'CUPR'],[18.407836659777477,-66.16119925580311,'BYSP'],[18.217585620398307,-67.15886742927133,'MAYZ'],[18.34009476655587,-64.97444726380154,'STVI'],[18.340094770271648,-64.97444729461071,'STVI'],[13.433208352331965,144.80271250084817,'GUUG'],[13.433208359238334,144.80271253985688,'GUUG'],[13.433208368191407,144.8027125534465,'GUUG'],[13.43320836877227,144.80271253540434,'GUUG'],[-49.351466972279134,70.25552238047209,'KERG'],[-49.351466950501205,70.25552236283113,'KERG'],[-49.3514669949748,70.25552238651662,'KERG'],[-49.351466897746214,70.25552266396406,'KERG'],[-49.351466932597546,70.255522651875,'KERG'],[-49.35154316460224,70.25550554283791,'KRGG'],[-49.35218299774995,70.21792808806939,'KETG'],[-49.352183049455164,70.21792819228985,'KETG'],[-49.352183040496705,70.2179281909547,'KETG'],[-49.352183056691196,70.21792818892676,'KETG'],[-66.66508529308734,140.00193389276973,'DUM1'],[-66.6650851624095,140.0019341102492,'DUM1'],[-17.57706051965236,-149.6064518291251,'THTI'],[-17.577060521281734,-149.6064517884197,'THTI'],[-17.577060502316822,-149.6064517744657,'THTI'],[-17.533083077813142,-149.57272261792892,'PAPE'],[-17.577027684841738,-149.60619104329132,'TAH2'],[-17.577027683658677,-149.60619104480713,'TAH1'],[-17.555312565626416,-149.6143015254806,'FAA1'],[-17.55531257190583,-149.61430154163168,'FAA1'],[-23.13035541064595,-134.96482213628488,'GAMB'],[-23.341798465154284,-149.4755381518931,'TBTG'],[-22.26984841060055,166.41020237223324,'NOUM'],[-22.269848397220763,166.410202401792,'NOUM'],[-22.269848402145545,166.41020243636441,'NOUM'],[-22.228324869307908,166.48488518764307,'NRMD'],[-22.22832484533806,166.48488526241832,'NRMD'],[-22.22832480421298,166.48488534120102,'NRMD'],[-22.228324837381177,166.48488535849287,'NRMD'],[-22.22832484124325,166.4848853495881,'NRMD'],[-20.558691081626957,164.28733714450914,'KOUC'],[-20.55869111934849,164.2873372720443,'KOUC'],[-20.558691140802306,164.2873372779826,'KOUC'],[-20.5586910943722,164.2873373752083,'KOUC'],[-20.558691099192618,164.28733734238006,'KOUC'],[-20.558691007315293,164.28733741152845,'KOUC'],[-20.917985315026918,167.26378192878772,'LPIL'],[-20.917985318647577,167.2637819352684,'LPIL'],[-20.917985330841915,167.2637819267394,'LPIL'],[-20.917985302797533,167.26378198043437,'LPIL'],[-20.917985196649663,167.26378212694112,'LPIL'],[-20.91798522347256,167.26378207050377,'LPIL'],[-20.917985237611717,167.2637819910049,'LPIL'],[-20.91798523802356,167.2637819423257,'LPIL'],[-20.91798523323504,167.2637819494403,'LPIL'],[-22.264787739377287,166.44251593034622,'NMEA'],[-14.307803499670454,-178.1209447103238,'FTNA'],[-14.307803525606342,-178.12094473797876,'FTNA'],[-14.307803568495066,-178.12094472347536,'FTNA'],[-14.30780363715727,-178.12094455868714,'FTNA'],[-14.307803721673555,-178.12094453892712,'FTNA'],[15.97961113534724,-61.70306284355126,'HOUE'],[15.979611098898925,-61.703062781104116,'HOUE'],[16.262305351272598,-61.52753646030171,'ABMF'],[16.26230538893573,-61.52753650128424,'ABMF'],[16.2623053892698,-61.52753647593035,'ABMF'],[16.296865475071513,-61.08645781674183,'ADE0'],[16.29686547005133,-61.086457793887035,'ADE0'],[15.875325829259822,-61.58196526839362,'FNA0'],[15.87532557125877,-61.58196539209351,'FNA0'],[15.875325543828792,-61.581965401683696,'FNA0'],[15.87532559561627,-61.581965344641546,'FNA0'],[16.044981371319118,-61.66271885405204,'SOUF'],[16.04498141161854,-61.66271877766718,'SOUF'],[16.044981436047244,-61.662718792438866,'SOUF'],[14.594816382138475,-60.99617669566078,'LMMF'],[14.594816399937512,-60.996176738987245,'LMMF'],[14.812959135225334,-61.16310775671846,'LAM0'],[14.812959143625799,-61.16310777810077,'LAM0'],[14.812959124575732,-61.16310772516407,'LAM0'],[5.252181844389248,-52.80595995591396,'KOUR'],[5.252181862878389,-52.80595994440703,'KOUR'],[5.2521818193181184,-52.80595995250498,'KOUR'],[5.252181836114275,-52.80595989680262,'KOUR'],[5.252181891913231,-52.80595986549492,'KOUR'],[5.252181859147522,-52.80595988487673,'KOUR'],[5.2521818575286705,-52.80595988350538,'KOUR'],[5.252181852545382,-52.80595983930461,'KOUR'],[5.252189041451759,-52.805972134784916,'KOU1'],[5.252189034457283,-52.80597214873366,'KOU1'],[5.098470662034452,-52.639750101488296,'KOUG'],[5.09847065337576,-52.63975009215445,'KOUG'],[4.948772273119414,-52.309974731688484,'CAYN'],[-21.208225178809574,55.57172094139299,'REUN'],[-21.20822519380684,55.57172096391889,'REUN'],[-21.208225159290635,55.5717209117974,'REUN'],[-21.19596142269704,55.28802408379393,'SLEU'],[-21.195961568235823,55.288024150904405,'SLEU']];
	
	let points = [];//[new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([83, 55])))];
	
	for(let i = 0; i < arr_p.length; i++){
		//arr_p[i][2] = i+'';
		let p = new ol.geom.Point(ol.proj.fromLonLat([arr_p[i][1], arr_p[i][0]]));
		points[i] = new ol.Feature(p);
		let st = new ol.style.Style({
			/*
			image: new ol.style.Circle({
				radius: 5,
				fill: new ol.style.Fill({color: '#000'}),
			}),//*/
			text: new ol.style.Text({
				text: arr_p[i][2],
				fill: new ol.style.Fill({color: '#f00'}),
			}),
		});
		//points[i].setStyle(new ol.style.Text({text: '87'}));
		points[i].setStyle(st);
	}
	
	
	let layer_points = new ol.layer.Vector({
			source: new ol.source.Vector({
				features: points,
			}),
			//*
			style: new ol.style.Style({
				image: new ol.style.Circle({
					radius: 5,
					fill: new ol.style.Fill({color: 'red'}),
				}),
			}),//*/
		});
	layer_points.setMap(map.map);
	//*/
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	let f_map_change = () => {
		let text = "";
		
		document.getElementById("test_out").innerHTML = text;
	};
	
	
	
	
	///#####################################
	let w_grid = 0;
	let arr_c_grid = [];
	let arr_c_x = [];
	let arr_c_y = [];
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
		let left = Math.min(c_top_left_to[0], c_bot_left_to[0], sc.f_to([c_top_l[0], c_centr[1], ...z_s])[0]);
		let right = Math.max(c_top_right_to[0], c_bot_right_to[0], sc.f_to([c_top_r[0], c_centr[1], ...z_s])[0]);
		let top = Math.max(c_top_right_to[1], c_top_left_to[1], sc.f_to([c_centr[0], c_top_r[1], ...z_s])[1]);
		let bot = Math.min(c_bot_left_to[1], c_bot_right_to[1], sc.f_to([c_centr[0], c_bot_r[1], ...z_s])[1]);
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
	}
	let f_enter = e => {if(e.keyCode === 13)e.target.blur();};
	let f_focus = e => {e.target.select();};
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
		let {
			id_sc = 0,
			color = "#000000"// Цвет линии разметки
		} = options;
		if(id_sc >= sc.length)id_sc = 0;
		/// Объекты графики
		// Общей слой svg
		let layer = createElementNS("g");
		// Линия разметки
		let line = createElementNS("path", ["fill", "none"], ["stroke-width", 1], ["stroke-opacity", .7], ["stroke", color]);
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
		span.insertAdjacentHTML('beforeend', "<br>Отображать в: ");
		let select_step = createElement("select", ["disabled", true]);
		for(let i = 0; i < arr_grid_step.length; i++){
			let op = createElement("option");
				op.insertAdjacentText('beforeend', arr_grid_step[i].t);
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
				for(let i = w_grid; i < arr_c_grid.length - w_grid; i++){
					if(i % w_grid !== 0){
						if(!flag_l){
							let c = intersection(arr_c_grid[i - 1][0], arr_c_grid[i - 1][1], arr_c_grid[i][0], arr_c_grid[i][1], offset, height_map);
							if(c !== 0){
								out_t("l", f_format_t_b(arr_c_y[i / w_grid | 0], false, select_step.selectedIndex), c);
								flag_l = true;
							}
						}
						if(!flag_r){
							let c = intersection(arr_c_grid[i - 1][0], arr_c_grid[i - 1][1], arr_c_grid[i][0], arr_c_grid[i][1], width_map - offset, height_map);
							if(c !== 0){
								out_t("r", f_format_t_b(arr_c_y[i / w_grid | 0], false, select_step.selectedIndex), c);
								flag_r = true;
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
								let c = intersection(arr_c_grid[j][1], arr_c_grid[j][0], arr_c_grid[j - w_grid][1], arr_c_grid[j - w_grid][0], offset, width_map);
								if(c !== 0){
									out_t("t", f_format_t_b(arr_c_x[i], true, select_step.selectedIndex), c);
									flag_t = true;
								}
							}
							if(!flag_b){
								let c = intersection(arr_c_grid[j][1], arr_c_grid[j][0], arr_c_grid[j - w_grid][1], arr_c_grid[j - w_grid][0], height_map - offset, width_map);
								if(c !== 0){
									out_t("b", f_format_t_b(arr_c_x[i], true, select_step.selectedIndex), c);
									flag_b = true;
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
				f_grid(interval, coor_top_left, coor_bot_right, sc[select_cs.selectedIndex - 1]);
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
	
	
	
	
}




































