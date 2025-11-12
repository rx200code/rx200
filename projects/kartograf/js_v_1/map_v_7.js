function Map(){
	/// Настройки
	this.id_div_map = "map";// Индификатор элемента карты.
	this.div_map = document.getElementById(this.id_div_map);// Элемент содержащий карту.
	this.width = this.div_map.clientWidth;// Ширина карты.
	this.height = this.div_map.clientHeight;// Высота карты.
	// Настройки центра карты и увеличения.
	this.elm_lat = document.getElementById("lat_center");// Поле содержащее широту центра карты.
	this.elm_lon = document.getElementById("lon_center");// Поле содержащее долготу центра карты.
	this.elm_zoom = document.getElementById("zoom");// Поле содержащее увеличение карты.
	this.view = new ol.View({
		center: ol.proj.fromLonLat([this.elm_lon.value, this.elm_lat.value]),
		zoom: this.elm_zoom.value
	});
	// Выводим основную карту.
	this.base_layer = new ol.layer.Tile();
	let f_source_opt = function(id, arr){
		let url = arr[id].url == undefined ? arr[0].url: arr[id].url;
		let options = {
			maxZoom:arr[id].max_z == undefined ? arr[0].max_z: arr[id].max_z,
			minZoom:arr[id].min_z == undefined ? arr[0].min_z: arr[id].min_z,
		};
		if(url instanceof Array)options.urls = url;
		else options.url = url.replace("{s}", "{"+(arr[id].s == undefined ? arr[0].s: arr[id].s)+"}");
		return options;
	};
	let update_layer = function(id){
		let options = f_source_opt(id, g_tiles);
		options.attributions = g_tiles[id].attr == undefined ? g_tiles[0].attr: g_tiles[id].attr;
		this.base_layer.setSource(new ol.source.XYZ(options));
	}.bind(this);
	update_layer(map_id);
	
	this.control = ol.control.defaults({
		attribution:true,
		attributionOptions:{collapsible:false},
		zoom:false
	});
	this.map = new ol.Map({
		target:this.id_div_map,
		//controls:[],
		controls:this.control,
		layers:[this.base_layer],
		view:this.view
	});
	// Создаем прозрачный слой.
	let range_map_n = document.getElementById('range_map_n');
	let layer_n = new ol.layer.Tile({opacity:1 - range_map_n.value});
	range_map_n.oninput = function(){
		layer_n.setOpacity(1 - this.value);
		layer_n.changed();
	};
	let on_layer_n = function(flag){
		if(flag)layer_n.setMap(this.map);
		else layer_n.setMap(null);
	}.bind(this);
	let update_layer_n = function(id){
		layer_n.setSource(new ol.source.XYZ(f_source_opt(id, g_tiles)));
	};
	// Создаем список карт.
	this.form_maps = document.getElementById('active_map');
	this.form_maps.onchange = function(e){
		if(e.target.value){
			if(e.target.name == "active_map"){
				map_id = e.target.value;
				update_layer(map_id);
			}else{
				update_layer_n(e.target.value);
			}
		}
	};
	for(let i = 1; i < g_tiles.length; i++){
		let type = g_tiles[i].type == undefined ? g_tiles[0].type: g_tiles[i].type;
		if(type == 6)continue;
		let label = document.createElement("label");
		let input = document.createElement("input");
		input.setAttribute("type", "radio");
		input.setAttribute("name", "active_map");
		input.setAttribute("value", i);
		if(i == map_id)input.checked = true;
		label.appendChild(input);
		let span = document.createElement("span");
		if(type != 0)span.setAttribute("class", "name_type_"+type);
		span.innerHTML = g_tiles[i].name;
		label.appendChild(span);
		let input_n = document.createElement("input");
		input_n.setAttribute("type", "radio");
		input_n.setAttribute("name", "active_map_n");
		input_n.setAttribute("value", i);
		input_n.style.display = 'none';
		this.form_maps.appendChild(input_n);
		this.form_maps.appendChild(label);
		this.form_maps.appendChild(document.createElement("br"));
	};
	let active_map_n = document.getElementById('active_map_n');
	active_map_n.checked = false;
	active_map_n.onchange = function(){
		let arr_radio = document.getElementsByName('active_map_n');
		if(this.checked){
			arr_radio.forEach((item) => {item.style.display = '';});
			document.getElementById('span_map_n').style.display = 'none';
			range_map_n.style.display = '';
		}else{
			arr_radio.forEach((item) => {item.style.display = 'none';});
			range_map_n.style.display = 'none';
			document.getElementById('span_map_n').style.display = '';
		}
		on_layer_n(this.checked);
	};
	// Выводит данные о центре карты и увеличении.
	this.input_data = function(){
		let center = ol.proj.toLonLat(this.view.getCenter());
		this.elm_lat.value = center[1];
		this.elm_lon.value = center[0];
		this.elm_zoom.value = this.view.getZoom();
	}.bind(this);
	this.view.on('change:center', this.input_data);
	//this.map.on("moveend", this.input_data);
	// Переносит(обновляет) карту к координатам центра, с заданным увеличением.
	let update_view = function(e){
		this.view.setZoom(this.elm_zoom.value);
		// проверки чего ввел пользователь, пока простая(если в поля ввел две координаты) потом можно улучшить.
		//*
		if(this.elm_lat.value.indexOf(',') != -1){
			let arr_t = this.elm_lat.value.split(',');
			this.elm_lat.value = arr_t[0];
			this.elm_lon.value = arr_t[1];
			update_view(e);
			return;
		}else if(this.elm_lon.value.indexOf(',') != -1){
			let arr_t = this.elm_lon.value.split(',');
			this.elm_lon.value = arr_t[0];
			this.elm_lat.value = arr_t[1];
			update_view(e);
			return;
		}
		//*/
		this.view.setCenter(ol.proj.fromLonLat([this.elm_lon.value, this.elm_lat.value]));
		//this.view.changed();//так как при увеличении уменьшение через окно ввода не срабатывает событие map.view.on("change:center", f_out_angles_text);
	}.bind(this);
	function select_input(){this.select();};
	function blur_input(e){
		if(e.relatedTarget == null || e.relatedTarget.nodeName != 'INPUT' || e.relatedTarget.type != 'text')update_view();
	};
	this.elm_lat.onfocus = select_input;
	this.elm_lat.onblur = blur_input;
	this.elm_lon.onfocus = select_input;
	this.elm_lon.onblur = blur_input;
	this.elm_zoom.onfocus = select_input;
	this.elm_zoom.onblur = blur_input;
	document.getElementById("menu_map").onkeydown = function(e){
		if(e.keyCode === 13)update_view();
	};
	/// Создаем дополнительные слои.
	// контейнер слоев html
	let div_ex_layer = document.getElementById("div_ex_layer");
	// заполняем основными дополнительными слоями.
	for(let i = 1; i < g_srtm.length; i++){
		let label = document.createElement("label");
		let input = document.createElement("input");
		input.setAttribute("type", "checkbox");
		label.appendChild(input);
		let span = document.createElement("span");
		span.innerHTML = g_srtm[i].name == undefined ? g_srtm[0].name: g_srtm[i].name;
		label.appendChild(span);
		div_ex_layer.appendChild(label);
		if(i < g_srtm.length - 1)div_ex_layer.appendChild(document.createElement("br"));
		let layer = new ol.layer.Tile({source:new ol.source.XYZ(f_source_opt(i, g_srtm))});
		input.onchange = function(){
			if(input.checked)layer.setMap(this.map);
			else layer.setMap(null);
		}.bind(this);
	};
	/// заполняем слои термоточек.
	// контейнер слоев div.
	let div_menu_fire = document.getElementById("div_menu_fire");
	// Настраиваем начальное положение чекбоксов/input.
	document.getElementsByName('time_fire')[0].checked = true;
	let check_MODIS = document.getElementById("check_MODIS");
	check_MODIS.checked = false;
	let check_VIIRS = document.getElementById("check_VIIRS");
	check_VIIRS.checked = false;
	// Создаем слой.
	// https://firms.modaps.eosdis.nasa.gov/web-services/mapkey_status.php?MAP_KEY=feaa3223062496431512156c2cceda84
	let source_FIRMS = new ol.source.ImageWMS({
		url:'https://firms.modaps.eosdis.nasa.gov/wms/key/feaa3223062496431512156c2cceda84/',
		params:{
			layers:'fires_viirs_24,fires_modis_24',
			VERSION: '1.1.1',
			colors:'240+40+40,250+200+50',
			size:'10,10'
			//symbols: "triangle,triangle",
		}
	});
	let layer_FIRMS = new ol.layer.Image({zIndex:100,source:source_FIRMS});
	// функция установки параметров слоя FIRMS.
	let f_FIRMS = function(){
		if(check_VIIRS.checked || check_MODIS.checked){
			let h = document.querySelector('input[name="time_fire"]:checked').value;
			let t = "";
			if(check_VIIRS.checked)t += 'fires_viirs_'+h;
			if(check_MODIS.checked){
				if(check_VIIRS.checked)t += ',';
				t += 'fires_modis_'+h;
			};
			source_FIRMS.updateParams({layers:t});
			layer_FIRMS.setMap(this.map);
		}else layer_FIRMS.setMap(null);
	}.bind(this);
	div_menu_fire.onchange = function(e){
		if(e.target.getAttribute("id") == "check_MODIS")check_VIIRS.checked = e.target.checked;
		f_FIRMS();
	};
	// Устанавливаем копирование и поиск, по координатам.
	document.getElementById('copy').onclick = function(){
		let text = (this.elm_lat.value * 1).toFixed(7)+","+(this.elm_lon.value * 1).toFixed(7);
		navigator.clipboard.writeText(text).then(function(){
				/* буфер обмена успешно заполнен */
				document.getElementById('copy_out').innerHTML = "Cкопировано";
				setTimeout(function(){document.getElementById('copy_out').innerHTML = "";}, 3000);
			}, function(){
				/* запись в буфер обмена не удалась */
				document.getElementById('copy_out').innerHTML = text;
				document.getSelection().selectAllChildren(document.getElementById('copy_out'));
				setTimeout(function(){document.getElementById('copy_out').innerHTML = "";}, 40000);
			});
	}.bind(this);
	document.getElementById('search').onclick = function(){
		let text = "https://www.google.com/search?q="+(this.elm_lat.value * 1).toFixed(7)+","+(this.elm_lon.value * 1).toFixed(7);
		window.open(text, "_blank");
	}.bind(this);
	document.getElementById('search_2').onclick = function(){
		let text = "https://yandex.ru/search/?text="+(this.elm_lat.value * 1).toFixed(7)+","+(this.elm_lon.value * 1).toFixed(7);
		window.open(text, "_blank");
	}.bind(this);
	
	
	
	
	
	
	
};