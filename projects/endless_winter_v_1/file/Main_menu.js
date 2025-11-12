function Main_menu(svg_layer){
	this.svg_layer = svg_layer;
	
	this.graf = document.createElementNS(svgns, "g");
	//this.graf.setAttributeNS(null, "fill", go_colors.bg_main_menu);//Устанавливаем цвет фона элементов главного меню.
	//this.background = document.createElementNS(svgns, "rect");
	//this.graf.appendChild(this.background);
	
	
	
	let language_text = document.createElementNS(svgns, "text");
	language_text.setAttributeNS(null,'fill', go_colors.text);
	language_text.setAttributeNS(null, "dy", "1.25em");
	language_text.setAttributeNS(null, "text-anchor", "end");
	language_text.setAttributeNS(null, "pointer-events", "none");
	language_text.textContent = go_text.language_title+" \u2000";
	this.graf.appendChild(language_text);
	
	
	/*//Перенесено в this.tuning.
	this.graf.appendChild(go_button.full_screen);
	this.graf.appendChild(go_button.language);
	this.graf.appendChild(go_button.volume);
	this.graf.appendChild(go_button.new_game);
	this.graf.appendChild(go_button.load);
	//*/
	
	/* TEST
	let pp = document.createElementNS(svgns, "path");
	pp.setAttributeNS(null, "d", "M28,0 v1000 M0,400 h1000");
	pp.setAttributeNS(null, "fill", "none");
	pp.setAttributeNS(null, "stroke", "#900");//go_colors.b_frame);
	pp.setAttributeNS(null, "stroke-width", 1);
	this.graf.appendChild(pp);//*/
	/* TEST 2
	let uu = document.createElementNS(svgns, "use");
	uu.setAttributeNS(null, "x", 100);
	uu.setAttributeNS(null, "y", 100);
	uu.setAttributeNS(null, "width", 210);
	uu.setAttributeNS(null, "height", 140);
	uu.setAttributeNS(null, "href", "#flag_ru");
	this.graf.appendChild(uu);//*/
	
	
	
	//Методы интерфейса.
	this.tuning = function(){//Настройка интерфейса в соответствии с параметрами экрана.
		//this.background.setAttributeNS(null, "width", go_sizes.g_actual_w);
		//this.background.setAttributeNS(null, "height", go_sizes.g_actual_h);
		if(!this.graf.contains(go_button.full_screen))this.graf.appendChild(go_button.full_screen);
		go_button.full_screen.set_pos(go_sizes.g_actual_w - (go_sizes.b_f_s + go_sizes.b_f_s_margin), go_sizes.g_actual_h - (go_sizes.b_f_s + go_sizes.b_f_s_margin));
		go_button.full_screen.off_focus();
		
		if(!this.graf.contains(go_button.language))this.graf.appendChild(go_button.language);
		go_button.language.set_pos(go_sizes.g_actual_w - (go_sizes.b_w + go_sizes.b_margin), go_sizes.b_margin);
		language_text.setAttributeNS(null, "x", go_sizes.g_actual_w - (go_sizes.b_w + go_sizes.b_margin));
		language_text.setAttributeNS(null, "y", go_sizes.b_margin);
		
		if(!this.graf.contains(go_button.volume))this.graf.appendChild(go_button.volume);
		go_button.volume.set_pos(go_sizes.b_margin, go_sizes.g_actual_h - (go_sizes.b_h + go_sizes.b_margin));
		
		if(!this.graf.contains(go_button.new_game))this.graf.appendChild(go_button.new_game);
		go_button.new_game.set_pos((go_sizes.g_actual_w / 2) - (go_sizes.b_menu_w / 2), (go_sizes.g_actual_h / 3) - (go_sizes.b_h + 5));
		
		if(!this.graf.contains(go_button.load))this.graf.appendChild(go_button.load);
		go_button.load.set_pos((go_sizes.g_actual_w / 2) - (go_sizes.b_menu_w / 2), (go_sizes.g_actual_h / 3) + 5);
		
	}.bind(this);
	this.on = function(){
		if(!this.svg_layer.contains(this.graf)){
			this.tuning();
			this.svg_layer.appendChild(this.graf);
		}
	}
	this.off = function(){
		if(this.svg_layer.contains(this.graf))this.svg_layer.removeChild(this.graf);
	}
	//События интерфейса.
	this.full_screen_change = function(event){//Вызывается, специально созданным событием, при свертывании или развертывании на весь экран окна игры.
		if(this.svg_layer.contains(this.graf))this.tuning();
	};
	go_event_target.addEventListener('my_full_screen_change', this.full_screen_change.bind(this));//Добавляем слушатель, специально созданного события события, которое вызывается при свертывании или развертывании игры на весь экран.
	this.language_change = function(event){//Вызывается, специально созданным событием, при смене языка.
		language_text.textContent = go_text.language_title+" \u2000";
	};
	go_event_target.addEventListener('my_language_change', this.language_change.bind(this));//Добавляем слушатель, специально созданного события, которое вызывается при смене языка.
}