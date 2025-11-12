function Interf(){//Пользовательский интерфейс.
	this.type = "Interf";
	this.indent_top = 30;//Толщина рамки с сверху.
	this.indent_down = 30;//Толщина рамки с снизу.
	this.indent_left = 30;//Толщина рамки с лева.
	this.indent_right = 200;//Толщина рамки с права. где и расположены основные кнопки управления, мини карта, и предпологается вывод другой интерактивной информции.
	this.indent_right_off_f_s = this.indent_right;//Толщина рамки с права. при выходе из полноэкранного режима игры.
	this.indent_right_on_f_s = 300;//Толщина рамки с права. в полноэкранном режиме игры.
	this.indent_color = gt_ci;//Цвет интерфейса, берем из глобальных настроек игры.
	this.stroke_w = 4;//Толщина контура рамки интерфейса.
	this.stroke_color = gt_ci_s;//Цвет контура рамки интерфейса, берем из глобальных настроек игры.
	this.focus_color = gt_cv;//Цвет фокуса, выделенного, стандартный как у выделленного объекта.
	//Рамка интерфейса.
	this.interf_frame = document.createElementNS(svgns, "path");//Рисуем саму рамку интерфейса.
	this.interf_frame.setAttributeNS(null, "d", "M0 0 h"+gi_win_w+" v"+gi_win_h+" h-"+gi_win_w+"z M"+this.indent_left+" "+this.indent_top+" v"+(gi_win_h-(this.indent_top+this.indent_down))+" h"+(gi_win_w-(this.indent_left+this.indent_right))+" v-"+(gi_win_h-(this.indent_top+this.indent_down))+"z");
	this.interf_frame.setAttributeNS(null, "fill", this.indent_color);//Цвет рамки интерфейса.
	this.interf_frame.setAttributeNS(null, "stroke", this.stroke_color);//Цвет контура рамки интерфейса
	this.interf_frame.setAttributeNS(null, "stroke-width", this.stroke_w);//Толщина контура рамки интерфейса.
	this.interf_frame.obj = this;
	//Кнопка свернуть/развернуть на весь экран.
	this.button_full_screen = document.createElementNS(svgns, "g");//Контейнер для конпки развернуть/свернуть на весь экран. Сокращенно b_f_s.
	this.title_b_f_s = document.createElementNS(svgns, "title");//Всплывающая подсказка кнопки, всплывает при наведении курсора.
	this.title_b_f_s.textContent = "Во весь экран";//Всплывающий текст кнопки.
	this.button_full_screen.appendChild(this.title_b_f_s);//Добавляем подсказку в контент кнопки.
	this.size_b_f_s = 30;//Общий размер кнопки. по высоте и ширене.
	this.margin_b_f_s = 5;//Отступ кнопки от нижнего правого угла окна игры, по оси "x" и по оси "y"
	this.backing_b_f_s = document.createElementNS(svgns, "rect");//Рисуем подкладку для кнопки, прямоугольник.
	this.backing_b_f_s.setAttributeNS(null, "width", this.size_b_f_s);//Ширина кнопки.
	this.backing_b_f_s.setAttributeNS(null, "height", this.size_b_f_s);//Высота кнопки.
	this.backing_b_f_s.setAttributeNS(null, "fill", this.indent_color);//Цвет кнопки такойже как и рамки интерфейса.
	this.backing_b_f_s.setAttributeNS(null, "stroke", this.stroke_color);//Цвет контура кнопки, такой же как и у контура интерфейса.
	this.backing_b_f_s.setAttributeNS(null, "stroke-width", 1);//Толщина контура кнопки.
	this.button_full_screen.appendChild(this.backing_b_f_s);//Добовляем подкладку кнопки в контент кнопки.
	this.padding_b_f_s = 5;//Отступ рисунка кнопки от внутреннего края кнопки.
	this.picture_size_el = (this.size_b_f_s - (this.padding_b_f_s*2))/3;//Длина одного элемента ресунка кнопки, равно ширина кнопки минус внутринние отступы с каждой стороны, и деленое на три.
	this.picture_on_full = "M"+this.padding_b_f_s+" "+(this.padding_b_f_s+this.picture_size_el)+" h"+this.picture_size_el+" v-"+this.picture_size_el+" m"+this.picture_size_el+" 0 v"+this.picture_size_el+" h"+this.picture_size_el+" m 0 "+this.picture_size_el+" h-"+this.picture_size_el+" v"+this.picture_size_el+" m -"+this.picture_size_el+" 0 v-"+this.picture_size_el+" h-"+this.picture_size_el;//Рисунок кнопки когда окно игры развернуто на весь экран. Стрелками во внутрь.
	this.picture_off_full = "M"+this.padding_b_f_s+" "+(this.padding_b_f_s+this.picture_size_el)+" v-"+this.picture_size_el+" h"+this.picture_size_el+" m"+this.picture_size_el+" 0 h"+this.picture_size_el+" v"+this.picture_size_el+" m 0 "+this.picture_size_el+" v"+this.picture_size_el+" h-"+this.picture_size_el+" m -"+this.picture_size_el+" 0 h-"+this.picture_size_el+" v-"+this.picture_size_el;//Рисунок кнопки когда окно игры свернуто(не на весь экран). Стрелками от центра.
	this.picture_b_f_s = document.createElementNS(svgns, "path");//Картинка кнопки линия(<path>).
	this.picture_b_f_s.setAttributeNS(null, "d", this.picture_off_full);//Рисуем картинку кнопки, стрелками от центра.
	this.picture_b_f_s.setAttributeNS(null, "fill", "none");//Заливка отсутствует.
	this.picture_b_f_s.setAttributeNS(null, "stroke", this.stroke_color);//Устанавливаем цвет линий рисунка кнопки.
	this.picture_b_f_s.setAttributeNS(null, "stroke-width", 1);//Толщина линий рисунка кнопки.
	this.button_full_screen.appendChild(this.picture_b_f_s);//Добавляем рисунок кнопки в контент кнопки.
	this.button_full_screen.setAttribute("transform", "translate("+(gi_win_w - this.size_b_f_s - this.margin_b_f_s)+ "," +(gi_win_h - this.size_b_f_s - this.margin_b_f_s)+ ")");//Смещаем кнопку к нижнему правому углу интерфейса, где обычно и располагаются такие кнопки, что будет интуитивно понятно.
	this.button_full_screen.obj = this;//добавляем в контент кнопки ссылку на сам объект интерфейса, для удобного доступа из событий кнопки к её элементам.
	this.button_full_screen.onmouseover = function(){//Вешаем на кнопку событие появления над ней курсора мыши.
		this.obj.picture_b_f_s.setAttributeNS(null, "fill", this.obj.focus_color);//При наведении мыши на кнопку изображение кнопки получает заливку цвета фокуса интерфейса.
		this.obj.backing_b_f_s.setAttributeNS(null, "stroke", this.obj.focus_color);//И контур самой кнопки получает цвет "выделенного/в фокусе" объекта.
	}
	this.button_full_screen.onmouseout = function(){//Вешаем на кнопку событие ухода курсора мыши с кнопки.
		this.obj.picture_b_f_s.setAttributeNS(null, "fill", "none");//Обратно с рисунка кнопки убираем заливку.
		this.obj.backing_b_f_s.setAttributeNS(null, "stroke", this.obj.stroke_color);//Цвет контура кнопки обратно меняем на цвет контура интерфецса.
	}
	this.button_full_screen.onclick = function(){//Вешаем на кнопку событие нажатие мышью.
		f_full_screen();//Функция развертывает окно игры SVG на весь экран, а при развернутом экране свертывает окно игры SVG обратно к прежнему состоянию.
	}
	//Кнопка ход.
	this.radius_run = 40;//Радиус кнопки ход.
	this.margin_run = 30;//Отступ кнопки ход от низа интерфейса и от правого края левоу рамки интерфейса.
	this.button_run = document.createElementNS(svgns, "g");//Контейнер для конпки ход.
	this.title_run = document.createElementNS(svgns, "title");//Всплывающая подсказка кнопки, всплывает при наведении курсора.
	this.title_run.textContent = "Завершить ход";//Всплывающий текст кнопки.
	this.button_run.appendChild(this.title_run);//Добавляем подсказку в контент кнопки.
	this.backing_run = document.createElementNS(svgns, "circle");//Подкладка кнопки ход, в виде круга.
	this.backing_run.setAttributeNS(null, "cx", this.radius_run);//Устанавливаем координату "x" конпки ход относительно её контента.
	this.backing_run.setAttributeNS(null, "cy", this.radius_run);//Устанавливаем координату "y" конпки ход относительно её контента.
	this.backing_run.setAttributeNS(null, "r", this.radius_run);//Устанавливаем радиус кнопки ход.
	this.backing_run.setAttributeNS(null, "fill", this.indent_color);//Устанавливаем цвет кнопки ход как у интерфейса.
	this.backing_run.setAttributeNS(null, "stroke", this.stroke_color);//Устанавливаем цвет контура кнопки ход как у контура интерфейск.
	this.backing_run.setAttributeNS(null, "stroke-width", 1);//Ширина контура кнопки ход.
	this.text_run = document.createElementNS(svgns, "text");//Текст кнопки ход.
	this.text_run.setAttributeNS(null,'x',this.radius_run);//Координата "x" текста, устанавливаем в центр кнопки.
	this.text_run.setAttributeNS(null,'y',this.radius_run);//Координата "y" текста, устанавливаем в центр кнопки.
	this.text_run.setAttributeNS(null, "text-anchor", "middle");//Центрируем текст по оси "x".
	this.text_run.setAttributeNS(null, "dy", ".3em");//Центрируем текст по оси "y".//Другой способ центрирования по оси "y". this.text_run.setAttributeNS(null, "dominant-baseline", "middle");
	this.text_run.setAttributeNS(null,'font-size', this.radius_run/2);//Размер текста.
	this.text_run.setAttributeNS(null,'fill', this.stroke_color);//цвет текста, такойже как и у контора интерфейса, стандартный.
	this.text_run.setAttributeNS(null, "pointer-events", "none");//Не реагирует на события мыши, пропуская их дальше.
	this.text_run.textContent = "ХОД";//Вводим сам текст на кнопке.
	this.button_run.appendChild(this.backing_run);//Добавляем подкладку кнопки ход в контент кнопки.
	this.button_run.appendChild(this.text_run);//Добавляем текст на кнопку.
	this.button_run.setAttribute("transform", "translate("+(gi_win_w - (this.indent_right - this.margin_run))+ "," +(gi_win_h - (this.margin_run + (this.radius_run * 2)))+ ")");//Устанавливаем кнопку ход, внизу с лева, правой рамки интерфейса.
	this.button_run.obj = this;//добавляем в контент кнопки ссылку на сам объект интерфейса, для удобного доступа из событий кнопки к её элементам.
	this.button_run.onmouseover = function(){//Вешаем на кнопку событие появления над ней курсора мыши.
		this.obj.text_run.setAttributeNS(null, "fill", this.obj.focus_color);//При наведении мыши на кнопку текст становится цвета ывделенного объекта.
		this.obj.backing_run.setAttributeNS(null, "stroke", this.obj.focus_color);//И контур самой кнопки получает цвет "выделенного/в фокусе" объекта.
	}
	this.button_run.onmouseout = function(){//Вешаем на кнопку событие ухода курсора мыши с кнопки.
		this.obj.text_run.setAttributeNS(null, "fill", this.obj.stroke_color);//Обратно меняем цвет текста на цвет контура интерфецса.
		this.obj.backing_run.setAttributeNS(null, "stroke", this.obj.stroke_color);//Цвет контура кнопки обратно меняем на цвет контура интерфецса.
	}
	this.button_run.onclick = function(){//Вешаем на кнопку событие нажатие мышью.
		ga_run[gi_id_player] = true;
		f_run();//Функхия хода.
	}
	//Кнопка меню.
	this.button_menu = document.createElementNS(svgns, "g");//Контейнер для конпки меню.
	this.title_menu = document.createElementNS(svgns, "title");//Всплывающая подсказка кнопки, всплывает при наведении курсора.
	this.title_menu.textContent = "Меню";//Всплывающий текст кнопки.
	this.button_menu.appendChild(this.title_menu);//Добавляем подсказку в контент кнопки.
	
	this.backing_menu_d = "M 0 0 h60 v22 h-60 z";
	this.backing_menu = document.createElementNS(svgns, "path");
	this.backing_menu.setAttributeNS(null, "d", this.backing_menu_d);
	this.backing_menu.setAttributeNS(null, "fill", this.indent_color);//Цвет рамки интерфейса.
	this.backing_menu.setAttributeNS(null, "stroke", this.stroke_color);//Цвет контура рамки интерфейса
	this.backing_menu.setAttributeNS(null, "stroke-width", 1);//Толщина контура кнопки.
	
	this.text_menu = document.createElementNS(svgns, "text");//Текст кнопки меню.
	this.text_menu.setAttributeNS(null,'x', 30);//Координата "x" текста.
	this.text_menu.setAttributeNS(null,'y', 0);//Координата "y" текста.
	this.text_menu.setAttributeNS(null, "text-anchor", "middle");//Центрируем текст по оси "x".
	this.text_menu.setAttributeNS(null, "dy", "1.1em");//
	this.text_menu.setAttributeNS(null,'font-size', 14);//Размер текста.
	this.text_menu.setAttributeNS(null,'fill', this.stroke_color);//цвет текста, такойже как и у контора интерфейса, стандартный.
	this.text_menu.setAttributeNS(null, "pointer-events", "none");//Не реагирует на события мыши, пропуская их дальше.
	this.text_menu.textContent = "МЕНЮ";//Вводим сам текст на кнопке.
	this.button_menu.appendChild(this.backing_menu);//Добавляем подкладку кнопки меню в контент кнопки.
	this.button_menu.appendChild(this.text_menu);//Добавляем текст на кнопку.
	this.button_menu.setAttribute("transform", "translate("+(gi_win_w - (64))+ "," +(4)+ ")");//Позиционируем кнопку меню.
	this.button_menu.obj = this;//добавляем в контент кнопки ссылку на сам объект интерфейса, для удобного доступа из событий кнопки к её элементам.
	this.button_menu.onmouseover = function(){//Вешаем на кнопку событие появления над ней курсора мыши.
		this.obj.text_menu.setAttributeNS(null, "fill", this.obj.focus_color);//При наведении мыши на кнопку текст становится цвета ывделенного объекта.
		this.obj.backing_menu.setAttributeNS(null, "stroke", this.obj.focus_color);//И контур самой кнопки получает цвет "выделенного/в фокусе" объекта.
	}
	this.button_menu.onmouseout = function(){//Вешаем на кнопку событие ухода курсора мыши с кнопки.
		this.obj.text_menu.setAttributeNS(null, "fill", this.obj.stroke_color);//Обратно меняем цвет текста на цвет контура интерфецса.
		this.obj.backing_menu.setAttributeNS(null, "stroke", this.obj.stroke_color);//Цвет контура кнопки обратно меняем на цвет контура интерфецса.
	}
	this.button_menu.onclick = function(){//Вешаем на кнопку событие нажатие мышью.
		go_menu.on();//Выводим меню.
	}
	//мини карта.
	this.mini_map1 = document.createElementNS(svgns, "use");
	this.mini_map1.setAttributeNS(null, "href", "#svg_1");//Добовляем клоны по слоям, чтоб трансформация на всю игровую карту svg_group не сказовалась на мини карте.
	this.mini_map1.setAttributeNS(null, "x", 0);
	this.mini_map1.setAttributeNS(null, "y", 0);
	this.mini_map2 = document.createElementNS(svgns, "use");
	this.mini_map2.setAttributeNS(null, "href", "#svg_2");
	this.mini_map2.setAttributeNS(null, "x", 0);
	this.mini_map2.setAttributeNS(null, "y", 0);
	this.mini_map3 = document.createElementNS(svgns, "use");
	this.mini_map3.setAttributeNS(null, "href", "#svg_3");
	this.mini_map3.setAttributeNS(null, "x", 0);
	this.mini_map3.setAttributeNS(null, "y", 0);
	this.mini_map4 = document.createElementNS(svgns, "use");
	this.mini_map4.setAttributeNS(null, "href", "#svg_4");
	this.mini_map4.setAttributeNS(null, "x", 0);
	this.mini_map4.setAttributeNS(null, "y", 0);
	this.indent_mini_map = 5;//Отступ мини карты от краев интерфейса по бокам.
	this.mini_map_g = document.createElementNS(svgns, "g");//Контенер для всех слоев миникарты.
	this.mini_map_g.setAttribute("transform", "matrix("+((this.indent_right - (this.indent_mini_map * 2))/gi_kw)+" 0 0 "+((this.indent_right - (this.indent_mini_map * 2))/gi_kw)+" "+(gi_win_w - (this.indent_right - this.indent_mini_map))+" "+this.indent_top+")");//Трансформируем до нужного размера(Масштаб мини карты. = ширина левой рамки интерфейса, на которой и расположена мини карта, минус удвоенный(тоже что по разу с каждой стороны) отступ от рамки интерфейса, и результат деленый на всю ширину игровой карты) и устанавливаем с права вверху на пользовательском интерфейсе. Отступ с верху по верхней рамки.
	this.mini_map_g.appendChild(this.mini_map1);//Добавляем все слои мини карты по очереди в контент мини карты.
	this.mini_map_g.appendChild(this.mini_map2);
	this.mini_map_g.appendChild(this.mini_map3);
	this.mini_map_g.appendChild(this.mini_map4);
	this.mini_map_g.obj = this;//Добовляем к миникарте ссылку на сам обект интерфейса, это нужно для удобного доступа к всему интерфейсу из событий мини карты.
	this.mini_map_g.onclick = function(event){//Вешаем на мини карту событие клик мыши, по которому центрируем игровое окно по игровой карте там где был клик на миникарте.
		svg_group.setAttribute("transform", "matrix("+gi_scale+" 0 0 "+gi_scale+" "+((((gi_win_w - (this.obj.indent_left+this.obj.indent_right))/2)+this.obj.indent_left) - (((event.pageX - this.getBoundingClientRect().x)/((this.obj.indent_right - (this.obj.indent_mini_map * 2))/gi_kw))*gi_scale))+" "+((((gi_win_h - (this.obj.indent_top+this.obj.indent_down))/2)+this.obj.indent_top) - (((event.pageY - this.getBoundingClientRect().y)/((this.obj.indent_right - (this.obj.indent_mini_map * 2))/gi_kw))*gi_scale))+")");
	}
	//Методы пользовательского интерфейса.
	this.full_screen_change = function(){//Функция настраивает пользовательский интерфейс в соответствии с новыми параметрами окна игры. При событии свернуть/развернуть на весь экран.
		if(window.fullScreen){//При развертывании игры на весь экран.
			this.indent_right = this.indent_right_on_f_s;//При развертывании игры на весь экран меняем ширину правой стороны рамки интерфейса на более широкую, что выглядит лучше и удобнее.
			this.picture_b_f_s.setAttributeNS(null, "d", this.picture_on_full);//перерисовываем изображение кнопки свернуть/развернуть на весь экран стрелками к центру кнопки.
			this.title_b_f_s.textContent = "Выход из полноэкранного режима";//Меняем всплывающий текст на кнопке свернуть/развернуть на весь экран.
		}else{
			this.indent_right = this.indent_right_off_f_s;//При свертовании обратно меняем шерену правой боковой панели интерфейса на более узкую.
			this.picture_b_f_s.setAttributeNS(null, "d", this.picture_off_full);//перерисовываем изображение кнопки свернуть/развернуть на весь экран стрелками от центра кнопки.
			this.title_b_f_s.textContent = "Во весь экран";//Меняем всплывающий текст на кнопке свернуть/развернуть на весь экран.
		}
		this.interf_frame.setAttributeNS(null, "d", "M0 0 h"+gi_win_w+" v"+gi_win_h+" h-"+gi_win_w+"z M"+this.indent_left+" "+this.indent_top+" v"+(gi_win_h-(this.indent_top+this.indent_down))+" h"+(gi_win_w-(this.indent_left+this.indent_right))+" v-"+(gi_win_h-(this.indent_top+this.indent_down))+"z");//Перерисовываем рамку интерфейса.
		this.button_full_screen.setAttribute("transform", "translate("+(gi_win_w - this.size_b_f_s - this.margin_b_f_s)+ "," +(gi_win_h - this.size_b_f_s - this.margin_b_f_s)+ ")");//Устанавливаем новое положение кнопки свернуть/развернуть на весь экран.
		this.button_run.setAttribute("transform", "translate("+(gi_win_w - (this.indent_right - this.margin_run))+ "," +(gi_win_h - (this.margin_run + (this.radius_run * 2)))+ ")");//Устанавливаем кнопку ход, внизу с лева, правой рамки интерфейса.
		this.button_menu.setAttribute("transform", "translate("+(gi_win_w - (64))+ "," +(4)+ ")");//Позиционируем кнопку меню.
		this.mini_map_g.setAttribute("transform", "matrix("+((this.indent_right - (this.indent_mini_map * 2))/gi_kw)+" 0 0 "+((this.indent_right - (this.indent_mini_map * 2))/gi_kw)+" "+(gi_win_w - (this.indent_right - this.indent_mini_map))+" "+this.indent_top+")");//Устанавливаем новое положение мини карты.
	}
	//Собираем все графические элементы пользовательского интерфейса вместе.
	this.graf = document.createElementNS(svgns, "g");//Контейнер для всех графических объектов пользовательского интерфейса.
	this.graf.appendChild(this.interf_frame);//Рамку добовляем первой.
	this.graf.appendChild(this.button_full_screen);//Добовляем кнопку свернуть/развернуть на весь экран.
	this.graf.appendChild(this.button_run);//Добовляем кнопку ход.
	this.graf.appendChild(this.button_menu);//Добовляем кнопку меню.
	this.graf.appendChild(this.mini_map_g);//Добовляем мини карту.
	svg_interf.appendChild(this.graf);//Добовляем пользовательский интерфейс в специальный для него уровень.
	
	//########### Кнопка тест временная ##########################
	/*
	this.button_test = document.createElementNS(svgns, "g");
	this.backing_test = document.createElementNS(svgns, "rect");
	this.backing_test.setAttributeNS(null, "width", 70);
	this.backing_test.setAttributeNS(null, "height", 30);
	this.backing_test.setAttributeNS(null, "fill", this.indent_color);
	this.backing_test.setAttributeNS(null, "stroke", this.stroke_color);
	this.backing_test.setAttributeNS(null, "stroke-width", 1);
	this.button_test.appendChild(this.backing_test);
	
	this.text_test = document.createElementNS(svgns, "text");
	this.text_test.setAttributeNS(null,'x',5);
	this.text_test.setAttributeNS(null,'y',0);
	this.text_test.setAttributeNS(null, "dy", "1em");
	this.text_test.setAttributeNS(null,'font-size', 20);
	this.text_test.setAttributeNS(null,'fill', this.stroke_color);
	this.text_test.setAttributeNS(null, "pointer-events", "none");
	this.text_test.textContent = "Тест";
	this.button_test.appendChild(this.text_test);
	
	this.button_test.obj = this;
	this.button_test.onmouseover = function(){
		this.obj.text_test.setAttributeNS(null, "fill", this.obj.focus_color);
		this.obj.backing_test.setAttributeNS(null, "stroke", this.obj.focus_color);
	}
	this.button_test.onmouseout = function(){
		this.obj.text_test.setAttributeNS(null, "fill", this.obj.stroke_color);
		this.obj.backing_test.setAttributeNS(null, "stroke", this.obj.stroke_color);
	}
	this.button_test.onclick = function(){
		test();
	}
	this.graf.appendChild(this.button_test);
	//############################################################*/
}