function Menu(){//Меню игры.
	//прозрачный закрывающей весь экран от действий онклик пользователя прямоугольник.
	this.graf = document.createElementNS(svgns, "g");
	this.stop_screen = document.createElementNS(svgns, "rect");
	this.stop_screen.setAttributeNS(null, "fill", "#000");
	this.stop_screen.setAttributeNS(null, "fill-opacity", "0.5");
	this.stop_screen.obj = this;
	this.stop_screen.onclick = function(){
		this.obj.off();
	}
	this.graf.appendChild(this.stop_screen);
	//подкладка меню.
	this.menu = document.createElementNS(svgns, "g");
	this.backing_w = 300;
	this.backing_h = 500;
	this.backing = document.createElementNS(svgns, "rect");
	this.backing.setAttributeNS(null, "width", this.backing_w);
	this.backing.setAttributeNS(null, "height", this.backing_h);
	this.backing.setAttributeNS(null, "fill", gt_ci);
	this.backing.setAttributeNS(null, "stroke", gt_ci_s);
	this.backing.setAttributeNS(null, "stroke-width", 4);
	this.menu.appendChild(this.backing);
	
	
	
	this.graf.appendChild(this.menu);
	//сверху надпись МЕНЮ.
	//кнопка сохранить.
	//кнопка загрузить.
	//Новая игра.
	//кнопка настройки "сетка". Возможно с галочкой настройка.
	//Настройка цвета интерфейса.
	//кнопка вернутся к игре.
	//############### vremenno #######################
	//*
	
	
	//################################################*/
	this.on = function(){//Открывает меню.
		this.stop_screen.setAttributeNS(null, "width", gi_win_w);
		this.stop_screen.setAttributeNS(null, "height", gi_win_h);
		this.menu.setAttribute("transform", "translate("+((gi_win_w - this.backing_w)/2)+ "," +((gi_win_h - this.backing_h)/2)+ ")");
		svg_window.appendChild(this.graf);
	}
	this.off = function(){//Закрывает меню.
		if(svg_window.contains(this.graf))svg_window.removeChild(this.graf);
	}
	this.full_screen_change = function(){
		if(svg_window.contains(this.graf))this.menu.setAttribute("transform", "translate("+((gi_win_w - this.backing_w)/2)+ "," +((gi_win_h - this.backing_h)/2)+ ")");
	}
	this.button_length = 0;
	this.button_width = 180;
	this.button_height = 30;
	this.f_button = function(text, func, bind){
		func = func || function(){go_window.on("Функция кнопки \""+text+"\" не определена.");};
		bind = bind || this;
		var g = document.createElementNS(svgns, "g");
		var b_rect = document.createElementNS(svgns, "rect");
		b_rect.setAttributeNS(null, "width", this.button_width);
		b_rect.setAttributeNS(null, "height", this.button_height);
		b_rect.setAttributeNS(null, "fill", gt_ci);
		b_rect.setAttributeNS(null, "stroke", gt_ci_s);
		b_rect.setAttributeNS(null, "stroke-width", 1);
		g.appendChild(b_rect);
		g.b_rect = b_rect;
		var b_text = document.createElementNS(svgns, "text");
		b_text.setAttributeNS(null,'x', this.button_width/2);
		//b_text.setAttributeNS(null,'y', (this.button_height/3)/2);
		b_text.setAttributeNS(null, "text-anchor", "middle");
		b_text.setAttributeNS(null, "dy", "1em");
		b_text.setAttributeNS(null,'font-size', (this.button_height/3)*2);
		b_text.setAttributeNS(null,'fill', gt_ci_s);
		b_text.setAttributeNS(null, "pointer-events", "none");
		b_text.textContent = text;
		g.appendChild(b_text);
		g.b_text = b_text;
		g.onmouseover = function(){//Вешаем на кнопку событие появления над ней курсора мыши.
			this.b_text.setAttributeNS(null, "fill", gt_cv);
			this.b_rect.setAttributeNS(null, "stroke", gt_cv);
		}
		g.onmouseout = function(){//Вешаем на кнопку событие ухода курсора мыши с кнопки.
			this.b_text.setAttributeNS(null, "fill", gt_ci_s);
			this.b_rect.setAttributeNS(null, "stroke", gt_ci_s);
		}
		func = func.bind(bind);
		g.onclick = function(){
			this.b_text.setAttributeNS(null, "fill", gt_ci_s);
			this.b_rect.setAttributeNS(null, "stroke", gt_ci_s);
			func();
		}
		g.setAttribute("transform", "translate("+((this.backing_w - this.button_width)/2)+","+(this.button_height+(this.button_height * this.button_length * 1.2))+")");
		this.button_length++;
		this.menu.appendChild(g);
	}
	this.f_button("Сохранить", f_seve_game);
	this.f_button("Загрузить", f_load_game);
	this.f_button("Новая игра", f_new_game);
	this.f_button("Вернутся к игре", this.off);
	this.f_button("Сетка", go_mir.f_grid, go_mir);
}