/* Все данные игры "Игра с огнем" взяты с:
https://greenwire-russia.greenpeace.org/stranica/detyam-o-prirodnykh-pozharakh-poznavatelnye-igry-multfilmy-i-zanyatiya
https://secured-static.greenpeace.org/russia/Global/russia/report/forest/fires/schools/games/%d0%98%d0%b3%d1%80%d0%b0%20%d1%81%20%d0%be%d0%b3%d0%bd%d0%b5%d0%bc.pdf
https://drive.google.com/drive/folders/1ynMPoTkr-lnoL0h0KvOsfN5HnOqCsAX8
https://drive.google.com/file/d/1OdQu-jhjuobRjopm3cMuDABRxaHDbJ9V/view
*/
/// Игра - "Игра с огнем", Game with fire, сокращенно gwf - что также является корнем игры.
/// В HTML должен быть тег <svg xmlns="http://www.w3.org/2000/svg" id="game_with_fire"></svg> в котором и будет игра.
/// после загрузки доккумента, запустите игру window.onload = function(){gwf.start();}
/// Создатель онлайн версии этой игры, для свободного не комерческого использования, добровольный лесной пожарный 2b3da249fdd9da31e00f2f54b87a05c2
var gwf = {
	svgns: "http://www.w3.org/2000/svg",// Пространство имен SVG.
	svg: null,// svg окно(окно игры).
	svg_width: 1120,// Ширина игрового окна.// далие в gwf.start() возможно переопределено.
	svg_height: 780,// Высота игрового окна.// далие в gwf.start() возможно переопределено.
	svg_color: "#fff",// Фон игрового окна.
	g_map: null,// Слой карты, подвижной, масштабируемой части игры.
	img_map: null,// Картинка карты.
	img_href: "file/map.jpg",// Расположение картинки карты.
	img_map_w: 3300,// Ширина картинки карты.
	img_map_h: 2339// Высота картинки карты.
};
// В следующих массивах аозможно name лишнее так как не используется.
gwf.actions = [
	{id:0,name:'Поведение при пожаре',active:2},// active 2 - Профилактика не пройдена, 1- профилактика пройдена, 0 - Профилактика использована.
	{id:1,name:'Уборка мусора',active:2},
	{id:2,name:'Опашка территории',active:2},
	{id:3,name:'Запрет поджогов травы',active:2,cancel:[6,11,14]},
	{id:4,name:'Расклейка листовок',active:2},
	{id:5,name:'Безопасное разведение костра',active:2,cancel:[12,10]},
	{id:6,name:'Безопасные зоны при пожаре',active:2}
];
gwf.weathers = [
	{id:0,name:'Солнце',f_card:function(){gwf.f_sun();},f_action:function(){gwf.f_sun_action();}},
	{id:1,name:'Солнце',f_card:function(){gwf.f_sun();},f_action:function(){gwf.f_sun_action();}},
	{id:2,name:'Дождь',f_card:function(){gwf.f_rain(1);},f_action:function(){gwf.f_rain_action(1);}},
	{id:3,name:'Дождь',f_card:function(){gwf.f_rain(0);},f_action:function(){gwf.f_rain_action(0);}},
	{id:4,name:'Ветер',f_card:function(){gwf.f_wind([8,9,10,11],[10,13,15,14],"s");},f_action:function(){gwf.f_wind_action([8,9,10,11],[10,13,15,14],"s");}},
	{id:5,name:'Ветер',f_card:function(){gwf.f_wind([0,1,2,3],[8,9,10,13],"se");},f_action:function(){gwf.f_wind_action([0,1,2,3],[8,9,10,13],"se");}},
	{id:6,name:'Ветер',f_card:function(){gwf.f_wind([0,1,2,3],[4,2,8,9],"e");},f_action:function(){gwf.f_wind_action([0,1,2,3],[4,2,8,9],"e");}},
	{id:7,name:'Ветер',f_card:function(){gwf.f_wind([8,9,10,11,13,15,14],[5,8,6,7,10,11,12],"ne");},f_action:function(){gwf.f_wind_action([8,9,10,11,13,15,14],[5,8,6,7,10,11,12],"ne");}},
	{id:8,name:'Ветер',f_card:function(){gwf.f_wind([6],[5],"n");},f_action:function(){gwf.f_wind_action([6],[5],"n");}},
	{id:9,name:'Ветер',f_card:function(){gwf.f_wind([8,9,10,11,12,13,15,14],[0,1,2,8,6,3,9,10],"nw");},f_action:function(){gwf.f_wind_action([8,9,10,11,12,13,15,14],[0,1,2,8,6,3,9,10],"nw");}},
	{id:10,name:'Ветер',f_card:function(){gwf.f_wind([4,5,6,7],[0,4,8,6],"w");},f_action:function(){gwf.f_wind_action([4,5,6,7],[0,4,8,6],"w");}},
	{id:11,name:'Ветер',f_card:function(){gwf.f_wind([4,5,6,7],[2,8,10,11],"sw");},f_action:function(){gwf.f_wind_action([4,5,6,7],[2,8,10,11],"sw");}},
	{id:12,name:'Дождь',f_card:function(){gwf.f_rain(2);},f_action:function(){gwf.f_rain_action(2);}},
	{id:13,name:'Облачно',f_card:function(){},f_action:function(){}},
	{id:14,name:'Ливень',f_card:function(){gwf.f_rain();},f_action:function(){gwf.f_rain_action();}}
];
gwf.f_wind = function(out_wind, in_wind, direction){
	for(let i = 0; i < out_wind.length; i++)
		if(this.fields[out_wind[i]].count_fire){
			this.fields[in_wind[i]].off_active();
			this.fields[in_wind[i]].add_fire();
		}
}
gwf.f_wind_action = function(out_wind, in_wind, direction){
	for(let i = 0; i < out_wind.length; i++)
		if(this.fields[out_wind[i]].count_fire)
			this.fields[in_wind[i]].on_active();
}
gwf.f_rain = function(region_id){
	if(typeof region_id !=="undefined"){
		this.fields.forEach(function(field){
			if(field.count_fire && field.region_id == region_id && field.type != "торф" && field.type != "охраняемый"){
				field.off_active();
				if(field.type == "трава" || field.type == "тростник"){
					field.add_fire_ex(15);
				}else if(field.type == "лиственный"){
					field.add_fire_ex(2);
				}else{
					field.add_fire_ex(1);
				}
			}
		});
	}else{
		this.fields.forEach(function(field){
			if(field.count_fire && field.type != "торф" && field.type != "охраняемый"){
				field.off_active();
				if(field.type == "трава" || field.type == "тростник"){
					field.add_fire_ex(15);
				}else if(field.type == "лиственный"){
					field.add_fire_ex(2);
				}else{
					field.add_fire_ex(1);
				}
			}
		});
	}
}
gwf.f_rain_action = function(region_id){
	if(typeof region_id !=="undefined"){
		this.fields.forEach(function(field){
			if(field.count_fire && field.region_id == region_id && field.type != "торф" && field.type != "охраняемый")
				field.on_active("#00f");
			
		});
	}else{
		this.fields.forEach(function(field){
			if(field.count_fire && field.type != "торф" && field.type != "охраняемый")
				field.on_active("#00f");
		});
	}
}
gwf.f_sun = function(){
	this.fields.forEach(function(field){
		if(field.count_fire){
			field.off_active();
			if(field.type == "торф" || field.type == "лиственный"){
				field.add_fire();
			}else{
				field.add_fire(2);
			}
		}
	});
}
gwf.f_sun_action = function(){
	this.fields.forEach(function(field){if(field.count_fire)field.on_active();});
}
gwf.events = [
	{id:0,name:'Авиапатрулирование',f_card:function(){gwf.fields[1].add_fire(2);},f_action_off:function(){gwf.fields[1].off_active();},f_action:function(){gwf.fields[1].on_active();}},
	{id:1,name:'Дружина',f_card:function(){gwf.two_action = true;},f_action_off:function(){},f_action:function(){}},
	{id:2,name:'Возгорание',f_card:function(){gwf.fields[3].add_fire(1);},f_action_off:function(){gwf.fields[3].off_active();},f_action:function(){gwf.fields[3].on_active();}},
	{id:3,name:'Возгорание',f_card:function(){gwf.fields[6].add_fire(1);},f_action_off:function(){gwf.fields[6].off_active();},f_action:function(){gwf.fields[6].on_active();}},
	{id:4,name:'Весенние праздники',f_card:function(){gwf.fields[13].add_fire(1);gwf.fields[9].add_fire(1);},f_action_off:function(){gwf.fields[13].off_active();gwf.fields[9].off_active();},f_action:function(){gwf.fields[13].on_active();gwf.fields[9].on_active();}},
	{id:5,name:'Возгорание',f_card:function(){gwf.fields[10].add_fire(1);},f_action_off:function(){gwf.fields[10].off_active();},f_action:function(){gwf.fields[10].on_active();}},
	{id:6,name:'Возгорание',f_card:function(){gwf.fields[8].add_fire(3);},f_action_off:function(){gwf.fields[8].off_active();},f_action:function(){gwf.fields[8].on_active();}},
	{id:7,name:'Возгорание',f_card:function(){gwf.fields[4].add_fire(1);},f_action_off:function(){gwf.fields[4].off_active();},f_action:function(){gwf.fields[4].on_active();}},
	{id:8,name:'Возгорание',f_card:function(){gwf.fields[14].add_fire(1);},f_action_off:function(){gwf.fields[14].off_active();},f_action:function(){gwf.fields[14].on_active();}},
	{id:9,name:'Сел телефон',f_card:function(){gwf.off_phone = true;},f_action_off:function(){},f_action:function(){}},
	{id:10,name:'Возгорание',f_card:function(){gwf.fields[7].add_fire(2);},f_action_off:function(){gwf.fields[7].off_active();},f_action:function(){gwf.fields[7].on_active();}},
	{id:11,name:'Возгорание',f_card:function(){gwf.fields[5].add_fire(3);},f_action_off:function(){gwf.fields[5].off_active();},f_action:function(){gwf.fields[5].on_active();}},
	{id:12,name:'Возгорание',f_card:function(){gwf.fields[2].add_fire(2);},f_action_off:function(){gwf.fields[2].off_active();},f_action:function(){gwf.fields[2].on_active();}},
	{id:13,name:'Возгорание',f_card:function(){gwf.fields[12].add_fire(1);},f_action_off:function(){gwf.fields[12].off_active();},f_action:function(){gwf.fields[12].on_active();}},
	{id:14,name:'Возгорание',f_card:function(){gwf.fields[11].add_fire(3);},f_action_off:function(){gwf.fields[11].off_active();},f_action:function(){gwf.fields[11].on_active();}}
];
gwf.fields = [
	{id:0,name:'заповедник "Олений"',region_id:0,region_name:'Заречье',type:"охраняемый",x:670,y:20},// Шаг по x 650(20,670,1320,1970,2620); y 560(20,580,1140,1700)
	{id:1,name:'Медвежий лес',region_id:0,region_name:'Заречье',type:"хвойный",x:20,y:580},
	{id:2,name:'Туманное болото',region_id:0,region_name:'Заречье',type:"торф",x:670,y:580},
	{id:3,name:'Зеленая роща',region_id:0,region_name:'Заречье',type:"лиственный",x:20,y:1140},
	{id:4,name:'Высокие тростники',region_id:1,region_name:'Долина',type:"тростник",x:1320,y:20},
	{id:5,name:'Желтое поле',region_id:1,region_name:'Долина',type:"трава",x:1970,y:20},
	{id:6,name:'Глубокое болото',region_id:1,region_name:'Долина',type:"торф",x:1970,y:580},
	{id:7,name:'Дальнее болото',region_id:1,region_name:'Долина',type:"торф",x:2620,y:580},
	{id:8,name:'Чистое поле',region_id:2,region_name:'окрестности деревни',type:"трава",x:1320,y:580},
	{id:9,name:'Беличья опушка',region_id:2,region_name:'окрестности деревни',type:"хвойный",x:670,y:1140},
	{id:10,name:'Светлый бор',region_id:2,region_name:'окрестности деревни',type:"хвойный",x:1320,y:1140},
	{id:11,name:'Тихое поле',region_id:2,region_name:'окрестности деревни',type:"трава",x:1970,y:1140},
	{id:12,name:'Грибной лес',region_id:2,region_name:'окрестности деревни',type:"лиственный",x:2620,y:1140},
	{id:13,name:'Дубовая роща',region_id:2,region_name:'окрестности деревни',type:"лиственный",x:670,y:1700},
	{id:14,name:'Широкое поле',region_id:2,region_name:'окрестности деревни',type:"трава",x:1970,y:1700},
	{id:15,name:'село Солнечное',region_id:2,region_name:'окрестности деревни',type:"охраняемый",x:1320,y:1700}
];
gwf.create_field = function(obj){
	obj.g = document.createElementNS(this.svgns, "g");
	this.g_map.appendChild(obj.g);
	obj.rect = document.createElementNS(this.svgns, "rect");
	obj.rect.setAttributeNS(null, "x", obj.x);
	obj.rect.setAttributeNS(null, "y", obj.y);
	obj.rect.setAttributeNS(null, "width", 620);
	obj.rect.setAttributeNS(null, "height", 530);
	obj.rect.setAttributeNS(null, "rx", 50);
	obj.rect.setAttributeNS(null, "ry", 30);
	obj.rect.setAttributeNS(null, "fill", "none");
	obj.rect.setAttributeNS(null, "pointer-events", "visible");
	obj.rect.setAttributeNS(null, "stroke", "none");
	obj.rect.setAttributeNS(null, "stroke-width", 10);
	obj.title = document.createElementNS(this.svgns, "title");
	obj.title.textContent = obj.name+"("+obj.type+")";
	obj.g.appendChild(obj.title);
	obj.g.appendChild(obj.rect);
	/// Анимация/выделение.
	obj.active = document.createElementNS(this.svgns, "animate");
	obj.active.setAttributeNS(null, "attributeName", "stroke-opacity");
	obj.active.setAttributeNS(null, "values", "1;0;1;");
	obj.active.setAttributeNS(null, "dur", "2s");
	obj.active.setAttributeNS(null, "repeatCount", "indefinite");
	obj.rect.appendChild(obj.active);
	obj.on_active = function(color){// = "#f00"){
		color = color || "#f00";// Для совместимости с IE(казлом)
		this.rect.setAttributeNS(null, "stroke", color);
	}
	obj.off_active = function(){
		this.rect.setAttributeNS(null, "stroke", "none");
	}
	obj.arr_fire = [];
	obj.count_fire = 0;
	obj.count_fire_ex = 0;
	obj.add_fire = function(i_amount){// = 1){
		i_amount = i_amount || 1;// Для совместимости с IE(казлом)
		while(i_amount--){
			let i_fire = this.count_fire + this.count_fire_ex;
			if(i_fire >= 13)break;
			if(i_fire < this.arr_fire.length){
				this.arr_fire[i_fire].setAttributeNS(null, "href", "#fire");
				this.g.appendChild(this.arr_fire[i_fire]);
			}else{
				let x = i_fire % 5 * 100;
				let y = (((i_fire / 5 | 0) + 1) % 3) * 100 + 20;
				this.arr_fire[i_fire] = document.createElementNS(gwf.svgns, "use");
				this.arr_fire[i_fire].setAttributeNS(null, "href", "#fire");
				this.arr_fire[i_fire].setAttributeNS(null, "x", this.x + x);
				this.arr_fire[i_fire].setAttributeNS(null, "y", this.y + y);
				this.g.appendChild(this.arr_fire[i_fire]);
			}
			this.count_fire++;
		}
	}
	obj.add_fire_ex = function(i_amount){// = 1){
		i_amount = i_amount || 1;// Для совместимости с IE(казлом)
		while(i_amount--){
			if(!this.count_fire)break;
			this.arr_fire[this.count_fire_ex].setAttributeNS(null, "href", "#fire_ex");
			this.count_fire--;
			this.count_fire_ex++;
		}
	}
	obj.clear_fire = function(){
		this.arr_fire.some(function(fire){
			if(this.g.contains(fire))this.g.removeChild(fire);
			else return true;
		},this);
		this.count_fire = 0;
		this.count_fire_ex = 0;
	}
	obj.g.onclick = function(){
		if((gwf.firefighters_flag || gwf.forest_guard_flag) && this.rect.getAttribute('stroke') != "none"){
			if(this.type == "трава" || this.type == "лиственный"){
				this.add_fire_ex(2);
			}else{
				this.add_fire_ex();
			}
			gwf.f_new_run();
		}
	}.bind(obj);
}
gwf.two_action = false;
gwf.f_new_run = function(){
	this.fields.forEach(function(field){field.off_active();});
	this.firefighters_flag = false;
	this.forest_guard_flag = false;
	if(this.g_map.contains(this.forest_guard))this.g_map.removeChild(this.forest_guard);
	if(this.g_map.contains(this.firefighters))this.g_map.removeChild(this.firefighters);
	if(this.g_map.contains(this.prevention))this.g_map.removeChild(this.prevention);
	if(this.two_action){
		this.two_action = false;
		this.f_action();
		return;
	}
	this.i_day++;
	if(this.i_day > 14){
		this.f_game_end();
		return;
	}
	this.title_run.textContent = "Осталось "+(15 - this.i_day)+" ходов.";
	this.button_run_off = false;
	this.backing_run.appendChild(this.animate_run);
	this.text_run.setAttributeNS(null, "fill", this.stroke_color_2);
	this.backing_run.setAttributeNS(null, "stroke", this.stroke_color_2);
	this.show_underline.setAttributeNS(null, "y", 235);
}
gwf.f_game_end = function(){
	if(this.fields[15].count_fire){
		this.texts_end_menu[0].out.setAttributeNS(null,'fill', "#f00");
		this.texts_end_menu[0].out.textContent = "\u2005горит";
	}else{
		this.texts_end_menu[0].out.setAttributeNS(null,'fill', "#0f0");
		this.texts_end_menu[0].out.textContent = "\u2005спасено";
	}
	if(this.fields[0].count_fire){
		this.texts_end_menu[1].out.setAttributeNS(null,'fill', "#f00");
		this.texts_end_menu[1].out.textContent = "\u2005горит";
	}else{
		this.texts_end_menu[1].out.setAttributeNS(null,'fill', "#0f0");
		this.texts_end_menu[1].out.textContent = "\u2005спасен";
	}
	let i = this.fields.length;
	let all_fire = 0;
	let fire_ex = 0;
	let fire = 0;
	let fields_not_fire = 0;
	let fields_fire_ex = 0;
	let fields_fire = 0;
	while(i--){
		all_fire += this.fields[i].count_fire + this.fields[i].count_fire_ex;
		fire_ex += this.fields[i].count_fire_ex;
		fire += this.fields[i].count_fire;
		if(this.fields[i].count_fire){
			fields_fire++;
		}else if(this.fields[i].count_fire_ex){
			fields_fire_ex++;
		}else{
			fields_not_fire++;
		}
	}
	i = this.actions.length;
	let prevention_out = 0;
	let prevented_fires = 0;
	while(i--){
		if(this.actions[i].active != 2)prevention_out++;
		if(this.actions[i].active == 0)prevented_fires++;
	}
	this.texts_end_menu[2].out.textContent = "\u2005"+all_fire;
	this.texts_end_menu[3].out.textContent = "\u2005"+fire_ex;
	this.texts_end_menu[4].out.textContent = "\u2005"+fire;
	this.texts_end_menu[5].out.textContent = "\u2005"+fields_not_fire;
	this.texts_end_menu[6].out.textContent = "\u2005"+fields_fire_ex;
	this.texts_end_menu[7].out.textContent = "\u2005"+fields_fire;
	this.texts_end_menu[8].out.textContent = "\u2005"+prevention_out;
	this.texts_end_menu[9].out.textContent = "\u2005"+prevented_fires;
	this.g_map.appendChild(this.end_menu);
}
gwf.f_new_game = function(flag_re_start){// = false){
	if(flag_re_start === undefined)flag_re_start = false;// Для совместимости с IE(казлом(ослом))
	if(!flag_re_start)this.shuffle_cards();
	this.i_day = 0;
	this.title_run.textContent = "Осталось "+(15 - this.i_day)+" ходов.";
	this.button_run_off = false;
	this.backing_run.appendChild(this.animate_run);
	this.text_run.setAttributeNS(null, "fill", this.stroke_color_2);
	this.backing_run.setAttributeNS(null, "stroke", this.stroke_color_2);
	this.show_underline.setAttributeNS(null, "y", 235);
	this.fiag_prevention = true;
	let i = this.actions.length;
	while(i--){
		if(!this.prevention.contains(this.actions[i].img))this.prevention.appendChild(this.actions[i].img);
		this.actions[i].active = 2;
	}
	this.fields.forEach(function(field){field.clear_fire();});
	if(this.g_map.contains(this.end_menu))this.g_map.removeChild(this.end_menu);
}
gwf.start = function(){
	//* Делаем окно игры в размер окна браузера.
	this.svg_width = document.body.clientWidth - 20;// -20 Чтоб не лезть в body margin
	//this.svg_height = document.body.clientHeight -20;
	this.svg_height = window.innerHeight -20;
	/* IE/Edge - ослы */
	//document.body.style.margin = 0;
	//this.svg_width = document.body.clientWidth;
	//this.svg_height = document.body.clientHeight;
	//*/
	this.svg = document.getElementById('game_with_fire');
	this.svg.setAttributeNS(null, "width", this.svg_width);
	this.svg.setAttributeNS(null, "height", this.svg_height);
	this.svg.style['background-color'] = this.svg_color;
	/// Создаем хранилище картинок.
	this.storage = document.createElementNS(this.svgns, "defs");
	this.svg.appendChild(this.storage);
	/// Создаем огоньки.
	this.img_fire = document.createElementNS(this.svgns, "image");
	this.img_fire.setAttributeNS(null, "href", "file/fire.png");
	this.img_fire.setAttributeNS(null, "id", "fire");
	///######### TEST для Edge #########
	this.img_fire.setAttributeNS(null, "width", 242);
	this.img_fire.setAttributeNS(null, "height", 242);
	///#################################
	this.storage.appendChild(this.img_fire);
	// потухший.
	this.img_fire_ex = document.createElementNS(this.svgns, "image");
	this.img_fire_ex.setAttributeNS(null, "href", "file/fire_ex.png");
	this.img_fire_ex.setAttributeNS(null, "id", "fire_ex");
	///######### TEST для Edge #########
	this.img_fire_ex.setAttributeNS(null, "width", 242);
	this.img_fire_ex.setAttributeNS(null, "height", 242);
	///#################################
	this.storage.appendChild(this.img_fire_ex);
	/// Создаем контейнер для всех элементов карты.
	this.g_map = document.createElementNS(this.svgns, "g");
	this.svg.appendChild(this.g_map);
	/// rect_0 для точного масштабирования. костыль.
	this.rect_0 = document.createElementNS(this.svgns, "rect");
	this.rect_0.setAttributeNS(null, "x", 0);
	this.rect_0.setAttributeNS(null, "y", 0);
	this.rect_0.setAttributeNS(null, "width", this.img_map_w);
	this.rect_0.setAttributeNS(null, "height", this.img_map_h);
	this.rect_0.setAttributeNS(null, "fill", "none");
	this.g_map.appendChild(this.rect_0);
	/// Создаем карту.
	this.img_map = document.createElementNS(this.svgns, "image");
	///######### TEST для Edge #########
	this.img_map.setAttributeNS(null, "width", 3300);
	this.img_map.setAttributeNS(null, "height", 2339);
	///#################################
	this.img_map.setAttributeNS(null, "href", this.img_href);
	this.g_map.appendChild(this.img_map);
	/// Создаем поля.
	this.fields.forEach(this.create_field,this);
	/// Перемешивает массивы карт, погоды и событий.
	this.shuffle_cards();
	/// Подчеркивание хода.
	this.underline = document.createElementNS(this.svgns, "path");
	this.underline.setAttributeNS(null, "d", "m 0,0 q 30,-7 100,0 q 70,8 140,0");
	this.underline.setAttributeNS(null, "fill", "none");
	this.underline.setAttributeNS(null, "stroke", "#5b7cc6");//#db3524, #c82921, #5b7cc6, #5b7ce7
	this.underline.setAttributeNS(null, "stroke-width", 10);
	this.underline.setAttributeNS(null, "stroke-opacity", .8);
	this.underline.setAttributeNS(null, "stroke-linecap", "round");
	this.underline.setAttributeNS(null, "id", "underline");
	this.storage.appendChild(this.underline);
	this.show_underline = document.createElementNS(this.svgns, "use");
	this.show_underline.setAttributeNS(null, "href", "#underline");
	this.show_underline.setAttributeNS(null, "x", 2740);
	this.show_underline.setAttributeNS(null, "y", 235);
	this.g_map.appendChild(this.show_underline);
	/// Кнопка ход.
	this.stroke_color_2 = "#000";
	this.radius_run = 70;
	this.margin_run = 30;
	this.button_run = document.createElementNS(this.svgns, "g");
	this.title_run = document.createElementNS(this.svgns, "title");
	this.title_run.textContent = "Осталось 15 ходов.";
	this.button_run.appendChild(this.title_run);
	this.backing_run = document.createElementNS(this.svgns, "circle");
	this.backing_run.setAttributeNS(null, "cx", this.img_map_w - this.img_map_w / 8.35);//Устанавливаем координату "x" конпки ход относительно её контента.
	this.backing_run.setAttributeNS(null, "cy", this.img_map_h / 5);//Устанавливаем координату "y" конпки ход относительно её контента.
	this.backing_run.setAttributeNS(null, "r", this.radius_run);
	this.backing_run.setAttributeNS(null, "fill", "none");
	this.backing_run.setAttributeNS(null, "pointer-events", "visible");
	this.backing_run.setAttributeNS(null, "stroke", this.stroke_color_2);
	this.backing_run.setAttributeNS(null, "stroke-width", 10);
	this.animate_run = document.createElementNS(this.svgns, "animate");
	this.animate_run.setAttributeNS(null, "attributeName", "stroke");
	this.animate_run.setAttributeNS(null, "values", "#000;#800;#fff;");
	this.animate_run.setAttributeNS(null, "dur", "1s");
	this.animate_run.setAttributeNS(null, "repeatCount", "indefinite");
	this.backing_run.appendChild(this.animate_run);
	this.text_run = document.createElementNS(this.svgns, "text");
	this.text_run.setAttributeNS(null,'x',this.img_map_w - this.img_map_w / 8.35);//Координата "x" текста, устанавливаем в центр кнопки.
	this.text_run.setAttributeNS(null,'y',this.img_map_h / 5);//Координата "y" текста, устанавливаем в центр кнопки.
	this.text_run.setAttributeNS(null, "text-anchor", "middle");
	this.text_run.setAttributeNS(null, "dy", ".3em");
	this.text_run.setAttributeNS(null,'font-size', this.radius_run/2);
	this.text_run.setAttributeNS(null,'fill', this.stroke_color_2);
	this.text_run.setAttributeNS(null, "pointer-events", "none");
	this.text_run.textContent = "ХОД";
	this.button_run.appendChild(this.backing_run);
	this.button_run.appendChild(this.text_run);
	this.button_run_off = false;
	this.button_run.onmouseover = function(){
		if(this.button_run_off)return;
		this.text_run.setAttributeNS(null, "fill", this.focus_color);
		this.backing_run.setAttributeNS(null, "stroke", this.focus_color);
	}.bind(this);
	this.button_run.onmouseout = function(){
		if(this.button_run_off)return;
		this.text_run.setAttributeNS(null, "fill", this.stroke_color_2);
		this.backing_run.setAttributeNS(null, "stroke", this.stroke_color_2);
	}.bind(this);
	this.i_day = 0;
	/// Меню карт #####
	this.cards_menu = document.createElementNS(this.svgns, "image");
	this.cards_menu.setAttributeNS(null, "x", 1400);
	this.cards_menu.setAttributeNS(null, "y", 100);
	this.cards_menu.setAttributeNS(null, "width", 1110);
	///######### TEST для Edge #########
	this.cards_menu.setAttributeNS(null, "height", 1616);
	///#################################
	this.active_card = null;
	this.cards_menu.onclick = function(){
		if(this.g_map.contains(this.cards_menu))this.g_map.removeChild(this.cards_menu);
		this.active_card.f_card();
		if(this.weather_or_action){
			this.active_card.f_action_off();
			if(this.g_map.contains(this.prevention_on))this.g_map.removeChild(this.prevention_on);
			if(this.prevention_on.contains(this.actions[3].img))this.prevention_on.removeChild(this.actions[3].img);
			if(this.prevention_on.contains(this.actions[5].img))this.prevention_on.removeChild(this.actions[5].img);
			this.button_run_off = false;
			this.backing_run.appendChild(this.animate_run);
			this.text_run.setAttributeNS(null, "fill", this.stroke_color_2);
			this.backing_run.setAttributeNS(null, "stroke", this.stroke_color_2);
			this.show_underline.setAttributeNS(null, "y", 300);
		}else{
			this.show_underline.setAttributeNS(null, "y", 360);
			this.f_action();
		}
	}.bind(this);
	///################
	this.weather_or_action = false;
	this.button_run.onclick = function(){
		if(this.button_run_off)return;
		if(this.weather_or_action)
			this.f_weather();
		else
			this.f_event();
		if(this.backing_run.contains(this.animate_run))this.backing_run.removeChild(this.animate_run);
		this.button_run_off = true;
	}.bind(this);
	this.g_map.appendChild(this.button_run);
	// Кнопка профилактики активна.
	this.prevention_on = document.createElementNS(this.svgns, "g");
	this.prevention_frame_on = document.createElementNS(this.svgns, "rect");
	this.prevention_frame_on.setAttributeNS(null, "x", 670);
	this.prevention_frame_on.setAttributeNS(null, "y", 1860);
	this.prevention_frame_on.setAttributeNS(null, "width", 1900);
	this.prevention_frame_on.setAttributeNS(null, "height", 370);//530
	this.prevention_frame_on.setAttributeNS(null, "rx", 50);
	this.prevention_frame_on.setAttributeNS(null, "ry", 30);
	this.prevention_frame_on.setAttributeNS(null, "fill", "none");
	this.prevention_frame_on.setAttributeNS(null, "pointer-events", "visible");
	this.prevention_frame_on.setAttributeNS(null, "stroke", "#ff0");
	this.prevention_frame_on.setAttributeNS(null, "stroke-width", 10);
	this.prevention_title_on = document.createElementNS(this.svgns, "title");
	this.prevention_title_on.textContent = "Использовать карту профилактики, для отмены возгорания.";
	this.prevention_on.appendChild(this.prevention_title_on);
	this.animate_frame_on = document.createElementNS(this.svgns, "animate");
	this.animate_frame_on.setAttributeNS(null, "attributeName", "stroke");
	this.animate_frame_on.setAttributeNS(null, "values", "#000;#0f0;#000;");
	this.animate_frame_on.setAttributeNS(null, "dur", "2s");
	this.animate_frame_on.setAttributeNS(null, "repeatCount", "indefinite");
	this.text_prevention_on = document.createElementNS(this.svgns, "text");
	this.text_prevention_on.setAttributeNS(null,'x', 1620);
	this.text_prevention_on.setAttributeNS(null,'y', 2280);
	this.text_prevention_on.setAttributeNS(null, "text-anchor", "middle");
	this.text_prevention_on.setAttributeNS(null, "dy", ".3em");
	this.text_prevention_on.setAttributeNS(null,'font-size', 60);
	this.text_prevention_on.setAttributeNS(null,'fill', "#000");
	this.text_prevention_on.setAttributeNS(null, "pointer-events", "none");
	this.text_prevention_on.textContent = "вы можете отменить возгорание";
	this.animate_text_on = document.createElementNS(this.svgns, "animate");
	this.animate_text_on.setAttributeNS(null, "attributeName", "fill");
	this.animate_text_on.setAttributeNS(null, "values", "#000;#0f0;#000;");
	this.animate_text_on.setAttributeNS(null, "dur", "2s");
	this.animate_text_on.setAttributeNS(null, "repeatCount", "indefinite");
	this.text_prevention_on.appendChild(this.animate_text_on);
	this.prevention_on.appendChild(this.text_prevention_on);
	this.prevention_frame_on.appendChild(this.animate_frame_on);
	this.prevention_on.appendChild(this.prevention_frame_on);
	/// Функция события.
	this.f_event = function(){
		this.active_card = this.events[this.i_day];
		this.active_card.f_action();
		this.cards_menu.setAttributeNS(null, "href", "file/e"+this.events[this.i_day].id+".jpg");
		if(!this.g_map.contains(this.cards_menu))this.g_map.appendChild(this.cards_menu);
		this.weather_or_action = true;
		if(this.active_card.id != 1 && this.active_card.id != 9){//меню отмены возгорания, профилактикой.
			let i = 0;
			let j = 0;
			while(i < this.actions.length){
				if(this.actions[i].active == 1){
					if(typeof this.actions[i].cancel === 'undefined' || this.actions[i].cancel.indexOf(this.active_card.id) != -1){
						this.actions[i].img.setAttributeNS(null, "x", 715 + j * 260);
						if(!this.prevention_on.contains(this.actions[i].img))this.prevention_on.appendChild(this.actions[i].img);
						j++;
					}
				}
				i++;
			}
			if(j){
				this.g_map.appendChild(this.prevention_on);
			}
		}
	}
	/// Функция погоды.
	this.f_weather = function(){
		this.active_card = this.weathers[this.i_day];
		this.active_card.f_action();
		this.cards_menu.setAttributeNS(null, "href", "file/w"+this.weathers[this.i_day].id+".jpg");
		if(!this.g_map.contains(this.cards_menu))this.g_map.appendChild(this.cards_menu);
		this.weather_or_action = false;
	}
	/// Функция действия. #######
	// Кнопка вызвать пожарных.
	this.firefighters = document.createElementNS(this.svgns, "rect");
	this.firefighters.setAttributeNS(null, "x", 20);
	this.firefighters.setAttributeNS(null, "y", 1700);
	this.firefighters.setAttributeNS(null, "width", 620);
	this.firefighters.setAttributeNS(null, "height", 530);
	this.firefighters.setAttributeNS(null, "rx", 50);
	this.firefighters.setAttributeNS(null, "ry", 30);
	this.firefighters.setAttributeNS(null, "fill", "none");
	this.firefighters.setAttributeNS(null, "pointer-events", "visible");
	this.firefighters.setAttributeNS(null, "stroke", "#00f");
	this.firefighters.setAttributeNS(null, "stroke-width", 10);
	this.firefighters_title = document.createElementNS(this.svgns, "title");
	this.firefighters_title.textContent = "Вызвать пожарных(трава -2, тростник -1, торф -1)";
	this.firefighters.appendChild(this.firefighters_title);
	this.animate_firefighters = document.createElementNS(this.svgns, "animate");
	this.animate_firefighters.setAttributeNS(null, "attributeName", "stroke");
	this.animate_firefighters.setAttributeNS(null, "values", "#000;#08f;#000;");
	this.animate_firefighters.setAttributeNS(null, "dur", "2s");
	this.animate_firefighters.setAttributeNS(null, "repeatCount", "indefinite");
	this.firefighters.appendChild(this.animate_firefighters);
	this.firefighters_flag = false;
	this.firefighters.onclick = function(){
		if(this.forest_guard_flag){
			this.forest_guard_flag = false;
			this.fields.forEach(function(field){if(field.count_fire)field.off_active()});
			if(this.fiag_prevention)this.g_map.appendChild(this.prevention);
		}
		if(this.firefighters_flag){
			this.firefighters_flag = false;
			this.fields.forEach(function(field){if(field.count_fire)field.off_active()});
			if(this.fiag_prevention)this.g_map.appendChild(this.prevention);
		}else{
			let i = this.fields.length;
			while(i--){
				if(this.fields[i].count_fire && (this.fields[i].type == "трава" || this.fields[i].type == "торф" || this.fields[i].type == "тростник")){
					this.fields[i].on_active("#00f");
					this.firefighters_flag = true;
				}
			}
			if(this.firefighters_flag && this.g_map.contains(this.prevention))this.g_map.removeChild(this.prevention);
		}
	}.bind(this);
	// Кнопка выхвать лесную охрану.
	this.forest_guard = document.createElementNS(this.svgns, "rect");
	this.forest_guard.setAttributeNS(null, "x", 2600);
	this.forest_guard.setAttributeNS(null, "y", 1700);
	this.forest_guard.setAttributeNS(null, "width", 620);
	this.forest_guard.setAttributeNS(null, "height", 530);
	this.forest_guard.setAttributeNS(null, "rx", 50);
	this.forest_guard.setAttributeNS(null, "ry", 30);
	this.forest_guard.setAttributeNS(null, "fill", "none");
	this.forest_guard.setAttributeNS(null, "pointer-events", "visible");
	this.forest_guard.setAttributeNS(null, "stroke", "#ff0");
	this.forest_guard.setAttributeNS(null, "stroke-width", 10);
	this.forest_guard_title = document.createElementNS(this.svgns, "title");
	this.forest_guard_title.textContent = "Вызвать лесную охрану(лиственный лес -2, хвойный лес -1, торф -1)";
	this.forest_guard.appendChild(this.forest_guard_title);
	this.animate_forest_guard = document.createElementNS(this.svgns, "animate");
	this.animate_forest_guard.setAttributeNS(null, "attributeName", "stroke");
	this.animate_forest_guard.setAttributeNS(null, "values", "#000;#fa0;#000;");
	this.animate_forest_guard.setAttributeNS(null, "dur", "2s");
	this.animate_forest_guard.setAttributeNS(null, "repeatCount", "indefinite");
	this.forest_guard.appendChild(this.animate_forest_guard);
	this.forest_guard_flag = false;
	this.forest_guard.onclick = function(){
		if(this.firefighters_flag){
			this.firefighters_flag = false;
			this.fields.forEach(function(field){if(field.count_fire)field.off_active()});
			if(this.fiag_prevention)this.g_map.appendChild(this.prevention);
		}
		if(this.forest_guard_flag){
			this.forest_guard_flag = false;
			this.fields.forEach(function(field){if(field.count_fire)field.off_active()});
			if(this.fiag_prevention)this.g_map.appendChild(this.prevention);
		}else{
			let i = this.fields.length;
			while(i--){
				if(this.fields[i].count_fire && (this.fields[i].type == "лиственный" || this.fields[i].type == "хвойный" || this.fields[i].type == "торф")){
					this.fields[i].on_active("#00f");
					this.forest_guard_flag = true;
				}
			}
			if(this.forest_guard_flag && this.g_map.contains(this.prevention))this.g_map.removeChild(this.prevention);
		}
	}.bind(this);
	// Кнопка профилактики.
	this.prevention = document.createElementNS(this.svgns, "g");
	this.prevention_frame = document.createElementNS(this.svgns, "rect");
	this.prevention_frame.setAttributeNS(null, "x", 670);
	this.prevention_frame.setAttributeNS(null, "y", 1860);
	this.prevention_frame.setAttributeNS(null, "width", 1900);
	this.prevention_frame.setAttributeNS(null, "height", 370);//530
	this.prevention_frame.setAttributeNS(null, "rx", 50);
	this.prevention_frame.setAttributeNS(null, "ry", 30);
	this.prevention_frame.setAttributeNS(null, "fill", "none");
	this.prevention_frame.setAttributeNS(null, "pointer-events", "visible");
	this.prevention_frame.setAttributeNS(null, "stroke", "#ff0");
	this.prevention_frame.setAttributeNS(null, "stroke-width", 10);
	this.prevention_title = document.createElementNS(this.svgns, "title");
	this.prevention_title.textContent = "Принять профилактические меры.";
	this.prevention_frame.appendChild(this.prevention_title);
	this.animate_frame = document.createElementNS(this.svgns, "animate");
	this.animate_frame.setAttributeNS(null, "attributeName", "stroke");
	this.animate_frame.setAttributeNS(null, "values", "#000;#0f0;#000;");
	this.animate_frame.setAttributeNS(null, "dur", "2s");
	this.animate_frame.setAttributeNS(null, "repeatCount", "indefinite");
	this.prevention_frame.appendChild(this.animate_frame);
	this.prevention.appendChild(this.prevention_frame);
	this.magnify_img = document.createElementNS(gwf.svgns, "image");
	///######### TEST для Edge #########
	this.magnify_img.setAttributeNS(null, "width", 1165);
	this.magnify_img.setAttributeNS(null, "height", 1683);
	this.magnify_img.setAttributeNS(null, "pointer-events", "none");
	///#################################
	this.g_map.appendChild(this.magnify_img);
	let i = this.actions.length;
	while(i--){
		this.actions[i].img = document.createElementNS(this.svgns, "image");//‭ отношение h/w 1,444635193133047‬
		this.actions[i].img.setAttributeNS(null, "href", "file/a"+i+".jpg");
		this.actions[i].img.setAttributeNS(null, "id", "a"+i);
		this.actions[i].img.setAttributeNS(null, "y", 1865);
		this.actions[i].img.setAttributeNS(null, "width", 249);// h = 369,82660944206‬
		///######### TEST для Edge #########
		this.actions[i].img.setAttributeNS(null, "height", 370);
		///#################################
		this.prevention.appendChild(this.actions[i].img);
		this.actions[i].img.onmouseover = function(){
			gwf.magnify_img.setAttributeNS(null, "href", this.getAttribute("href"));
			gwf.magnify_img.style.display = 'block';
		}
		this.actions[i].img.onmouseout = function(){
			gwf.magnify_img.setAttributeNS(null, "href", "");
			gwf.magnify_img.style.display = 'none';
		}
		let j = i;
		this.actions[i].img.onclick = function(){
			if(this.actions[j].active == 2){
				this.actions[j].active = 1;
				if(this.prevention.contains(this.actions[j].img))this.prevention.removeChild(this.actions[j].img);
				this.f_new_run();
			}else{
				this.actions[j].active = 0;
				if(this.prevention_on.contains(this.actions[j].img))this.prevention_on.removeChild(this.actions[j].img);
				if(this.g_map.contains(this.cards_menu))this.g_map.removeChild(this.cards_menu);
				this.active_card.f_action_off();
				if(this.g_map.contains(this.prevention_on))this.g_map.removeChild(this.prevention_on);
				if(this.prevention_on.contains(this.actions[3].img))this.prevention_on.removeChild(this.actions[3].img);
				if(this.prevention_on.contains(this.actions[5].img))this.prevention_on.removeChild(this.actions[5].img);
				this.button_run_off = false;
				this.backing_run.appendChild(this.animate_run);
				this.text_run.setAttributeNS(null, "fill", this.stroke_color_2);
				this.backing_run.setAttributeNS(null, "stroke", this.stroke_color_2);
				this.show_underline.setAttributeNS(null, "y", 300);
				if(this.g_map.contains(this.prevention_on))this.g_map.removeChild(this.prevention_on);
				if(this.prevention_on.contains(this.actions[3].img))this.prevention_on.removeChild(this.actions[3].img);
				if(this.prevention_on.contains(this.actions[5].img))this.prevention_on.removeChild(this.actions[5].img);
			}
			this.magnify_img.setAttributeNS(null, "href", "");
			gwf.magnify_img.setAttributeNS(null, "href", "");
			gwf.magnify_img.style.display = 'none';
		}.bind(this);
	}
	// функция.
	this.off_phone = false;
	this.fiag_prevention = true;
	this.f_action = function(){
		if(this.fiag_prevention){
			let i = 0;
			let j = 0;
			while(i < this.actions.length){
				if(this.actions[i].active == 2){
					this.actions[i].img.setAttributeNS(null, "x", 715 + j * 260);
					j++;
				}
				i++;
			}
			if(j){
				this.g_map.appendChild(this.prevention);
			}else{
				this.fiag_prevention = false;
			}
		}
		if(this.fields.some(function(field){return field.count_fire > 0 && field.type != "охраняемый";}) && !this.off_phone){
			this.g_map.appendChild(this.forest_guard);
			this.g_map.appendChild(this.firefighters);
		}else{
			this.off_phone = false;
			if(!this.fiag_prevention)this.f_new_run();
		}
	}
	/// #########################
	/// Создаем финальное меню.
	this.end_menu = document.createElementNS(this.svgns, "g");
	this.background_end_menu = document.createElementNS(this.svgns, "rect");
	this.background_end_menu.setAttributeNS(null, "width", this.img_map_w);
	this.background_end_menu.setAttributeNS(null, "height", this.img_map_h);
	this.background_end_menu.setAttributeNS(null, "fill-opacity", .7);
	this.end_menu.appendChild(this.background_end_menu);
	this.text_menu_title = document.createElementNS(this.svgns, "text");
	this.text_menu_title.setAttributeNS(null,'x', this.img_map_w / 2);
	this.text_menu_title.setAttributeNS(null,'y', 100);
	this.text_menu_title.setAttributeNS(null, "text-anchor", "middle");
	this.text_menu_title.setAttributeNS(null, "dy", ".3em");
	this.text_menu_title.setAttributeNS(null,'font-size', 150);
	this.text_menu_title.setAttributeNS(null,'fill', "#ff0");
	this.text_menu_title.setAttributeNS(null, "pointer-events", "none");
	this.text_menu_title.textContent = "итоги";
	this.end_menu.appendChild(this.text_menu_title);
	this.texts_end_menu = [
		{text:'село Солнечное',color_out:"#fff"},
		{text:'заповедник "Олений"',color_out:"#fff"},
		{text:'всего загорелось пожаров',color_out:"#ff0"},
		{text:'потушено пожаров',color_out:"#08f"},
		{text:'горит пожаров',color_out:"#f00"},
		{text:'территорий не пострадало от пожаров',color_out:"#0f0"},
		{text:'территорий потушено',color_out:"#08f"},
		{text:'территорий горит',color_out:"#f00"},
		{text:'профилактик проведено',color_out:"#ff0"},
		{text:'возгораний предотвращено',color_out:"#0f0"}];
	i = this.texts_end_menu.length;
	while(i--){
		this.texts_end_menu[i].img = document.createElementNS(this.svgns, "text");
		this.texts_end_menu[i].img.setAttributeNS(null,'x', this.img_map_w / 2);
		this.texts_end_menu[i].img.setAttributeNS(null,'y', i * 120 + 300);
		this.texts_end_menu[i].img.setAttributeNS(null, "text-anchor", "end");
		this.texts_end_menu[i].img.setAttributeNS(null, "dy", ".3em");
		this.texts_end_menu[i].img.setAttributeNS(null,'font-size', 80);
		this.texts_end_menu[i].img.setAttributeNS(null,'fill', "#fff");
		this.texts_end_menu[i].img.setAttributeNS(null, "pointer-events", "none");
		this.texts_end_menu[i].img.textContent = this.texts_end_menu[i].text+" :";
		this.end_menu.appendChild(this.texts_end_menu[i].img);
		this.texts_end_menu[i].out = document.createElementNS(this.svgns, "text");
		this.texts_end_menu[i].out.setAttributeNS(null,'x', this.img_map_w / 2);
		this.texts_end_menu[i].out.setAttributeNS(null,'y', i * 120 + 300);
		this.texts_end_menu[i].out.setAttributeNS(null, "text-anchor", "start");
		this.texts_end_menu[i].out.setAttributeNS(null, "dy", ".3em");
		this.texts_end_menu[i].out.setAttributeNS(null,'font-size', 80);
		this.texts_end_menu[i].out.setAttributeNS(null,'fill', this.texts_end_menu[i].color_out);
		this.texts_end_menu[i].out.setAttributeNS(null, "pointer-events", "none");
		this.end_menu.appendChild(this.texts_end_menu[i].out);
	}
	this.button_new_game = document.createElementNS(this.svgns, "g");
	this.background_bng = document.createElementNS(this.svgns, "rect");
	this.background_bng.setAttributeNS(null, "x", this.img_map_w / 2 - 250);
	this.background_bng.setAttributeNS(null, "y", 1500);
	this.background_bng.setAttributeNS(null, "width", 500);
	this.background_bng.setAttributeNS(null, "height", 150);
	this.background_bng.setAttributeNS(null, "fill", "#000");
	this.background_bng.setAttributeNS(null, "stroke", "#fff");
	this.background_bng.setAttributeNS(null, "stroke-width", 5);
	this.button_new_game.appendChild(this.background_bng);
	this.text_bng = document.createElementNS(this.svgns, "text");
	this.text_bng.setAttributeNS(null,'x', this.img_map_w / 2);
	this.text_bng.setAttributeNS(null,'y', 1565);
	this.text_bng.setAttributeNS(null, "text-anchor", "middle");
	this.text_bng.setAttributeNS(null, "dy", ".3em");
	this.text_bng.setAttributeNS(null,'font-size', 80);
	this.text_bng.setAttributeNS(null,'fill', "#fff");
	this.text_bng.setAttributeNS(null, "pointer-events", "none");
	this.text_bng.textContent = "новая игра";
	this.button_new_game.appendChild(this.text_bng);
	this.end_menu.appendChild(this.button_new_game);
	this.button_new_game.onmouseover = function(){
		this.text_bng.setAttributeNS(null, "fill", "#ff0");
		this.background_bng.setAttributeNS(null, "stroke", "#ff0");
	}.bind(this);
	this.button_new_game.onmouseout = function(){
		this.text_bng.setAttributeNS(null, "fill", "#fff");
		this.background_bng.setAttributeNS(null, "stroke", "#fff");
	}.bind(this);
	this.button_new_game.onclick = function(){
		this.text_bng.setAttributeNS(null, "fill", "#fff");
		this.background_bng.setAttributeNS(null, "stroke", "#fff");
		this.f_new_game();
	}.bind(this);
	this.button_re_start_game = document.createElementNS(this.svgns, "g");
	this.background_brsg = document.createElementNS(this.svgns, "rect");
	this.background_brsg.setAttributeNS(null, "x", this.img_map_w / 2 - 250);
	this.background_brsg.setAttributeNS(null, "y", 1710);
	this.background_brsg.setAttributeNS(null, "width", 500);
	this.background_brsg.setAttributeNS(null, "height", 150);
	this.background_brsg.setAttributeNS(null, "fill", "#000");
	this.background_brsg.setAttributeNS(null, "stroke", "#fff");
	this.background_brsg.setAttributeNS(null, "stroke-width", 5);
	this.button_re_start_game.appendChild(this.background_brsg);
	this.text_brsg = document.createElementNS(this.svgns, "text");
	this.text_brsg.setAttributeNS(null,'x', this.img_map_w / 2);
	this.text_brsg.setAttributeNS(null,'y', 1775);
	this.text_brsg.setAttributeNS(null, "text-anchor", "middle");
	this.text_brsg.setAttributeNS(null, "dy", ".3em");
	this.text_brsg.setAttributeNS(null,'font-size', 80);
	this.text_brsg.setAttributeNS(null,'fill', "#fff");
	this.text_brsg.setAttributeNS(null, "pointer-events", "none");
	this.text_brsg.textContent = "переиграть";
	this.button_re_start_game.appendChild(this.text_brsg);
	this.text_brsg_title = document.createElementNS(this.svgns, "title");
	this.text_brsg_title.textContent = "Играть с той же последовательностью карт.";
	this.button_re_start_game.appendChild(this.text_brsg_title);
	this.end_menu.appendChild(this.button_re_start_game);
	this.button_re_start_game.onmouseover = function(){
		this.text_brsg.setAttributeNS(null, "fill", "#ff0");
		this.background_brsg.setAttributeNS(null, "stroke", "#ff0");
	}.bind(this);
	this.button_re_start_game.onmouseout = function(){
		this.text_brsg.setAttributeNS(null, "fill", "#fff");
		this.background_brsg.setAttributeNS(null, "stroke", "#fff");
	}.bind(this);
	this.button_re_start_game.onclick = function(){
		this.text_brsg.setAttributeNS(null, "fill", "#fff");
		this.background_brsg.setAttributeNS(null, "stroke", "#fff");
		this.f_new_game(true);
	}.bind(this);
	/// Масштабирование передвижение карты.
	this.svg.oncontextmenu = function(){return false;}//Браузер не реагирует стандартно на правый клик мышке в игре.
	this.flag_move_map = false;
	this.distance_to_x = 0;
	this.distance_to_y = 0;
	this.mouse_to_x;
	this.mouse_to_y;
	//####### для совместимости с IE(ослом) #######
	let ie_scrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
	let ie_scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	// переписаны
	//this.x_offset_wheel = this.g_map.getBoundingClientRect().left + window.scrollX;
	//this.y_offset_wheel = this.g_map.getBoundingClientRect().top + window.scrollY;
	//#############################################
	this.x_offset_wheel = this.g_map.getBoundingClientRect().left + ie_scrollX;
	this.y_offset_wheel = this.g_map.getBoundingClientRect().top + ie_scrollY;
	// Начальный масштаб в соответствии с окном игры, и по центру.
	if(this.svg_width / this.img_map_w < this.svg_height / this.img_map_h){
		this.scale = this.svg_width / this.img_map_w;
		this.offset_to_x = 0;
		this.offset_to_y = (this.svg_height - (this.img_map_h * this.scale)) / 2;
	}else{
		this.scale = this.svg_height / this.img_map_h;
		this.offset_to_x = (this.svg_width - (this.img_map_w * this.scale)) / 2;
		this.offset_to_y = 0;
	}
	this.g_map.setAttribute("transform", "matrix("+this.scale+" 0 0 "+this.scale+" "+this.offset_to_x+" "+this.offset_to_y+")");
	this.g_map.onmousedown = function(event){
		if(event.which == 1){
			this.flag_move_map = true;
			this.mouse_to_x = event.clientX;
			this.mouse_to_y = event.clientY;
		}
		return false;
	}.bind(this);
	this.g_map.onmouseup = function(event){
		if(event.which == 1){
			this.flag_move_map = false;
			this.offset_to_x = this.distance_to_x;
			this.offset_to_y = this.distance_to_y;
		}	
	}.bind(this);
	this.g_map.onmouseout = function(event){
		this.flag_move_map = false;// при движении карты и ухода мыши за пределы окна, Пока закомментированно, так как срабатывает на любой элемент на карте.
	}.bind(this);
	this.g_map.onmousemove = function(event){
		if(this.flag_move_map){
			let x = this.offset_to_x + (event.clientX - this.mouse_to_x);
			let y = this.offset_to_y + (event.clientY - this.mouse_to_y);
			this.g_map.setAttribute("transform", "translate("+x+ "," +y+ ") scale("+this.scale+")");
			this.distance_to_x = x;
			this.distance_to_y = y;
		}	
	}.bind(this);
	this.g_map.addEventListener("wheel", function(event){//Событие прокрутки колесика мышки, на игровой карте при котором приближаем или удаляем игровую карту относительно позиции курсора мыши.
			///Устанавливаем размер дельты 3 как в браузере Mozilla Firefox.
			let deltaY = 3 * Math.sign(event.deltaY);//Для совместимости браузеров, от дельты берем только знак. Так как в разных браузерах разное значение дельты.
			//Положение курсора относительно основного окна.
			//####### для совместимости с IE(ослом) #######
			let ie_scrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
			let ie_scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
			// переписаны
			//let offsetX = event.clientX - this.x_offset_wheel + window.scrollX;
			//let offsetY = event.clientY - this.y_offset_wheel + window.scrollY;
			//#############################################
			let offsetX = event.clientX - this.x_offset_wheel + ie_scrollX;
			let offsetY = event.clientY - this.y_offset_wheel + ie_scrollY;
			//alert("offsetX = "+offsetX);
			//alert("window.scrollX = "+ window.scrollX);
			//Расстояние между картой и курсором.
			let distance_x = offsetX - this.offset_to_x;
			let distance_y = offsetY - this.offset_to_y;
			//Расстояние между картой и курсором, в изначальном масштабе 1 к 1.
			let primary_distance_x = distance_x / this.scale;
			let primary_distance_y = distance_y / this.scale;
			//Устанавливаем новый коэффициент масштаба.
			this.scale += deltaY / 100 * this.scale;//Старый масштаб плюс количество прокрутки колесика мыши. Делим на 100 чтоб плавно масштабировалось. И умножаем на текущий масштаб чтоб равномерно увеличиволось и уменьшалось. Так как, например, при сильно увеличенном масштабе, ещё увеличение на тоже значение мало заметно.
			if(this.scale > 2)this.scale = 2;//Устанавливаем максимальный коэффициент масштаба.
			if(this.scale < 0.3)this.scale = 0.3;//Устанавливаем минимальный коэффициент масштаба.
			//Расстояние между картой и курсором, в новом масштабе.
			let new_distance_x = primary_distance_x * this.scale;
			let new_distance_y = primary_distance_y * this.scale;
			//Расстояние на которое следует сместить игровую карту относительно текущей позиции.
			let shift_map_x = new_distance_x - distance_x;
			let shift_map_y = new_distance_y - distance_y;
			//Новые координаты карты, после масштабирования.
			this.offset_to_x -= shift_map_x;
			this.offset_to_y -= shift_map_y;
			//Масштабируем на коэффициент масштаба и одновременно смещаем на новые координаты игровую карту, в матрице трансформации.
			this.g_map.setAttribute("transform", "matrix("+this.scale+" 0 0 "+this.scale+" "+this.offset_to_x+" "+this.offset_to_y+")");
			//Делаем так чтоб браузер не реагировал стандартно на прокрутку колесика мыши пытаясь сместить страницу.
			event.preventDefault();
			return false;
		}.bind(this));
	/// Кнопка свернуть/развернуть на весь экран.
	this.stroke_color = "#888";
	this.focus_color = "#aaa";
	this.button_full_screen = document.createElementNS(this.svgns, "g");//Контейнер для конпки развернуть/свернуть на весь экран. Сокращенно b_f_s.
	this.title_b_f_s = document.createElementNS(this.svgns, "title");
	this.title_b_f_s.textContent = "Во весь экран";
	this.button_full_screen.appendChild(this.title_b_f_s);
	this.size_b_f_s = 30;//Общий размер кнопки. по высоте и ширене.
	this.margin_b_f_s = 5;//Отступ кнопки от нижнего правого угла окна игры, по оси "x" и по оси "y"
	this.backing_b_f_s = document.createElementNS(this.svgns, "rect");
	this.backing_b_f_s.setAttributeNS(null, "width", this.size_b_f_s);
	this.backing_b_f_s.setAttributeNS(null, "height", this.size_b_f_s);
	this.backing_b_f_s.setAttributeNS(null, "fill", "none");
	this.backing_b_f_s.setAttributeNS(null, "pointer-events", "visible");
	this.backing_b_f_s.setAttributeNS(null, "stroke", this.stroke_color);
	this.backing_b_f_s.setAttributeNS(null, "stroke-width", 1);
	this.button_full_screen.appendChild(this.backing_b_f_s);
	this.padding_b_f_s = 5;//Отступ рисунка кнопки от внутреннего края кнопки.
	this.picture_size_el = (this.size_b_f_s - (this.padding_b_f_s*2))/3;//Длина одного элемента ресунка кнопки, равно ширина кнопки минус внутринние отступы с каждой стороны, и деленое на три.
	this.picture_on_full = "M"+this.padding_b_f_s+" "+(this.padding_b_f_s+this.picture_size_el)+" h"+this.picture_size_el+" v-"+this.picture_size_el+" m"+this.picture_size_el+" 0 v"+this.picture_size_el+" h"+this.picture_size_el+" m 0 "+this.picture_size_el+" h-"+this.picture_size_el+" v"+this.picture_size_el+" m -"+this.picture_size_el+" 0 v-"+this.picture_size_el+" h-"+this.picture_size_el;//Рисунок кнопки когда окно игры развернуто на весь экран. Стрелками во внутрь.
	this.picture_off_full = "M"+this.padding_b_f_s+" "+(this.padding_b_f_s+this.picture_size_el)+" v-"+this.picture_size_el+" h"+this.picture_size_el+" m"+this.picture_size_el+" 0 h"+this.picture_size_el+" v"+this.picture_size_el+" m 0 "+this.picture_size_el+" v"+this.picture_size_el+" h-"+this.picture_size_el+" m -"+this.picture_size_el+" 0 h-"+this.picture_size_el+" v-"+this.picture_size_el;//Рисунок кнопки когда окно игры свернуто(не на весь экран). Стрелками от центра.
	this.picture_b_f_s = document.createElementNS(this.svgns, "path");
	this.picture_b_f_s.setAttributeNS(null, "d", this.picture_off_full);
	this.picture_b_f_s.setAttributeNS(null, "fill", "none");
	this.picture_b_f_s.setAttributeNS(null, "stroke", this.stroke_color);
	this.picture_b_f_s.setAttributeNS(null, "stroke-width", 1);
	this.button_full_screen.appendChild(this.picture_b_f_s);
	this.button_full_screen.setAttribute("transform", "translate("+(this.svg_width - this.size_b_f_s - this.margin_b_f_s)+ "," +(this.svg_height - this.size_b_f_s - this.margin_b_f_s)+ ")");//Смещаем кнопку к нижнему правому углу интерфейса, где обычно и располагаются такие кнопки, что будет интуитивно понятно.
	this.button_full_screen.onmouseover = function(){
		this.picture_b_f_s.setAttributeNS(null, "fill", this.focus_color);
		this.backing_b_f_s.setAttributeNS(null, "stroke", this.focus_color);
	}.bind(this);
	this.button_full_screen.onmouseout = function(){
		this.picture_b_f_s.setAttributeNS(null, "fill", "none");
		this.backing_b_f_s.setAttributeNS(null, "stroke", this.stroke_color);
	}.bind(this);
	this.button_full_screen.onclick = function(){
		//alert(document.webkitFullscreenElement);
		if(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || document.mozFullscreenElement){//window.fullScreen){//Если во весь экран.
			gwf.closeFullscreen();//document.exitFullscreen();//mozCancelFullScreen();//Свертывает игру к прежнему состояни.
		}else{
			//gwf.svg.requestFullscreen();//mozRequestFullScreen();//Развертывает на весь экран.
			gwf.openFullscreen();
		}
	}
	this.svg.appendChild(this.button_full_screen);
}
/// Вспомогательные функции.
/* Function to open fullscreen mode //Запустить отображение в полноэкранном режиме*/
gwf.openFullscreen = function(){
	if(gwf.svg.requestFullscreen){
		gwf.svg.requestFullscreen();
	}else if(gwf.svg.mozRequestFullScreen){ /* Firefox */
		gwf.svg.mozRequestFullScreen();
	}else if(gwf.svg.webkitRequestFullscreen){ /* Chrome, Safari & Opera */
		gwf.svg.webkitRequestFullscreen();
	}else if(gwf.svg.msRequestFullscreen){ /* IE/Edge */
		gwf.svg.msRequestFullscreen();
	}
}
 /* Close fullscreen // Выход из полноэкранного режима*/
gwf.closeFullscreen = function(){
	if(document.exitFullscreen){
		document.exitFullscreen();
	}else if(document.mozCancelFullScreen){ /* Firefox */
		document.mozCancelFullScreen();
	}else if(document.webkitExitFullscreen){ /* Chrome, Safari and Opera */
		document.webkitExitFullscreen();
	}else if(document.msExitFullscreen){ /* IE/Edge */
		document.msExitFullscreen();
	}
} 
gwf.shuffle_cards = function(){// Тасовка карт.
	gwf.events = gwf.shuffle(gwf.events);
	gwf.weathers = gwf.shuffle(gwf.weathers);
}
gwf.shuffle = function(arr){// Функция перемешивает массив.
	let j, temp;
	for(let i = arr.length - 1; i > 0; i--){
		j = Math.floor(Math.random()*(i + 1));
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
	}
	return arr;
}
/// Событие свернуть/развернуть на весь экран. ##########
gwf.f_fullscreenchange = function(event){//Событие срабатывает при развертывании и свертывании игры на весь экран.
	//####### для совместимости с IE(ослом) #######
	let ie_scrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
	let ie_scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	// переписаны
	//gwf.x_offset_wheel = gwf.svg.getBoundingClientRect().left + window.scrollX;//Настраиваем позиционирование изображения курсора.
	//gwf.y_offset_wheel = gwf.svg.getBoundingClientRect().top + window.scrollY;//Настраиваем позиционирование изображения курсора.
	//#############################################
	gwf.x_offset_wheel = gwf.svg.getBoundingClientRect().left + ie_scrollX;//Настраиваем позиционирование изображения курсора.
	gwf.y_offset_wheel = gwf.svg.getBoundingClientRect().top + ie_scrollY;//Настраиваем позиционирование изображения курсора.
	if(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || document.mozFullscreenElement){//window.fullScreen){//При развертывании игры на весь экран.
		gwf.picture_b_f_s.setAttributeNS(null, "d", gwf.picture_on_full);//перерисовываем изображение кнопки свернуть/развернуть на весь экран стрелками к центру кнопки.
		gwf.title_b_f_s.textContent = "Выход из полноэкранного режима";//Меняем всплывающий текст на кнопке свернуть/развернуть на весь экран.
	}else{
		gwf.picture_b_f_s.setAttributeNS(null, "d", gwf.picture_off_full);//перерисовываем изображение кнопки свернуть/развернуть на весь экран стрелками от центра кнопки.
		gwf.title_b_f_s.textContent = "Во весь экран";//Меняем всплывающий текст на кнопке свернуть/развернуть на весь экран.
	}
	let svg_w = gwf.svg.getBoundingClientRect().width;
	let svg_h = gwf.svg.getBoundingClientRect().height;
	gwf.button_full_screen.setAttribute("transform", "translate("+(svg_w - gwf.size_b_f_s - gwf.margin_b_f_s)+ "," +(svg_h - gwf.size_b_f_s - gwf.margin_b_f_s)+ ")");//Смещаем кнопку к нижнему правому углу интерфейса, где обычно и располагаются такие кнопки, что будет интуитивно понятно.
	// После смены экрана, настраиваем карту по центру, в масштабе в соответствии с экраном.
	if(svg_w / gwf.img_map_w < svg_h / gwf.img_map_h){
		gwf.scale = svg_w / gwf.img_map_w;
		gwf.offset_to_x = 0;
		gwf.offset_to_y = (svg_h - (gwf.img_map_h * gwf.scale)) / 2;
	}else{
		gwf.scale = svg_h / gwf.img_map_h;
		gwf.offset_to_x = (svg_w - (gwf.img_map_w * gwf.scale)) / 2;
		gwf.offset_to_y = 0;
	}
	gwf.g_map.setAttribute("transform", "matrix("+gwf.scale+" 0 0 "+gwf.scale+" "+gwf.offset_to_x+" "+gwf.offset_to_y+")");
	gwf.distance_to_x = gwf.offset_to_x;
	gwf.distance_to_y = gwf.offset_to_y;
}
document.addEventListener("webkitfullscreenchange", gwf.f_fullscreenchange);
document.addEventListener("mozfullscreenchange", gwf.f_fullscreenchange);
document.addEventListener("fullscreenchange", gwf.f_fullscreenchange);
document.addEventListener("MSFullscreenChange", gwf.f_fullscreenchange);
///######################################################
// Для совместимости с IE(Ослом, казлом, чертом)
if(!("contains" in SVGElement.prototype)){
	SVGElement.prototype.contains = function(child_node){
		if(child_node.parentNode === null)return false;
		if(child_node.parentNode === this)return true;
		return false;
	}
}
if(!("sign" in Math)){
	Math.sign = function(n_deltaY){
		if(n_deltaY > 0)return 1;
		if(n_deltaY < 0)return -1;
		return 0;
	}
}


























