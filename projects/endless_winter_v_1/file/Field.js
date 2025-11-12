function Field(){
	this.width = 52;
	this.height = 52;
	this.graf = document.createElementNS(svgns, "g");
	this.cell_layer = document.createElementNS(svgns, "g");
	this.graf.appendChild(this.cell_layer);
	this.cells_arr = [];
	for(let y = 0; y < this.height; y++){
		for(let x = 0; x < this.width; x++){
			this.cells_arr[this.cells_arr.length] = new Cell(this.cells_arr.length, x, y, this);
		}
	}
	
	this.flag_move_field = false;
	this.offset_to_x = 0;
	this.offset_to_y = 0;
	this.distance_to_x = 0;
	this.distance_to_y = 0;
	this.mouse_to_x;
	this.mouse_to_y;
	this.scale = 1;
	this.graf.onmousedown = function(event){
		if(event.which == 1){
			this.flag_move_field = true;
			this.mouse_to_x = event.clientX;
			this.mouse_to_y = event.clientY;
		}
	}.bind(this);
	this.graf.onmouseup = function(event){
		if(event.which == 1){
			this.flag_move_field = false;
			this.offset_to_x = this.distance_to_x;
			this.offset_to_y = this.distance_to_y;
		}
		if(event.which == 2){
			this.scale = 1;
			this.center();
		}
		if(event.which == 3){
			this.center();
		}
	}.bind(this);
	this.graf.onmousemove = function(event){
		if(this.flag_move_field){
			let x = this.offset_to_x + (event.clientX - this.mouse_to_x);
			let y = this.offset_to_y + (event.clientY - this.mouse_to_y);
			this.graf.setAttribute("transform", "translate("+x+ "," +y+ ") scale("+this.scale+")");
			this.distance_to_x = x;
			this.distance_to_y = y;
		}
	}.bind(this);
	this.graf.addEventListener("wheel", function(event){//Событие прокрутки колесика мышки, на игровой карте при котором приближаем или удаляем игровую карту относительно позиции курсора мыши.
		//Устанавливаем размер дельты 3 как в браузере Mozilla Firefox.
		let deltaY = 3 * Math.sign(event.deltaY);//Для совместимости браузеров, от дельты берем только знак. Так как в разных браузерах разное значение дельты.
		//Положение курсора относительно основного окна игры.
		let offsetX = event.clientX - svg.getBoundingClientRect().left;
		let offsetY = event.clientY - svg.getBoundingClientRect().top;
		//Расстояние между картой и курсором.
		let distance_x = offsetX - this.offset_to_x;
		let distance_y = offsetY - this.offset_to_y;
		//Расстояние между картой и курсором, в изначальном масштабе 1 к 1.
		let primary_distance_x = distance_x / this.scale;
		let primary_distance_y = distance_y / this.scale;
		//Устанавливаем новый коэффициент масштаба.
		this.scale += deltaY / 100 * this.scale;//Старый масштаб плюс количество прокрутки колесика мыши. Делим на 100 чтоб плавно масштабировалось. И умножаем на текущий масштаб чтоб равномерно увеличиволось и уменьшалось. Так как, например, при сильно увеличенном масштабе, ещё увеличение на тоже значение мало заметно.
		if(this.scale > 3)this.scale = 3;//Устанавливаем максимальный коэффициент масштаба.
		if(this.scale < 0.3)this.scale = 0.3;//Устанавливаем минимальный коэффициент масштаба.
		//Расстояние между картой и курсором, в новом масштабе.
		let new_distance_x = primary_distance_x * this.scale;
		let new_distance_y = primary_distance_y * this.scale;
		//Расстояние на которое следует сместить игровую карту относительно текущей позиции.
		let shift_map_x = new_distance_x - distance_x;
		let shift_map_y = new_distance_y - distance_y;
		//Новые координаты карты, после масштабирования.
		this.offset_to_x -= shift_map_x;
		this.offset_to_y -= shift_map_y;
		//Масштабируем на коэффициент масштаба и одновременно смещаем на новые координаты игровую карту, в матрице трансформации.
		this.graf.setAttribute("transform", "matrix("+this.scale+" 0 0 "+this.scale+" "+this.offset_to_x+" "+this.offset_to_y+")");
		//Делаем так чтоб браузер не реагировал стандартно на прокрутку колесика мыши пытаясь сместить страницу.
		event.preventDefault();
		return false;
	}.bind(this));
	this.center = function(){
		let x = (((go_sizes.g_actual_w - (go_sizes.interf_m_r + go_sizes.interf_m)) / 2) + go_sizes.interf_m) - ((this.width / 2 * go_sizes.cell) * this.scale);
		let y = (((go_sizes.g_actual_h - (go_sizes.interf_m * 2)) / 2) + go_sizes.interf_m) - ((this.height / 2 * go_sizes.cell) * this.scale);
		this.set_pos(x, y);
	}.bind(this);
	this.set_pos = function(x, y){
		this.offset_to_x = x;
		this.offset_to_y = y;
		this.graf.setAttribute("transform", "translate("+this.offset_to_x+ "," +this.offset_to_y+ ") scale("+this.scale+")");
	}.bind(this);
}
function Cell(id, x, y, parent){
	this,parent = parent;
	this.id = id;
	this.x = x;
	this.y = y;
	this.size = go_sizes.cell;
	this.x_px = x * this.size;
	this.y_px = y * this.size;
	this.block = 0;
	/*
	this.graf = document.createElementNS(svgns, "rect");
	this.graf.setAttributeNS(null, "width", this.size);
	this.graf.setAttributeNS(null, "height", this.size);
	this.graf.setAttributeNS(null, "x", this.x_px);
	this.graf.setAttributeNS(null, "y", this.y_px);
	//*/
	//*
	this.graf = document.createElementNS(svgns, "path");
	this.graf.setAttributeNS(null, "d", "M"+this.x_px+","+this.y_px+" h"+this.size+" v"+this.size+" h-"+this.size+" z");
	//*/
	
	this.graf.setAttributeNS(null, "fill", go_colors.i_bg);
	this.graf.setAttributeNS(null, "stroke", go_colors.frame);
	this.graf.setAttributeNS(null, "stroke-width", 1);
	
	this.graf.onclick = function(){
		out("id = "+this.id+"; x = "+this.x+"; y = "+this.y);
	}.bind(this);
	
	this,parent.cell_layer.appendChild(this.graf);
}