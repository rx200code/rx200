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
	let f_source_opt = function(id){
		let url = g_tiles[id].url == undefined ? g_tiles[0].url: g_tiles[id].url;
		let options = {
			maxZoom:g_tiles[id].max_z == undefined ? g_tiles[0].max_z: g_tiles[id].max_z,
			minZoom:g_tiles[id].min_z == undefined ? g_tiles[0].min_z: g_tiles[id].min_z,
		};
		if(url instanceof Array)options.urls = url;
		else options.url = url.replace("{s}", "{"+(g_tiles[id].s == undefined ? g_tiles[0].s: g_tiles[id].s)+"}");
		return options;
	};
	let update_layer = function(id){
		let options = f_source_opt(id);
		options.attributions = g_tiles[id].attr == undefined ? g_tiles[0].attr: g_tiles[id].attr;
		this.base_layer.setSource(new ol.source.XYZ(options));
	}.bind(this);
	update_layer(map_id);
	
	this.control = ol.control.defaults({
		attribution:true,
		attributionOptions:{collapsible:false},
		zoom:false
	});
	//alert(JSON.stringify(this.control));
	
	
	this.map = new ol.Map({
		target:this.id_div_map,
		//controls:[],
		controls:this.control,
		layers:[this.base_layer],
		view:this.view
	});
	// Создаем прозрачный слой.
	let range_map_n = document.getElementById('range_map_n');
	let layer_n = new ol.layer.Tile({opacity:range_map_n.value * 1});
	range_map_n.oninput = function(){
		layer_n.setOpacity(this.value * 1);
		layer_n.changed();
	};
	let on_layer_n = function(flag){
		if(flag)layer_n.setMap(this.map);
		else layer_n.setMap(null);
	}.bind(this);
	let update_layer_n = function(id){
		layer_n.setSource(new ol.source.XYZ(f_source_opt(id)));
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
	for(i = 1; i < g_tiles.length; i++){
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
	}
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
	// Переносит(обновляет) карту к координатам центра, с заданным увеличением.
	let update_view = function(e){
		this.view.setZoom(this.elm_zoom.value);
		this.view.setCenter(ol.proj.fromLonLat([this.elm_lon.value, this.elm_lat.value]));
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
};