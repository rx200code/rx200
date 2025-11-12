function Cursor(){
	this.flag_move_map = false;//Флаг перемещения карты вслед за движением курсора.
	this.distance_to_x = 0;//Дистанция до курсора по оси "x". Нужна для перемещения объектов вслед за курсором, например игровой карты.
	this.distance_to_y = 0;//Дистанция до курсора по оси "y". Нужна для перемещения объектов вслед за курсором, например игровой карты.
	this.flag_onclick = true;//Флаг реакции на клик мыши.
	this.svg_x = svg.getBoundingClientRect().left + window.scrollX;//Определяем отступ элемента svg относительно доккумента по оси "x", для позиционирования курсора мыши.
	this.svg_y = svg.getBoundingClientRect().top + window.scrollY;//Определяем отступ элемента svg относительно доккумента по оси "y", для позиционирования курсора мыши.
	this.c_st = "0,0 8,0 8,5 20,17 17,20 5,8 0,8";//Стандартный курсор.
	this.c_at = "0,0 -2,6 -11,14 -9,16 -11,18 -13,16 -17,20 -20,17 -16,13 -18,11 -16,9 -14,11 -6,2";//Нападения курсор.
	this.c_in = "-2,-5 1,-3 -2,-5 -5,-2 -4,2 -2,9 -4,2 -6,9 -4,2 -14,7 -12,14 -14,7 -17,14 -15,7 -15,3 -5,-2 -2,-5";//Взаимодействия героя курсор.
	this.c_bl = "3,0 10,7 7,10 0,3 -7,10 -10,7 -3,0 -10,-7 -7,-10 0-3 7,-10 10,-7";//Блок курсор.
	this.c_go = "0,0 3,2 0,0 -3,3 -4,7 -2,14 -4,7 -6,14 -4,7 -14,7 -12,14 -14,7 -17,14 -15,7 -12,3 -3,3 0,0";//Идти курсор.
	this.cursor = document.createElementNS(svgns, "polygon");//Изображения курсора многоугольник.
	this.cursor.setAttributeNS(null, "points", this.c_st);//График курсора, изначально устанавливаем стандартный.
	this.cursor.setAttributeNS(null, "fill", "#fff");//устанавливаем цвет курсора.
	this.cursor.setAttributeNS(null, "stroke", "#000");//цвет контура.
	this.cursor.setAttributeNS(null, "stroke-width", 1);//толщина контура.
	this.cursor.setAttributeNS(null, "pointer-events", "none");//Не реагирует на события мыши, пропуская их дальше. Иначе изображения курсора будет мешать событиям мыши.
	svg_cursor.appendChild(this.cursor);//Добавляем изображения курсора в группу образующую курсор.
	svg_cursor.setAttribute("transform", "translate("+ gi_win_w/2 + "," + gi_win_h/2 + ")");//Изначально курсор появляется в центре экрана.
	this.type_cursor = function(type_cursor){//Метод устанавливает тип курсора.
		switch(type_cursor){//Тип курсора можно задать текстовым сокращением, или цифрой, которая соответствует блоку сектора.
			case "go"://Идти
			case 0:
				this.cursor.setAttributeNS(null, "points", this.c_go);
				break;
			case "st"://Стандартный
			case 5:
				this.cursor.setAttributeNS(null, "points", this.c_st);
				break;
			case "in"://взаимодействие героя.
			case 1:
				this.cursor.setAttributeNS(null, "points", this.c_in);
				break;
			case "at"://Нападения
			case 2:
			case 3:
				this.cursor.setAttributeNS(null, "points", this.c_at);
				break;
			case "bl"://Блок.
			case 4:
				this.cursor.setAttributeNS(null, "points", this.c_bl);
		}
	}
	this.set_xy = function(x,y,e){//Метод устанавливает координаты курсора.
		svg_cursor.setAttribute("transform", "translate("+x+ "," +y+ ")");//Устанавливаем курсор по координатам мыши.
		if(this.flag_move_map){//Если true то игровая карта перемещается с курсором.
			if(x < go_interf.indent_left || x > gi_win_w - go_interf.indent_right || y < go_interf.indent_top || y > gi_win_h - go_interf.indent_down)this.flag_move_map = false;//Если курсор вышел за пределы игрового окна в котором находится игровая карта, то карта не перемещается.
			svg_group.setAttribute("transform", "translate("+(x - this.distance_to_x)+ "," +(y - this.distance_to_y)+ ") scale("+gi_scale+")");//Перемещаем карты вселд за курсором, сохраняя масштаб.
			this.flag_onclick = false;//Если карта перемещалась то она не реагирует на клик мыши стандартно, данный флаг используется в секторах.
		}
	}
	svg.cursor = this;//Пока курсор не создан делаем ссылку на него в окне игры, на который следом вешаем событие mousemove.
	svg.addEventListener("mousemove", function(event){//Срабатывает при движении мыши.
		this.cursor.set_xy(event.pageX - this.cursor.svg_x, event.pageY - this.cursor.svg_y, event);//Координаты мыши относительно экрана svg.
	});
	svg_group.onmouseover = function(event){//Вешаем событие появления курсора мыши на игровой карте.
		if(go_v.type == "Ger" && !go_v.player.flag_ai){//Если выделен герой и он игрока.
			var o_sector = event.target.obj;//Начинаем определять сектор объекта.
			while(o_sector.type != "Sector" && o_sector.parent){//Если не сектор и есть родитель то проверяем не сектор ли родитель. И так пока не кончатся родители или не найдем сектор.
				o_sector = o_sector.parent;
			}
			if(go_v.o_ids_move[o_sector.id] == undefined && o_sector.block != 4){//Если сектора нет в массиви доступных ждя передвижения но сам сектор не заблокирован вообще для передвижения(тоесть на него сейчас нельзя попасть прямым путем), то стандартный курсор.
				go_cursor.type_cursor("st");
				return;
			}
			var type_cursor = o_sector.block;//тип курсора не всегда соответствует блоку.
			if(go_v.target_id == o_sector.id && o_sector.block == 0)type_cursor = 1;//Если сектор свободен для передвежения и является целью передвижения, то тип курсора как цель а не как просто свободный для передвижения.
			if(go_v.sector.id == o_sector.id)type_cursor = 5;//Если герой уже сам находится на цели передвижения то курсор стандартный.
			if(o_sector.flag_fog)type_cursor = 5;//Если туман то курсор стандартный.
			go_cursor.type_cursor(type_cursor);//Устанавливаем курсор.
		}
	}
	svg_group.onmouseout = function(event){//Вешаем событие ухода курсора мыши на игровой карте.
		go_cursor.type_cursor("st");//При уходи с игровой карты курсор всегда стандартный.
	}
}