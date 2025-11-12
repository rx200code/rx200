function Menu(svg_layer){
	this.svg_layer = svg_layer;
	
	this.graf = document.createElementNS(svgns, "g");
	
	let stop_screen = document.createElementNS(svgns, "rect");
	stop_screen.setAttributeNS(null, "fill", "#000");
	stop_screen.setAttributeNS(null, "fill-opacity", "0.5");
	stop_screen.onclick = function(){
		this.off();
	}.bind(this);
	this.graf.appendChild(stop_screen);
	
	let background = document.createElementNS(svgns, "path");
	background.setAttributeNS(null, "fill", go_colors.i_bg);//Цвет рамки интерфейса.
	background.setAttributeNS(null, "stroke", go_colors.frame);//Цвет контура рамки интерфейса
	background.setAttributeNS(null, "stroke-width", 3);//Толщина контура рамки интерфейса.
	this.graf.appendChild(background);
	
	let text = document.createElementNS(svgns, "text");
	text.setAttributeNS(null,'fill', go_colors.text);
	text.setAttributeNS(null, "y", "115");
	text.setAttributeNS(null, "dy", "0.5ex");
	text.setAttributeNS(null, "text-anchor", "middle");
	text.setAttributeNS(null, "pointer-events", "none");
	text.textContent = go_text.menu;
	this.graf.appendChild(text);
	
	
	
	//Методы интерфейса.
	this.tuning = function(){//Настройка интерфейса в соответствии с параметрами экрана.
		stop_screen.setAttributeNS(null, "width", go_sizes.g_actual_w);
		stop_screen.setAttributeNS(null, "height", go_sizes.g_actual_h);
		
		background.setAttributeNS(null, "d", "M"+(go_sizes.g_actual_w / 2 - go_sizes.menu_w / 2)+" 100 H"+(go_sizes.g_actual_w / 2 + go_sizes.menu_w / 2)+" V600 H"+(go_sizes.g_actual_w / 2 - go_sizes.menu_w / 2)+" z");
		
		text.setAttributeNS(null, "dx", go_sizes.g_actual_w / 2);
		
		if(!this.graf.contains(go_button.save))this.graf.appendChild(go_button.save);
		go_button.save.set_pos((go_sizes.g_actual_w / 2) - (go_sizes.b_menu_w / 2), 130);
		
		if(!this.graf.contains(go_button.load))this.graf.appendChild(go_button.load);
		go_button.load.set_pos((go_sizes.g_actual_w / 2) - (go_sizes.b_menu_w / 2), 170);
		
		if(!this.graf.contains(go_button.new_game))this.graf.appendChild(go_button.new_game);
		go_button.new_game.set_pos((go_sizes.g_actual_w / 2) - (go_sizes.b_menu_w / 2), 210);
		
		if(!this.graf.contains(go_button.continue_game))this.graf.appendChild(go_button.continue_game);
		go_button.continue_game.set_pos((go_sizes.g_actual_w / 2) - (go_sizes.b_menu_w / 2), 250);
		
		if(!this.graf.contains(go_button.end_game))this.graf.appendChild(go_button.end_game);
		go_button.end_game.set_pos((go_sizes.g_actual_w / 2) - (go_sizes.b_menu_w / 2), 290);
		
		if(!this.graf.contains(go_button.main_menu))this.graf.appendChild(go_button.main_menu);
		go_button.main_menu.set_pos((go_sizes.g_actual_w / 2) - (go_sizes.b_menu_w / 2), 330);
		
		if(!this.graf.contains(go_button.grid))this.graf.appendChild(go_button.grid);
		go_button.grid.set_pos((go_sizes.g_actual_w / 2) - (go_sizes.b_menu_w / 2), 370);
		
		if(!this.graf.contains(go_button.full_screen_menu))this.graf.appendChild(go_button.full_screen_menu);
		go_button.full_screen_menu.set_pos((go_sizes.g_actual_w / 2) - (go_sizes.b_menu_w / 2), 410);
		
		if(!this.graf.contains(go_button.language))this.graf.appendChild(go_button.language);
		go_button.language.set_pos((go_sizes.g_actual_w / 2) - (go_sizes.b_w / 2), 450);
		
		if(!this.graf.contains(go_button.volume))this.graf.appendChild(go_button.volume);
		go_button.volume.set_pos((go_sizes.g_actual_w / 2) - (go_sizes.menu_w / 2 - 10), 560);
		
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
		text.textContent = go_text.menu;
	};
	go_event_target.addEventListener('my_language_change', this.language_change.bind(this));//Добавляем слушатель, специально созданного события, которое вызывается при смене языка.
}