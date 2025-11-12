function f_cor_sector(x,y){//принимает координаты центра, возвращает в текстовом виде координаты для отрисовки шестиугольника = сектора = гекса.
	var t_cor = "";
	var i = 6;
	while(i){
		var angle_deg = 60 * i - 30;//угол в градусах.
		var angle_rad = Math.PI / 180 * angle_deg;//угол в радианах.
		t_cor += (x + gi_rs * Math.cos(angle_rad))+","+(y + gi_rs * Math.sin(angle_rad));
		if(--i != 0)t_cor += " ";
	}
	return t_cor;
}
function f_distance(id,r){//Функция вычисляет по иду сектора, иды секторов в радиусе(радиус измеряется в секторах), от сектора. и возвращает их в массиве включая ид центрального сектора.
	var arr_ids = [];//{id:i_id,distance:i} содержит объекты.
	var center_xy = get_xy(id);
	var center_xyz = xy_to_xyz(center_xy.x,center_xy.y);
	var x = -r;
	var y, y_max, z, i_id;
	while(x <= r){
		y = Math.max(-r, -x-r);
		y_max = Math.min(r, -x+r);
		while(y <= y_max){
			z = -x-y;
			i_id = get_id(center_xyz.x+x, center_xyz.y+y, center_xyz.z+z);
			if(i_id !== -1)arr_ids[arr_ids.length] = {id:i_id,distance:Math.max(Math.abs(x),Math.abs(y),Math.abs(z))};
			y++;
		}
		x++;
	}
	return arr_ids;
}
function f_full_screen(){//Открывает игру на весь экран, в случае если игра открыта на весь экран сворачивает её.
	if(window.fullScreen){//Если во весь экран.
		document.mozCancelFullScreen();//Свертывает игру к прежнему состояни.
	}else{
		svg.mozRequestFullScreen();//Развертывает на весь экран.
	}
}
function f_focus_sector(id){//Функция центрирует вид на секторе чей ид был передан функции.
	if(id < 0 || id >= go_mir.child_sector.length)return -1;//Если сектора с данным идом нет то функция вернкт -1.
	svg_group.setAttribute("transform", "matrix("+gi_scale+" 0 0 "+gi_scale+" "+((((gi_win_w - (go_interf.indent_left + go_interf.indent_right)) / 2) + go_interf.indent_left) - (go_mir.child_sector[id].center_x * gi_scale))+" "+((((gi_win_h - (go_interf.indent_top + go_interf.indent_down)) / 2) + go_interf.indent_top) - (go_mir.child_sector[id].center_y * gi_scale))+")");
}
function f_seve_game(){
	var o_seve = {};
	//o_seve.flag_grid_map = gb_flag_grid_map;
	//o_seve.players = go_players.seve();
	o_seve.mir = go_mir.seve();
	f_download(JSON.stringify(o_seve),"seve.sev","text/plain");
}
function f_load_game(){
	var input = document.createElement("input");
	input.setAttribute("type", "file");
	input.setAttribute("onchange", "f_handleFiles(this.files[0])");
	input.click();
}
function f_handleFiles(file){
	var reader = new FileReader();
	reader.onload = function(){
		var o_seve = JSON.parse(reader.result);
		//gb_flag_grid_map = o_seve.flag_grid_map;
		//go_players.load(o_seve.players);
		go_mir.load(o_seve.mir);
		
		go_interf.full_screen_change();//Для настройки миникарты.
	}
	reader.readAsText(file);
}
function f_new_game(){
	go_mir.load(go_seve.mir);//Загружаем стартовую заранее сохраненную карту.
}
function f_download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}
function f_run(){//Функция передачи хода.
	var j = 2;
	while(j--){
		for(var i = 0; i < ga_run.length; i++){
			if(!ga_run[i]){
				if(!go_mir.child_players[i].flag_ai)return;
				go_mir.child_players[i].run_ai();
				ga_run[i] = true;
			}
		}
		go_mir.run();
		ga_run.fill(false);
		for(var i = 0; i < go_mir.child_players.length; i++){
				go_mir.child_players[i].run();
		}
		
	}
}
function f_battle(attack, defend){
	out(attack.name+" напал на "+defend.name);
	//if(defend.type == "Ger" || defend.type == "Unit")//Если защищающийся не город или постройка, тоесть юнит или герой, то рисуем обычное поле битвы.
	
}
function f_del(obj){//Функция удаления объекта, если обекта нет удаляет все обекты, это нужно перед загрузкой.
	if(obj == undefined){//Объекта нет.
		//Удаляем весе объекты игры.
		out("Удаляем все объекты игры.");
		
		return;
	}
	switch(obj.type){//Для каждого типа объектов свой способ удаления.
		case "Sector"://Сектора.
			out("Удаляем сектора.");
			
			delete obj.parent;
			if(obj.child != undefined){
				f_del(obj.child);
			}
			svg_1.removeChild(this.graf);
			if(this.flag_fog){
				svg_4.removeChild(this.fog);
				this.flag_fog = false;
			}
			go_mir.child_sector.splice(this.id,1);
			
			break;
		case "Mount"://Горы.
		case "Forest"://Лес.
			obj.parent.block = 0;
			delete obj.parent.child;
			svg_2.removeChild(obj.graf);
			break;
		case "Ger"://Герой.
			out("Удаляем Героя.");
			
			break;
		case "House"://Постройка.
			out("Удаляем Постройку.");
			
			break;
		case "Unit"://Юнит.
			out("Удаляем Юнита.");
			
			break;
		case "Item"://Предмет.
			out("Удаляем Предмет.");
			
			break;
		default://Постройки, монстры, вещи и другое будет реализовано потом.
			out("Нужно удалить что то неизвестное функции удаления f_del.");
			break;
		}
	
}
function f_seve(obj){
	
}
function f_load(obj){
	
}
