function City_menu(svg_layer){
	this.svg_layer = svg_layer;
	
	this.graf = document.createElementNS(svgns, "g");
	
	let stop_screen = document.createElementNS(svgns, "rect");
	stop_screen.setAttributeNS(null, "fill", go_colors.i_bg);
	/*
	stop_screen.setAttributeNS(null, "fill-opacity", "0.5");
	stop_screen.onclick = function(){
		this.off();
	}.bind(this);
	//*/
	this.graf.appendChild(stop_screen);
	
	
	//тут поле
	this.graf_field = document.createElementNS(svgns, "g");
	this.graf.appendChild(this.graf_field);
	
	
	this.background = document.createElementNS(svgns, "path");
	this.background.setAttributeNS(null, "fill", go_colors.i_bg);//Цвет рамки интерфейса.
	this.background.setAttributeNS(null, "stroke", go_colors.frame);//Цвет контура рамки интерфейса
	this.background.setAttributeNS(null, "stroke-width", 3);//Толщина контура рамки интерфейса.
	this.graf.appendChild(this.background);
	this.exit_test = document.createElementNS(svgns, "path");
	this.exit_test.setAttributeNS(null, "fill", go_colors.i_bg);//Цвет рамки интерфейса.
	this.exit_test.setAttributeNS(null, "stroke", go_colors.frame);//Цвет контура рамки интерфейса
	this.exit_test.setAttributeNS(null, "stroke-width", 3);//Толщина контура рамки интерфейса.
	this.exit_test.onclick = function(){
		this.off();
	}.bind(this);
	this.graf.appendChild(this.exit_test);
	
	//Методы интерфейса.
	this.tuning = function(){//Настройка интерфейса в соответствии с параметрами экрана.
		stop_screen.setAttributeNS(null, "width", go_sizes.g_actual_w);
		stop_screen.setAttributeNS(null, "height", go_sizes.g_actual_h);
		this.background.setAttributeNS(null, "d", "M0 0 H"+go_sizes.g_actual_w+" V"+go_sizes.g_actual_h+" H0 z M"+go_sizes.interf_m+","+go_sizes.interf_m+" V"+(go_sizes.g_actual_h - go_sizes.interf_m)+" H"+(go_sizes.g_actual_w - go_sizes.interf_m_r)+" V"+go_sizes.interf_m+" z");
		this.exit_test.setAttributeNS(null, "d", "M"+(go_sizes.g_actual_w - 80)+",10 h70 v30 h-70 z");
		
	}.bind(this);
	this.on = function(city){
		if(!this.svg_layer.contains(this.graf)){
			this.tuning();
			go_field.center();
			this.graf_field.appendChild(go_field.graf);
			
			this.svg_layer.appendChild(this.graf);
		}
		out(city.picture.getAttribute("transform"));
	}
	this.off = function(){
		if(this.svg_layer.contains(this.graf))this.svg_layer.removeChild(this.graf);
	}
	//События интерфейса.
	this.full_screen_change = function(event){//Вызывается, специально созданным событием, при свертывании или развертывании на весь экран окна игры.
		if(this.svg_layer.contains(this.graf))this.tuning();
	};
	go_event_target.addEventListener('my_full_screen_change', this.full_screen_change.bind(this));//Добавляем слушатель, специально созданного события события, которое вызывается при свертывании или развертывании игры на весь экран.
	
	/*
	this.language_change = function(event){//Вызывается, специально созданным событием, при смене языка.
		
	};
	go_event_target.addEventListener('my_language_change', this.language_change.bind(this));//Добавляем слушатель, специально созданного события, которое вызывается при смене языка.
	//*/
}