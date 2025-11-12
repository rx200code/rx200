function Manager_tracks(){
	let menu = document.getElementById("content_tracks");// Меню Менеджара треков.
	// Слой канвас для отображения текстов.
	//* Вариант canvas на много быстрее SVG
	let canvas = createElement("canvas", ["width", width_map], ["height", height_map], ["style", "position: absolute; top:0px; left:0px; pointer-events: none;"]);
	let ctx = canvas.getContext("2d");
	
	let test_out = document.getElementById("test_out");
	let ctx_c = 0;
	
	/* TEST
	let height_t = 21;
	ctx.font = height_t+"px monospace";
	let width_t_0 = height_t * .6;
	height_t *= .62;
	let height_t_2 = height_t / 2;
	//let width_t = width_t_0 * 4;
	//let width_t_2 = width_t / 2;
	//*/
	
	//
	//ctx.font = "27px monospace";
	//ctx.fillStyle = "#000000ff";
	ctx.textAlign = "center";
	document.body.append(canvas);
	//*/
	/* Test
	let count_t_b = 0;// text_bord(t_b)
	let arr_t_b = [];
	let remove_t = () => {
		for(let i = count_t_b; i < arr_t_b.length; i++){
			if(layer_n.contains(arr_t_b[i]))layer_n.removeChild(arr_t_b[i]);
			else break;
		}
	};
	let remove_t_all = () => {
		count_t_b = 0;
		remove_t();
		if(arr_t_b.length > 1500)arr_t_b.length = 1500;//чтоб не грузить память.
	};
	/* Варимнт SVG
	let layer_n = createElementNS("g");// Временно тут.
	let create_t_n = () => createElementNS("text", ['font-family', "monospace"], ['fill', "#000"], ['font-size', "14px"], ["text-anchor", "middle"], ['font-weight', 900]);// ['filter', 'url(#bord_t_2)'],
	let out_t = (t, c) => {
		let elm;
		if(arr_t_b.length <= count_t_b){
			elm = create_t_n();
			arr_t_b[arr_t_b.length] = elm;
			count_t_b++;
		}else elm = arr_t_b[count_t_b++];
		elm.textContent = t;
		elm.setAttributeNS(null,'x', c[0]);
		elm.setAttributeNS(null,'y', c[1]);
		if(!layer_n.contains(elm))layer_n.appendChild(elm);
	};
	
	document.getElementById("svg").appendChild(layer_n);
	
	let out_n = () => {
		count_t_b = 0;
		for(let i = 0; i < arr_c_g.length; i++){
			out_t("123", arr_c_g[i]);
		}
		remove_t();
	};
	/*
	input_on_n.onchange = () => {// Временно тут.
		if(input_on_n.checked){
			layer.appendChild(layer_n);
			if(input_on.checked)out_n();
		}else if(layer.contains(layer_n))layer.removeChild(layer_n);
	};
	//*/// END Варимнт SVG
	
	
	
	
	
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
	let f_save_track;// Основная функция сохранения.
	let to_gpx_file;// Преобразует обект трека в текст файла gpx
	let obj_ed;// Временная ссылка на объект, 
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
			arr_tr.sort((obj_a, obj_b) => obj_b.dop.qt_p_a - obj_a.dop.qt_p_a);
		}else if(tr_sort.selectedIndex === 4){// По точкам.
			arr_tr.sort((obj_a, obj_b) => obj_a.dop.qt_p_a - obj_b.dop.qt_p_a);
		}else if(tr_sort.selectedIndex === 5){// По дистанции.
			arr_tr.sort((obj_a, obj_b) => obj_b.dop.dist_r + obj_b.dop.dist_t - (obj_a.dop.dist_r + obj_a.dop.dist_t));
		}else if(tr_sort.selectedIndex === 6){// По дистанции.
			arr_tr.sort((obj_a, obj_b) => obj_a.dop.dist_r + obj_a.dop.dist_t - (obj_b.dop.dist_r + obj_b.dop.dist_t));
		}else if(tr_sort.selectedIndex === 7){// По дате.
			arr_tr.sort((obj_a, obj_b) => {
				let a = date_new.getTime();
				let b = a;
				
				if(obj_a.gpx.metadata !== undefined && obj_a.gpx.metadata.time !== undefined)a = obj_a.gpx.metadata.time;
				else if(obj_a.dop.d !== undefined)a = obj_a.dop.d.getTime();
				
				if(obj_b.gpx.metadata !== undefined && obj_b.gpx.metadata.time !== undefined)b = obj_b.gpx.metadata.time;
				else if(obj_b.dop.d !== undefined)b = obj_b.dop.d.getTime();
				
				return b - a;
			});
		}else if(tr_sort.selectedIndex === 8){// По дате.
			arr_tr.sort((obj_a, obj_b) => {
				let a = date_new.getTime();
				let b = a;
				
				if(obj_a.gpx.metadata !== undefined && obj_a.gpx.metadata.time !== undefined)a = obj_a.gpx.metadata.time;
				else if(obj_a.dop.d !== undefined)a = obj_a.dop.d.getTime();
				
				if(obj_b.gpx.metadata !== undefined && obj_b.gpx.metadata.time !== undefined)b = obj_b.gpx.metadata.time;
				else if(obj_b.dop.d !== undefined)b = obj_b.dop.d.getTime();
				
				return a - b;
			});
		}else if(tr_sort.selectedIndex === 9){// По цвету.
			arr_tr.sort((obj_a, obj_b) => {
				let n = parseInt(obj_a.dop._c.slice(1), 16);
				let a = .2126 * (n >> 16) + .7152 * ((n >> 8) & 255) + .0722 * (n & 255);
				n = parseInt(obj_b.dop._c.slice(1), 16);
				let b = .2126 * (n >> 16) + .7152 * ((n >> 8) & 255) + .0722 * (n & 255);
				return b - a;
			});
		}else if(tr_sort.selectedIndex === 10){// По цвету.
			arr_tr.sort((obj_a, obj_b) => {
				let n = parseInt(obj_a.dop._c.slice(1), 16);
				let a = .2126 * (n >> 16) + .7152 * ((n >> 8) & 255) + .0722 * (n & 255);
				n = parseInt(obj_b.dop._c.slice(1), 16);
				let b = .2126 * (n >> 16) + .7152 * ((n >> 8) & 255) + .0722 * (n & 255);
				return a - b;
			});
		}else if(tr_sort.selectedIndex === 11){// выделенное.
			arr_tr.sort((obj_a, obj_b) => {
				if(obj_a.dop.f_foc){
					if(obj_b.dop.f_foc)return 0;
					else return -1;
				}else if(obj_b.dop.f_foc)return 1;
				else return 0;
			});
		}else if(tr_sort.selectedIndex === 12){// выделенное.
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
	// Вспоиогательные переменные координат краев просмотра. мах. мин.
	let c_bot_left, c_top_right;
	// Функции отображения текстов.
	let f_out_txt = () => {
		ctx.clearRect(0, 0, width_map, height_map);
		// определяем ширену символа через метры веб меркатора. TEST
		let height_t_2 = width_map / (c_top_right[0] - c_bot_left[0]);
		/*
		let height_t = (width_map / ((c_top_right[0] - c_bot_left[0]) / 300)) | 0;
		if(height_t < 5)return;
		ctx.font = height_t+"px monospace";
		let width_t_0 = height_t * .6;
		height_t *= .62;
		let height_t_2 = height_t / 2;
		//*/
		
		for(let m = 0; m < arr_tr.length; m++){
			if(!arr_tr[m].dop.f_n || !arr_tr[m].dop.f_n_a)continue;
			//alert(height_t);
			let height_t = height_t_2 * arr_tr[m].dop.t_s | 0;
			//alert(height_t);
			if(height_t < 5)continue;
			else if(height_t > 30)height_t = 30;
			ctx.font = height_t+"px monospace";
			let width_t_0 = height_t * .6;
			height_t *= .62;
			
			
			if(arr_tr[m].dop.f_n_p && arr_tr[m].dop.f_p && arr_tr[m].wpts_WM !== undefined){
				for(let i = 0; i < arr_tr[m].wpts_WM.length; i++){
					if(arr_tr[m].wpts[i].name !== undefined){
						//if(test[0] < c_bot_left[0] || test[1] < c_bot_left[1] || test[0] > c_top_right[0] || test[1] > c_top_right[1])continue;
						if(arr_tr[m].wpts_WM[i][0] < c_bot_left[0] || arr_tr[m].wpts_WM[i][1] < c_bot_left[1] || arr_tr[m].wpts_WM[i][0] > c_top_right[0] || arr_tr[m].wpts_WM[i][1] > c_top_right[1])continue;
						let c = map.map.getPixelFromCoordinate(arr_tr[m].wpts_WM[i]);
						// TEST
						ctx.fillStyle = "#ffffff88";
						let width_t = width_t_0 * arr_tr[m].wpts[i].name.length;
						
						ctx.fillRect(c[0] - width_t / 2, c[1] - height_t, width_t, height_t);
						ctx.fillStyle = "#000000ff";
						//
						ctx.fillText(arr_tr[m].wpts[i].name, c[0], c[1]);
					}
				}
			}
			if(arr_tr[m].dop.f_n_r && arr_tr[m].dop.f_r && arr_tr[m].rtes !== undefined){
				for(let i = 0; i < arr_tr[m].rtes.length; i++)if(arr_tr[m].rtes[i].rtepts_WM !== undefined)for(let j = 0; j < arr_tr[m].rtes[i].rtepts_WM.length; j++){
					if(arr_tr[m].rtes[i].rtepts[j].name !== undefined){
						if(arr_tr[m].rtes[i].rtepts_WM[j][0] < c_bot_left[0] || arr_tr[m].rtes[i].rtepts_WM[j][1] < c_bot_left[1] || arr_tr[m].rtes[i].rtepts_WM[j][0] > c_top_right[0] || arr_tr[m].rtes[i].rtepts_WM[j][1] > c_top_right[1])continue;
						let c = map.map.getPixelFromCoordinate(arr_tr[m].rtes[i].rtepts_WM[j]);
						// TEST
						ctx.fillStyle = "#ffffff88";
						let width_t = width_t_0 * arr_tr[m].rtes[i].rtepts[j].name.length;
						
						ctx.fillRect(c[0] - width_t / 2, c[1] - height_t, width_t, height_t);
						ctx.fillStyle = "#000000ff";
						//
						ctx.fillText(arr_tr[m].rtes[i].rtepts[j].name, c[0], c[1]);
					}
				}
			}
			
			if(arr_tr[m].dop.f_n_t && arr_tr[m].dop.f_t && arr_tr[m].trks !== undefined){
				for(let i = 0; i < arr_tr[m].trks.length; i++)if(arr_tr[m].trks[i].trksegs !== undefined)for(let j = 0; j < arr_tr[m].trks[i].trksegs.length; j++)if(arr_tr[m].trks[i].trksegs[j].trkpts_WM !== undefined)for(let k = 0; k < arr_tr[m].trks[i].trksegs[j].trkpts_WM.length; k++){
					
					if(arr_tr[m].trks[i].trksegs[j].trkpts[k].name !== undefined){
						if(arr_tr[m].trks[i].trksegs[j].trkpts_WM[k][0] < c_bot_left[0] || arr_tr[m].trks[i].trksegs[j].trkpts_WM[k][1] < c_bot_left[1] || arr_tr[m].trks[i].trksegs[j].trkpts_WM[k][0] > c_top_right[0] || arr_tr[m].trks[i].trksegs[j].trkpts_WM[k][1] > c_top_right[1])continue;
						let c = map.map.getPixelFromCoordinate(arr_tr[m].trks[i].trksegs[j].trkpts_WM[k]);
						// TEST
						ctx.fillStyle = "#ffffff88";
						let width_t = width_t_0 * arr_tr[m].trks[i].trksegs[j].trkpts[k].name.length;
						
						ctx.fillRect(c[0] - width_t / 2, c[1] - height_t, width_t, height_t);
						ctx.fillStyle = "#000000ff";
						//
						ctx.fillText(arr_tr[m].trks[i].trksegs[j].trkpts[k].name, c[0], c[1]);
					}
				}
			}
		}
		
	};
	// Функция отображения трека.
	let f_tr_view = obj => {
		let path = "";
		if(obj.dop.f_p && obj.wpts_WM !== undefined){
			for(let i = 0; i < obj.wpts_WM.length; i++){
				if(obj.wpts_WM[i][0] < c_bot_left[0] || obj.wpts_WM[i][1] < c_bot_left[1] || obj.wpts_WM[i][0] > c_top_right[0] || obj.wpts_WM[i][1] > c_top_right[1])continue;
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
	
	this.f_move = (coor_bot_left, coor_top_right) => {
		c_bot_left = coor_bot_left;
		c_top_right = coor_top_right;
		// TEST
		//count_t_b = 0;
		//document.getElementById("test_out").textContent = JSON.stringify(obj);
		//*
		//test_out.textContent = ctx_c;
		//ctx_c = 0;
		//ctx.clearRect(0, 0, width_map, height_map);
		//*/
		
		//let path = "";
		for(let i = 0; i < arr_tr.length; i++){
			// TEST
			//ctx.fillStyle = arr_tr[i].dop.c+"ff";
			// END TEST
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
		f_out_txt();
		// TEST
		//remove_t();
		
		
		//document.getElementById("test_out").textContent = path;
		//p_point.setAttributeNS(null, "d", path);
	};
	
	this.f_load = (ctx, ctx_w, res, coor_top_left, coor_bot_right, coef_t) => {// Функция для прописовки треков при сохранении.
		let c = [];
		for(let t = 0; t < arr_tr.length; t++){
			if(arr_tr[t].dop.f_p && arr_tr[t].wpts_WM !== undefined){
				let r = arr_tr[t].dop.f_foc ? 3.5: 2.5;
				ctx.fillStyle = arr_tr[t].dop._c+"ff";
				for(let i = 0; i < arr_tr[t].wpts_WM.length; i++){
					if(arr_tr[t].wpts_WM[i][0] < coor_top_left[0] || arr_tr[t].wpts_WM[i][1] < coor_bot_right[1] || arr_tr[t].wpts_WM[i][0] > coor_bot_right[0] || arr_tr[t].wpts_WM[i][1] > coor_top_left[1])continue;
					c[0] = (arr_tr[t].wpts_WM[i][0] - coor_top_left[0]) / res;
					c[1] = (coor_top_left[1] - arr_tr[t].wpts_WM[i][1]) / res;
					ctx.beginPath();
					ctx.arc(c[0], c[1], r, 0, rad_360);
					ctx.fill();
				}
			}
			if(arr_tr[t].dop.f_r && arr_tr[t].rtes !== undefined){
				ctx.lineWidth = arr_tr[t].dop.f_foc ? 4: 2;
				ctx.strokeStyle = arr_tr[t].dop._c+"7f";
				ctx.beginPath();
				for(let i = 0; i < arr_tr[t].rtes.length; i++)if(arr_tr[t].rtes[i].rtepts_WM !== undefined)for(let j = 0; j < arr_tr[t].rtes[i].rtepts_WM.length; j++){
					c[0] = (arr_tr[t].rtes[i].rtepts_WM[j][0] - coor_top_left[0]) / res;
					c[1] = (coor_top_left[1] - arr_tr[t].rtes[i].rtepts_WM[j][1]) / res;
					if(j === 0)ctx.moveTo(c[0], c[1]);
					else ctx.lineTo(c[0], c[1]);
				}
				ctx.stroke();
			}
			if(arr_tr[t].dop.f_t && arr_tr[t].trks !== undefined){
				ctx.lineWidth = arr_tr[t].dop.f_foc ? 4: 2;
				ctx.strokeStyle = arr_tr[t].dop._c+"ff";
				ctx.beginPath();
				for(let i = 0; i < arr_tr[t].trks.length; i++)if(arr_tr[t].trks[i].trksegs !== undefined)for(let j = 0; j < arr_tr[t].trks[i].trksegs.length; j++)if(arr_tr[t].trks[i].trksegs[j].trkpts_WM !== undefined)for(let k = 0; k < arr_tr[t].trks[i].trksegs[j].trkpts_WM.length; k++){
					c[0] = (arr_tr[t].trks[i].trksegs[j].trkpts_WM[k][0] - coor_top_left[0]) / res;
					c[1] = (coor_top_left[1] - arr_tr[t].trks[i].trksegs[j].trkpts_WM[k][1]) / res;
					if(k === 0)ctx.moveTo(c[0], c[1]);
					else ctx.lineTo(c[0], c[1]);
				}
				ctx.stroke();
			}
		}
		// Рисуем тексты треков.
		// f_out_txt();
		ctx.textAlign = "center";
		let c_bot_left = [coor_top_left[0], coor_bot_right[1]];
		let c_top_right = [coor_bot_right[0], coor_top_left[1]];
		// определяем ширену символа через метры веб меркатора. TEST
		let height_t_2 = ctx_w / (c_top_right[0] - c_bot_left[0]);
		for(let m = 0; m < arr_tr.length; m++){
			if(!arr_tr[m].dop.f_n || !arr_tr[m].dop.f_n_a)continue;
			let height_t = height_t_2 * arr_tr[m].dop.t_s | 0;
			height_t *= coef_t;
			if(height_t < 5)continue;
			else if(height_t > 30)height_t = 30;
			ctx.font = height_t+"px monospace";
			let width_t_0 = height_t * .6;
			height_t *= .62;
			if(arr_tr[m].dop.f_n_p && arr_tr[m].dop.f_p && arr_tr[m].wpts_WM !== undefined){
				for(let i = 0; i < arr_tr[m].wpts_WM.length; i++){
					if(arr_tr[m].wpts[i].name !== undefined){
						if(arr_tr[m].wpts_WM[i][0] < c_bot_left[0] || arr_tr[m].wpts_WM[i][1] < c_bot_left[1] || arr_tr[m].wpts_WM[i][0] > c_top_right[0] || arr_tr[m].wpts_WM[i][1] > c_top_right[1])continue;
						c[0] = (arr_tr[m].wpts_WM[i][0] - coor_top_left[0]) / res;
						c[1] = (coor_top_left[1] - arr_tr[m].wpts_WM[i][1]) / res;
						ctx.fillStyle = "#ffffff7f";
						let width_t = width_t_0 * arr_tr[m].wpts[i].name.length;
						ctx.fillRect(c[0] - width_t / 2, c[1] - height_t, width_t, height_t);
						ctx.fillStyle = "#000000ff";
						ctx.fillText(arr_tr[m].wpts[i].name, c[0], c[1]);
					}
				}
			}
			if(arr_tr[m].dop.f_n_r && arr_tr[m].dop.f_r && arr_tr[m].rtes !== undefined){
				for(let i = 0; i < arr_tr[m].rtes.length; i++)if(arr_tr[m].rtes[i].rtepts_WM !== undefined)for(let j = 0; j < arr_tr[m].rtes[i].rtepts_WM.length; j++){
					if(arr_tr[m].rtes[i].rtepts[j].name !== undefined){
						if(arr_tr[m].rtes[i].rtepts_WM[j][0] < c_bot_left[0] || arr_tr[m].rtes[i].rtepts_WM[j][1] < c_bot_left[1] || arr_tr[m].rtes[i].rtepts_WM[j][0] > c_top_right[0] || arr_tr[m].rtes[i].rtepts_WM[j][1] > c_top_right[1])continue;
						c[0] = (arr_tr[m].rtes[i].rtepts_WM[j][0] - coor_top_left[0]) / res;
						c[1] = (coor_top_left[1] - arr_tr[m].rtes[i].rtepts_WM[j][1]) / res;
						ctx.fillStyle = "#ffffff7f";
						let width_t = width_t_0 * arr_tr[m].rtes[i].rtepts[j].name.length;
						ctx.fillRect(c[0] - width_t / 2, c[1] - height_t, width_t, height_t);
						ctx.fillStyle = "#000000ff";
						ctx.fillText(arr_tr[m].rtes[i].rtepts[j].name, c[0], c[1]);
					}
				}
			}
			if(arr_tr[m].dop.f_n_t && arr_tr[m].dop.f_t && arr_tr[m].trks !== undefined){
				for(let i = 0; i < arr_tr[m].trks.length; i++)if(arr_tr[m].trks[i].trksegs !== undefined)for(let j = 0; j < arr_tr[m].trks[i].trksegs.length; j++)if(arr_tr[m].trks[i].trksegs[j].trkpts_WM !== undefined)for(let k = 0; k < arr_tr[m].trks[i].trksegs[j].trkpts_WM.length; k++){
					if(arr_tr[m].trks[i].trksegs[j].trkpts[k].name !== undefined){
						if(arr_tr[m].trks[i].trksegs[j].trkpts_WM[k][0] < c_bot_left[0] || arr_tr[m].trks[i].trksegs[j].trkpts_WM[k][1] < c_bot_left[1] || arr_tr[m].trks[i].trksegs[j].trkpts_WM[k][0] > c_top_right[0] || arr_tr[m].trks[i].trksegs[j].trkpts_WM[k][1] > c_top_right[1])continue;
						c[0] = (arr_tr[m].trks[i].trksegs[j].trkpts_WM[k][0] - coor_top_left[0]) / res;
						c[1] = (coor_top_left[1] - arr_tr[m].trks[i].trksegs[j].trkpts_WM[k][1]) / res;
						ctx.fillStyle = "#ffffff7f";
						let width_t = width_t_0 * arr_tr[m].trks[i].trksegs[j].trkpts[k].name.length;
						ctx.fillRect(c[0] - width_t / 2, c[1] - height_t, width_t, height_t);
						ctx.fillStyle = "#000000ff";
						ctx.fillText(arr_tr[m].trks[i].trksegs[j].trkpts[k].name, c[0], c[1]);
					}
				}
			}
		}
	};
	// Функции чеков отображения
	let check_all = flag => {// Функция проверки всех.
		let p = true;
		let r = true;
		let t = true;
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
	let tr_check_n = obj => {// Функция проверки текстовых чеков.
		if(obj.dop.f_n_a)f_out_txt();
		let n = true;
		if(!obj.dop.f_foc && f_is_foc())return;
		if(obj.dop.f_foc){
			for(let i = 0; i < arr_tr.length; i++)if(arr_tr[i].dop.f_foc && !arr_tr[i].dop.f_n){
				n = false;
				break;
			}
		}else{
			for(let i = 0; i < arr_tr.length; i++)if(!arr_tr[i].dop.f_n){
				n = false;
				break;
			}
		}
		tr_all.n.checked = n;
	};
	
	let tr_check = obj => {// Чек на треке.
		obj.dop.f_a = obj.dop.f_p && obj.dop.f_r && obj.dop.f_t;
		f_tr_view(obj);
	};
	let tr_check_2 = obj => {// Чек на треке.
		tr_check(obj);
		check_all(obj.dop.f_foc);
		if(obj.dop.f_n)f_out_txt();
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
	
	tr_all.n.onchange = () => {
		if(f_is_foc()){
			for(let i = 0; i < arr_tr.length; i++)if(arr_tr[i].dop.f_foc &&  arr_tr[i].dop.f_n !== tr_all.n.checked){
				arr_tr[i].dop.f_n = tr_all.n.checked;
			}
		}else for(let i = 0; i < arr_tr.length; i++)if(arr_tr[i].dop.f_n !== tr_all.n.checked){
			arr_tr[i].dop.f_n = tr_all.n.checked;
		}
		f_out_txt();
	};
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
		f_out_txt();
	};
	let f_tr_all = n => {
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
		f_out_txt();
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
			if(confirm("Удалить из списка треков: выделенные треки?")){
				for(let i = arr_tr.length - 1; i >= 0; i--)if(arr_tr[i].dop.f_foc)f_del_tr(arr_tr[i]);
				f_out_txt();
			}
		}else{
			if(confirm("Удалить все треки из списка треков?")){
				for(let i = arr_tr.length - 1; i >= 0; i--)f_del_tr(arr_tr[i]);
				f_out_txt();
			}
		}
	};
	let f_del_track = obj => {// Удаляет трек из списка.
		if(confirm("Удалить из списка треков: "+obj.dop.n)){
			f_del_tr(obj);
			if(obj.dop.f_n_a)f_out_txt();
		}
	};
	// Функция сохранения всех треков.
	let tr_save = document.getElementById("tr_save");// Сохранение всех треков, или выделенных если есть.
	tr_save.onclick = () => {// Сохранение всех треков, или выделенных если есть.
		if(arr_tr.length === 0)return;
		let arr_file = [];
		if(f_is_foc()){
			for(let i = 0; i < arr_tr.length; i++)if(arr_tr[i].dop.f_foc)arr_file.push(to_gpx_file(arr_tr[i]));
		}else for(let i = 0; i < arr_tr.length; i++)arr_file.push(to_gpx_file(arr_tr[i]));
		download(to_zip(arr_file), "tracks.zip", "application/zip");
	};
	// Функция создания различной информации о треке, для создания которой необходим перебор всех точек трека.
	let f_dop_create = obj => {
		//obj.dop.bounds // Рамка(c_max_min) [[Нижний левый], [Верхний правый]] WM [[min], [max]] // Определяет максимальные и минимальные координаты.
		//obj.dop.t_s // приветно 2/3 размера текстов в метрах WM на символ.
		obj.dop.qt_p = 0;// Количество точек.
		obj.dop.qt_p_r = 0;// Количество точек маршрутов.
		obj.dop.qt_p_t = 0;// Количество точек треков.
		obj.dop.qt_p_a = 0;// Общее количество точек.
		obj.dop.qt_r = 0;// Количество маршрутов.
		obj.dop.qt_t = 0;// Количество треков.
		
		obj.dop.dist_r = 0;// Расстояние маршрутов.
		obj.dop.dist_t = 0;// Расстояние треков.
		
		
		let c1 = [];
		let c2 = [];
		
		
		if(obj.wpts_WM !== undefined){
			obj.dop.qt_p = obj.wpts_WM.length;
			for(let i = 0; i < obj.wpts_WM.length; i++){
				if(obj.dop.bounds === undefined)obj.dop.bounds = [[obj.wpts_WM[i][0], obj.wpts_WM[i][1]], [obj.wpts_WM[i][0], obj.wpts_WM[i][1]]];
				else{
					if(obj.wpts_WM[i][0] < obj.dop.bounds[0][0])obj.dop.bounds[0][0] = obj.wpts_WM[i][0];
					else if(obj.wpts_WM[i][0] > obj.dop.bounds[1][0])obj.dop.bounds[1][0] = obj.wpts_WM[i][0];
					if(obj.wpts_WM[i][1] < obj.dop.bounds[0][1])obj.dop.bounds[0][1] = obj.wpts_WM[i][1];
					else if(obj.wpts_WM[i][1] > obj.dop.bounds[1][1])obj.dop.bounds[1][1] = obj.wpts_WM[i][1];
				}
			}
		}
		if(obj.rtes !== undefined){
			obj.dop.qt_r = obj.rtes.length;
			for(let i = 0; i < obj.rtes.length; i++)if(obj.rtes[i].rtepts_WM !== undefined){
				obj.dop.qt_p_r += obj.rtes[i].rtepts_WM.length;
				for(let j = 0; j < obj.rtes[i].rtepts_WM.length; j++){
					if(j < 2){
						if(j === 1){
							c1[0] = toRad(obj.rtes[i].rtepts[0].lon);
							c1[1] = toRad(obj.rtes[i].rtepts[0].lat);
							c2[0] = toRad(obj.rtes[i].rtepts[j].lon);
							c2[1] = toRad(obj.rtes[i].rtepts[j].lat);
							obj.dop.dist_r += get_dist(c1, c2);
						}
					}else{
						c1[0] = c2[0];
						c1[1] = c2[1];
						c2[0] = toRad(obj.rtes[i].rtepts[j].lon);
						c2[1] = toRad(obj.rtes[i].rtepts[j].lat);
						obj.dop.dist_r += get_dist(c1, c2);
					}
					if(obj.dop.bounds === undefined)obj.dop.bounds = [[obj.rtes[i].rtepts_WM[j][0], obj.rtes[i].rtepts_WM[j][1]], [obj.rtes[i].rtepts_WM[j][0], obj.rtes[i].rtepts_WM[j][1]]];
					else{
						if(obj.rtes[i].rtepts_WM[j][0] < obj.dop.bounds[0][0])obj.dop.bounds[0][0] = obj.rtes[i].rtepts_WM[j][0];
						else if(obj.rtes[i].rtepts_WM[j][0] > obj.dop.bounds[1][0])obj.dop.bounds[1][0] = obj.rtes[i].rtepts_WM[j][0];
						if(obj.rtes[i].rtepts_WM[j][1] < obj.dop.bounds[0][1])obj.dop.bounds[0][1] = obj.rtes[i].rtepts_WM[j][1];
						else if(obj.rtes[i].rtepts_WM[j][1] > obj.dop.bounds[1][1])obj.dop.bounds[1][1] = obj.rtes[i].rtepts_WM[j][1];
					}
				}
			}
		}
		if(obj.trks !== undefined){
			obj.dop.qt_t = obj.trks.length;
			for(let i = 0; i < obj.trks.length; i++)if(obj.trks[i].trksegs !== undefined){
				let flag_tr = true;
				for(let j = 0; j < obj.trks[i].trksegs.length; j++)if(obj.trks[i].trksegs[j].trkpts_WM !== undefined){
					obj.dop.qt_p_t += obj.trks[i].trksegs[j].trkpts_WM.length;
					for(let k = 0; k < obj.trks[i].trksegs[j].trkpts_WM.length; k++){
						if(flag_tr && k < 2){
							if(k === 1){
								flag_tr = false;
								c1[0] = toRad(obj.trks[i].trksegs[j].trkpts[0].lon);
								c1[1] = toRad(obj.trks[i].trksegs[j].trkpts[0].lat);
								c2[0] = toRad(obj.trks[i].trksegs[j].trkpts[k].lon);
								c2[1] = toRad(obj.trks[i].trksegs[j].trkpts[k].lat);
								obj.dop.dist_t += get_dist(c1, c2);
							}
						}else{
							c1[0] = c2[0];
							c1[1] = c2[1];
							c2[0] = toRad(obj.trks[i].trksegs[j].trkpts[k].lon);
							c2[1] = toRad(obj.trks[i].trksegs[j].trkpts[k].lat);
							obj.dop.dist_t += get_dist(c1, c2);
						}
						if(obj.dop.bounds === undefined)obj.dop.bounds = [[obj.trks[i].trksegs[j].trkpts_WM[k][0], obj.trks[i].trksegs[j].trkpts_WM[k][1]], [obj.trks[i].trksegs[j].trkpts_WM[k][0], obj.trks[i].trksegs[j].trkpts_WM[k][1]]];
						else{
							if(obj.trks[i].trksegs[j].trkpts_WM[k][0] < obj.dop.bounds[0][0])obj.dop.bounds[0][0] = obj.trks[i].trksegs[j].trkpts_WM[k][0];
							else if(obj.trks[i].trksegs[j].trkpts_WM[k][0] > obj.dop.bounds[1][0])obj.dop.bounds[1][0] = obj.trks[i].trksegs[j].trkpts_WM[k][0];
							if(obj.trks[i].trksegs[j].trkpts_WM[k][1] < obj.dop.bounds[0][1])obj.dop.bounds[0][1] = obj.trks[i].trksegs[j].trkpts_WM[k][1];
							else if(obj.trks[i].trksegs[j].trkpts_WM[k][1] > obj.dop.bounds[1][1])obj.dop.bounds[1][1] = obj.trks[i].trksegs[j].trkpts_WM[k][1];
						}
					}
				}
			}
		}
		obj.dop.qt_p_a = obj.dop.qt_p + obj.dop.qt_p_r + obj.dop.qt_p_t;
		obj.dop.t_s = (((obj.dop.bounds[1][0] - obj.dop.bounds[0][0]) * (obj.dop.bounds[1][1] - obj.dop.bounds[0][1])) / obj.dop.qt_p_a) ** .4;
	};
	// Функции центрирования.
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
	
	
	
	// вывод информации о трекеах.
	
	
	
	
	
	let info_track_b = createElement("span", ["class", "info_out_b"]);//, ["style", "width:: "+document.documentElement.clientWidth+"px; height:"+document.documentElement.clientHeight+"px;"]);
	let info_track_c = createElement("span", ["class", "info_out_t"]);
	let info_track_n = createElement("center");
	info_track_c.append(info_track_n);
	let info_track_t = createElement("span");
	info_track_c.append(info_track_t);
	let info_track = createElement("span");
	info_track.append(info_track_b);
	info_track.append(info_track_c);
	
	info_track_b.onmouseup = e => {
		document.body.removeChild(info_track);
	};
	
	/* редактор gpx потом доделать, пока просто информация о файле.
	let obj_ed;
	let tr_edit_elm = createElement("span");//, ["contenteditable", true]);
	tr_edit_elm.insertAdjacentHTML('beforeend', "<br>name flle: ");
	let ed_n_f = createElement("span", ["contenteditable", true]);
	tr_edit_elm.append(ed_n_f);
	ed_n_f.oninput = () => {obj_ed.dop.n_f = ed_n_f.textContent};
	//*/
	
	let f_info_track = obj => {// Выводит информацию о треке.
		/* редактор gpx потом доделать, пока просто информация о файле.
		obj_ed = obj;
		info_track_n.textContent = obj.dop.n;
		ed_n_f.textContent = obj.dop.n_f;
		info_track_t.textContent = "";
		info_track_t.append(tr_edit_elm);
		//*/
		info_track_n.textContent = obj.dop.n;
		let text = "";
		
		text += "<br>Имя: "+obj.dop.n+
		"<br>Точек: "+obj.dop.qt_p+
		"<br>Точек в маршрутах: "+obj.dop.qt_p_r+
		"<br>Точек в треках: "+obj.dop.qt_p_t+
		"<br>Всего точек: "+obj.dop.qt_p_a+
		"<br>Маршрутов: "+obj.dop.qt_r+
		"<br>Треков: "+obj.dop.qt_t+
		"<br>Расстояние: "+((obj.dop.dist_r + obj.dop.dist_t) / 1000).toFixed(3)+" km"+
		"<br>Дата: "+obj.dop.date+"<br>";
		info_track_t.innerHTML = text;
		document.body.append(info_track);
		
	};
	
	
	let tr_info_a = document.getElementById("tr_info_a");// Вывод информации о всех треках.
	tr_info_a.onclick = () => {
		info_track_n.textContent = "Треки";
		let text = "Количество: <b>"+arr_tr.length+"</b><br><b>p</b>(points) - точки.<br><b>r</b>(routes) - маршруты.<br><b>t</b>(tracks) - треки.<br>";
		if(arr_tr.length > 0){
			text += "<table class='tr_table' cellspacing='0'><tr><th></th><th>p</th><th>p r</th><th>p t</th><th>all p</th><th>r</th><th>t</th><th>km</th><th>date</th></tr>";
			let p = 0;
			let p_r = 0;
			let p_t = 0;
			let r = 0;
			let t = 0;
			let km = 0;
			for(let i = 0; i < arr_tr.length; i++){
				p += arr_tr[i].dop.qt_p;
				p_r += arr_tr[i].dop.qt_p_r;
				p_t += arr_tr[i].dop.qt_p_t;
				r += arr_tr[i].dop.qt_r;
				t += arr_tr[i].dop.qt_t;
				let m = ((arr_tr[i].dop.dist_r + arr_tr[i].dop.dist_t) / 1000);
				km += m;
				text += "<tr><th>"+arr_tr[i].dop.n+"</th><td>"+arr_tr[i].dop.qt_p+"</td><td>"+arr_tr[i].dop.qt_p_r+"</td><td>"+arr_tr[i].dop.qt_p_t+"</td><td>"+arr_tr[i].dop.qt_p_a+"</td><td>"+arr_tr[i].dop.qt_r+"</td><td>"+arr_tr[i].dop.qt_t+"</td><td>"+m.toFixed(3)+"</td><td>"+arr_tr[i].dop.date+"</td></tr>";
				
			}
			text += "<tr><th></th><th>"+p+"</th><th>"+p_r+"</th><th>"+p_t+"</th><th>"+(p + p_r + p_t)+"</th><th>"+r+"</th><th>"+t+"</th><th>"+km.toFixed(3)+"</th><th></th></tr></table><br>";
		}
		info_track_t.innerHTML = text;
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
	let f_track_enter = (obj, flag_file = true) => {// Функция создания элементов трека.
		// Создаем контейнер.
		obj.menu = createElement("div", ["class", "track"]);
		// Создаем случайный цвет треку.
		if(obj.dop._c === undefined)obj.dop._c = '#'+(0x1000000 + (Math.random()) * 0xffffff).toString(16).slice(1,7);
		// Создаем элементы\n SVG
		obj.svg = {};
		
		obj.svg.p = createElementNS("path", ["fill", "none"], ["stroke-width", 5], ["stroke-opacity", 1], ["stroke", obj.dop._c], ["stroke-linecap", "round"]);
		svg.appendChild(obj.svg.p);
		
		//obj.svg.r = createElementNS("path", ["fill", "none"], ["stroke-width", 2], ["stroke-opacity", 1], ["stroke", obj.dop._c], ["stroke-dasharray", "4"]);
		obj.svg.r = createElementNS("path", ["fill", "none"], ["stroke-width", 2], ["stroke-opacity", .5], ["stroke", obj.dop._c]);
		svg.appendChild(obj.svg.r);
		
		obj.svg.t = createElementNS("path", ["fill", "none"], ["stroke-width", 2], ["stroke-opacity", 1], ["stroke", obj.dop._c]);
		svg.appendChild(obj.svg.t);
		
		
		// Создаем различную информацию о треке, для создания которой необходим перебор всех точек.
		f_dop_create(obj);
		// Создаем флаги
		obj.dop.f_foc = false;
		//obj.dop.f_a = true;
		//obj.dop.f_p = true;
		//obj.dop.f_r = true;
		//obj.dop.f_t = true;
		//obj.dop.f_n = false;
		
		obj.menu.onmousedown = e => {// Выделяет треки.
			if(e.target.className === "track")tr_id_s = arr_tr.indexOf(obj);
			e.preventDefault();
		};
		obj.menu.onmouseup = e => {// Выделяет треки.
			if(e.target.className === "track")f_foc_e(obj);
			e.preventDefault();
		};
		
		// Имя файла.
		obj.menu.textContent = obj.dop.n;
		// Устанавливаем дату трека.
		let d;
		if(obj.gpx.metadata !== undefined && obj.gpx.metadata.time !== undefined){
			tr_date.setTime(obj.gpx.metadata.time);
			d = tr_date.toISOString();
		}else if(obj.dop.d !== undefined)d = obj.dop.d.toISOString();
		else d = date_new.toISOString();
		obj.dop.date = d;
		
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
		
		// Отображать файл треков целиком. пункты, маршруты, треки.
		obj.menu.insertAdjacentHTML('beforeend', "<br>");
		let input_a_view = createElement("input", ["type", "checkbox"], ["checked", true]);
		
		Object.defineProperty(obj.dop, 'f_a', {get(){return input_a_view.checked}, set(b){input_a_view.checked = b;}});
		input_a_view.onchange = () => {
			tr_check_all(obj);
			check_all(obj.dop.f_foc);
			if(obj.dop.f_n)f_out_txt();
		};
		
		obj.menu.append(input_a_view);
		// Отображать пункты.
		obj.menu.insertAdjacentHTML('beforeend', " p");
		let input_p_view = createElement("input", ["type", "checkbox"], ["checked", true]);
		
		Object.defineProperty(obj.dop, 'f_p', {get(){return input_p_view.checked}, set(b){input_p_view.checked = b;}});
		input_p_view.onchange = () => tr_check_2(obj);
		
		obj.menu.append(input_p_view);
		// Отображать маршруты.
		obj.menu.insertAdjacentHTML('beforeend', " r");
		let input_r_view = createElement("input", ["type", "checkbox"], ["checked", true]);
		
		Object.defineProperty(obj.dop, 'f_r', {get(){return input_r_view.checked}, set(b){input_r_view.checked = b;}});
		input_r_view.onchange = () => tr_check_2(obj);
		
		obj.menu.append(input_r_view);
		// Отображать треки.
		obj.menu.insertAdjacentHTML('beforeend', " t");
		let input_t_view = createElement("input", ["type", "checkbox"], ["checked", true]);
		
		Object.defineProperty(obj.dop, 'f_t', {get(){return input_t_view.checked}, set(b){input_t_view.checked = b;}});
		input_t_view.onchange = () => tr_check_2(obj);
		
		obj.menu.append(input_t_view);
		// Отображать названия точек.
		obj.menu.insertAdjacentHTML('beforeend', " n");
		let input_n_view = createElement("input", ["type", "checkbox"]);
		
		Object.defineProperty(obj.dop, 'f_n', {get(){return input_n_view.checked}, set(b){input_n_view.checked = b;}});
		
		input_n_view.onchange = () => tr_check_n(obj);
		
		obj.menu.append(input_n_view);
		
		
		
		
		
		if(arr_tr.length === 0){// При загрузке первого трека
			tr_all_p.checked = tr_all_r.checked = tr_all_t.checked = tr_all_a.checked = true;// устанавливаем чеки.
			tr_all_n.checked = false;
			tr_center(obj);// перемещаемся к треку.
		}
		arr_tr.push(obj);
		f_tr_view(obj);
		if(flag_file){
			count_l_tr++;
			end_l();
		}else{
			tr_sort.onchange();
		}
		
	};
	// TEST
	this.f_track_enter_g = (obj) => {
		f_track_enter(obj, false);
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
	let f_lat = t => {// Широта точки. Десятичные градусы, датум WGS84. // -90.0 <= value <= 90.0
		let n = parseFloat(t);
		if(isFinite(n) && -90 <= n && n <= 90)return n;
		else return undefined;
	};
	let f_lon = t => {// Долгота точки. Десятичные градусы, датум WGS84. // -180.0 <= value < 180.0
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
	let wpt_f_n = false;// Вспомогательный флаг для определения текстов в названии точек.
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
		let obj = {lon:lon, lat:lat};
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
					wpt_f_n = true;
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
		obj.dop = {};// данные трека не относящиеся напрямую к самому треку.
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
		// Заполняем дополнительную информацию.
		obj.dop.f_n_p = wpt_f_n;// Флаги есть ли текст в именах точек.
		obj.dop.f_n_r = wpt_f_n;
		obj.dop.f_n_t = wpt_f_n;
		obj.dop.n_f = file.name;// Имя файла.
		obj.dop.n = obj.dop.n_f.slice(0, -4).slice(0, 27);
		
		obj.dop.s = file.size;// Размер файла.
		obj.dop.d = new Date(file.lastModified);// Дата последнего изменения файла.
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
					if(wpt_f_n){
						obj.dop.f_n_p = wpt_f_n;
						wpt_f_n = false;
					}
				}
			}else if(tag_gpx.children[i].tagName === "trk"){// Список треков.
				if(i_sequence > 3)f_error_out(file.name, "Нарушена последовательность в gpx элементом trk "+gpx_a);
				else i_sequence = 3;
				let trk = f_trk(tag_gpx.children[i], file.name);
				if(trk !== undefined){
					if(obj.trks === undefined)obj.trks = [];// Массив.
					obj.trks.push(trk);
					if(wpt_f_n){
						obj.dop.f_n_t = wpt_f_n;
						wpt_f_n = false;
					}
				}else f_error_out(file.name, "В gpx пустой элемент trk "+trk_a);
			}else if(tag_gpx.children[i].tagName === "rte"){// Список маршрутов.
				if(i_sequence > 2)f_error_out(file.name, "Нарушена последовательность в gpx элементом rte "+gpx_a);
				else i_sequence = 2;
				let rte = f_rte(tag_gpx.children[i], file.name);
				if(rte !== undefined){
					if(obj.rtes === undefined)obj.rtes = [];// Массив.
					obj.rtes.push(rte);
					if(wpt_f_n){
						obj.dop.f_n_r = wpt_f_n;
						wpt_f_n = false;
					}
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
		obj.dop.f_n_a = obj.dop.f_n_p || obj.dop.f_n_t || obj.dop.f_n_r;
		f_error_out(file.name, "Загружен.", false);
		f_track_enter(obj);// Передаем трек для отображения его.
	};
	/// ФУНКЦИИ сохранение треков.
	let new_l = String.fromCharCode(0xD, 0xA);// На всякий случай добавим, чтоб кривой Гармин не запутался. Если гармин без этого читает то лучше убрать или присвоить пустую строку.
	let to_metadata, to_wpt, to_rte, to_trk, to_extensions;// Основные, Функции для формирования текста gpx.
	let to_trkseg, to_copyright, to_link, to_email, to_author/* personType */, to_bounds;// Дополнительные функции формирования текста gpx.
	// Основные
	to_metadata = obj => {
		let text = '<metadata>'+new_l;
		if(obj.name !== undefined)text += '<name>'+obj.name+'</name>'+new_l;
		if(obj.desc !== undefined)text += '<desc>'+obj.desc+'</desc>'+new_l;
		if(obj.author !== undefined)text += to_author(obj.author);
		if(obj.copyright !== undefined)text += to_copyright(obj.copyright);
		if(obj.links !== undefined)for(let i = 0; i < obj.links.length; i++)text += to_link(obj.links[i]);
		if(obj.time !== undefined){
			tr_date.setTime(obj.time);
			text += '<time>'+tr_date.toISOString().slice(0, 19)+'Z</time>'+new_l;
		}
		if(obj.keywords !== undefined)text += '<keywords>'+obj.keywords+'</keywords>'+new_l;
		if(obj.bounds !== undefined)text += to_bounds(obj.bounds);
		if(obj.extensions !== undefined)text += to_extensions(obj.extensions);
		text += '</metadata>'+new_l;
		return text;
	};
	to_wpt = (obj, tag = "wpt") => {
		let n = obj.lon % 360;
		n %= 360;
		if(n >= 180)n -= 360;
		else if(n < -180)n += 360;
		let text = '<'+tag+' lat="'+parseFloat(obj.lat.toFixed(lim_d))+'" lon="'+parseFloat(n.toFixed(lim_d))+'">'+new_l;
		if(obj.ele !== undefined)text += '<ele>'+obj.ele+'</ele>'+new_l;
		if(obj.time !== undefined){
			tr_date.setTime(obj.time);
			text += '<time>'+tr_date.toISOString().slice(0, 19)+'Z</time>'+new_l;
		}
		if(obj.magvar !== undefined)text += '<magvar>'+obj.magvar+'</magvar>'+new_l;
		if(obj.geoidheight !== undefined)text += '<geoidheight>'+obj.geoidheight+'</geoidheight>'+new_l;
		if(obj.name !== undefined)text += '<name>'+obj.name+'</name>'+new_l;
		if(obj.cmt !== undefined)text += '<cmt>'+obj.cmt+'</cmt>'+new_l;
		if(obj.desc !== undefined)text += '<desc>'+obj.desc+'</desc>'+new_l;
		if(obj.src !== undefined)text += '<src>'+obj.src+'</src>'+new_l;
		if(obj.links !== undefined)for(let i = 0; i < obj.links.length; i++)text += to_link(obj.links[i]);
		if(obj.sym !== undefined)text += '<sym>'+obj.sym+'</sym>'+new_l;
		if(obj.type !== undefined)text += '<type>'+obj.type+'</type>'+new_l;
		if(obj.fix !== undefined)text += '<fix>'+obj.fix+'</fix>'+new_l;
		if(obj.sat !== undefined)text += '<sat>'+obj.sat+'</sat>'+new_l;
		if(obj.hdop !== undefined)text += '<hdop>'+obj.hdop+'</hdop>'+new_l;
		if(obj.vdop !== undefined)text += '<vdop>'+obj.vdop+'</vdop>'+new_l;
		if(obj.pdop !== undefined)text += '<pdop>'+obj.pdop+'</pdop>'+new_l;
		if(obj.ageofdgpsdata !== undefined)text += '<ageofdgpsdata>'+obj.ageofdgpsdata+'</ageofdgpsdata>'+new_l;
		if(obj.dgpsid !== undefined)text += '<dgpsid>'+obj.dgpsid+'</dgpsid>'+new_l;
		if(obj.extensions !== undefined)text += to_extensions(obj.extensions);
		text += '</'+tag+'>'+new_l;
		return text;
	};
	to_rte = obj => {
		let text = '<rte>'+new_l;
		if(obj.name !== undefined)text += '<name>'+obj.name+'</name>'+new_l;
		if(obj.cmt !== undefined)text += '<cmt>'+obj.cmt+'</cmt>'+new_l;
		if(obj.desc !== undefined)text += '<desc>'+obj.desc+'</desc>'+new_l;
		if(obj.src !== undefined)text += '<src>'+obj.src+'</src>'+new_l;
		if(obj.links !== undefined)for(let i = 0; i < obj.links.length; i++)text += to_link(obj.links[i]);
		if(obj.number !== undefined)text += '<number>'+obj.number+'</number>'+new_l;
		if(obj.type !== undefined)text += '<type>'+obj.type+'</type>'+new_l;
		if(obj.extensions !== undefined)text += to_extensions(obj.extensions);
		if(obj.rtepts !== undefined)for(let i = 0; i < obj.rtepts.length; i++)text += to_wpt(obj.rtepts[i], "rtept");
		text += '</rte>'+new_l;
		return text;
	};
	to_trk = obj => {
		let text = '<trk>'+new_l;
		if(obj.name !== undefined)text += '<name>'+obj.name+'</name>'+new_l;
		if(obj.cmt !== undefined)text += '<cmt>'+obj.cmt+'</cmt>'+new_l;
		if(obj.desc !== undefined)text += '<desc>'+obj.desc+'</desc>'+new_l;
		if(obj.src !== undefined)text += '<src>'+obj.src+'</src>'+new_l;
		if(obj.links !== undefined)for(let i = 0; i < obj.links.length; i++)text += to_link(obj.links[i]);
		if(obj.number !== undefined)text += '<number>'+obj.number+'</number>'+new_l;
		if(obj.type !== undefined)text += '<type>'+obj.type+'</type>'+new_l;
		if(obj.extensions !== undefined)text += to_extensions(obj.extensions);
		if(obj.trksegs !== undefined)for(let i = 0; i < obj.trksegs.length; i++)text += to_trkseg(obj.trksegs[i]);
		text += '</trk>'+new_l;
		return text;
	};
	to_extensions = extensions => {
		return '<extensions>'+extensions+'</extensions>'+new_l;
	};
	// Дополнительные
	to_trkseg = obj => {
		let text = '<trkseg>'+new_l;
		if(obj.trkpts !== undefined)for(let i = 0; i < obj.trkpts.length; i++)text += to_wpt(obj.trkpts[i], "trkpt");
		if(obj.extensions !== undefined)text += to_extensions(obj.extensions);
		text += '</trkseg>'+new_l;
		return text;
	};
	to_copyright = obj => {
		let text = '<copyright author="'+obj.author+'">'+new_l;
		if(obj.year !== undefined)text += '<year>'+obj.year+'</year>'+new_l;
		if(obj.license !== undefined)text += '<license>'+obj.license+'</license>'+new_l;
		text += '</copyright>'+new_l;
		return text;
	};
	to_link = obj => {
		let text = '<link href="'+obj.href+'">'+new_l;
		if(obj.text !== undefined)text += '<text>'+obj.text+'</text>'+new_l;
		if(obj.type !== undefined)text += '<type>'+obj.type+'</type>'+new_l;
		text += '</link>'+new_l;
		return text;
	};
	to_email = t => {
		let text = '';
		let index = t.indexOf("@");
		if(index > 0 && index < t.length - 1)text += '<email id="'+t.slice(0, index)+'" domain="'+t.slice(index + 1)+'"/>'+new_l;
		return text;
	};
	to_author = obj => {
		let text = '<author>'+new_l;
		if(obj.name !== undefined)text += '<name>'+obj.name+'</name>'+new_l;
		if(obj.email !== undefined)text += to_email(obj.email);
		if(obj.link !== undefined)text += to_link(obj.link);
		text += '</author>'+new_l;
		return text;
	};
	to_bounds = obj => {
		if(obj_ed.dop.bounds === undefined){
			if(obj.hasOwnProperty("minlat") && obj.hasOwnProperty("minlon") && obj.hasOwnProperty("maxlat") && obj.hasOwnProperty("maxlon"))return '<bounds minlat="'+obj.minlat+'" minlon="'+obj.minlon+'" maxlat="'+obj.maxlat+'" maxlon="'+obj.maxlon+'"/>'+new_l;
			else return "";
			//return '<bounds minlat="'+f_lat(obj.minlat+"")+'" minlon="'+f_lon(obj.minlon+"")+'" maxlat="'+f_lat(obj.maxlat+"")+'" maxlon="'+f_lon(obj.maxlon+"")+'"/>';
		}else{
			let c = to_wgs_84_gpx(obj_ed.dop.bounds[0]);
			let text = '<bounds minlat="'+c[1]+'" minlon="'+c[0];
			c = to_wgs_84_gpx(obj_ed.dop.bounds[1]);
			text += '" maxlat="'+c[1]+'" maxlon="'+c[0]+'"/>'+new_l;
			return text;
		}
	};
	
	to_gpx_file = obj => {
		lim_d = obj.dop.lim_d === undefined ? 7: obj.dop.lim_d;// Лимит на знаки после запятой.
		/// Готовим текст файла
		obj_ed = obj;// делаем временную ссылку на объект
		// Декларация.
		let text = '<?xml version="'+(obj.dop.v !== undefined ? obj.dop.v: "1.0")+'" encoding="UTF-8"'+(obj.dop.st !== undefined ? ' standalone="'+obj.dop.st+'"?>': '?>')+new_l;
		// Корневой gpx тег.
		text += '<gpx'+new_l+'xmlns="http://www.topografix.com/GPX/1/1"'+new_l+'creator="'+(obj.gpx.creator !== undefined ? obj.gpx.creator: "feb7e9c4d5539ae0f1496cdb2aaee27c")+'"'+new_l+'version="1.1"'+new_l+'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'+new_l+'xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">'+new_l;
		// Создаем metadata если есть
		if(obj.gpx.metadata !== undefined)text += to_metadata(obj.gpx.metadata);
		if(obj.wpts !== undefined)for(let i = 0; i < obj.wpts.length; i++)text += to_wpt(obj.wpts[i]);
		if(obj.rtes !== undefined)for(let i = 0; i < obj.rtes.length; i++)text += to_rte(obj.rtes[i]);
		if(obj.trks !== undefined)for(let i = 0; i < obj.trks.length; i++)text += to_trk(obj.trks[i]);
		if(obj.extensions !== undefined)text += to_extensions(obj.extensions);
		text += '</gpx>'+new_l;// Закрываем gpx тег.
		// возвращаем файл.
		obj_ed = null;
		//download(text, obj.dop.n+".gpx", "text/xml");
		return {buffer:encoder.encode(text).buffer, name:obj.dop.n+".gpx"};
	};
	f_save_track = obj => {// Сохранение трека из списка.
		lim_d = obj.dop.lim_d === undefined ? 7: obj.dop.lim_d;// Лимит на знаки после запятой.
		/// Готовим текст файла
		obj_ed = obj;// делаем временную ссылку на объект
		// Декларация.
		let text = '<?xml version="'+(obj.dop.v !== undefined ? obj.dop.v: "1.0")+'" encoding="'+(obj.dop.en !== undefined ? obj.dop.en: "UTF-8")+'"'+(obj.dop.st !== undefined ? ' standalone="'+obj.dop.st+'"?>': '?>')+new_l;
		// Корневой gpx тег.
		text += '<gpx'+new_l+'xmlns="http://www.topografix.com/GPX/1/1"'+new_l+'creator="'+(obj.gpx.creator !== undefined ? obj.gpx.creator: "feb7e9c4d5539ae0f1496cdb2aaee27c")+'"'+new_l+'version="1.1"'+new_l+'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'+new_l+'xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">'+new_l;
		// Создаем metadata если есть
		if(obj.gpx.metadata !== undefined)text += to_metadata(obj.gpx.metadata);
		if(obj.wpts !== undefined)for(let i = 0; i < obj.wpts.length; i++)text += to_wpt(obj.wpts[i]);
		if(obj.rtes !== undefined)for(let i = 0; i < obj.rtes.length; i++)text += to_rte(obj.rtes[i]);
		if(obj.trks !== undefined)for(let i = 0; i < obj.trks.length; i++)text += to_trk(obj.trks[i]);
		if(obj.extensions !== undefined)text += to_extensions(obj.extensions);
		text += '</gpx>'+new_l;// Закрываем gpx тег.
		// Сохраняем файл.
		download(text, obj.dop.n+".gpx", "text/xml");
		obj_ed = null;
	};
	this.f_save_gpx = (obj) => {
		f_save_track(obj);
	};
};