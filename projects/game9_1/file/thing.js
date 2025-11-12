function Thing(){//Последним аргументом должен быть объект родитель, пред последним Конструктор, а все аргументы до этих двух будут переданы в конструктор предмета(или героя).
	if(arguments[arguments.length - 1].child != undefined || !arguments[arguments.length - 1].child instanceof Array)return;
	this.parent = arguments[--arguments.length];
	arguments[--arguments.length].apply(this, arguments);
}
function Mount(){//Горы.
	this.type = "Mount";//Название функции конструктора.
	this.parent.block = 4;
	this.name = "Горы";
	var mount_height = gi_rs/10*7;
	var mount_contour = "M"+(this.parent.center_x - (gi_ws/2))+" "+(this.parent.center_y + (gi_rs/4))+" q"+(gi_ws/4)+" 0 "+(gi_ws/2)+" -"+mount_height+" q"+(gi_ws/4)+" "+mount_height+" "+(gi_ws/2)+" "+mount_height;
	this.graf = document.createElementNS(svgns, "path");
	this.graf.setAttributeNS(null, "d", mount_contour);
	this.graf.setAttributeNS(null, "fill", "url(#gradient_mount)");
	this.graf.setAttributeNS(null, "pointer-events", "none");//Не реагирует на события мыши, пропуская их дальше.
	this.graf.obj = this;
	svg_2.appendChild(this.graf);
	this.seve = function(){
		var o_seve = {};
		o_seve.type = this.type;
		return o_seve;
	}
	this.load = function(o_seve){
		
	}
	this.del = function(){
		this.parent.block = 0;
		delete this.parent.child;
		svg_2.removeChild(this.graf);
		
	}
}
function Forest(){//Лес.
	this.type = "Forest";//Название функции конструктора.
	this.parent.block = 4;
	this.name = "Лес";
	this.graf = document.createElementNS(svgns, "circle");
	this.graf.setAttributeNS(null, "cx", this.parent.center_x);
	this.graf.setAttributeNS(null, "cy", this.parent.center_y);
	this.graf.setAttributeNS(null, "r", (gi_rs*.55));
	this.graf.setAttributeNS(null, "fill", "url(#gradient_forest)");
	this.graf.setAttributeNS(null, "pointer-events", "none");//Не реагирует на события мыши, пропуская их дальше.
	this.graf.obj = this;
	svg_2.appendChild(this.graf);
	this.seve = function(){
		var o_seve = {};
		o_seve.type = this.type;
		return o_seve;
	}
	this.load = function(o_seve){
		
	}
	this.del = function(){
		this.parent.block = 0;
		delete this.parent.child;
		svg_2.removeChild(this.graf);
	}
}
function Ger(player){//Конструктор героя.
	this.type = "Ger";
	
	this.player = player;
	
	this.player.arr_child[this.player.arr_child.length] = this;
	
	//this.id_sector = id_sector;//Ид сектора на котором герой.
	
	this.sector = this.parent;//Ссылка на сектор на котором герой.
	
	this.obzor = 3;//Дальность обзора.
	
	this.obzor_ids = f_distance(this.sector.id,this.obzor);//Массив идов секторов обзора, вида {id:id,distance:расстояние}.
	this.obzor_ids.forEach(function(item){//При конструировании(создании) героя, делаем видимыми сектора в радиусе обзора.
		go_mir.child_sector[item.id].players_fog[this.player.id] = false;
	},this);
	this.x_sector = this.sector.x;//"x" координата сектора в котором находится герой, в системе координат смещения.
	this.y_sector = this.sector.y;//"y" координата сектора в котором находится герой, в системе координат смещения.
	this.action = 5;//Количество действий в ход.
	this.only_action = this.action;//Осталось действий.
	this.sector.block = 1;//Блокируем сектор для передвижения.
	
	this.a_ids_move = [];//f_ids_move(this);//Создаем массив для передвижения, объекты в массиве [{id:id,distance:расстояние,last:id}] last ид сектора с которого был найден этот как сосед.
	this.o_ids_move = [];//f_ids_move(this);//Создаем псевдомассив(объект) для передвижения, объекты в псевдомассиве {id_sector:{block:индекс_блока,distance:расстояние,last:id,rotation:от 0 до 5 множитель}}.
	//this.a_id_hods = f_distance(this.sector.id,this.only_action);
	
	this.track = new Track(this);
	
	this.flag_hod = true;
	this.run = function(){
		this.only_action = this.action;
		this.a_ids_move = f_ids_move(this);
		if(go_v === this){
			go_mir.vid();
			this.vid();
		}
	}
	this.name = "Гер";
	this.r = gi_rs/2;
	this.ot = this.r-Math.floor(gi_sw/2)
	this.graf = document.createElementNS(svgns, "circle");
	this.graf.setAttributeNS(null, "cx", this.sector.center_x);
	this.graf.setAttributeNS(null, "cy", this.sector.center_y);
	this.graf.setAttributeNS(null, "r", this.r-Math.floor(gi_rs/5));
	this.graf.setAttributeNS(null, "fill", this.player.color);
	this.graf.setAttributeNS(null, "stroke", gt_ck);
	this.graf.setAttributeNS(null, "stroke-width", gi_sw);
	this.graf.obj = this;//"Ggg";
	this.vid = function(){
		if(this.flag_hod && go_v === this){
			go_mir.vid();
			return;
		}
		if(this.player.flag_ai){
			if(go_v.vid_no(this) == -1)return;
			this.graf.setAttributeNS(null, "stroke", gt_cv);
			info("Имя игрока = "+this.player.name+"; Действий = "+this.action+"/"+this.only_action+"; id_sector = "+this.sector.id+". количество секторов для хода = "+Object.keys(this.o_ids_move).length+".");
			go_v = this;
			return;
		}
		//if(this.target_id != -1){
			this.o_ids_move = f_ids_move(this);
			this.track.on(this.target_id);
		//}
		this.flag_hod = true;
		this.flag_hod2 = true;
		if(go_v.vid_no(this) == -1)return;
		this.graf.setAttributeNS(null, "stroke", gt_cv);
		info("Имя = "+this.name+"; Действий = "+this.action+"/"+this.only_action+"; id_sector = "+this.sector.id+". количество секторов для хода = "+Object.keys(this.o_ids_move).length+". target_id = "+this.target_id);
		go_v = this;
		this.a_ids_move = f_ids_move(this);
		for(var i = 0; i < this.a_ids_move.length; i++){
			if(i <= this.only_action){
				for(var k = 0; k < this.a_ids_move[i].length; k++){
					go_mir.child_sector[this.a_ids_move[i][k].id].sector.setAttributeNS(null, "fill", "#785");
					go_mir.child_sector[this.a_ids_move[i][k].id].out_text(i);
				}
			}
		}
	}
	this.target_id = -1;
	this.vid_no = function(obj){
		//*#################################
		if(this.player.id !== gi_id_player){
			this.graf.setAttributeNS(null, "stroke", gt_ck);
			return;
		}
		if(obj instanceof Mir){
			this.graf.setAttributeNS(null, "stroke", gt_ck);
			this.track.off();
			go_cursor.type_cursor("st");
			return;
		}
		while(obj instanceof Thing){
			obj = obj.parent;
		}
		this.o_ids_move = f_ids_move(this);
		if(this.o_ids_move[obj.id].last != -1){
			go_cursor.type_cursor(1);
		}
		if(this.target_id == obj.id){
			//передвижение.
			this.track.on(this.target_id);
			var i_move = 1;
			var id_move = 0;
			while(this.track.a_path.length > i_move && this.only_action > 0){
				i_move++;
				this.only_action--;
				id_move = this.track.a_path[this.track.a_path.length - i_move];
				if(this.o_ids_move[id_move].block == 0){
					//############ Само перемещение #############
					//Снятие героя.
					if(this.parent.type == "Sector"){//если герой непосредственно на секторе то очищаем сектор от него.
						this.parent.child = undefined;
						this.parent.block = 0;
					}
					//Вставка героя.
					this.parent = go_mir.child_sector[id_move];
					this.sector = this.parent;
					this.sector.child = this;
					this.sector.block = 1;
					this.x_sector = this.sector.x;
					this.y_sector = this.sector.y;
					this.graf.setAttributeNS(null, "cx", this.sector.center_x);
					this.graf.setAttributeNS(null, "cy", this.sector.center_y);
					//###########################################
					this.obzor_ids = f_distance(this.sector.id,this.obzor);//Массив идов секторов обзора, вида {id:id,distance:расстояние}.
					this.obzor_ids.forEach(function(item){//При конструировании(создании) героя, делаем видимыми сектора в радиусе обзора.
						go_mir.child_sector[item.id].off_fog();
						go_mir.child_sector[item.id].players_fog[this.player.id] = false;
					},this);
					//f_focus_sector(this.sector.id);
				}
				if(this.o_ids_move[id_move].block == 1){
					go_mir.child_sector[id_move].child.interaction(this);
				}
				if(this.o_ids_move[id_move].block == 2){
					//############ Само перемещение #############
					//Снятие героя.
					if(this.parent.type == "Sector"){//если герой непосредственно на секторе то очищаем сектор от него.
						this.parent.child = undefined;
						this.parent.block = 0;
					}
					//Вставка героя.
					this.parent = go_mir.child_sector[id_move];
					this.sector = this.parent;
					this.sector.child = this;
					this.x_sector = this.sector.x;
					this.y_sector = this.sector.y;
					this.graf.setAttributeNS(null, "cx", this.sector.center_x);
					this.graf.setAttributeNS(null, "cy", this.sector.center_y);
					//###########################################
					this.obzor_ids = f_distance(this.sector.id,this.obzor);//Массив идов секторов обзора, вида {id:id,distance:расстояние}.
					this.obzor_ids.forEach(function(item){//При конструировании(создании) героя, делаем видимыми сектора в радиусе обзора.
						go_mir.child_sector[item.id].off_fog();
						go_mir.child_sector[item.id].players_fog[this.player.id] = false;
					},this);
					//f_focus_sector(this.sector.id);
					var at_ids = f_distance(this.sector.id,1);//Массив идов секторов обзора, вида {id:id,distance:расстояние}.
					this.obzor_ids.forEach(function(item){//При конструировании(создании) героя, делаем видимыми сектора в радиусе обзора.
						if(go_mir.child_sector[item.id].block == 3)go_mir.child_sector[item.id].child.interaction(this);
					},this);
				}
			}
			this.o_ids_move = f_ids_move(this);
			if(this.o_ids_move[obj.id].last == -1){
				go_cursor.type_cursor("st");
			}
			this.track.on(this.target_id);
			return -1;
		}else{
			this.target_id = obj.id;
		}
		this.track.on(this.target_id);
		return -1;
		//##############################*/
		
		this.graf.setAttributeNS(null, "stroke", gt_ck);
		var b_flag = false;
		var i_xods = 0;
		top:
		for(var i = 0; i < this.a_ids_move.length; i++){
			if(i <= this.only_action){
				for(var k = 0; k < this.a_ids_move[i].length; k++){
					if(!this.flag_hod2){
						go_mir.child_sector[this.a_ids_move[i][k].id].sector.setAttributeNS(null, "fill", gt_cs);
						go_mir.child_sector[this.a_ids_move[i][k].id].out_text("");
					}
					if(this.a_ids_move[i][k].id == obj.id){
						b_flag = true;
						i_xods = this.a_ids_move[i][k].distance;
						if(this.flag_hod2){
							break top;
						}
						
					}
				}
			}
		}
		if(obj instanceof Sector && obj.id != this.sector.id && b_flag){
			if(this.flag_hod2){
				var arr_p = [obj.id,this.a_ids_move[i][k].last];
				while(this.a_ids_move[i][k].last != this.sector.id){
					i--;
					for(k = 0; k < this.a_ids_move[i].length; k++){
						if(this.a_ids_move[i][k].id == arr_p[arr_p.length - 1]){
							arr_p[arr_p.length] = this.a_ids_move[i][k].last;
							break;
						}
					}
				}
				arr_p.forEach(function(item){
					go_mir.child_sector[item].sector.setAttributeNS(null, "fill", "#f00");
				});
				this.flag_hod2 = false;
				return -1;
			}
			this.flag_hod2 = true;
			//*
			this.only_action -= i_xods;
			this.sector.block = 0;
			this.sector = obj;
			this.sector.block = 1;
			this.x_sector = obj.x;
			this.y_sector = obj.y;
			this.graf.setAttributeNS(null, "cx", obj.center_x);
			this.graf.setAttributeNS(null, "cy", obj.center_y);
			this.a_ids_move = f_ids_move(this);
			this.flag_hod = false;
			this.vid();
			//*/
			
			return -1;
		};
	};
	this.graf.onclick = function(){
		if(!go_cursor.flag_onclick){
			go_cursor.flag_onclick = true;
			return;
		}
		this.obj.vid();
	};
	this.interaction = function(obj){
		if(obj.type == "Ger")out("Ты кто такой?");
	};
	svg_3.appendChild(this.graf);
}
function Track(obj){
	this.parent = obj;
	this.a_path = [];
	this.a_rot = [];
	this.cross = document.createElementNS(svgns, "polygon");//Изображения креста многоугольник.
	this.cross.setAttributeNS(null, "points", "-10,-8 -8,-10 0,-2 8,-10 10,-8 2,0 10,8 8,10 0,2 -8,10 -10,8 -2,0 -10,-8");//График креста.
	this.cross.setAttributeNS(null, "fill", "#fff");//устанавливаем цвет креста.
	this.cross.setAttributeNS(null, "stroke", "#000");//цвет контура.
	this.cross.setAttributeNS(null, "stroke-width", 1);//толщина контура.
	this.cross.setAttributeNS(null, "pointer-events", "none");//Не реагирует на события мыши, пропуская их дальше. Иначе изображения ернста будет мешать событиям мыши.
	/*
	this.point = document.createElementNS(svgns, "polygon");//Изображения стрелки многоугольник.
	this.point.setAttributeNS(null, "points", "10,0 5,5 5,2 -10,2 -10,-2 5,-2 5,-5 10,0");//График стрелки.
	this.point.setAttributeNS(null, "fill", "#fff");//устанавливаем цвет стрелки.
	this.point.setAttributeNS(null, "stroke", "#000");//цвет контура.
	this.point.setAttributeNS(null, "stroke-width", 1);//толщина контура.
	this.point.setAttributeNS(null, "pointer-events", "none");//Не реагирует на события мыши, пропуская их дальше. Иначе изображения ернста будет мешать событиям мыши.
	//this.point.setAttributeNS(null, "id", "point");//Ид стрелки для повторного использования.
	//*/
	this.graf = document.createElementNS(svgns, "g");//контейнер для креста.
	this.graf.appendChild(this.cross);//Добавляем изображения креста в группу.
	this.a_point = [];
	this.on = function(id){//this.parent.target_id
		this.off();
		if(this.parent.o_ids_move[id] == undefined)return -1;
		this.a_path.length = 0;
		this.a_path[this.a_path.length] = id;
		this.a_rot = [];
		this.a_rot[this.a_rot.length] = -1;
		while(this.parent.o_ids_move[id].last != -1){
			this.a_rot[this.a_rot.length] = 60*this.parent.o_ids_move[id].rotation;
			id = this.parent.o_ids_move[id].last;
			this.a_path[this.a_path.length] = id;
			
		}
		if(this.a_path.length < 2)return -1;
		//this.a_path[0]//XXX
		
		this.cross.setAttribute("transform", "translate("+go_mir.child_sector[this.a_path[0]].center_x+ "," +go_mir.child_sector[this.a_path[0]].center_y+ ")");
		if(this.parent.o_ids_move[this.a_path[0]].distance > this.parent.only_action){
			this.cross.setAttributeNS(null, "fill", "#000");
		}else{
			this.cross.setAttributeNS(null, "fill", "#FFF");
		}
		
		
		for(var i = 1; i < (this.a_path.length - 1); i++){
			if(this.a_point.length < i){//Если нехватает создаем.
				this.a_point[i - 1] = document.createElementNS(svgns, "polygon");//Изображения стрелки многоугольник.
				this.a_point[i - 1].setAttributeNS(null, "points", "10,0 5,5 5,2 -10,2 -10,-2 5,-2 5,-5 10,0");//График стрелки.
				//this.a_point[i - 1].setAttributeNS(null, "fill", "#fff");//устанавливаем цвет стрелки.
				this.a_point[i - 1].setAttributeNS(null, "stroke", "#000");//цвет контура.
				this.a_point[i - 1].setAttributeNS(null, "stroke-width", 1);//толщина контура.
				this.a_point[i - 1].setAttributeNS(null, "pointer-events", "none");//Не реагирует на события мыши, пропуская их дальше. Иначе изображения ернста будет мешать событиям мыши.
				
			}
			//this.a_point[i - 1].setAttributeNS(null, "x", go_mir.child_sector[this.a_path[i]].center_x);
			//this.a_point[i - 1].setAttributeNS(null, "y", go_mir.child_sector[this.a_path[i]].center_y);
			this.a_point[i - 1].setAttribute("transform", "translate("+go_mir.child_sector[this.a_path[i]].center_x+ "," +go_mir.child_sector[this.a_path[i]].center_y+ ") rotate(-"+this.a_rot[i]+")");
			if(this.parent.o_ids_move[this.a_path[i]].distance > this.parent.only_action){
				this.a_point[i - 1].setAttributeNS(null, "fill", "#000");
			}else{
				this.a_point[i - 1].setAttributeNS(null, "fill", "#FFF");
			}
			//this.a_point[i - 1].setAttribute("transform", "skewX("+this.a_rot[i]+ ")");
			//go_mir.child_sector[this.a_path[i]].out_text("_"+this.a_rot[i]+"_");
			this.graf.appendChild(this.a_point[i - 1]);
			//this.a_path[i];//-->
		}
		svg_3.appendChild(this.graf);
	}
	this.off = function(){
		if(svg_3.contains(this.graf))svg_3.removeChild(this.graf);
		for(var i = 0; this.graf.contains(this.a_point[i]); i++){
			this.graf.removeChild(this.a_point[i]);
		}
	}
}
function Unit(){
	this.type = "Unit";
	this.race;
	this.name = "Monster";
	this.amount = 1;
	if(this.parent.type == "Sector"){
		var sector_ids = f_distance(this.parent.id,1);
		sector_ids.forEach(function(item){
			if(go_mir.child_sector[item.id].block == 0)go_mir.child_sector[item.id].block = 2;
		},this);
		this.parent.block = 3;
	}
	var mount_height = gi_rs/10*7;
	var mount_contour = "M"+(this.parent.center_x - (gi_ws/2))+" "+(this.parent.center_y + (gi_rs/4))+" q"+(gi_ws/4)+" 0 "+(gi_ws/2)+" -"+mount_height+" q"+(gi_ws/4)+" "+mount_height+" "+(gi_ws/2)+" "+mount_height;
	this.graf = document.createElementNS(svgns, "path");
	this.graf.setAttributeNS(null, "d", mount_contour);
	this.graf.setAttributeNS(null, "fill", "#f00");
	this.graf.setAttributeNS(null, "pointer-events", "none");//Не реагирует на события мыши, пропуская их дальше.
	svg_2.appendChild(this.graf);
	this.interaction = function(obj){
		if(obj.type == "Ger"){
			f_battle(obj, this);
		}
	};
}
function Item(){
	this.type = "Item";
}
function House(){
	this.type = "House";
	
}
function City(player){
	this.type = "City";
	this.player = player || go_mir.child_players[gi_id_player_active];
	this.player.arr_child[this.player.arr_child.length] = this;
	this.sector = this.parent;
	this.sector.block = 1;//Блокируем сектор для передвижения.
	this._level = 0;
	Object.defineProperty(this, "level", {
		get: function(){
				return this._level;
		},
		set: function(value){
			this._level = value;
		}
	});
	Object.defineProperty(this, "name", {
		get: function(){
			switch(this._level){
				case 0:
					return "Хутор";
					break;
				case 1:
					return "Деревня";
					break;
				case 2:
					return "Село";
					break;
				case 3:
					return "none";
					break;
				case 4:
					return "none";
					break;
				case 5:
					return "none";
					break;
				case 6:
					return "none";
					break;
				case 7:
					return "none";
					break;
				default:
					return "none";
					break;
			}
		},
		set: function(value){}
	});
	this.obzor = this._level + 2;//Дальность обзора.
	this.obzor_ids = f_distance(this.sector.id,this.obzor);//Массив идов секторов обзора, вида {id:id,distance:расстояние}.
	this.obzor_ids.forEach(function(item){//При конструировании(создании) героя, делаем видимыми сектора в радиусе обзора.
		go_mir.child_sector[item.id].players_fog[this.player.id] = false;
	},this);
	this.arr_ger = [];
	//Графика.
	this.graf = document.createElementNS(svgns, "g");//контейнер для отображения на карте игры.
	this.graf.obj = this;//Оставляем ссылку на обект города.
	this.picture_height = gi_rs/10*5;
	this.path_l0 = "M"+(this.parent.center_x - (gi_ws/2))+" "+(this.parent.center_y + (gi_rs/4))+" q"+(gi_ws/4)+" 0 "+(gi_ws/2)+" -"+this.picture_height+" q"+(gi_ws/4)+" "+this.picture_height+" "+(gi_ws/2)+" "+this.picture_height;
	this.picture = document.createElementNS(svgns, "path");
	this.picture.setAttributeNS(null, "d", this["path_l"+this.level]);
	this.picture.setAttributeNS(null, "fill", this.player.color);
	this.graf.appendChild(this.picture);//Добовляем в контейнер изображение сектора.
	svg_2.appendChild(this.graf);
	//Методы.
	this.interaction = function(obj){
		if(obj.type == "Ger"){
			/*
			//Снятие героя.
			if(this.parent.type == "Sector"){//если герой непосредственно на секторе то очищаем сектор от него.
				this.parent.child = undefined;
				this.parent.block = 0;
			}
			//Вставка героя.
			this.parent = go_mir.child_sector[id_move];
			this.sector = this.parent;
			this.sector.child = this;
			this.sector.block = 1;
			this.x_sector = this.sector.x;
			this.y_sector = this.sector.y;
			this.graf.setAttributeNS(null, "cx", this.sector.center_x);
			this.graf.setAttributeNS(null, "cy", this.sector.center_y);
			*/
		}
	};
}
