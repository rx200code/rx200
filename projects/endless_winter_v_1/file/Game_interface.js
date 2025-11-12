function Game_interface(svg_layer){
	this.svg_layer = svg_layer;
	
	this.graf = document.createElementNS(svgns, "g");
	
	this.background = document.createElementNS(svgns, "path");
	this.background.setAttributeNS(null, "fill", go_colors.i_bg);//Цвет рамки интерфейса.
	this.background.setAttributeNS(null, "stroke", go_colors.frame);//Цвет контура рамки интерфейса
	this.background.setAttributeNS(null, "stroke-width", 3);//Толщина контура рамки интерфейса.
	this.graf.appendChild(this.background);
	
	let gold_text = document.createElementNS(svgns, "text");
	gold_text.setAttributeNS(null,'fill', go_colors.text);
	gold_text.setAttributeNS(null, "x", "30");
	gold_text.setAttributeNS(null, "dy", "1.25em");
	gold_text.setAttributeNS(null, "text-anchor", "start");
	gold_text.setAttributeNS(null, "pointer-events", "none");
	gold_text.textContent = "Gold";
	this.graf.appendChild(gold_text);
	this.gold = function(gold){
		gold_text.textContent = "Gold "+gold;
	}
	
	/* TEST
	let pp = document.createElementNS(svgns, "path");
	pp.setAttributeNS(null, "d", "M30,0 v1000 M0,30 h1000");
	pp.setAttributeNS(null, "fill", "none");
	pp.setAttributeNS(null, "stroke", "#900");//go_colors.b_frame);
	pp.setAttributeNS(null, "stroke-width", 1);
	this.graf.appendChild(pp);//*/

	
	
	//Методы интерфейса.
	this.tuning = function(){//Настройка интерфейса в соответствии с параметрами экрана.
		this.background.setAttributeNS(null, "d", "M0 0 H"+go_sizes.g_actual_w+" V"+go_sizes.g_actual_h+" H0 z M"+go_sizes.interf_m+","+go_sizes.interf_m+" V"+(go_sizes.g_actual_h - go_sizes.interf_m)+" H"+(go_sizes.g_actual_w - go_sizes.interf_m_r)+" V"+go_sizes.interf_m+" z");
		
		if(!this.graf.contains(go_button.full_screen))this.graf.appendChild(go_button.full_screen);
		go_button.full_screen.set_pos(go_sizes.g_actual_w - (go_sizes.b_f_s + go_sizes.b_f_s_margin), go_sizes.g_actual_h - (go_sizes.b_f_s + go_sizes.b_f_s_margin));
		go_button.full_screen.off_focus();
		
		if(!this.graf.contains(go_button.menu))this.graf.appendChild(go_button.menu);
		go_button.menu.set_pos((go_sizes.g_actual_w - 55), 5);
		
		this.gold(go_player.gold);
		
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
	/*
	this.language_change = function(event){//Вызывается, специально созданным событием, при смене языка.
		
	};
	go_event_target.addEventListener('my_language_change', this.language_change.bind(this));//Добавляем слушатель, специально созданного события, которое вызывается при смене языка.
	//*/
}