var svgns = "http://www.w3.org/2000/svg";//Пространство имен SVG.
//function svg_create(name){return document.createElementNS(svgns, name);};
var svg;//Само окно игры которое в себя включает все остальные svg.
//Все уровни идут в таком же порядке как они расположены ниже, от нижнего к верхнему.
var svg_defs;//Уровень для всяких невидимых графических объектов.
var svg_world;//Подвижный и масштабируемый уровень, основного поля игры.
	var svg_roads;
	var svg_sectors;
	var svg_city;
var svg_interf;//Уровень пользовательского интерфейса в игре.
var svg_city_menu;//Уровень окон городов.
var svg_house;//Уровень окон построек.
var svg_ger;//Уровень окно героев.
var svg_unit;//Уровень окно юнитов.
var svg_item;//Уровень окно предметов.
var svg_battle;//Уровень битв.
var svg_dip;//Уровень окон дипломатии.
var svg_stat;//Уровень окон статистики.
var svg_window;//Уровень всплывающих окон.
var svg_dialog;//Уровень диалогов.
var svg_menu;//Уровень меню в игре.
var svg_main_menu;//Уровень стартового меню.
var svg_result;//Уровень отображения итогов игры.
var svg_cursor;//Уровень курсорв мыши, должен идти последним.
window.onload = function(){//Когда все загружено.
	//Формируем уровни.
	svg = document.getElementById('grafika');//определяем окно игры, должно быть в html игры.
	svg_defs = document.createElementNS(svgns, "defs");//Уровень для скрытых графических объектов.
	svg.appendChild(svg_defs);
	svg_world = document.createElementNS(svgns, "g");//Все уровни непосредственно игровой карты мира.
	svg.appendChild(svg_world);
		svg_roads = document.createElementNS(svgns, "g");
		svg_world.appendChild(svg_roads);
		svg_sectors = document.createElementNS(svgns, "g");
		svg_world.appendChild(svg_sectors);
		svg_city = document.createElementNS(svgns, "g");
		svg_world.appendChild(svg_city);
		
	svg_interf = document.createElementNS(svgns, "g");//Пользовательский интерфейс.
	svg.appendChild(svg_interf);
	svg_city_menu = document.createElementNS(svgns, "g");//Уровень окон городов на карте.
	svg.appendChild(svg_city_menu);
	svg_house = document.createElementNS(svgns, "g");//Уровень окон объектов на карте.
	svg.appendChild(svg_house);
	svg_ger = document.createElementNS(svgns, "g");//Уровень окно героев.
	svg.appendChild(svg_ger);
	svg_unit = document.createElementNS(svgns, "g");//Уровень окно юнитов.
	svg.appendChild(svg_unit);
	svg_item = document.createElementNS(svgns, "g");//Уровень окно предметов.
	svg.appendChild(svg_item);
	svg_battle = document.createElementNS(svgns, "g");//Уровень битв.
	svg.appendChild(svg_battle);
	svg_dip = document.createElementNS(svgns, "g");//Уровень окон дипломатии.
	svg.appendChild(svg_dip);
	svg_stat = document.createElementNS(svgns, "g");//Уровень окон статистики.
	svg.appendChild(svg_stat);
	svg_window = document.createElementNS(svgns, "g");//Уровень для всплывающих окон.
	svg.appendChild(svg_window);
	svg_dialog = document.createElementNS(svgns, "g");//Уровень диалогов.
	svg.appendChild(svg_dialog);
	svg_menu = document.createElementNS(svgns, "g");//Уровень меню в игре.
	svg.appendChild(svg_menu);
	svg_main_menu = document.createElementNS(svgns, "g");//Уровень стартового меню.
	svg.appendChild(svg_main_menu);
	svg_result = document.createElementNS(svgns, "g");//Уровень отображения итогов игры.
	svg.appendChild(svg_result);
	svg_cursor = document.createElementNS(svgns, "g");//Уровень курсорв мыши, должен идти последним.
	svg.appendChild(svg_cursor);
	//Настройки.
	//менеджер настроек.
	go_manager_setting = new Manager_setting();//настраивает игру.
	//выводим начальное меню игры.
	//go_main_menu.on();
	f_new_game();
	//*############## Загружено. ##############
	out("Загружено");
	//#########################################*/
}