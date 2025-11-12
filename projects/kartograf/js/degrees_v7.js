function Degrees(){
	let svg = document.getElementById("svg");// слой для рисования.
	let menu = document.getElementById("menu_degrees");// Все настройки меню разметки и сеток.
	let degrees_text = createElementNS("g");// Контейнер для вывода текста.
	let scale_text = 1;// Коэфицент масштаба текста.
	let size_t = 18 * scale_text;// Размер текста.
	let bot_y = height_map - 30 * scale_text;// Вертикальный отступ с низу для текста в углах.
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
			let degrees = Math.round(n);
			text += (degrees < 10 ? "0"+degrees: degrees)+"°";
			let minutes = Math.round(n * 60) % 60;
			text += (minutes < 10 ? "0"+minutes: minutes)+"'";
			let seconds = Math.round(n * 3600) % 60;
			text += (seconds < 10 ? "0"+seconds: seconds)+'"';
		}else if(format_d_t == 9)text += n < 10 ? "0"+n.toFixed(5)+"°": n.toFixed(5)+"°";
		else if(format_d_t == 10)text += Math.round(n * 60)+"°";
		else if(format_d_t == 11)text += Math.round(n * 60 * 60)+"°";
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
		//let coor_top_left = ol.proj.toLonLat(map.map.getCoordinateFromPixel([0,0]));
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
	};
	let out_text_z = c => c[3] ? "z:"+sc[sys_c_ind].f_z(c[2])+" S": "z:"+sc[sys_c_ind].f_z(c[2])+" N";
	let f_out_angles_text = () => {
		// Переводим координаты в нужную систему/проекцию координат
		let c_top_left_out = sc[sys_c_ind].f_to(coor_top_left);
		let c_top_right_out = sc[sys_c_ind].f_to(coor_top_right);
		let c_bot_left_out = sc[sys_c_ind].f_to(coor_bot_left);
		let c_bot_right_out = sc[sys_c_ind].f_to(coor_bot_right);
		// Переводим в нужный формат и отображаем координаты.
		//let z = c_top_left_out.length > 2;// Истина если массив длинее чем две координаты, что значит что он содержит третьим значением зону
		let z = sc[sys_c_ind].hasOwnProperty('f_z');// Истина если есть функция зоны.
		top_left_text_F.textContent = f_number_in_format_d(c_top_left_out[1], false)+(z ? " "+out_text_z(c_top_left_out): "");
		top_left_text_L.textContent = f_number_in_format_d(c_top_left_out[0], true);
		top_right_text_F.textContent = (z ? out_text_z(c_top_right_out): "")+f_number_in_format_d(c_top_right_out[1], false);
		top_right_text_L.textContent = f_number_in_format_d(c_top_right_out[0], true);
		bot_left_text_F.textContent = f_number_in_format_d(c_bot_left_out[1], false)+(z ? " "+out_text_z(c_bot_left_out): "");
		bot_left_text_L.textContent = f_number_in_format_d(c_bot_left_out[0], true);
		bot_right_text_F.textContent = (z ? out_text_z(c_bot_right_out): "")+ f_number_in_format_d(c_bot_right_out[1], false);
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
		let coor = [0, 0];
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
				let c_WM = f_from(coor.concat(z_s));
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
	let f_auto_step = [() => {f_auto_step_id(0);}, () => {f_auto_step_id(1);}];
	
	
	
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
			f_auto_step[id]();
			if(document.getElementById("draw_grid_"+id).checked){
				map.view.on('change:resolution', f_auto_step[id]);
				draw_grid(id);
			}else map.view.un('change:resolution', f_auto_step[id]);
		}else{
			f_step_options(id);
			grid_step[id].disabled = false;
			if(document.getElementById("draw_grid_"+id).checked){
				map.view.un('change:resolution', f_auto_step[id]);
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
	
	
	
	
	
	
	
	
	
	
	
	
	/// Test
	//document.getElementById("test_out_deg").innerHTML = text;
	
	// Функции тестовые.
	function xy_to_lf(arr){// Примерно на 20% быстрее чем в OpenLayers ol.proj.toLonLat(arr);
		let y = (arr[0]/6378137) / Math.PI * 180;
		y %= 360;
		if(y < 0)y += 360;
		return [y, (Math.PI / 2 - 2 * Math.atan(Math.pow(Math.E, -arr[1] / 6378137))) / Math.PI * 180];
	}
	
	
	
	
	
	
	//TEST
	/// Вариант 1 черный
	let v1_line = createElementNS("path");
	v1_line.setAttributeNS(null, "fill", "none");
	v1_line.setAttributeNS(null, "stroke", "#000");
	v1_line.setAttributeNS(null, "stroke-width", 1);
	degrees_text.appendChild(v1_line);
	
	this.rect_grid = createElementNS("path");
	this.rect_grid.setAttributeNS(null, "fill", "none");
	this.rect_grid.setAttributeNS(null, "stroke", "#000");
	this.rect_grid.setAttributeNS(null, "stroke-width", 5);
	this.rect_grid.setAttributeNS(null, "stroke-linecap", "round");
	this.rect_grid.setAttributeNS(null, "pointer-events", "none");
	degrees_text.appendChild(this.rect_grid);
	this.rect_grid2 = createElementNS("path");
	this.rect_grid2.setAttributeNS(null, "fill", "none");
	this.rect_grid2.setAttributeNS(null, "stroke", "#0f0");
	this.rect_grid2.setAttributeNS(null, "stroke-width", 3);
	this.rect_grid2.setAttributeNS(null, "stroke-linecap", "round");
	this.rect_grid2.setAttributeNS(null, "pointer-events", "none");
	degrees_text.appendChild(this.rect_grid2);
	this.rect_grid3 = createElementNS("path");
	this.rect_grid3.setAttributeNS(null, "fill", "none");
	this.rect_grid3.setAttributeNS(null, "stroke", "#f00");
	this.rect_grid3.setAttributeNS(null, "stroke-width", 1);
	this.rect_grid3.setAttributeNS(null, "stroke-linecap", "round");
	this.rect_grid3.setAttributeNS(null, "pointer-events", "none");
	degrees_text.appendChild(this.rect_grid3);
	
	/// Данные геодов.
	this.geode = {
		krasovsky:{a:6378245, f:298.3, year:1942},// ск 42 и ск 95
		grs_80:{a:6378137, f:298.257222101, year:1980},
		wgs_84:{a:6378137, f:298.257223563, year:1984},
		pz_90_11:{a:6378136, f:298.25784, year:1990},// Также ПЗ-90 и ПЗ-90.2
		iers:{a:6378136.49, f:298.25645, year:1996},
		gsk_2011:{a:6378136.5, f:298.2564151, year:2011}
	};
	/// Методы и данные смены системы координат. Построенные на основе гостов ГОСТ Р 51794-2001, 2008. ГОСТ 32453-2013, 2017
	this.data_systems_cor = {
		wgs84_sk42:{
			d_x:23.92,
			d_y:-141.27,
			d_z:-80.9,
			w_x:0,
			w_y:0,
			w_z:0,
			m:0,
			a:(this.geode.wgs_84.a + this.geode.krasovsky.a) / 2,
			d_a:this.geode.krasovsky.a - this.geode.wgs_84.a,//Возможно надо поменять местами.
			e:(1 / this.geode.krasovsky.f * (2 - 1 / this.geode.krasovsky.f) + 1 / this.geode.wgs_84.f * (2 - 1 / this.geode.wgs_84.f)) / 2,// в госте ГОСТ 32453-2013 ошибка вместо сложения вычитание.(стр.7)
			d_e:1 / this.geode.krasovsky.f * (2 - 1 / this.geode.krasovsky.f) - 1 / this.geode.wgs_84.f * (2 - 1 / this.geode.wgs_84.f)
		},
		wgs84_pz_90_11:{
			d_x:-0.013,
			d_y:0.106,
			d_z:0.022,
			w_x:-0.0023,
			w_y:0.00354,
			w_z:-0.00421,
			m:(-0.008 * Math.pow(10, -6)),
			a:(this.geode.wgs_84.a + this.geode.pz_90_11.a) / 2,
			d_a:this.geode.pz_90_11.a - this.geode.wgs_84.a,//Возможно надо поменять местами.
			e:(1 / this.geode.pz_90_11.f * (2 - 1 / this.geode.pz_90_11.f) + 1 / this.geode.wgs_84.f * (2 - 1 / this.geode.wgs_84.f)) / 2,// в госте ГОСТ 32453-2013 ошибка вместо сложения вычитание.(стр.7)
			d_e:1 / this.geode.pz_90_11.f * (2 - 1 / this.geode.pz_90_11.f) - 1 / this.geode.wgs_84.f * (2 - 1 / this.geode.wgs_84.f)
		},
		sk42_pz_90_11:{
			d_x:-0.013,
			d_y:0.106,
			d_z:0.022,
			w_x:-0.0023,
			w_y:0.00354,
			w_z:-0.00421,
			m:(-0.008 * Math.pow(10, -6)),
			a:(this.geode.krasovsky.a + this.geode.pz_90_11.a) / 2,
			d_a:this.geode.pz_90_11.a - this.geode.krasovsky.a,//Возможно надо поменять местами.
			e:(1 / this.geode.pz_90_11.f * (2 - 1 / this.geode.pz_90_11.f) + 1 / this.geode.krasovsky.f * (2 - 1 / this.geode.krasovsky.f)) / 2,// в госте ГОСТ 32453-2013 ошибка вместо сложения вычитание.(стр.7)
			d_e:1 / this.geode.pz_90_11.f * (2 - 1 / this.geode.pz_90_11.f) - 1 / this.geode.krasovsky.f * (2 - 1 / this.geode.krasovsky.f)
		}
	};
	// Методы.
	this.translation_cor = function(cor, sys_name = "wgs84_sk42", invert = 1){
		let _L = cor.lng * Math.PI / 180;
		let _B = cor.lat * Math.PI / 180;
		let _H = 0;
		let _M = this.data_systems_cor[sys_name].a * (1 - this.data_systems_cor[sys_name].e) * Math.pow((1 - this.data_systems_cor[sys_name].e * Math.pow(Math.sin(_B), 2)), -3 / 2);
		let _N = this.data_systems_cor[sys_name].a * Math.pow((1 - this.data_systems_cor[sys_name].e * Math.pow(Math.sin(_B), 2)), -1 / 2);
		let _P = (180 / Math.PI) * 60 * 60;
		// Оптимизированный для wgs84_sk42
		let d_B = _P / (_M + _H) * (_N / this.data_systems_cor[sys_name].a * this.data_systems_cor[sys_name].e * Math.sin(_B) * Math.cos(_B) * this.data_systems_cor[sys_name].d_a + ((Math.pow(_N, 2) / Math.pow(this.data_systems_cor[sys_name].a, 2)) + 1) * _N * Math.sin(_B) * Math.cos(_B) * (this.data_systems_cor[sys_name].d_e / 2) - (this.data_systems_cor[sys_name].d_x * Math.cos(_L) + this.data_systems_cor[sys_name].d_y * Math.sin(_L)) * Math.sin(_B) + this.data_systems_cor[sys_name].d_z * Math.cos(_B));
		let d_L = (_P / (_N *  Math.cos(_B))) * (-this.data_systems_cor[sys_name].d_x * Math.sin(_L) + this.data_systems_cor[sys_name].d_y * Math.cos(_L));
		return {lng:cor.lng + d_L / 3600 * invert, lat:cor.lat + d_B / 3600 * invert};
	};
	this.wgs84_in_krasovsky = function(cor){
		return this.translation_cor(cor, "wgs84_sk42", 1);
	};
	this.krasovsky_in_wgs84 = function(cor){
		return this.translation_cor(cor, "wgs84_sk42", -1);
	};
	this.flag_center_zone = false;
	this.krasovsky_in_gauss_kruger = function(cor, n){
		let B = cor.lat * Math.PI / 180;
		let L = cor.lng;// * Math.PI / 180;
		let H = 0;
		if(n === undefined){
			if(this.flag_center_zone)n = ((6 + L) / 6) - .5;// Если вместо | 0; будет - .5 то будет зону считать относительно центра, в результате более ровно сетка будет смотреть на север.
			else n = ((6 + L) / 6) | 0;
		}
		//let I = (L - (3 + 6 * (n - 1))) / 57.29577951;
		let I = (L - (3 + 6 * (n - 1))) / 57.29577951;
		let I2 = Math.pow(Math.sin(I), 2);
		let y = 6367558.4968 * B -  Math.sin(2 * B) * (16002.89 + 66.9607 * Math.pow(Math.sin(B), 2) + 0.3515 * Math.pow(Math.sin(B), 4) -
			I2 * (1594561.25 + 5336.535 * Math.pow(Math.sin(B), 2) + 26.790 * Math.pow(Math.sin(B), 4) + 0.149 * Math.pow(Math.sin(B), 6) +
			I2 * (672483.4 - 811219.9 * Math.pow(Math.sin(B), 2) + 5420 * Math.pow(Math.sin(B), 4) - 10.6 * Math.pow(Math.sin(B), 6) +
			I2 * (278194 - 830174 * Math.pow(Math.sin(B), 2) + 572434 * Math.pow(Math.sin(B), 4) - 16010 * Math.pow(Math.sin(B), 6) +
			I2 * (109500 - 574700 * Math.pow(Math.sin(B), 2) + 863700 * Math.pow(Math.sin(B), 4) - 398600 * Math.pow(Math.sin(B), 6))))));
		let x = (5 + 10 * n) * Math.pow(10, 5) + I * Math.cos(B) * (6378245 + 21346.1415 * Math.pow(Math.sin(B), 2) + 107.159 * Math.pow(Math.sin(B), 4) + 0.5977 * Math.pow(Math.sin(B), 6) +
			I2 * (1070204.16 - 2136826.66 * Math.pow(Math.sin(B), 2) + 17.98 * Math.pow(Math.sin(B), 4) - 11.99 * Math.pow(Math.sin(B), 6) +
			I2 * (270806 - 1523417 * Math.pow(Math.sin(B), 2) + 1327645 * Math.pow(Math.sin(B), 4) - 21701 * Math.pow(Math.sin(B), 6) +
			I2 * (79690 - 866190 * Math.pow(Math.sin(B), 2) + 1730360 * Math.pow(Math.sin(B), 4) - 945460 * Math.pow(Math.sin(B), 6)))));
		return {x,y,n};
	}.bind(this);
	this.gauss_kruger_in_krasovsky = function(cor, n){//{x,y} или {x,y,n}
		if(n === undefined)n = (cor.x * Math.pow(10, -6)) | 0;//Похоже cor.n
		let _b = cor.y / 6367558.4968;
		let B_0 = _b + Math.sin(2 * _b) * (0.00252588685 - 0.0000149186 * Math.pow(Math.sin(_b), 2) + 0.00000011904 * Math.pow(Math.sin(_b), 4));
		let z0 = (cor.x - (10 * n + 5) * Math.pow(10, 5)) / (6378245 * Math.cos(B_0));
		let d_B = -Math.pow(z0, 2) * Math.sin(2 * B_0) * (0.251684631 - 0.003369263 * Math.pow(Math.sin(B_0), 2) + 0.000011276/* в госте 32453-2017 0.00001127*/ * Math.pow(Math.sin(B_0), 4) -
			Math.pow(z0, 2) * (0.10500614 - 0.04559916 * Math.pow(Math.sin(B_0), 2) + 0.00228901 * Math.pow(Math.sin(B_0), 4) - 0.00002987 * Math.pow(Math.sin(B_0), 6) -
			Math.pow(z0, 2) * (0.042858 - 0.025318 * Math.pow(Math.sin(B_0), 2) + 0.014346 * Math.pow(Math.sin(B_0), 4) - 0.001264 * Math.pow(Math.sin(B_0), 6) -
			Math.pow(z0, 2) * (0.01672 - 0.0063 * Math.pow(Math.sin(B_0), 2) + 0.01188 * Math.pow(Math.sin(B_0), 4) - 0.00328 * Math.pow(Math.sin(B_0), 6)))));
		let I = z0 * (1 - 0.0033467108 * Math.pow(Math.sin(B_0), 2) - 0.0000056002 * Math.pow(Math.sin(B_0), 4) - 0.0000000187 * Math.pow(Math.sin(B_0), 6) -
			Math.pow(z0, 2) * (0.16778975 + 0.16273586 * Math.pow(Math.sin(B_0), 2) - 0.0005249 * Math.pow(Math.sin(B_0), 4) - 0.00000846 * Math.pow(Math.sin(B_0), 6) -
			Math.pow(z0, 2) * (0.0420025 + 0.1487407 * Math.pow(Math.sin(B_0), 2) + 0.005942 * Math.pow(Math.sin(B_0), 4) - 0.000015 * Math.pow(Math.sin(B_0), 6) -
			Math.pow(z0, 2) * (0.01225 + 0.09477 * Math.pow(Math.sin(B_0), 2) + 0.03282 * Math.pow(Math.sin(B_0), 4) - 0.00034 * Math.pow(Math.sin(B_0), 6) -
			Math.pow(z0, 2) * (0.0038 + 0.0524 * Math.pow(Math.sin(B_0), 2) + 0.0482 * Math.pow(Math.sin(B_0), 4) +/* в гостах 51794-2001 51794-2008 32453-2013 тут + а в госте 32453-2017 минус -*/ 0.0032 * Math.pow(Math.sin(B_0), 6))))));
		let lng = 6 * (n - 0.5) / 57.29577951 + I;
		let lat = B_0 + d_B;
		return {lng:lng * 180 / Math.PI, lat:lat * 180 / Math.PI, n:n};
	};
	this.wgs84_in_gauss_kruger = function(cor, n){
		return this.krasovsky_in_gauss_kruger(this.wgs84_in_krasovsky(cor), n);
	};
	this.gauss_kruger_in_wgs84 = function(cor, n){
		let cor_n = this.gauss_kruger_in_krasovsky(cor, n);
		let cor_lat_lng = this.krasovsky_in_wgs84(cor_n);
		cor_lat_lng.n = cor_n.n;
		return cor_lat_lng;
	};
	/// Рисуем сетку.
	this.step_grid_size = 1000;
	// Смещение введенное пользователем.
	this.value_offset_x = 0;
	this.value_offset_y = 0;
	// Объект заполняемый точками сетки. В случае скачевания или вывода их на карту.
	this.points_grid = {
		update_flag:false,//Если установлен точки будут заполнены или обновлены.
		add_flag:false,
		count_info:0,
		count:0,
		info:[{
			zone:0,
			center_x:0,
			center_y:0,
			angle:0,
			offset_x:0,
			offset_y:0,
			count:0,
			count_x:0,
			count_y:0,
			offset_id:0
		}],
		points:[]
	};
	
	
	
	
	
	
	
	
	
	this.cor_bottom_right = {lat:0, lng:0};
	this.cor_top_left = {lat:0, lng:0};
	this.cor_center = {lat:0, lng:0};
	this.draw_a_rect_grid = function(){
		let coor_top_left = ol.proj.toLonLat(map.map.getCoordinateFromPixel([0,0]));
		let coor_bot_right = ol.proj.toLonLat(map.map.getCoordinateFromPixel([width_map,height_map]));
		
		this.cor_top_left.lng = coor_top_left[0];
		this.cor_top_left.lat = coor_top_left[1];
		this.cor_bottom_right.lng = coor_bot_right[0];
		this.cor_bottom_right.lat = coor_bot_right[1];
		this.cor_center.lng = (this.cor_bottom_right.lng + this.cor_top_left.lng) / 2;
		this.cor_center.lat = (this.cor_top_left.lat + this.cor_bottom_right.lat) / 2;
		
		// Если сетка уходит в отрицательные координаты(lng < 3 ), тоесть в зону 0 и ниже, то перемещаем в положительные на 360 градусов, строим и возвращаем назид.
		let flag_360 = false;
		let offset_360 = 360;
		if(this.cor_top_left.lng < 3){
			flag_360 = true;
			offset_360 = ((((this.cor_top_left.lng - 3) / 360) | 0) - 1) * -360;
			this.cor_bottom_right.lng += offset_360;
			this.cor_top_left.lng += offset_360;
			this.cor_center.lng += offset_360;
		}
		// Находим зону в центре. И координаты Гаусса-Крюгера центра. Если координаты закреплены с зоной то устанавливаем их.
		let view_n = this.wgs84_in_gauss_kruger(this.cor_center);
		
		// Находим центральные оси x и y относительно сетки, по которым и будем считать интервал в проекции Гаусса-Крюгера.
		let xy_center_left = this.wgs84_in_gauss_kruger({lat:this.cor_center.lat, lng:this.cor_top_left.lng}, view_n.n);
		let xy_center_right = this.wgs84_in_gauss_kruger({lat:this.cor_center.lat, lng:this.cor_bottom_right.lng}, view_n.n);
		let xy_top_center = this.wgs84_in_gauss_kruger({lat:this.cor_top_left.lat, lng:this.cor_center.lng}, view_n.n);
		let xy_bottom_center = this.wgs84_in_gauss_kruger({lat:this.cor_bottom_right.lat, lng:this.cor_center.lng}, view_n.n);
		
		let interval_x = xy_center_right.x - xy_center_left.x;
		let interval_y = xy_top_center.y - xy_bottom_center.y;
		// Вычисляем смещение, начала сетки так, что бы, сетка начиналась со значения кратнму шагу.
		let offset_x = this.step_grid_size - xy_center_left.x % this.step_grid_size;
		let offset_y = this.step_grid_size - xy_bottom_center.y % this.step_grid_size;
		// Создаем угол.
		// Определяем угол наклона сетки Гаусса Крюгера в центре.
		let a_pos = this.gauss_kruger_in_wgs84(view_n, view_n.n);
		let b_pos = this.gauss_kruger_in_wgs84({x:view_n.x, y:view_n.y + interval_y / 2}, view_n.n);
		if(flag_360){
			a_pos.lng -= offset_360;
			b_pos.lng -= offset_360;
		}
		let a_point_obj = map.map.getPixelFromCoordinate(ol.proj.fromLonLat([a_pos.lng, a_pos.lat]));
		let b_point_obj = map.map.getPixelFromCoordinate(ol.proj.fromLonLat([b_pos.lng, b_pos.lat]));
		let a_point = {x:a_point_obj[0], y:a_point_obj[1]};
		let b_point = {x:b_point_obj[0], y:b_point_obj[1]};
		
		//Рисуем ось наклона сетки, без коррекции на краях зон.
		//let d_path = "M"+(a_point.x - this.x_left_rect_bord)+","+(a_point.y - this.y_top_rect_bord)+"L"+(b_point.x - this.x_left_rect_bord)+","+(b_point.y - this.y_top_rect_bord);
		// или рисуем точку в центре сетки.
		let d_path = "M"+(a_point.x)+","+(a_point.y)+"h0";
		
		// Переменные для циклов построения сетки.
		let line_v = "";
		let line_h_arr = [];
		let i = 0;
		let count = 0;
		while(offset_x < interval_x){
			let x = xy_center_left.x + offset_x;
			let offset_y_i = offset_y;
			i = 0;
			while(offset_y_i < interval_y){
				let y = xy_bottom_center.y + offset_y_i;
				let xp = x;
				let yp = y;
				/*
				// Вычисляем наклон каждой точки относительно центра.
				let x_dop = x - view_n.x;
				let y_dop = y - view_n.y;
				let a = 0;
				if(x_dop == 0) a = (y_dop > 0) ? 0 : Math.PI;
				else{
					a = Math.atan(y_dop / x_dop);
					if(x_dop < 0)a += Math.PI;
				}
				let r = Math.sqrt(Math.pow(x - view_n.x, 2) + Math.pow(y - view_n.y, 2));
				// Добавляем к наклону каждой точки заданный угол и определяем координаты.
				xp = (view_n.x + r * Math.cos(a + angle_rad));
				yp = (view_n.y + r * Math.sin(a + angle_rad));
				//*/
				// переводим координаты в wgs84
				let cor_lat_lng = this.gauss_kruger_in_wgs84({x:xp, y:yp}, view_n.n);
				if(flag_360)cor_lat_lng.lng -= offset_360;
				
				let cor_xy_obj = map.map.getPixelFromCoordinate(ol.proj.fromLonLat([cor_lat_lng.lng, cor_lat_lng.lat]));
				let cor_xy = {x:cor_xy_obj[0], y:cor_xy_obj[1]};
				
				let cor_x = cor_xy.x;
				let cor_y = cor_xy.y;
				line_v += i == 0 ? "M"+cor_x+","+cor_y: "L"+cor_x+","+cor_y;
				if(offset_x < this.step_grid_size){
					line_h_arr[i] = "M"+cor_x+","+cor_y;
				}else line_h_arr[i] += "L"+cor_x+","+cor_y;
				offset_y_i += this.step_grid_size;
				i++;
			}
			offset_x += this.step_grid_size;
			count += i;
		}
		if(flag_360){
			this.cor_bottom_right.lng -= offset_360;
			this.cor_top_left.lng -= offset_360;
			this.cor_center.lng -= offset_360;
		}
		
		
		this.rect_grid.setAttributeNS(null, "d", d_path);
		v1_line.setAttributeNS(null, "d", line_v+line_h_arr.join(''));
		
	}.bind(this);
	
	/// Вариант 3 красный
	let v3_line = createElementNS("path");
	v3_line.setAttributeNS(null, "fill", "none");
	v3_line.setAttributeNS(null, "stroke", "#f00");
	v3_line.setAttributeNS(null, "stroke-width", 1);
	degrees_text.appendChild(v3_line);
	
	this.gauss_kruger_in_wgs84_3 = function(cor, n){
		let cor_2 = this.gauss_kruger_in_wgs84(cor, n);
		//let F = f_deg_B_in_F(cor_2.lat);
		//cor_2.lat = F;
		return cor_2;
	};
	this.wgs84_in_gauss_kruger_3 = function(cor, n){
		let B = f_deg_F_in_B(cor.lat);
		cor.lat = B;
		return this.wgs84_in_gauss_kruger(cor, n);
	};
	this.draw_a_rect_grid_3 = function(){
		let coor_top_left = ol.proj.toLonLat(map.map.getCoordinateFromPixel([0,0]));
		let coor_bot_right = ol.proj.toLonLat(map.map.getCoordinateFromPixel([width_map,height_map]));
		
		this.cor_top_left.lng = coor_top_left[0];
		this.cor_top_left.lat = coor_top_left[1];
		this.cor_bottom_right.lng = coor_bot_right[0];
		this.cor_bottom_right.lat = coor_bot_right[1];
		this.cor_center.lng = (this.cor_bottom_right.lng + this.cor_top_left.lng) / 2;
		this.cor_center.lat = (this.cor_top_left.lat + this.cor_bottom_right.lat) / 2;
		
		// Если сетка уходит в отрицательные координаты(lng < 3 ), тоесть в зону 0 и ниже, то перемещаем в положительные на 360 градусов, строим и возвращаем назид.
		let flag_360 = false;
		let offset_360 = 360;
		if(this.cor_top_left.lng < 3){
			flag_360 = true;
			offset_360 = ((((this.cor_top_left.lng - 3) / 360) | 0) - 1) * -360;
			this.cor_bottom_right.lng += offset_360;
			this.cor_top_left.lng += offset_360;
			this.cor_center.lng += offset_360;
		}
		// Находим зону в центре. И координаты Гаусса-Крюгера центра. Если координаты закреплены с зоной то устанавливаем их.
		let view_n = this.wgs84_in_gauss_kruger_3(this.cor_center);
		
		// Находим центральные оси x и y относительно сетки, по которым и будем считать интервал в проекции Гаусса-Крюгера.
		let xy_center_left = this.wgs84_in_gauss_kruger_3({lat:this.cor_center.lat, lng:this.cor_top_left.lng}, view_n.n);
		let xy_center_right = this.wgs84_in_gauss_kruger_3({lat:this.cor_center.lat, lng:this.cor_bottom_right.lng}, view_n.n);
		let xy_top_center = this.wgs84_in_gauss_kruger_3({lat:this.cor_top_left.lat, lng:this.cor_center.lng}, view_n.n);
		let xy_bottom_center = this.wgs84_in_gauss_kruger_3({lat:this.cor_bottom_right.lat, lng:this.cor_center.lng}, view_n.n);
		
		let interval_x = xy_center_right.x - xy_center_left.x;
		let interval_y = xy_top_center.y - xy_bottom_center.y;
		// Вычисляем смещение, начала сетки так, что бы, сетка начиналась со значения кратнму шагу.
		let offset_x = this.step_grid_size - xy_center_left.x % this.step_grid_size;
		let offset_y = this.step_grid_size - xy_bottom_center.y % this.step_grid_size;
		// Создаем угол.
		// Определяем угол наклона сетки Гаусса Крюгера в центре.
		let a_pos = this.gauss_kruger_in_wgs84_3(view_n, view_n.n);
		let b_pos = this.gauss_kruger_in_wgs84_3({x:view_n.x, y:view_n.y + interval_y / 2}, view_n.n);
		if(flag_360){
			a_pos.lng -= offset_360;
			b_pos.lng -= offset_360;
		}
		let a_point_obj = map.map.getPixelFromCoordinate(ol.proj.fromLonLat([a_pos.lng, a_pos.lat]));
		let b_point_obj = map.map.getPixelFromCoordinate(ol.proj.fromLonLat([b_pos.lng, b_pos.lat]));
		let a_point = {x:a_point_obj[0], y:a_point_obj[1]};
		let b_point = {x:b_point_obj[0], y:b_point_obj[1]};
		
		//Рисуем ось наклона сетки, без коррекции на краях зон.
		//let d_path = "M"+(a_point.x - this.x_left_rect_bord)+","+(a_point.y - this.y_top_rect_bord)+"L"+(b_point.x - this.x_left_rect_bord)+","+(b_point.y - this.y_top_rect_bord);
		// или рисуем точку в центре сетки.
		let d_path = "M"+(a_point.x)+","+(a_point.y)+"h0";
		
		// Переменные для циклов построения сетки.
		let line_v = "";
		let line_h_arr = [];
		let i = 0;
		let count = 0;
		while(offset_x < interval_x){
			let x = xy_center_left.x + offset_x;
			let offset_y_i = offset_y;
			i = 0;
			while(offset_y_i < interval_y){
				let y = xy_bottom_center.y + offset_y_i;
				let xp = x;
				let yp = y;
				/*
				// Вычисляем наклон каждой точки относительно центра.
				let x_dop = x - view_n.x;
				let y_dop = y - view_n.y;
				let a = 0;
				if(x_dop == 0) a = (y_dop > 0) ? 0 : Math.PI;
				else{
					a = Math.atan(y_dop / x_dop);
					if(x_dop < 0)a += Math.PI;
				}
				let r = Math.sqrt(Math.pow(x - view_n.x, 2) + Math.pow(y - view_n.y, 2));
				// Добавляем к наклону каждой точки заданный угол и определяем координаты.
				xp = (view_n.x + r * Math.cos(a + angle_rad));
				yp = (view_n.y + r * Math.sin(a + angle_rad));
				//*/
				// переводим координаты в wgs84
				let cor_lat_lng = this.gauss_kruger_in_wgs84_3({x:xp, y:yp}, view_n.n);
				if(flag_360)cor_lat_lng.lng -= offset_360;
				
				let cor_xy_obj = map.map.getPixelFromCoordinate(ol.proj.fromLonLat([cor_lat_lng.lng, cor_lat_lng.lat]));
				let cor_xy = {x:cor_xy_obj[0], y:cor_xy_obj[1]};
				
				let cor_x = cor_xy.x;
				let cor_y = cor_xy.y;
				line_v += i == 0 ? "M"+cor_x+","+cor_y: "L"+cor_x+","+cor_y;
				if(offset_x < this.step_grid_size){
					line_h_arr[i] = "M"+cor_x+","+cor_y;
				}else line_h_arr[i] += "L"+cor_x+","+cor_y;
				offset_y_i += this.step_grid_size;
				i++;
			}
			offset_x += this.step_grid_size;
			count += i;
		}
		if(flag_360){
			this.cor_bottom_right.lng -= offset_360;
			this.cor_top_left.lng -= offset_360;
			this.cor_center.lng -= offset_360;
		}
		this.rect_grid3.setAttributeNS(null, "d", d_path);
		v3_line.setAttributeNS(null, "d", line_v+line_h_arr.join(''));
		
	}.bind(this);
	
	
	
	
	
	
	
	
	
	
	/// Вариант 2 зеленый
	let v2_line = createElementNS("path");
	v2_line.setAttributeNS(null, "fill", "none");
	v2_line.setAttributeNS(null, "stroke", "#0f0");
	v2_line.setAttributeNS(null, "stroke-width", 1);
	degrees_text.appendChild(v2_line);
	
	let proj4_WGS_84_4326 = '+proj=longlat +datum=WGS84 +no_defs';
	let proj4_gauss_14 = '+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=14500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs';//Gauss-Kruger zone 14
	//let proj4_gauss_14 = '+proj=utm +zone=44 +datum=WGS84 +units=m +no_defs';// UTM 44
	//proj4(proj_wgs_84, proj_web_mercator, [coor_top_left[0], offset_lat + coor_bot_right[1]])
	
	this.gauss_kruger_in_wgs84_2 = function(cor, n){// n = 14
		let cor_n = proj4(proj4_gauss_14, proj4_WGS_84_4326, [cor.x, cor.y]);
		return {lng:cor_n[0], lat:cor_n[1], n:n};
	};
	this.wgs84_in_gauss_kruger_2 = function(cor, n){// n = 14
		let cor_n = proj4(proj4_WGS_84_4326, proj4_gauss_14, [cor.lng, cor.lat]);
		return {x:cor_n[0], y:cor_n[1], n:14};
	};
	
	
	this.draw_a_rect_grid_2 = function(){
		let coor_top_left = ol.proj.toLonLat(map.map.getCoordinateFromPixel([0,0]));
		let coor_bot_right = ol.proj.toLonLat(map.map.getCoordinateFromPixel([width_map,height_map]));
		
		this.cor_top_left.lng = coor_top_left[0];
		this.cor_top_left.lat = coor_top_left[1];
		this.cor_bottom_right.lng = coor_bot_right[0];
		this.cor_bottom_right.lat = coor_bot_right[1];
		this.cor_center.lng = (this.cor_bottom_right.lng + this.cor_top_left.lng) / 2;
		this.cor_center.lat = (this.cor_top_left.lat + this.cor_bottom_right.lat) / 2;
		
		// Если сетка уходит в отрицательные координаты(lng < 3 ), тоесть в зону 0 и ниже, то перемещаем в положительные на 360 градусов, строим и возвращаем назид.
		let flag_360 = false;
		let offset_360 = 360;
		if(this.cor_top_left.lng < 3){
			flag_360 = true;
			offset_360 = ((((this.cor_top_left.lng - 3) / 360) | 0) - 1) * -360;
			this.cor_bottom_right.lng += offset_360;
			this.cor_top_left.lng += offset_360;
			this.cor_center.lng += offset_360;
		}
		// Находим зону в центре. И координаты Гаусса-Крюгера центра. Если координаты закреплены с зоной то устанавливаем их.
		let view_n = this.wgs84_in_gauss_kruger_2(this.cor_center);
		
		// Находим центральные оси x и y относительно сетки, по которым и будем считать интервал в проекции Гаусса-Крюгера.
		let xy_center_left = this.wgs84_in_gauss_kruger_2({lat:this.cor_center.lat, lng:this.cor_top_left.lng}, view_n.n);
		let xy_center_right = this.wgs84_in_gauss_kruger_2({lat:this.cor_center.lat, lng:this.cor_bottom_right.lng}, view_n.n);
		let xy_top_center = this.wgs84_in_gauss_kruger_2({lat:this.cor_top_left.lat, lng:this.cor_center.lng}, view_n.n);
		let xy_bottom_center = this.wgs84_in_gauss_kruger_2({lat:this.cor_bottom_right.lat, lng:this.cor_center.lng}, view_n.n);
		
		let interval_x = xy_center_right.x - xy_center_left.x;
		let interval_y = xy_top_center.y - xy_bottom_center.y;
		// Вычисляем смещение, начала сетки так, что бы, сетка начиналась со значения кратнму шагу.
		let offset_x = this.step_grid_size - xy_center_left.x % this.step_grid_size;
		let offset_y = this.step_grid_size - xy_bottom_center.y % this.step_grid_size;
		// Создаем угол.
		// Определяем угол наклона сетки Гаусса Крюгера в центре.
		let a_pos = this.gauss_kruger_in_wgs84_2(view_n, view_n.n);
		let b_pos = this.gauss_kruger_in_wgs84_2({x:view_n.x, y:view_n.y + interval_y / 2}, view_n.n);
		if(flag_360){
			a_pos.lng -= offset_360;
			b_pos.lng -= offset_360;
		}
		let a_point_obj = map.map.getPixelFromCoordinate(ol.proj.fromLonLat([a_pos.lng, a_pos.lat]));
		let b_point_obj = map.map.getPixelFromCoordinate(ol.proj.fromLonLat([b_pos.lng, b_pos.lat]));
		let a_point = {x:a_point_obj[0], y:a_point_obj[1]};
		let b_point = {x:b_point_obj[0], y:b_point_obj[1]};
		
		//Рисуем ось наклона сетки, без коррекции на краях зон.
		//let d_path = "M"+(a_point.x - this.x_left_rect_bord)+","+(a_point.y - this.y_top_rect_bord)+"L"+(b_point.x - this.x_left_rect_bord)+","+(b_point.y - this.y_top_rect_bord);
		// или рисуем точку в центре сетки.
		let d_path = "M"+(a_point.x)+","+(a_point.y)+"h0";
		
		// Переменные для циклов построения сетки.
		let line_v = "";
		let line_h_arr = [];
		let i = 0;
		let count = 0;
		while(offset_x < interval_x){
			let x = xy_center_left.x + offset_x;
			let offset_y_i = offset_y;
			i = 0;
			while(offset_y_i < interval_y){
				let y = xy_bottom_center.y + offset_y_i;
				let xp = x;
				let yp = y;
				/*
				// Вычисляем наклон каждой точки относительно центра.
				let x_dop = x - view_n.x;
				let y_dop = y - view_n.y;
				let a = 0;
				if(x_dop == 0) a = (y_dop > 0) ? 0 : Math.PI;
				else{
					a = Math.atan(y_dop / x_dop);
					if(x_dop < 0)a += Math.PI;
				}
				let r = Math.sqrt(Math.pow(x - view_n.x, 2) + Math.pow(y - view_n.y, 2));
				// Добавляем к наклону каждой точки заданный угол и определяем координаты.
				xp = (view_n.x + r * Math.cos(a + angle_rad));
				yp = (view_n.y + r * Math.sin(a + angle_rad));
				//*/
				// переводим координаты в wgs84
				let cor_lat_lng = this.gauss_kruger_in_wgs84_2({x:xp, y:yp}, view_n.n);
				if(flag_360)cor_lat_lng.lng -= offset_360;
				
				let cor_xy_obj = map.map.getPixelFromCoordinate(ol.proj.fromLonLat([cor_lat_lng.lng, cor_lat_lng.lat]));
				let cor_xy = {x:cor_xy_obj[0], y:cor_xy_obj[1]};
				
				let cor_x = cor_xy.x;
				let cor_y = cor_xy.y;
				line_v += i == 0 ? "M"+cor_x+","+cor_y: "L"+cor_x+","+cor_y;
				if(offset_x < this.step_grid_size){
					line_h_arr[i] = "M"+cor_x+","+cor_y;
				}else line_h_arr[i] += "L"+cor_x+","+cor_y;
				offset_y_i += this.step_grid_size;
				i++;
			}
			offset_x += this.step_grid_size;
			count += i;
		}
		if(flag_360){
			this.cor_bottom_right.lng -= offset_360;
			this.cor_top_left.lng -= offset_360;
			this.cor_center.lng -= offset_360;
		}
		
		
		this.rect_grid2.setAttributeNS(null, "d", d_path);
		v2_line.setAttributeNS(null, "d", line_v+line_h_arr.join(''));
		
	}.bind(this);
	
	
	
	
	///Конец вариантов 1 и 2.
	
	let degrees_line = createElementNS("path");
	degrees_line.setAttributeNS(null, "fill", "none");
	degrees_line.setAttributeNS(null, "stroke", "#000");
	//degrees_line.setAttributeNS(null, "stroke-opacity", 1);
	degrees_line.setAttributeNS(null, "stroke-width", .4);
	
	//degrees_line.setAttributeNS(null, "d", "M100,100 h100v100");
	degrees_text.appendChild(degrees_line);
	
	let proj_web_mercator = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs';
	let proj_wgs_84 = '+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=6500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs ';//Gauss-Kruger zone 6
	
	let f_map_change = () => {
		let text = "";
		let coor_top_left = ol.proj.toLonLat(map.map.getCoordinateFromPixel([0,0]));
		let coor_bot_right = ol.proj.toLonLat(map.map.getCoordinateFromPixel([width_map,height_map]));
		
		//1//let coor_top_left = proj4(proj_web_mercator, proj_wgs_84, map.map.getCoordinateFromPixel([0,0]));
		//1//let coor_bot_right = proj4(proj_web_mercator, proj_wgs_84, map.map.getCoordinateFromPixel([width_map,height_map]));
		// временно.
		
		//alert(map.map.getPixelFromCoordinate(ol.proj.fromLonLat([83,55])));
		
		//*
		let step_degree_grid = 1;
		
		//2//let step_degree_grid = 2000;
		
		let d_path = "";
		//*
		let interval_lng = coor_bot_right[0] - coor_top_left[0];
		if(interval_lng < 0.00000000001)interval_lng += 360;
		
		let offset_lng = step_degree_grid - coor_top_left[0] % step_degree_grid;
		if(coor_top_left[0] < 0)offset_lng -= step_degree_grid;
		let cof_lng = width_map / interval_lng;
		while(offset_lng < interval_lng){
			d_path += "M"+(offset_lng * cof_lng)+",0 v"+height_map+" ";
			offset_lng += step_degree_grid;
		}
		
		text += "coor_bot_right[0] = "+coor_bot_right[0]+"<br>";
		text += "coor_top_left[0] = "+coor_top_left[0]+"<br>";
		text += "offset_lng = "+offset_lng+"<br>";
		text += "interval_lng = "+interval_lng+"<br>";
		text += d_path;
		let interval_lat = coor_top_left[1] - coor_bot_right[1];
		let offset_lat = step_degree_grid - coor_bot_right[1] % step_degree_grid;
		if(coor_bot_right[1] < 0)offset_lat -= step_degree_grid;
		let cof_lat = height_map / interval_lat;
		//*
		while(offset_lat < interval_lat){
			d_path += "M0,"+(
				(map.map.getPixelFromCoordinate(ol.proj.fromLonLat([coor_top_left[0], offset_lat + coor_bot_right[1]]))[1])
				//3//(map.map.getPixelFromCoordinate(proj4(proj_wgs_84, proj_web_mercator, [coor_top_left[0], offset_lat + coor_bot_right[1]]))[1])
			)+" h"+width_map+" ";
			offset_lat += step_degree_grid;
		}
		//*/
		degrees_line.setAttributeNS(null, "d", d_path);
		//alert(d_path);
		
		//alert(coor_top_left);
		
		
		let time = 0;
		
		/* Для варианта 1
		text += "<br>Время вариманта 1 = ";
		time = performance.now();
		this.draw_a_rect_grid();
		time = performance.now() - time;
		text += time;
		//*/
		/* Для варианта 2
		text += "<br>Время вариманта 2 = ";
		time = performance.now();
		this.draw_a_rect_grid_2();
		time = performance.now() - time;
		text += time;
		//*/
		/* Для варианта 3
		text += "<br>Время вариманта 3 = ";
		time = performance.now();
		this.draw_a_rect_grid_3();
		time = performance.now() - time;
		text += time;
		//*/
		document.getElementById("test_out").innerHTML = text;
	};
	
	//map.view.on("change:center", f_out_angles);
	//map.map.on("moveend", f_out_angles);
	//map.map.on("pointerdrag", f_out_angles);
	
	
	//map.map.on("postrender", f_map_change);// пока самая надежная
	
	//map.view.on("change", f_map_change);
	//map.map.on("pointerdrag", f_out_angles);
	//*/
	
}




































