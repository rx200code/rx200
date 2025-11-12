function Manager_setting(){
	go_text.language = manager_data.language;
	go_sizes.volume_all = manager_data.volume_all;
	go_sizes.volume_music = manager_data.volume_music;
	go_sizes.volume_effect = manager_data.volume_effect;
	//go_text.language = "en";//test
	document.title = go_text.game_name;//Устанавливаем заголовок браузера.
	//svg_main_menu.setAttributeNS(null, "fill", go_colors.bg_main_menu);//Устанавливаем цвет слоя для главного меню.
	svg.setAttributeNS(null, "width", go_sizes.g_i_w);//Ширина игрового окна.
	svg.setAttributeNS(null, "height", go_sizes.g_i_h);//Высота игрового окна.
	svg.style['background-color'] = go_colors.g_bg;//Устанавливаем фон всей игры.
	//svg.style['cursor'] = "none";//Убираем изображение курсора, чтобы поставить свой.
	//Создаем глобальные объекты игры.
	go_sound = new Sound();
	go_graf = new Graf();
	
	go_button = new Button();
	go_main_menu = new Main_menu(svg_main_menu);
	go_interf = new Game_interface(svg_interf);
	go_city_menu = new City_menu(svg_city_menu);
	go_menu = new Menu(svg_menu);
	go_field = new Field();
	//События.
	document.onfullscreenchange = function(event){
		go_event_target.dispatchEvent(new Event('my_full_screen_change'));
		
	}
	svg.oncontextmenu = function(){//Браузер не реагирует стандартно на правый клик мышке в игре.
		return false;
	}
	this.language_change = function(event){//Вызывается, специально созданным событием, при смене языка.
		manager_data.language = go_text.language;//Сохраняем новый язык.
		document.title = go_text.game_name;//Устанавливаем заголовок браузера на новом языке.
	};
	go_event_target.addEventListener('my_language_change', this.language_change);//Добавляем слушатель, специально созданного события, которое вызывается при смене языка.
}