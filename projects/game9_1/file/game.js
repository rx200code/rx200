var svgns = "http://www.w3.org/2000/svg";
var svg;//Само окно игры которое в себя включает все остальные svg. Все уровни идут в таком же порядке как они расположены ниже.
var svg_defs;//Уровень для всяких невидимых графических объектов.
var svg_group;//Подвижный и масштабируемый уровень, основного поля игры, который включает в себя подуровни svg_0, svg_1, svg_2, svg_3, svg_4.
var svg_0;//Уровень 0 зарезервирован, и в данный момент используется для масштабирования и несовсем уровень а "rect"(Прямоугольник).
var svg_1;//Уровень 1 для сектороа.
var svg_2;//Уровень 2 для обектов на секторе
var svg_3;//Уровень 3 для героев, отрядов.
var svg_4;//Уровень 4 для тумана.
var svg_interf;//Уровень пользовательского интерфейса.
var svg_city;//Уровень окон городов на карте.
var svg_house;//Уровень окон объектов на карте.
var svg_ger;//Уровень окно героев.
var svg_battle;//Уровень битв.
var svg_window;//Уровень всплывающих окон.
var svg_cursor;//Уровень курсорв мыши, должен идти последним.
window.onload = function(){//Когда все загружено.
	//Начинаем построение графического изображения и постройку уровней сохроняя их порядоу.
	svg = document.getElementById('grafika');//определяем окно игры.
	svg_defs = document.createElementNS(svgns, "defs");//Уровень для скрытых графических объектов.
	svg.appendChild(svg_defs);//Добовляем уровень в SVG для всяких скрытых графических объектов для.
	go_graf_defs = new Graf_defs();//Заполняем svg_defs всякими скрытыми графическими объектами, оставляя к ним доступ.
	svg_group = document.createElementNS(svgns, "g");//Все уровни непосредственно игровой карты мира.
	svg_group.setAttributeNS(null, "id", "svg_group");//Идентифицируем для возможности обращатся например из <use> svg.
		svg_0 = document.createElementNS(svgns, "rect");//используется для точного значения svg_0.getBoundingClientRect().x и y при масштабировании.
			svg_0.setAttributeNS(null, "x", 0);
			svg_0.setAttributeNS(null, "y", 0);
			svg_0.setAttributeNS(null, "width", 1);
			svg_0.setAttributeNS(null, "height", 1);
			//svg_0.setAttributeNS(null, "fill","#000");//по умолчанию цвет и так черный как и у фона игровой карты.
		svg_group.appendChild(svg_0);//Добовляем в определенном порядке в уровень карты игрового мира.
		svg_1 = document.createElementNS(svgns, "g");//Уровень 1 для сектороа.
		svg_1.setAttributeNS(null, "id", "svg_1");//Идентифицируем для возможности обращатся например из <use> svg.
		svg_group.appendChild(svg_1);//Добовляем в определенном порядке в уровень карты игрового мира.
		svg_2 = document.createElementNS(svgns, "g");//Уровень 2 для обектов на секторе
		svg_2.setAttributeNS(null, "id", "svg_2");//Идентифицируем для возможности обращатся например из <use> svg.
		svg_group.appendChild(svg_2);//Добовляем в определенном порядке в уровень карты игрового мира.
		svg_3 = document.createElementNS(svgns, "g");//Уровень 3 для героев, отрядов.
		svg_3.setAttributeNS(null, "id", "svg_3");//Идентифицируем для возможности обращатся например из <use> svg.
		svg_group.appendChild(svg_3);//Добовляем в определенном порядке в уровень карты игрового мира.
		svg_4 = document.createElementNS(svgns, "g");//Уровень 4 для тумана.
		svg_4.setAttributeNS(null, "id", "svg_4");//Идентифицируем для возможности обращатся например из <use> svg.
		svg_group.appendChild(svg_4);//Добовляем в определенном порядке в уровень карты игрового мира.
	svg.appendChild(svg_group);//Добовляем уровень игровой карты мира в основное окно игры.
	svg_interf = document.createElementNS(svgns, "g");//Пользовательский интерфейс.
	svg.appendChild(svg_interf);//Добовляем уровень пользовательского интерфейса, на игровой карте мира в основное окно игры.
	svg_city = document.createElementNS(svgns, "g");//Уровень окон городов на карте.
	svg.appendChild(svg_city);
	svg_house = document.createElementNS(svgns, "g");//Уровень окон объектов на карте.
	svg.appendChild(svg_house);
	svg_ger = document.createElementNS(svgns, "g");//Уровень окно героев.
	svg.appendChild(svg_ger);
	svg_battle = document.createElementNS(svgns, "g");//Уровень битв.
	svg.appendChild(svg_battle);
	svg_window = document.createElementNS(svgns, "g");//Уровень для всплывающих окон.
	svg.appendChild(svg_window);//Добовляем уровень всплывающих окон в основное окно игры.
	svg_cursor = document.createElementNS(svgns, "g");//Уровень курсорв мыши, должен идти последним.
	svg.appendChild(svg_cursor);//Добовляем уровень курсора мыши в основное окно игры последним.
	svg.setAttributeNS(null, "width", gi_win_w);//Ширина игрового окна.
	svg.setAttributeNS(null, "height", gi_win_h);//Высота игрового окна.
	//Начинаем создавать объекты игры.
	go_mir = new Mir();//Строим пустой мир.
	//go_mir.load(go_seve.mir);//Загружаем в мир заранее сохраненную игру. Как стартовую карту.
	go_cursor = new Cursor();//Создаём свой курсор для экрана svg игры.
	go_interf = new Interf();//Создаём пользовательский интерфейс игры.
	go_window = new Up_window();//Создаём объект всплывающих окон игры.
	go_menu = new Menu();//Создаём объект всплывающих окон игры.
	f_focus_sector(1482);//Централизуем экран игры над сектором 1403(id).
	//Начинаем вешать разные события.
	document.onmozfullscreenchange = function(event){//Событие срабатывает при развертывании и свертывании игры на весь экран.
		go_cursor.svg_x = svg.getBoundingClientRect().left + window.scrollX;//Настраиваем позиционирование изображения курсора.
		go_cursor.svg_y = svg.getBoundingClientRect().top + window.scrollY;//Настраиваем позиционирование изображения курсора.
		gi_win_w = svg.getBoundingClientRect().width;//Записываем новую шерену игрового окна.
		gi_win_h = svg.getBoundingClientRect().height;//Записываем новую высоту игрового окна.
		go_interf.full_screen_change();//Функция настраивает пользовательский интерфейс в соответствии с новыми параметрами окна игры.
		go_menu.full_screen_change();//Функция настраивает меню, если оно открыто, в соответствии с новыми параметрами окна игры.
	}
	svg_group.addEventListener("wheel", function(event){//Событие прокрутки колесика мышки, на игровой карте при котором приближаем или удаляем игровую карту относительно позиции курсора мыши.
		//Положение курсора.
		var cursor_svg_x = event.pageX - go_cursor.svg_x;//Определяем положение курсора мыши относительно окна SVG игры по оси "x". Положение мыши по оси "x" относительно всего документа минус отступ окна SVG относительно всего документа по оси "x".
		var cursor_svg_y = event.pageY - go_cursor.svg_y;//Определяем положение курсора мыши относительно окна SVG игры по оси "y". Положение мыши по оси "y" относительно всего документа минус отступ окна SVG относительно всего документа по оси "y".
		//Положение карты, которую будем масштабировать относительно окна игры SVG.
		var map_svg_x = svg_0.getBoundingClientRect().left - go_cursor.svg_x + window.scrollX;//Определяем положение игровой карты относительно основного окна игры SVG по оси "x". Положение карты мира относительно документа минус отступ(положение) окна SVG относительно всего документа плюс скролл по оси "x".
		var map_svg_y = svg_0.getBoundingClientRect().top - go_cursor.svg_y + window.scrollY;//Определяем положение игровой карты относительно основного окна игры SVG по оси "y". Положение карты мира относительно документа минус отступ(положение) окна SVG относительно всего документа плюс скролл по оси "y".
		//Расстояние между картой и курсором.
		var distance_x = cursor_svg_x - map_svg_x;//От положения карты отнимаем положение курсора по оси "x".
		var distance_y = cursor_svg_y - map_svg_y;//От положения карты отнимаем положение курсора по оси "y".
		//Расстояние между картой и курсором, в изначальном масштабе 1 к 1.
		var primary_distance_x = distance_x / gi_scale;//Делим расстояние по оси "x" на текущий коэффициент масштаба. Получая тоже расстояние в масштабе 1 к 1.//Тут мы можем и сразу получить: var new_distance_x = distance_x * (event.deltaY / 100 + 1);//Но для большей понятности кода сделаем все по шагам. Так же такой(сокращенный) код по какойто причине при быстром скролле(многократном) у правого края игровой карты при сдвинутой карте в левую часть игрового окна, и быстром перемещении мыши то на карту то в право с карты, вызывает баг при котором карта начинает быстро сезжать в лево.
		var primary_distance_y = distance_y / gi_scale;//Делим расстояние по оси "y" на текущий коэффициент масштаба. Получая тоже расстояние в масштабе 1 к 1.//Тут мы можем и сразу получить: var new_distance_y = distance_y * (event.deltaY / 100 + 1);//Но для большей понятности кода сделаем все по шагам. Так же такой(сокращенный) код по какойто причине при быстром скролле(многократном) у правого края игровой карты при сдвинутой карте в левую часть игрового окна, и быстром перемещении мыши то на карту то в право с карты, вызывает баг при котором карта начинает быстро сезжать в лево.
		//Устанавливаем новый коэффициент масштаба.
		gi_scale += event.deltaY / 100 * gi_scale;//Старый масштаб плюс количество прокрутки колесика мыши. Делим на 100 чтоб плавно масштабировалось. И умножаем на текущий масштаб чтоб равномерно увеличиволось и уменьшалось. Так как, например, при сильно увеличенном масштабе, ещё увеличение на тоже значение мало заметно.
		if(gi_scale > 3)gi_scale = 3;//Устанавливаем максимальный коэффициент масштаба.
		if(gi_scale < 0.3)gi_scale = 0.3;//Устанавливаем минимальный коэффициент масштаба.
		//Расстояние между картой и курсором, в новом масштабе.
		var new_distance_x = primary_distance_x * gi_scale;//Расстояние между картой и курсором, в изначальном масштабе 1 к 1 по оси "x" умножаем на коэффициент масштаба.
		var new_distance_y = primary_distance_y * gi_scale;//Расстояние между картой и курсором, в изначальном масштабе 1 к 1 по оси "x" умножаем на коэффициент масштаба.
		//Расстояние на которое следует сместить игровую карту относительно текущей позиции.
		var shift_map_x = new_distance_x - distance_x;//Расстояние между картой и курсором, в новом масштабе минус текущее(до масштабирования) расстояние между картой и курсором по оси "x".
		var shift_map_y = new_distance_y - distance_y;//Расстояние между картой и курсором, в новом масштабе минус текущее(до масштабирования) расстояние между картой и курсором по оси "y".
		//Новые координаты карты, после масштабирования.
		var new_map_x = map_svg_x - shift_map_x;//Положение карты после масштабирования = текущее положение карты минус расстояние на которое следует сместить карту по оси "x". Вычитание по тому что при увеличении карты относительно курсора мыши её начальные координаты(левый верхний угол) смещаются в отрицательном направлении относительно основной системы координат SVG.
		var new_map_y = map_svg_y - shift_map_y;//Положение карты после масштабирования = текущее положение карты минус расстояние на которое следует сместить карту по оси "y".
		//Масштабируем на коэффициент масштаба и одновременно смещаем на новые координаты игровую карту, в матрице трансформации.
		svg_group.setAttribute("transform", "matrix("+gi_scale+" 0 0 "+gi_scale+" "+new_map_x+" "+new_map_y+")");
		//Делаем так чтоб браузер не реагировал стандартно на прокрутку колесика мыши пытаясь сместить страницу.
		event.preventDefault();
		return false;
	});
	svg_group.onmousedown = function(event){//Срабатывает при нажатии кнопки мыши на игровой карте.
		if(event.which == 1){//Если нажата левая кнопка мыши.
			go_cursor.flag_move_map = true;//Устанавливаем флаг перемещения игровой карты.
			go_cursor.distance_to_x = event.clientX - svg_0.getBoundingClientRect().left;//Устанавливаем дистанцию от курсора до края игровой карты по оси "x".
			go_cursor.distance_to_y = event.clientY - svg_0.getBoundingClientRect().top;//Устанавливаем дистанцию от курсора до края игровой карты по оси "y".
		}
	}
	svg_group.onmouseup = function(event){//Срабатывает при отжатии кнопки мыши на игровой карте.
		if(event.which == 2){//Если отжата средняя кнопка мыши(колесико).
			gi_scale = 1;//Устанавливаем изначальный масштаб 1 к 1.
			svg_group.setAttribute("transform", "scale("+gi_scale+")");//Так как координаты смещения не заданы карта встает на начальную позицию по осям "x" и "y" в 0.
		}
		go_cursor.flag_move_map = false;//Снимаем флаг передвижения карты. По умолчанию флаг снят.
	}
	svg.oncontextmenu = function(){//Браузер не реагирует стандартно на правый клик мышке в игре.
		go_mir.vid();
		return false;
	}
	//################ vremenno test ####################
	/*
	for(var i = 0; i < go_mir.child_sector.length; i++){
		go_mir.child_sector[i].on_fog();
	}//*/
	//go_mir.child_sector[1482].child = new Thing(go_mir.child_players[0], Ger, go_mir.child_sector[1482]);
	//go_mir.child_sector[1484].child = new Thing(go_mir.child_players[1], Ger, go_mir.child_sector[1484]);
	f_fog_off();
	//###################################################*/
}
function Mir(){//Конструктор мира.
	go_mir = this;
	this.id = 0;//Ид мира, пока незнаю зачем.(Возможно для перехода на другие карты, тоесть продолжение игры)
	this.size_xs = 0;//Количество секторов по оси "x".//gi_xs
	this.size_ys = 0;//Количество секторов по оси "y".//gi_ys
	this.size = this.size_xs*this.size_ys;//Размер мира в гексах, Сексторах.
	this.child_players = new Array();//Массив играков, включая АИ.
	this.child_sector = new Array();//Массив секторов.
	
	//############## Загрузка из go_load ################
	this.size_xs = go_load.size_xs;
	this.size_ys = go_load.size_ys;
	gi_xs = this.size_xs;
	gi_ys = this.size_ys;
	gi_kw = gi_ws*gi_xs+gi_ws/2;
	gi_kh = gi_hs*gi_ys+gi_hs-gi_rs;
	this.size = this.size_xs*this.size_ys;
	var i = 0;
	//Сначала загружаем играков.
	while(i <  go_load.Players.length){
		this.child_players[go_load.Players[i].id] = new Player(go_load.Players[i].id, go_load.Players[i].flag_ai, go_load.Players[i].name, go_load.Players[i].gold, go_load.Players[i].color);
		i++;
	}
	ga_run.length = this.child_players.length;
	ga_run.fill(false);
	//Устанавливаем первого игрока не АИ.
	i = 0;
	while(i < this.child_players.length){
		if(!this.child_players[i].flag_ai){
			gi_id_player = i;
			gi_id_player_active = i;
			break;
		}
		i++;
	}
	
	//Потом сектора, с массивами тумана для каждого игрока.
	i = 0;
	while(i < this.size_ys){
		var k = 0;
		while(k < this.size_xs){
			this.child_sector[this.child_sector.length] = new Sector(this.child_sector.length,k,i,this);//Создаем сектора и добовляем их в массив секторов.
			k++;
		}
		i++;
	}
	
	for(i = 0; i < go_load.Mount.length; i++)this.child_sector[go_load.Mount[i]].child = new Thing(Mount, this.child_sector[go_load.Mount[i]]);
	for(i = 0; i < go_load.Forest.length; i++)this.child_sector[go_load.Forest[i]].child = new Thing(Forest, this.child_sector[go_load.Forest[i]]);
	
	//Устанавливаем героев.
	for(i = 0; i < go_load.Ger.length; i++){
		this.child_sector[go_load.Ger[i].sector].child = new Thing(this.child_players[go_load.Ger[i].player_id], Ger, this.child_sector[go_load.Ger[i].sector]);
	}
	this.child_sector[1443].child = new Thing(this.child_players[1], City, this.child_sector[1443]);
	this.child_sector[1402].child = new Thing(Unit, this.child_sector[1402]);
	//###### vremenno #######
	/*
	for(i = 0; i < this.child_players.length; i++){
		this.child_sector[(1361+i)].child = new Thing(this.child_players[i], Ger, this.child_sector[(1361+i)]);
	}
	//#######################*/
	
	//###################################################*/
	
	
	this.run = function(){//Функция которвя запускается каждый ход.
		
	}
	
	go_v = this;//Добовляем объект в выделенные объекты. Чтоб сразу после создания мира ссылка на выделенный объект небыла пустой.
	this.vid = function(){//Функция вывода информации о мире.
		go_v.vid_no(this);
		info("x = "+this.size_xs+"; y = "+this.size_ys+"; Sector = "+this.child_sector.length+". players = "+this.child_players.length+".");
		go_v = this;
	}
	this.vid_no = function(obj){//Функция снятия выделения.
		
	}
	this.f_grid = function(){//Функция устанавливает/убирает сетку.
		if(gb_flag_grid_map){
			for(var i = 0; i < this.child_sector.length; i++)this.child_sector[i].f_grid(this.child_sector[i].sector_color);
		}else{
			for(var i = 0; i < this.child_sector.length; i++)this.child_sector[i].f_grid(gt_ck);
		}
		gb_flag_grid_map = !gb_flag_grid_map;
	}
	this.seve = function(){
		var o_seve = {};
		o_seve.id = this.id;
		o_seve.size_xs = this.size_xs;
		o_seve.size_ys = this.size_ys;
		o_seve.size_sector = this.child_sector.length;
		o_seve.child_sector = [];
		o_seve.child_players = [];
		var i = 0;
		for(i = 0; i < this.child_players.length; i++){
			o_seve.child_players[this.child_players[i].id] = this.child_players[i].seve();
		}
		for(i = 0; i < this.child_sector.length; i++){
			o_seve.child_sector[i] = this.child_sector[i].seve();
		}
		return o_seve;
	}
	this.load = function(o_seve){
		this.del();
		this.id = o_seve.id;
		this.size_xs = o_seve.size_xs;
		gi_xs = this.size_xs;
		this.size_ys = o_seve.size_ys;
		gi_ys = this.size_ys;
		gi_kw = gi_ws*gi_xs+gi_ws/2;
		gi_kh = gi_hs*gi_ys+gi_hs-gi_rs;
		for(i = 0; i < o_seve.child_players.length; i++){
			this.child_players[o_seve.child_players[i].id] = new Player();
			this.child_players[o_seve.child_players[i].id].load(o_seve.child_players[i]);
		}
		for(i = 0; i < o_seve.child_sector.length; i++){
			this.child_sector[i] = new Sector();
			this.child_sector[i].load(o_seve.child_sector[i]);
		}
		go_mir.vid();//Выводим инфо о мире.
	}
	this.del = function(){//Функция удаления(очищения) объекта mir и всех подобъектов. Подготовка мира к загрузке.
		while(this.child_players.length){
			this.child_players[this.child_players.length - 1].del();
		}
		while(this.child_sector.length){
			this.child_sector[this.child_sector.length - 1].del();
		}
	}
}
function Sector(id,x,y,mir){//Конструктор создания сектора на карте. входные данные ид, х и у сектора в системе координат смещения.
	this.type = "Sector";
	this._name = "Сектор";
	
	Object.defineProperty(this, "name", {
		get: function(){
			if(this.child == undefined || this.child.type == "Ger"){
				return this._name;
			}else{
				return this.child.name;
			}
		},
		set: function(value){
			this._name = value;
		}
	});
	this.parent = mir || go_mir;//Родитель.
	this.child;
	this.stroke_color = gt_ck;
	this.sector_color = gt_cs;
	this.block = 0;//если сектор не занят то значение 0, если сектор занят объектом с которым можно взаимодействовать(включая вражеского героя) то значение 1,
					///если сектор занят нетральным монстром то значение 3 и вокруг прелегающих секторов значение 2, если сектор полностью заблокирован для перемещения то значение 4.
	this.id = id || 0;//Ид гекса.
	this.x = x || 0;//координата "x" в системе координат смещения.
	this.y = y || 0;//координата "y" в системе координат смещения.
	var x1 = Math.sqrt(3)/2 * gi_rs;//Вспомогательное значение для вычисления центральных координат сектора.
	this.center_x = x1+(x1*2*this.x)+x1*(this.y&1);//вычисляем координаты центра Сектора, по оси x.
	this.center_y = gi_rs+(gi_rs * 3 / 2 * this.y);//вычисляем координаты центра Сектора, по оси y.
	this.cube_x = this.x-(this.y-(this.y&1))/2;//координата "x" в кубической системе координат.
	this.cube_z = this.y;//координата "z" в кубической системе координат.
	this.cube_y = -this.cube_x-this.cube_z;//координата "y" в кубической системе координат.
	this.cor_sector = f_cor_sector(this.center_x,this.center_y);//Координаты для отрисовки сектора.
	this.sector = document.createElementNS(svgns, "polygon");//Рисуем сектор.
	this.sector.setAttributeNS(null, "points", this.cor_sector);//Вводим координаты сектора.
	this.sector.setAttributeNS(null, "fill", this.sector_color);//устанавливаем цвет сектора.
	this.sector.setAttributeNS(null, "stroke", gb_flag_grid_map ? this.stroke_color : this.sector_color);//цвет контура.
	this.sector.setAttributeNS(null, "stroke-width", gi_sw);//толщина контура.
	this.sector.obj = this;//Оставляем ссылку на обект сектора.
	
	this.vid = function(){//Функция выводящая информацию о секторе при его выделении, и выделяющая сектор.
		if(go_v === this){
			go_mir.vid();
			return;
		}
		if(go_v.vid_no(this) == -1)return;
		this.sector.setAttributeNS(null, "stroke", gt_cv);
		
		//this.sector.setAttributeNS(null, "stroke-width", 2);//толщина контура.
		svg_1.removeChild(this.graf);//для отображения по верх соседних секторов, так как контуры иногда смежные.
		svg_1.appendChild(this.graf);//для отображения по верх соседних секторов, так как контуры иногда смежные.
		info("x = "+this.x+"; y = "+this.y+"; id = "+this.id+". cube_x = "+this.cube_x+", cube_y = "+this.cube_y+", cube_z = "+this.cube_z+". name = "+this.name+". block = "+this.block+". players_fog = "+this.players_fog+". child.type = "+(this.child ? this.child.type : "not")+".");
		go_v = this;
	};
	this.vid_no = function(obj){//Функция снимающая выделение.
		this.sector.setAttributeNS(null, "stroke", this.stroke_color);
	};
	this.sector.onclick = function(){//
		if(!go_cursor.flag_onclick){
			go_cursor.flag_onclick = true;
			return;
		}
		this.obj.vid();
	};
	this.fog = document.createElementNS(svgns, "polygon");//Рисуем туман.
	this.fog.setAttributeNS(null, "points", this.cor_sector);//Вводим координаты сектора.
	this.fog.setAttributeNS(null, "fill", "#000");//устанавливаем цвет туман.
	//############ vremenno ##################
	//this.fog.setAttributeNS(null, "fill-opacity", "0.5");
	//########################################*/
	this.fog.setAttributeNS(null, "stroke", gt_ck);//цвет контура.
	this.fog.setAttributeNS(null, "stroke-width", gi_sw);//толщина контура.
	this.fog.obj = this;//Оставляем ссылку на обект сектора.
	this.fog.onclick = function(){//Клик по туману войны приводит к отображению общей информации карты.
		go_mir.vid();
	};
	this.players_fog = new Array(this.parent.child_players.length);
	this.players_fog.fill(true);
	this.flag_fog = false;//Флаг тумана. Нужен для функции svg_4.appendChild(this.fog); так как если элемент уже удален скрипт виснет.
	this.off_fog = function(){//Метод снятия тумана.
		if(this.flag_fog){
			svg_4.removeChild(this.fog);
			this.flag_fog = false;
		}
	}
	this.on_fog = function(){//Метод установки тумана.
		if(!this.flag_fog){
			svg_4.appendChild(this.fog);
			this.flag_fog = true;
		}
	}
	this.graf = document.createElementNS(svgns, "g");//контейнер для всех графических объектов сектора выводимых на svg
	this.graf.obj = this;//Оставляем ссылку на обект сектора.
	this.graf.appendChild(this.sector);//Добовляем в контейнер изображение сектора.
	this.picture = document.createElementNS(svgns, "g");//контейнер для изображений на секторе под текстом.
	
	this.graf.appendChild(this.picture);//Добавляем в контейнер сектора, контейнер для изображений на секторе под текстом.
	
	this.on_fog();//Добовляем в контейнер изображение тумана.
	svg_1.appendChild(this.graf);//Добовляем контейнер сектора в основное окно графики svg.
	this.f_grid = function(t_color){
		
		this.stroke_color = t_color;
		if(this.sector.getAttribute("stroke") != gt_cv)this.sector.setAttributeNS(null, "stroke", t_color);
	}
	this.seve = function(){
		var o_seve = {};
		o_seve.id = this.id;
		o_seve.flag_fog = this.flag_fog;
		o_seve.block = this.block;
		o_seve.sector_color = this.sector_color;
		if(this.child != undefined){
			o_seve.child = this.child.seve();
		}
		return o_seve;
	}
	this.load = function(o_seve){
		this.id = o_seve.id;
		this.x = get_xy(this.id).x;
		this.y = get_xy(this.id).y;
		var x1 = Math.sqrt(3)/2 * gi_rs;
		this.center_x = x1+(x1*2*this.x)+x1*(this.y&1);
		this.center_y = gi_rs+(gi_rs * 3 / 2 * this.y);
		this.cube_x = this.x-(this.y-(this.y&1))/2;
		this.cube_z = this.y;
		this.cube_y = -this.cube_x-this.cube_z;
		this.cor_sector = f_cor_sector(this.center_x,this.center_y);
		this.sector.setAttributeNS(null, "points", this.cor_sector);
		this.fog.setAttributeNS(null, "points", this.cor_sector);
		
		this.flag_fog = o_seve.flag_fog;
		if(!this.flag_fog){
			svg_4.removeChild(this.fog);
		}
		this.block = o_seve.block;
		this.sector_color = o_seve.sector_color;
		if(!gb_flag_grid_map)this.f_grid(this.sector_color);
		this.sector.setAttributeNS(null, "fill", this.sector_color);
		
		if(o_seve.child != undefined){
			this.child = new Thing(eval(o_seve.child.type), this);
			this.child.load(o_seve.child);
		}
	}
	this.del = function(){
		delete this.parent;
		if(this.child != undefined){
			this.child.del();
			delete this.child;
		}
		svg_1.removeChild(this.graf);
		if(this.flag_fog){
			svg_4.removeChild(this.fog);
			this.flag_fog = false;
		}
		go_mir.child_sector.splice(this.id,1);
	}
}


function get_id(x, y, z){
	if(z !== undefined){
		x = x + (z - (z&1)) / 2;
		y = z;
	}
	if(x<0 || x>=gi_xs || y<0 || y>=gi_ys)return -1;
	return y*gi_xs+x;
}
function get_xy(id){
	var x = id%gi_xs;
	var y = Math.floor(id / gi_xs);
	return {x:x, y:y};
}
function xy_to_xyz(x,y){
	var x = x-(y-(y&1))/2;
	var z = y;
	var y = -x-z;
	return {x:x, y:y, z:z};
}
function getRandomInRange(min, max){
	if(arguments.length == 1 && typeof arguments[0] == "object" && arguments[0] instanceof Array)return Math.floor(Math.random() * (arguments[0][1] - arguments[0][0] + 1)) + arguments[0][0];
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function get_circle(r,x,y,c){
	var svgns = "http://www.w3.org/2000/svg";
	var shape = document.createElementNS(svgns, "circle");
	shape.setAttributeNS(null, "cx", x);
	shape.setAttributeNS(null, "cy", y);
	shape.setAttributeNS(null, "r",  r);
	shape.setAttributeNS(null, "fill", c);
	return shape;
}
//###############Ниже вспомогательные функции на другом языке.########################
/*######################### Код не отсюда ############################
var axial_directions = [
    Hex(+1, 0), Hex(+1, -1), Hex(0, -1), 
    Hex(-1, 0), Hex(-1, +1), Hex(0, +1), 
]

function hex_direction(direction):
    return axial_directions[direction]

function hex_neighbor(hex, direction):
    var dir = hex_direction(direction)
    return Hex(hex.q + dir.q, hex.r + dir.r)
//####################################################################
function hex_reachable(start, movement):
    var visited = set() # set of hexes
    add start to visited
    var fringes = [] # array of arrays of hexes
    fringes.append([start])

    for each 1 < k ≤ movement:
        fringes.append([])
        for each hex in fringes[k-1]:
            for each 0 ≤ dir < 6:
                var neighbor = hex_neighbor(hex, dir)
                if neighbor not in visited and not blocked:
                    add neighbor to visited
                    fringes[k].append(neighbor)

    return visited
//####################################################################*/
var id_xx = 134;
var ids_xx = [41,60,80,99,118,136,155,174,193,212];//Массив непроходимых.
var axial_directions1 = [{x:1, y:0}, {x:1, y:-1}, {x:0, y:-1}, {x:-1, y:0}, {x:0, y:1}, {x:1, y:1}];//не чет
var axial_directions2 = [{x:1, y:0}, {x:0, y:-1}, {x:-1, y:-1}, {x:-1, y:0}, {x:-1, y:1}, {x:0, y:1}];//чет
function hex_neighbor(id, direction, mir){
	if(mir.child_sector[id].y&1){//не чет
		var x = mir.child_sector[id].x + axial_directions1[direction].x;
		var y = mir.child_sector[id].y + axial_directions1[direction].y;
	}else{//чет
		var x = mir.child_sector[id].x + axial_directions2[direction].x;
		var y = mir.child_sector[id].y + axial_directions2[direction].y;
	}
	//alert(get_id(x,y));
	return get_id(x,y);
}
function f_ids_move(obj){
	var start = obj.sector.id;//ид стартового поля.
	var visited = [];//массив посещенных в цикле.
	visited[visited.length] = start;
	var fringes = [];//формируем массив свободных для пути клеток.
	fringes[fringes.length] = [{id:start,distance:0,last:-1}];//{id:id,distance:расстояние,last:id};//добавляем первое стартовое поле.
	//*
	var o_move = {[start]:{block:1,distance:0,last:-1,rotation:-1}};//{id_sector:{block:индекс_блока,distance:расстояние,last:id}}
	var arr_last = [start];
	var s = 0;
	while(arr_last.length){
		var arr_last2 = [];
		s++;
		arr_last.forEach(function(item){
			if(!go_mir.child_sector[item].block || item == start){
				for(var dir = 0; dir < 6; dir++){
					var neighbor = hex_neighbor(item, dir, go_mir);
					if(neighbor !== -1 && visited.indexOf(neighbor) === -1 && go_mir.child_sector[neighbor].block != 4 && !go_mir.child_sector[neighbor].flag_fog){
						
						visited[visited.length] = neighbor;
						arr_last2[arr_last2.length] = neighbor;
						o_move[neighbor] = {block:go_mir.child_sector[neighbor].block,distance:s,last:item,rotation:dir};
						
					}
				}
			}else if(go_mir.child_sector[item].block == 2){
				for(var dir = 0; dir < 6; dir++){
					var neighbor = hex_neighbor(item, dir, go_mir);
					if(neighbor !== -1 && go_mir.child_sector[neighbor].block == 3 && visited.indexOf(neighbor) === -1){
						
						visited[visited.length] = neighbor;
						arr_last2[arr_last2.length] = neighbor;
						o_move[neighbor] = {block:go_mir.child_sector[neighbor].block,distance:s,last:item,rotation:dir};
						
					}
				}
			}
		});
		arr_last = arr_last2;//?
	}
	return o_move;//*/
	var k = 1;
	while(fringes[fringes.length - 1].length){//Вместо for(var k = 1; k <= movement; k++){ Чтобы просмотреть все пути.
		fringes[fringes.length] = [];
		fringes[fringes.length-2].forEach(function(item){
			for(var dir = 0; dir < 6; dir++){
				var neighbor = hex_neighbor(item.id, dir, go_mir);
				if(neighbor !== -1 && visited.indexOf(neighbor) === -1 && !go_mir.child_sector[neighbor].block){
					visited[visited.length] = neighbor;
					fringes[fringes.length-1][fringes[fringes.length-1].length] = {id:neighbor,distance:fringes.length-1,last:item.id};
					k++;
				}
			}
		});
	}
	return fringes;
	/*fringes.forEach(function(item,index){
		item.forEach(function(item2){
			//go_mir.child_sector[item2].graf.setAttributeNS(null, "fill", "#785");
			go_mir.child_sector[item2.id].text.textContent = index+"-"+item2.last;
		});
	});
	/*
	visited.forEach(function(item){
		go_mir.child_sector[item].graf.setAttributeNS(null, "fill", "#785");
		
		//go_mir.child_sector[item].text.textContent = ;
	});//*/
}
function f_test(){
	go_mir.child_sector[id_xx].graf.setAttributeNS(null, "fill", "#00f");
	go_mir.child_sector[id_xx].text.textContent = "xx";
	ids_xx.forEach(function(item){
		go_mir.child_sector[item].graf.setAttributeNS(null, "fill", "#593315");
		//go_mir.child_sector[item.id].text.textContent = item.hod;
	});
	//Сюда переписать закомментированные функции выше.
	
	var blocked = ids_xx;//массив блокированных идов куда ходить нельзя.
	var movement = 5;//длина просмотра поиска.
	var start = id_xx;//ид стартового поля.
	var visited = [];//массив посещенных в цикле.
	visited[visited.length] = start;
	var fringes = [];//формируем массив свободных для пути клеток.
	fringes[fringes.length] = [start];//{id:start,hod:0};//добавляем первое стартовое поле.
	var k = 1;
	while(fringes[fringes.length - 1].length){//Вместо for(var k = 1; k <= movement; k++){ Чтобы просмотреть все пути.
		fringes[fringes.length] = [];
		fringes[fringes.length-2].forEach(function(item){
			for(var dir = 0; dir < 6; dir++){
				var neighbor = hex_neighbor(item, dir);
				if(neighbor !== -1 && visited.indexOf(neighbor) === -1 && blocked.indexOf(neighbor) === -1){
					visited[visited.length] = neighbor;
					fringes[fringes.length-1][fringes[fringes.length-1].length] = neighbor;
					k++;
				}
			}
		});
	}
	fringes.forEach(function(item,index){
		item.forEach(function(item2){
			//go_mir.child_sector[item2].graf.setAttributeNS(null, "fill", "#785");
			go_mir.child_sector[item2].text.textContent = index;
		});
	});
	/*
	visited.forEach(function(item){
		go_mir.child_sector[item].graf.setAttributeNS(null, "fill", "#785");
		
		//go_mir.child_sector[item].text.textContent = ;
	});//*/
}