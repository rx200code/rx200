function Manager_tracks(){
	let menu = document.getElementById("content_tracks");// Меню Менеджара треков.
	// Информация о загрузки
	let b_i_load = document.getElementById("info_load");
	b_i_load.style.display = "none";
	let i_load_s = document.getElementById("info_load_sing");
	let file_out_b = createElement("span", ["class", "info_out_b"]);
	let file_out_t = createElement("span", ["class", "info_out_t"]);
	let file_out = createElement("span");
	file_out.append(file_out_b);
	file_out.append(file_out_t);
	b_i_load.onclick = () => {
		document.body.append(file_out);
	};
	let flag_m_i = true;
	file_out.onmousedown = e => {
		flag_m_i = e.target.className !== "";
	};
	file_out_t.onscroll = () => {
		flag_m_i = false;
	};
	file_out.onmouseup = e => {
		if(flag_m_i && e.target.className !== "")document.body.removeChild(file_out);
	};
	let f_error_out = (f_n, t, flag = true) => {
		if(flag)i_load_s.style.color = "#ff5050";
		file_out_t.insertAdjacentHTML('beforeend', "<br><b>"+f_n+":</b><span style='color:"+(flag ? "#ff5050": "green")+";'> "+t+"</span>");
	};
	// Загрузка треков.
	let count_l = 0;
	let count_l_tr = 0;
	let end_l;// Функция отслеживает конец загрузки.
	let parser_gpx;// Основная функция парсера.
	let input_file_gpx = createElement("input", ["type", "file"], ["multiple", ""]);
	let reg_gpx_format = /\.gpx$/i;
	input_file_gpx.onchange = () => {
		count_l = 0;
		b_i_load.style.display = "inline";
		i_load_s.style.color = "#0a0";
		file_out_t.innerHTML = "<center>Файлы</center><br>";
		for(let i = 0; i < input_file_gpx.files.length; i++){
			// Проверка по фориату(gpx) имени файла.
			if(!reg_gpx_format.test(input_file_gpx.files[i].name)){
				f_error_out(input_file_gpx.files[i].name, "формат файла не gpx.");
				end_l();
				continue;
			}
			let reader = new FileReader();
			reader.onload = () => {
				parser_gpx(input_file_gpx.files[i], reader.result);
			};
			reader.readAsText(input_file_gpx.files[i]);
		}
	};
	
	let b_load = document.getElementById("tr_load");
	b_load.onclick = () => {
		input_file_gpx.click();
	};
	// ОТОБРАЖЕНИЕ ТРЕКОВ.
	let tr_sort = document.getElementById("tr_sort");// Определяет сортировку треков в списке.
	let svg = document.getElementById("svg");// слой для рисования SVG.
	//track_list
	let tr_list = document.getElementById("tr_list");// Контейнер для списка треков.
	let tr_date = new Date();// Для работы с датами.
	let arr_pre_tr = [];// предварительный массив загрузки треков.
	let arr_tr = [];// Массив треков.
	let tr_obj = null;;// Для временного копирования ссылки на объект трека.
	// Функция сортировки.
	tr_sort.onchange = () => {
		//tr_sort.selectedIndex;
		
		if(tr_sort.selectedIndex === 1)arr_tr.sort((a, b) => a.dop.n.localeCompare(b.dop.n));// По имени.
		else if(tr_sort.selectedIndex === 2)arr_tr.sort((a, b) => b.dop.n.localeCompare(a.dop.n));// По имени.
		else if(tr_sort.selectedIndex === 3){// По точкам.
			arr_tr.sort((obj_a, obj_b) => {
				let a = 0;
				let b = 0;
				if(obj_a.wpts !== undefined)a += obj_a.wpts.length;
				if(obj_b.wpts !== undefined)b += obj_b.wpts.length;
				
				
				if(obj_a.rtes !== undefined)for(let i = 0; i < obj_a.rtes.length; i++)if(obj_a.rtes[i].rtepts !== undefined)a += obj_a.rtes[i].rtepts.length;
				if(obj_b.rtes !== undefined)for(let i = 0; i < obj_b.rtes.length; i++)if(obj_b.rtes[i].rtepts !== undefined)b += obj_b.rtes[i].rtepts.length;
				
				if(obj_a.trks !== undefined)for(let i = 0; i < obj_a.trks.length; i++)if(obj_a.trks[i].trksegs !== undefined)for(let j = 0; j < obj_a.trks[i].trksegs.length; j++)if(obj_a.trks[i].trksegs[j].trkpts !== undefined)a += obj_a.trks[i].trksegs[j].trkpts.length;
				if(obj_b.trks !== undefined)for(let i = 0; i < obj_b.trks.length; i++)if(obj_b.trks[i].trksegs !== undefined)for(let j = 0; j < obj_b.trks[i].trksegs.length; j++)if(obj_b.trks[i].trksegs[j].trkpts !== undefined)b += obj_b.trks[i].trksegs[j].trkpts.length;
				
				
				
				return b - a;
			});
		}else if(tr_sort.selectedIndex === 4){// По точкам.
			arr_tr.sort((obj_a, obj_b) => {
				let a = 0;
				let b = 0;
				if(obj_a.wpts !== undefined)a += obj_a.wpts.length;
				if(obj_b.wpts !== undefined)b += obj_b.wpts.length;
				
				
				if(obj_a.rtes !== undefined)for(let i = 0; i < obj_a.rtes.length; i++)if(obj_a.rtes[i].rtepts !== undefined)a += obj_a.rtes[i].rtepts.length;
				if(obj_b.rtes !== undefined)for(let i = 0; i < obj_b.rtes.length; i++)if(obj_b.rtes[i].rtepts !== undefined)b += obj_b.rtes[i].rtepts.length;
				
				if(obj_a.trks !== undefined)for(let i = 0; i < obj_a.trks.length; i++)if(obj_a.trks[i].trksegs !== undefined)for(let j = 0; j < obj_a.trks[i].trksegs.length; j++)if(obj_a.trks[i].trksegs[j].trkpts !== undefined)a += obj_a.trks[i].trksegs[j].trkpts.length;
				if(obj_b.trks !== undefined)for(let i = 0; i < obj_b.trks.length; i++)if(obj_b.trks[i].trksegs !== undefined)for(let j = 0; j < obj_b.trks[i].trksegs.length; j++)if(obj_b.trks[i].trksegs[j].trkpts !== undefined)b += obj_b.trks[i].trksegs[j].trkpts.length;
				
				
				
				return a - b;
			});
		}else if(tr_sort.selectedIndex === 5){// По дате.
			arr_tr.sort((obj_a, obj_b) => {
				let a = date_new.getTime();
				let b = a;
				
				if(obj_a.gpx.metadata !== undefined && obj_a.gpx.metadata.time !== undefined)a = obj_a.gpx.metadata.time;
				else if(obj_a.dop.d !== undefined)a = obj_a.dop.d.getTime();
				
				if(obj_b.gpx.metadata !== undefined && obj_b.gpx.metadata.time !== undefined)b = obj_b.gpx.metadata.time;
				else if(obj_b.dop.d !== undefined)b = obj_b.dop.d.getTime();
				
				return b - a;
			});
		}else if(tr_sort.selectedIndex === 6){// По дате.
			arr_tr.sort((obj_a, obj_b) => {
				let a = date_new.getTime();
				let b = a;
				
				if(obj_a.gpx.metadata !== undefined && obj_a.gpx.metadata.time !== undefined)a = obj_a.gpx.metadata.time;
				else if(obj_a.dop.d !== undefined)a = obj_a.dop.d.getTime();
				
				if(obj_b.gpx.metadata !== undefined && obj_b.gpx.metadata.time !== undefined)b = obj_b.gpx.metadata.time;
				else if(obj_b.dop.d !== undefined)b = obj_b.dop.d.getTime();
				
				return a - b;
			});
		}else if(tr_sort.selectedIndex === 7){// По цвету.
			arr_tr.sort((obj_a, obj_b) => {
				let n = parseInt(obj_a.dop._c.slice(1), 16);
				let a = .2126 * (n >> 16) + .7152 * ((n >> 8) & 255) + .0722 * (n & 255);
				n = parseInt(obj_b.dop._c.slice(1), 16);
				let b = .2126 * (n >> 16) + .7152 * ((n >> 8) & 255) + .0722 * (n & 255);
				return b - a;
			});
		}else if(tr_sort.selectedIndex === 8){// По цвету.
			arr_tr.sort((obj_a, obj_b) => {
				let n = parseInt(obj_a.dop._c.slice(1), 16);
				let a = .2126 * (n >> 16) + .7152 * ((n >> 8) & 255) + .0722 * (n & 255);
				n = parseInt(obj_b.dop._c.slice(1), 16);
				let b = .2126 * (n >> 16) + .7152 * ((n >> 8) & 255) + .0722 * (n & 255);
				return a - b;
			});
		}else if(tr_sort.selectedIndex === 9){// выделенное.
			arr_tr.sort((obj_a, obj_b) => {
				if(obj_a.dop.f_foc){
					if(obj_b.dop.f_foc)return 0;
					else return -1;
				}else if(obj_b.dop.f_foc)return 1;
				else return 0;
			});
		}else if(tr_sort.selectedIndex === 10){// выделенное.
			arr_tr.sort((obj_a, obj_b) => {
				if(obj_a.dop.f_foc){
					if(obj_b.dop.f_foc)return 0;
					else return 1;
				}else if(obj_b.dop.f_foc)return -1;
				else return 0;
			});
		}
		
		
		while(tr_list.firstChild)tr_list.removeChild(tr_list.firstChild);
		for(let i = 0; i < arr_tr.length; i++)tr_list.appendChild(arr_tr[i].menu);
	};
	// Функция проверки есть ли выделенные.
	let f_is_foc = () => {
		for(let i = 0; i < arr_tr.length; i++)if(arr_tr[i].dop.f_foc)return true;
		return false;
	};
	// Функция отображения трека.
	let f_tr_view = obj => {
		let path = "";
		if(obj.dop.f_p && obj.wpts_WM !== undefined){
			for(let i = 0; i < obj.wpts_WM.length; i++){
				let c = map.map.getPixelFromCoordinate(obj.wpts_WM[i]);
				path += "M"+c[0]+","+c[1]+"h0";
			}
		}
		obj.svg.p.setAttributeNS(null, "d", path);
		path = "";
		if(obj.dop.f_r && obj.rtes !== undefined){
			for(let i = 0; i < obj.rtes.length; i++)if(obj.rtes[i].rtepts_WM !== undefined)for(let j = 0; j < obj.rtes[i].rtepts_WM.length; j++){
				let c = map.map.getPixelFromCoordinate(obj.rtes[i].rtepts_WM[j]);
				path += (j === 0 ? "M": "L")+c[0]+","+c[1];
			}
		}
		obj.svg.r.setAttributeNS(null, "d", path);
		path = "";
		if(obj.dop.f_t && obj.trks !== undefined){
			for(let i = 0; i < obj.trks.length; i++)if(obj.trks[i].trksegs !== undefined)for(let j = 0; j < obj.trks[i].trksegs.length; j++)if(obj.trks[i].trksegs[j].trkpts_WM !== undefined)for(let k = 0; k < obj.trks[i].trksegs[j].trkpts_WM.length; k++){
				let c = map.map.getPixelFromCoordinate(obj.trks[i].trksegs[j].trkpts_WM[k]);
				path += (k === 0 ? "M": "L")+c[0]+","+c[1];
			}
		}
		obj.svg.t.setAttributeNS(null, "d", path);
	};
	
	this.f_move = (coor_top_left, coor_bot_right) => {
		// TEST
		//document.getElementById("test_out").textContent = JSON.stringify(obj);
		
		//let path = "";
		for(let i = 0; i < arr_tr.length; i++){
			f_tr_view(arr_tr[i]);
			/*// TEST
			let test = arr_tr[i].trks[0].trksegs[0].trkpts_WM;
			for(let j = 0; j < test.length; j++){
				if(test[j][0] > coor_top_left[0] && test[j][0] < coor_bot_right[0] && test[j][1] < coor_top_left[1] && test[j][1] > coor_bot_right[1]){
					
					let c = map.map.getPixelFromCoordinate(test[j]);
					path += "M"+c[0]+","+c[1]+"h0"
				}
			}
			//*/
			/*
			if(arr_tr[i].wpts_WM === undefined)continue;
			for(let j = 0; j < arr_tr[i].wpts_WM.length; j++){
				if(arr_tr[i].wpts_WM[j][0] > coor_top_left[0] && arr_tr[i].wpts_WM[j][0] < coor_bot_right[0] && arr_tr[i].wpts_WM[j][1] < coor_top_left[1] && arr_tr[i].wpts_WM[j][1] > coor_bot_right[1]){
					
					let c = map.map.getPixelFromCoordinate(arr_tr[i].wpts_WM[j]);
					path += "M"+c[0]+","+c[1]+"h0"
				}
			}
			
			//*/
		}
		//document.getElementById("test_out").textContent = path;
		//p_point.setAttributeNS(null, "d", path);
	};
	// Ввод треков.
	let f_save_track = obj => {// Сохранение трек из списка.
		
		alert("save "+obj.dop.n);
	};
	
	
	// Функции чеков отображения
	let check_all = flag => {// Функция проверки всех.
		let p = true;
		let r = true;
		let t = true;
		let foc;
		if(flag === undefined)flag = f_is_foc();
		else if(!flag && f_is_foc())return;
		if(flag){
			for(let i = 0; i < arr_tr.length; i++)if(arr_tr[i].dop.f_foc && !arr_tr[i].dop.f_p){
				p = false;
				break;
			}
			for(let i = 0; i < arr_tr.length; i++)if(arr_tr[i].dop.f_foc && !arr_tr[i].dop.f_r){
				r = false;
				break;
			}
			for(let i = 0; i < arr_tr.length; i++)if(arr_tr[i].dop.f_foc && !arr_tr[i].dop.f_t){
				t = false;
				break;
			}
		}else{
			for(let i = 0; i < arr_tr.length; i++)if(!arr_tr[i].dop.f_p){
				p = false;
				break;
			}
			for(let i = 0; i < arr_tr.length; i++)if(!arr_tr[i].dop.f_r){
				r = false;
				break;
			}
			for(let i = 0; i < arr_tr.length; i++)if(!arr_tr[i].dop.f_t){
				t = false;
				break;
			}
		}
		tr_all.p.checked = p;
		tr_all.r.checked = r;
		tr_all.t.checked = t;
		tr_all.a.checked = p && r && t;
	};
	
	let tr_check = obj => {// Чек на треке.
		obj.dop.f_a = obj.dop.f_p && obj.dop.f_r && obj.dop.f_t;
		f_tr_view(obj);
	};
	let tr_check_2 = obj => {// Чек на треке.
		tr_check(obj);
		check_all(obj.dop.f_foc);
	};
	let tr_check_all = obj => {// Чек на треке.
		obj.dop.f_p = obj.dop.f_r = obj.dop.f_t = obj.dop.f_a;
		f_tr_view(obj);
	};
	let tr_all = {};
	
	tr_all.a = document.getElementById("tr_all_a");
	tr_all.p = document.getElementById("tr_all_p");
	tr_all.r = document.getElementById("tr_all_r");
	tr_all.t = document.getElementById("tr_all_t");
	tr_all.n = document.getElementById("tr_all_n");
	
	
	tr_all.a.onchange = () => {
		tr_all.p.checked = tr_all.r.checked = tr_all.t.checked = tr_all.a.checked;
		if(f_is_foc()){
			for(let i = 0; i < arr_tr.length; i++)if(arr_tr[i].dop.f_foc &&  arr_tr[i].dop.f_a !== tr_all.a.checked){
				arr_tr[i].dop.f_a = tr_all.a.checked;
				tr_check_all(arr_tr[i]);
			}
		}else for(let i = 0; i < arr_tr.length; i++)if(arr_tr[i].dop.f_a !== tr_all.a.checked){
			arr_tr[i].dop.f_a = tr_all.a.checked;
			tr_check_all(arr_tr[i]);
		}
	};
	let f_tr_all = (n) => {
		tr_all.a.checked = tr_all.p.checked && tr_all.r.checked && tr_all.t.checked;
		let checked = tr_all[n].checked;
		let n_f = 'f_'+n;
		
		if(f_is_foc()){
			for(let i = 0; i < arr_tr.length; i++)if(arr_tr[i].dop.f_foc &&  arr_tr[i].dop[n_f] !== checked){
				arr_tr[i].dop[n_f] = checked;
				tr_check(arr_tr[i]);
			}
		}else for(let i = 0; i < arr_tr.length; i++)if(arr_tr[i].dop[n_f] !== checked){
			arr_tr[i].dop[n_f] = checked;
			tr_check(arr_tr[i]);
		}
	};
	tr_all.p.onchange = () => {f_tr_all("p");};
	tr_all.r.onchange = () => {f_tr_all("r");};
	tr_all.t.onchange = () => {f_tr_all("t");};
	
	// Функции удаления треков.
	let tr_del = document.getElementById("tr_del");// Удаление всех треков, или выделенных если есть.
	let f_del_tr = obj => {
		obj.svg.p.remove();
		obj.svg.r.remove();
		obj.svg.t.remove();
		tr_list.removeChild(obj.menu);
		arr_tr.splice(arr_tr.indexOf(obj), 1);
	};
	tr_del.onclick = () => {// Удаление всех треков, или выделенных если есть.
		if(arr_tr.length === 0)return;
		if(f_is_foc()){
			if(confirm("Удалить из списка треков: выделенные треки?"))for(let i = arr_tr.length - 1; i >= 0; i--)if(arr_tr[i].dop.f_foc)f_del_tr(arr_tr[i]);
		}else{
			if(confirm("Удалить все треки из списка треков?"))for(let i = arr_tr.length - 1; i >= 0; i--)f_del_tr(arr_tr[i]);
		}
	};
	let f_del_track = obj => {// Удаляет трек из списка.
		if(confirm("Удалить из списка треков: "+obj.dop.n))f_del_tr(obj);
	};
	// Функции центрирования.
	let tr_max_min_c = obj => {// Определяет максимальные и минимальные координаты.
		let c_max_min;// [[Нижний левый], [Верхний правый]] WM [[min], [max]]
		if(obj.wpts_WM !== undefined){
			for(let i = 0; i < obj.wpts_WM.length; i++){
				if(c_max_min === undefined)c_max_min = [[obj.wpts_WM[i][0], obj.wpts_WM[i][1]], [obj.wpts_WM[i][0], obj.wpts_WM[i][1]]];
				else{
					if(obj.wpts_WM[i][0] < c_max_min[0][0])c_max_min[0][0] = obj.wpts_WM[i][0];
					else if(obj.wpts_WM[i][0] > c_max_min[1][0])c_max_min[1][0] = obj.wpts_WM[i][0];
					if(obj.wpts_WM[i][1] < c_max_min[0][1])c_max_min[0][1] = obj.wpts_WM[i][1];
					else if(obj.wpts_WM[i][1] > c_max_min[1][1])c_max_min[1][1] = obj.wpts_WM[i][1];
				}
			}
		}
		if(obj.rtes !== undefined){
			for(let i = 0; i < obj.rtes.length; i++)if(obj.rtes[i].rtepts_WM !== undefined)for(let j = 0; j < obj.rtes[i].rtepts_WM.length; j++){
				if(c_max_min === undefined)c_max_min = [[obj.rtes[i].rtepts_WM[j][0], obj.rtes[i].rtepts_WM[j][1]], [obj.rtes[i].rtepts_WM[j][0], obj.rtes[i].rtepts_WM[j][1]]];
				else{
					if(obj.rtes[i].rtepts_WM[j][0] < c_max_min[0][0])c_max_min[0][0] = obj.rtes[i].rtepts_WM[j][0];
					else if(obj.rtes[i].rtepts_WM[j][0] > c_max_min[1][0])c_max_min[1][0] = obj.rtes[i].rtepts_WM[j][0];
					if(obj.rtes[i].rtepts_WM[j][1] < c_max_min[0][1])c_max_min[0][1] = obj.rtes[i].rtepts_WM[j][1];
					else if(obj.rtes[i].rtepts_WM[j][1] > c_max_min[1][1])c_max_min[1][1] = obj.rtes[i].rtepts_WM[j][1];
				}
			}
		}
		if(obj.trks !== undefined){
			for(let i = 0; i < obj.trks.length; i++)if(obj.trks[i].trksegs !== undefined)for(let j = 0; j < obj.trks[i].trksegs.length; j++)if(obj.trks[i].trksegs[j].trkpts_WM !== undefined)for(let k = 0; k < obj.trks[i].trksegs[j].trkpts_WM.length; k++){
				if(c_max_min === undefined)c_max_min = [[obj.trks[i].trksegs[j].trkpts_WM[k][0], obj.trks[i].trksegs[j].trkpts_WM[k][1]], [obj.trks[i].trksegs[j].trkpts_WM[k][0], obj.trks[i].trksegs[j].trkpts_WM[k][1]]];
				else{
					if(obj.trks[i].trksegs[j].trkpts_WM[k][0] < c_max_min[0][0])c_max_min[0][0] = obj.trks[i].trksegs[j].trkpts_WM[k][0];
					else if(obj.trks[i].trksegs[j].trkpts_WM[k][0] > c_max_min[1][0])c_max_min[1][0] = obj.trks[i].trksegs[j].trkpts_WM[k][0];
					if(obj.trks[i].trksegs[j].trkpts_WM[k][1] < c_max_min[0][1])c_max_min[0][1] = obj.trks[i].trksegs[j].trkpts_WM[k][1];
					else if(obj.trks[i].trksegs[j].trkpts_WM[k][1] > c_max_min[1][1])c_max_min[1][1] = obj.trks[i].trksegs[j].trkpts_WM[k][1];
				}
			}
		}
		return c_max_min;
	};
	let tr_center = obj => {
		if(obj.dop.bounds !== undefined)map.view.setCenter([(obj.dop.bounds[0][0] + obj.dop.bounds[1][0]) / 2, (obj.dop.bounds[0][1] + obj.dop.bounds[1][1]) / 2]);
	};
	let tr_all_c = document.getElementById("tr_all_c");// Переместится к центру всех треков, или выделенных.
	tr_all_c.onclick = () => {
		let c_max_min;
		if(f_is_foc()){
			for(let i = 0; i < arr_tr.length; i++)if(arr_tr[i].dop.f_foc && arr_tr[i].dop.bounds !== undefined){
				if(c_max_min === undefined)c_max_min = [[arr_tr[i].dop.bounds[0][0], arr_tr[i].dop.bounds[0][1]], [arr_tr[i].dop.bounds[1][0], arr_tr[i].dop.bounds[1][1]]];
				else{
					if(c_max_min[0][0] > arr_tr[i].dop.bounds[0][0])c_max_min[0][0] = arr_tr[i].dop.bounds[0][0];
					if(c_max_min[0][1] > arr_tr[i].dop.bounds[0][1])c_max_min[0][1] = arr_tr[i].dop.bounds[0][1];
					if(c_max_min[1][0] < arr_tr[i].dop.bounds[1][0])c_max_min[1][0] = arr_tr[i].dop.bounds[1][0];
					if(c_max_min[1][1] < arr_tr[i].dop.bounds[1][1])c_max_min[1][1] = arr_tr[i].dop.bounds[1][1];
				}
			}
		}else for(let i = 0; i < arr_tr.length; i++)if(arr_tr[i].dop.bounds !== undefined){
			if(c_max_min === undefined)c_max_min = [[arr_tr[i].dop.bounds[0][0], arr_tr[i].dop.bounds[0][1]], [arr_tr[i].dop.bounds[1][0], arr_tr[i].dop.bounds[1][1]]];
			else{
				if(c_max_min[0][0] > arr_tr[i].dop.bounds[0][0])c_max_min[0][0] = arr_tr[i].dop.bounds[0][0];
				if(c_max_min[0][1] > arr_tr[i].dop.bounds[0][1])c_max_min[0][1] = arr_tr[i].dop.bounds[0][1];
				if(c_max_min[1][0] < arr_tr[i].dop.bounds[1][0])c_max_min[1][0] = arr_tr[i].dop.bounds[1][0];
				if(c_max_min[1][1] < arr_tr[i].dop.bounds[1][1])c_max_min[1][1] = arr_tr[i].dop.bounds[1][1];
			}
		}
		if(c_max_min !== undefined)map.view.setCenter([(c_max_min[0][0] + c_max_min[1][0]) / 2, (c_max_min[0][1] + c_max_min[1][1]) / 2]);
	};
	
	
	
	// вывод информации о треке.
	
	
	
	let info_track_b = createElement("span", ["class", "info_out_b"]);//, ["style", "width:: "+document.documentElement.clientWidth+"px; height:"+document.documentElement.clientHeight+"px;"]);
	let info_track_t = createElement("span", ["class", "info_out_t"]);
	let info_track_n = createElement("center");
	info_track_t.append(info_track_n);
	let info_track = createElement("span");
	info_track.append(info_track_b);
	info_track.append(info_track_t);
	
	info_track_b.onmouseup = e => {
		document.body.removeChild(info_track);
	};
	
	
	
	let f_info_track = obj => {// Выводит информацию о треке.
		info_track_n.textContent = obj.dop.n;
		
		
		let n = 0;
		if(obj.wpts !== undefined)n += obj.wpts.length;
		if(obj.rtes !== undefined)for(let i = 0; i < obj.rtes.length; i++)if(obj.rtes[i].rtepts !== undefined)n += obj.rtes[i].rtepts.length;
		if(obj.trks !== undefined)for(let i = 0; i < obj.trks.length; i++)if(obj.trks[i].trksegs !== undefined)for(let j = 0; j < obj.trks[i].trksegs.length; j++)if(obj.trks[i].trksegs[j].trkpts !== undefined)n += obj.trks[i].trksegs[j].trkpts.length;
		
		info_track_t.textContent = "";
		info_track_t.insertAdjacentHTML('beforeend', "<br>"+n);
		
		let d = "dale: ";
		info_track_t.insertAdjacentHTML('beforeend', "<br>"+d);
		if(obj.dop.d !== undefined)d = "f "+obj.dop.d.toISOString();
		info_track_t.insertAdjacentHTML('beforeend', "<br>"+d);
		if(obj.gpx.metadata !== undefined && obj.gpx.metadata.time !== undefined){
			tr_date.setTime(obj.gpx.metadata.time);
			d = " t "+tr_date.toISOString();
		}else d = "";
		info_track_t.insertAdjacentHTML('beforeend', "<br>"+d);
		
		document.body.append(info_track);
		
	};
	// Функции цвета.
	let input_color = document.getElementById("tr_color");// Выбирает цвет цвет.
	let all_color = document.getElementById("all_color");// Установка цвета для всех или для выделенных.
	input_color.oninput = () => {// oninput // onchange
		if(tr_obj === null){
			if(f_is_foc()){
				for(let i = 0; i < arr_tr.length; i++)if(arr_tr[i].dop.f_foc)arr_tr[i].dop.c = input_color.value;
			}else for(let i = 0; i < arr_tr.length; i++)arr_tr[i].dop.c = input_color.value;
		}else tr_obj.dop.c = input_color.value;
	};
	let f_tr_colof = (obj) => {// Установка цвета для трека.
		tr_obj = obj;
		input_color.value = obj.dop.c;
		input_color.focus();
		input_color.click();
	};
	all_color.onclick = () => {
		tr_obj = null;
		//input_color.value = "#000000";
		input_color.focus();
		input_color.click();
	};
	// Функции выделения элементов.
	let f_foc = obj => {// Выделить элемент.
		obj.dop.f_foc = !obj.dop.f_foc;
		if(obj.dop.f_foc){
			obj.menu.style.backgroundColor = "#eff";
			obj.svg.p.setAttributeNS(null, "stroke-width", 7);
			obj.svg.r.setAttributeNS(null, "stroke-width", 4);
			obj.svg.t.setAttributeNS(null, "stroke-width", 4);
		}else{
			obj.menu.style.backgroundColor = "#ffe";
			obj.svg.p.setAttributeNS(null, "stroke-width", 5);
			obj.svg.r.setAttributeNS(null, "stroke-width", 2);
			obj.svg.t.setAttributeNS(null, "stroke-width", 2);
		}
	};
	let tr_id_s = -1;// Ид стартового выделения.
	let f_foc_e = obj => {// Выделить конец.
		if(tr_id_s < 0)return;
		let tr_id_e = arr_tr.indexOf(obj);
		if(tr_id_e < 0)return;
		if(tr_id_s > tr_id_e){
			tr_id_s ^= tr_id_e;
			tr_id_e ^= tr_id_s;
			tr_id_s ^= tr_id_e;
		}
		let flag = true;
		for(let i = tr_id_s; i <= tr_id_e; i++)if(!arr_tr[i].dop.f_foc){
			flag = false;
			f_foc(arr_tr[i]);
		}
		if(flag)for(let i = tr_id_s; i <= tr_id_e; i++)f_foc(arr_tr[i]);
		tr_id_s = -1;
		check_all();
	};
	let conv_foc = document.getElementById("conv_foc");// Конвертировать выделенные элементы.
	conv_foc.onclick = () => {
		for(let i = 0; i < arr_tr.length; i++)f_foc(arr_tr[i]);
		check_all();
	};
	let all_foc = document.getElementById("all_foc");// Выделить все элементы.
	all_foc.onclick = () => {
		let flag = true;
		for(let i = 0; i < arr_tr.length; i++)if(!arr_tr[i].dop.f_foc){
			flag = false;
			f_foc(arr_tr[i]);
		}
		if(flag)conv_foc.onclick();
		check_all();
	};
	// Функции создания элементов трека после загрузки.
	end_l = () => {// Функция добавляет треки, в соответствии с правилом сортировки, в конце загрузки всех файлов.
		count_l++;
		if(count_l >= input_file_gpx.files.length){
			count_l = 0;
			f_error_out("Итог", "Загружено "+count_l_tr+" из "+input_file_gpx.files.length, count_l_tr !== input_file_gpx.files.length);
			count_l_tr = 0;
			tr_sort.onchange();
		}
	};
	let f_track_enter = (obj) => {// Функция создания элементов трека.
		// Создаем контейнер.
		obj.menu = createElement("div", ["class", "track"]);
		// Создаем случайный цвет треку.
		obj.dop._c = '#'+(0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1,6);
		// Создаем элементы SVG
		obj.svg = {};
		
		obj.svg.p = createElementNS("path", ["fill", "none"], ["stroke-width", 5], ["stroke-opacity", 1], ["stroke", obj.dop._c], ["stroke-linecap", "round"]);
		svg.appendChild(obj.svg.p);
		
		obj.svg.r = createElementNS("path", ["fill", "none"], ["stroke-width", 2], ["stroke-opacity", 1], ["stroke", obj.dop._c], ["stroke-dasharray", "4"]);
		svg.appendChild(obj.svg.r);
		
		obj.svg.t = createElementNS("path", ["fill", "none"], ["stroke-width", 2], ["stroke-opacity", 1], ["stroke", obj.dop._c]);
		svg.appendChild(obj.svg.t);
		
		
		// Создаем информацию о рамке.
		obj.dop.bounds = tr_max_min_c(obj);
		// Создаем флаги
		obj.dop.f_foc = false;
		//obj.dop.f_a = true;
		//obj.dop.f_p = true;
		//obj.dop.f_r = true;
		//obj.dop.f_t = true;
		obj.dop.f_n = false;
		
		obj.menu.onmousedown = e => {// Выделяет треки.
			if(e.target.className === "track")tr_id_s = arr_tr.indexOf(obj);
			e.preventDefault();
		};
		obj.menu.onmouseup = e => {// Выделяет треки.
			if(e.target.className === "track")f_foc_e(obj);
			e.preventDefault();
		};
		
		// Имя файла.
		obj.menu.textContent = obj.dop.n.slice(0, -4).slice(0, 30);
		
		
		// Кнопка удалить.
		let b_del = createElement("span", ["class", "b_tr_s"]);
		b_del.textContent = "❌";
		b_del.onclick = () => f_del_track(obj);
		obj.menu.append(b_del);
		// Кнопка сохранения.
		let b_save = createElement("span", ["class", "b_tr_s"]);
		b_save.textContent = "💾";
		b_save.onclick = () => f_save_track(obj);
		obj.menu.append(b_save);
		// Кнопка информации.
		let b_info = createElement("span", ["class", "b_tr_s"]);
		b_info.textContent = "📝";
		b_info.onclick = () => f_info_track(obj);
		obj.menu.append(b_info);
		// Кнопка центрирования на карте.
		let b_sing = createElement("span", ["class", "b_2"]);
		b_sing.textContent = "●";
		b_sing.onclick = () => tr_center(obj);
		obj.menu.append(b_sing);
		// Кнопка цвета.
		let b_color = createElement("span", ["class", "b_2"], ["style", "background-color:"+obj.dop._c+"; margin-right: 2px;"]);
		b_color.innerHTML = " &nbsp;";
		b_color.onclick = () => {f_tr_colof(obj);};
		Object.defineProperty(obj.dop, 'c', {get(){return this._c}, set(c){
			this._c = c;
			b_color.style.backgroundColor = c;
			obj.svg.p.setAttributeNS(null, "stroke", c);
			obj.svg.r.setAttributeNS(null, "stroke", c);
			obj.svg.t.setAttributeNS(null, "stroke", c);
		}});
		obj.menu.append(b_color);
		
		//
		obj.menu.insertAdjacentHTML('beforeend', "<br>");
		let input_a_view = createElement("input", ["type", "checkbox"], ["checked", true]);
		
		Object.defineProperty(obj.dop, 'f_a', {get(){return input_a_view.checked}, set(b){input_a_view.checked = b;}});
		input_a_view.onchange = () => {
			tr_check_all(obj);
			check_all(obj.dop.f_foc);
		};
		
		obj.menu.append(input_a_view);
		//
		obj.menu.insertAdjacentHTML('beforeend', " p");
		let input_p_view = createElement("input", ["type", "checkbox"], ["checked", true]);
		
		Object.defineProperty(obj.dop, 'f_p', {get(){return input_p_view.checked}, set(b){input_p_view.checked = b;}});
		input_p_view.onchange = () => tr_check_2(obj);
		
		obj.menu.append(input_p_view);
		//
		obj.menu.insertAdjacentHTML('beforeend', " r");
		let input_r_view = createElement("input", ["type", "checkbox"], ["checked", true]);
		
		Object.defineProperty(obj.dop, 'f_r', {get(){return input_r_view.checked}, set(b){input_r_view.checked = b;}});
		input_r_view.onchange = () => tr_check_2(obj);
		
		obj.menu.append(input_r_view);
		//
		obj.menu.insertAdjacentHTML('beforeend', " t");
		let input_t_view = createElement("input", ["type", "checkbox"], ["checked", true]);
		
		Object.defineProperty(obj.dop, 'f_t', {get(){return input_t_view.checked}, set(b){input_t_view.checked = b;}});
		input_t_view.onchange = () => tr_check_2(obj);
		
		obj.menu.append(input_t_view);
		//
		obj.menu.insertAdjacentHTML('beforeend', " n");
		let input_n_view = createElement("input", ["type", "checkbox"]);
		obj.menu.append(input_n_view);
		
		
		
		
		
		if(arr_tr.length === 0){// При загрузке первого трека
			tr_all_p.checked = tr_all_r.checked = tr_all_t.checked = tr_all_a.checked = true;// устанавливаем чеки.
			tr_all_n.checked = false;
			tr_center(obj);// перемещаемся к треку.
		}
		arr_tr.push(obj);
		f_tr_view(obj);
		count_l_tr++;
		end_l();
		
	};
	// TEST
	this.f_track_test = (obj) => {
		arr_tr.push(obj);
	};
	
	
	
	// ФУНКЦИИ ДЛЯ РАЗБОРА GPX.
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
					let time = Date.parse(elm.children[i].textContent);
					if(Number.isNaN(time))f_error_out(name_f, "Элементом time в metadata не содержит преобразуемую дату "+metadata_a);
					else obj.time = time;
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
					let time = Date.parse(elm.children[i].textContent);
					if(Number.isNaN(time))f_error_out(name_f, "Элементом time в wpt не содержит преобразуемую дату "+wpt_a);
					else obj.time = time;
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
	
	let r_declaration = /^\s*(<\?xml[^\?]*\?>)/i;
	// Парсер gpx. по элементам DOM.
	parser_gpx = (file, t) => {
		let obj = {};// Объект трека, в котором все данные трека, и который будет добавлен в массив треков.
		obj.dop = {// данные трека не относящиеся напрямую к самому треку.
			//d:null,// Знаков после запятой, при сохранении будет обрезать координаты, если не undefined
			n:file.name,// Имя файла.
			s:file.size,// Размер файла.
			d:new Date(file.lastModified)// Дата последнего изменения файла.
		};
		// Заполняем декларацию xml.
		let result = r_declaration.exec(t);
		if(result !== null){
			let arr = /version\s*=\s*('|")(.*?)\1/ims.exec(result[1]);
			if(arr !== null)obj.dop.v = arr[2];
			arr = /encoding\s*=\s*('|")(.*?)\1/ims.exec(result[1]);
			if(arr !== null)obj.dop.en = arr[2];
			arr = /standalone\s*=\s*('|")(.*?)\1/ims.exec(result[1]);
			if(arr !== null)obj.dop.st = arr[2];
		}else f_error_out(file.name, " Отсутствует декларация(пролог) xml");
		
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
			end_l();
			return;
		}else{
			f_error_out(file.name, "не верный корневой элемент. "+tag_gpx.tagName);
			end_l();
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
		f_track_enter(obj);// Передаем трек для отображения его.
	};
};