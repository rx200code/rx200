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
	//this.source = new ol.source.XYZ();
	//this.base_layer = new ol.layer.Tile({source: this.source});
	this.base_layer = new ol.layer.Tile();
	//this.source = new ol.source.OSM();
	//this.source = null;
	let update_layer = function(id){
		let url = g_tiles[id].url == undefined ? g_tiles[0].url: g_tiles[id].url;
		this.base_layer.setSource(new ol.source.XYZ({
			url:url.replace("{s}", "{"+(g_tiles[id].s == undefined ? g_tiles[0].s: g_tiles[id].s)+"}"),
			maxZoom:g_tiles[id].max_z == undefined ? g_tiles[0].max_z: g_tiles[id].max_z,
			minZoom:g_tiles[id].min_z == undefined ? g_tiles[0].min_z: g_tiles[id].min_z
		}));
		/*
		this.base_layer.setMaxZoom(g_tiles[id].max_z == undefined ? g_tiles[0].max_z: g_tiles[id].max_z);
		this.base_layer.setMinZoom(g_tiles[id].min_z == undefined ? g_tiles[0].min_z: g_tiles[id].min_z);
		this.source.setUrl(url.replace("{s}", "{"+(g_tiles[id].s == undefined ? g_tiles[0].s: g_tiles[id].s)+"}"));
		//*/
		/*
		this.source = new ol.source.XYZ({
			url:url.replace("{s}", "{"+(g_tiles[id].s == undefined ? g_tiles[0].s: g_tiles[id].s)+"}"),
			maxZoom:g_tiles[id].max_z == undefined ? g_tiles[0].max_z: g_tiles[id].max_z,
			minZoom:g_tiles[id].min_z == undefined ? g_tiles[0].min_z: g_tiles[id].min_z
		});//*/
		
		//alert(JSON.stringify(this.source.getKeys()));
		//let url = g_tiles[id].url == undefined ? g_tiles[0].url: g_tiles[id].url;
		//alert(JSON.stringify(this.source.getProjection()));
		//alert(this.source.getProperties());
		//alert(this.source.getTileGrid());
		//alert(JSON.stringify(this.source.getTileGrid()));
		//this.source.setUrl(url.replace("{s}", "{"+(g_tiles[id].s == undefined ? g_tiles[0].s: g_tiles[id].s)+"}"));
		//alert(g_tiles[id].s == undefined ? g_tiles[0].s: g_tiles[id].s);
		//alert(url.replace("{s}", "{"+(g_tiles[id].s == undefined ? g_tiles[0].s: g_tiles[id].s)+"}"));
		//this.source.set('url', url.replace("{s}", "{"+(g_tiles[id].s == undefined ? g_tiles[0].s: g_tiles[id].s)+"}"), true);
		//this.source.set('maxZoom', g_tiles[id].max_z == undefined ? g_tiles[0].max_z: g_tiles[id].max_z);
		//alert(this.source.get('maxZoom'));
		//this.source.setUrl(url.replace("{s}", "{"+(g_tiles[id].s == undefined ? g_tiles[0].s: g_tiles[id].s)+"}"));
		
		/*
		this.source.setProperties({
			url:url.replace("{s}", "{"+(g_tiles[id].s == undefined ? g_tiles[0].s: g_tiles[id].s)+"}")
			//maxZoom:g_tiles[id].max_z == undefined ? g_tiles[0].max_z: g_tiles[id].max_z,
			//minZoom:g_tiles[id].min_z == undefined ? g_tiles[0].min_z: g_tiles[id].min_z
		},true);
		//*/
		//alert(this.source.get('maxZoom'));
	}.bind(this);
	update_layer(map_id);
	
	
	this.map = new ol.Map({
		target:this.id_div_map,
		controls:[],
		layers:[this.base_layer],
		view:this.view
	});
	// Создаем список карт.
	this.form_maps = document.getElementById('active_map');
	this.form_maps.onchange = function(e){
		if(e.target.value){
			map_id = e.target.value;
			update_layer(map_id);
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
		this.form_maps.appendChild(label);
		this.form_maps.appendChild(document.createElement("br"));
	}
	
	
	
	// Определяем какая карта выбрана.
	/*
	let type_map = document.querySelector('input[name="active_map"]:checked').value;
	if(type_map == null){
		type_map = 77;
		document.getElementsByName('active_map')[0].checked = true;
	}//*/
	
	// Test ВРЕМЕННО.
	/*
	document.getElementById("active_map").onchange = function(e){
		if(e.target.value)alert(e.target.value);
	};//*/
	//*
	
	
	
	//this.source = new ol.source.OSM();
	/*
	this.source = new ol.source.XYZ({
		url:'http://{a-d}.tile.stamen.com/toner/{z}/{x}/{y}.png'
	});//*/
	/*
	this.source = new ol.source.XYZ({
		url:''
	});//*/
	
	
	this.input_data = function(){
		let center = ol.proj.toLonLat(this.view.getCenter());
		this.elm_lat.value = center[1];
		this.elm_lon.value = center[0];
		this.elm_zoom.value = this.view.getZoom();
	}.bind(this);
	this.view.on('change:center', this.input_data);
	
	//*
	function select_input(){this.select();};
	let update_view = function(e){
		this.view.setZoom(this.elm_zoom.value);
		this.view.setCenter(ol.proj.fromLonLat([this.elm_lon.value, this.elm_lat.value]));
	}.bind(this);
	
	function blur_input(e){
		//alert(e.relatedTarget.type);
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
	//*/
	
	//alert(ol.proj.toLonLat(this.view.getCenter()));
	//alert(ol.proj.fromLonLat([82.9214626, 55.0265031]));
	
	//*/
	
	/// Методы
	
	
	
	
	
	/// Функции
	/*
	function check_data(){
		
	};//*/
	/*
	function toNnn(text){
		this.value_offset_x = parseFloat(this.text_offset_x.value);
		if(!isFinite(this.value_offset_x))this.value_offset_x = 0;
		
	};//*/
	
	
	
};