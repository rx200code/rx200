//содержит графические объекты игры.
/*############## СОКРАЩЕНИЯ ###############
g - game. игра.
############################################*/
var go_graf = null;

function Graf(){
	//рисуем росийский флаг.
	this.flag_ru =  document.createElementNS(svgns, "svg");
	this.flag_ru.setAttributeNS(null, "id", "flag_ru");
	this.flag_ru.setAttributeNS(null, "width", go_sizes.language_flag_w);
	this.flag_ru.setAttributeNS(null, "height", go_sizes.language_flag_h);
	this.flag_ru.setAttributeNS(null, "stroke", "none");
	this.flag_ru.setAttributeNS(null, "viewBox", "0 0 90 60");
	this.flag_ru.setAttributeNS(null, "preserveAspectRatio", "xMinYMin meet");
	let white_strip_f_ru = document.createElementNS(svgns, "path");
	white_strip_f_ru.setAttributeNS(null, "d", "M0,0 h90 v20 H0 z");
	white_strip_f_ru.setAttributeNS(null, "fill", "#fff");
	this.flag_ru.appendChild(white_strip_f_ru);
	let blue_strip_f_ru = document.createElementNS(svgns, "path");
	blue_strip_f_ru.setAttributeNS(null, "d", "M0,20 h90 v20 H0 z");
	blue_strip_f_ru.setAttributeNS(null, "fill", "#0039a6");
	this.flag_ru.appendChild(blue_strip_f_ru);
	let red_strip_f_ru = document.createElementNS(svgns, "path");
	red_strip_f_ru.setAttributeNS(null, "d", "M0,40 h90 v20 H0 z");
	red_strip_f_ru.setAttributeNS(null, "fill", "#d52b1e");
	this.flag_ru.appendChild(red_strip_f_ru);
	svg_defs.appendChild(this.flag_ru);
	let _flag_ru = document.createElementNS(svgns, "use");
	_flag_ru.setAttributeNS(null, "href", "#flag_ru");
	go_text._flag_graf.ru = _flag_ru;//Добавляем ссылку на изображение флага в глобальный текстовый объект go_text.
	//рисуем британский флаг.
	this.flag_en =  document.createElementNS(svgns, "svg");
	this.flag_en.setAttributeNS(null, "id", "flag_en");
	this.flag_en.setAttributeNS(null, "width", go_sizes.language_flag_w);
	this.flag_en.setAttributeNS(null, "height", go_sizes.language_flag_h);
	this.flag_en.setAttributeNS(null, "stroke", "none");
	this.flag_en.setAttributeNS(null, "viewBox", "0 0 90 60");
	this.flag_en.setAttributeNS(null, "preserveAspectRatio", "xMinYMin meet");
	let backing_flag_en = document.createElementNS(svgns, "path");
	backing_flag_en.setAttributeNS(null, "d", "M0,0 h90 v60 H0 z");
	backing_flag_en.setAttributeNS(null, "fill", "#00247d");
	this.flag_en.appendChild(backing_flag_en);
	let cross_white_f_en_1 = document.createElementNS(svgns, "path");
	cross_white_f_en_1.setAttributeNS(null, "d", "M0,0 h10.82 L45,22.79 L79.18,0 H90 v7.21 L55.82,30 L90,52.79 V60 h-10.82 L45,37.21 L10.82,60 H0 v-7.21 L34.18,30 L0,7.21 z");
	cross_white_f_en_1.setAttributeNS(null, "fill", "#fff");
	this.flag_en.appendChild(cross_white_f_en_1);
	let cross_red_f_en_1 = document.createElementNS(svgns, "path");
	cross_red_f_en_1.setAttributeNS(null, "d", "M45,30 h-7.21 L0,4.81 V0 z v-4.81 L82.79,0 H90 z h7.21 L90,55.19 V60 z v4.81 L7.21,60 H0 z");
	cross_red_f_en_1.setAttributeNS(null, "fill", "#cf142b");
	this.flag_en.appendChild(cross_red_f_en_1);
	let cross_white_f_en_2 = document.createElementNS(svgns, "path");
	cross_white_f_en_2.setAttributeNS(null, "d", "M0,20 h90 v20 H0 z M35,0 h20 v60 H35 z");
	cross_white_f_en_2.setAttributeNS(null, "fill", "#fff");
	this.flag_en.appendChild(cross_white_f_en_2);
	let cross_red_f_en_2 = document.createElementNS(svgns, "path");
	cross_red_f_en_2.setAttributeNS(null, "d", "M0,24 h90 v12 H0 z M39,0 h12 v60 H39 z");
	cross_red_f_en_2.setAttributeNS(null, "fill", "#cf142b");
	this.flag_en.appendChild(cross_red_f_en_2);
	svg_defs.appendChild(this.flag_en);
	let _flag_en = document.createElementNS(svgns, "use");
	_flag_en.setAttributeNS(null, "href", "#flag_en");
	go_text._flag_graf.en = _flag_en;//Добавляем ссылку на изображение флага в глобальный текстовый объект go_text.
}

//go_graf = new Graf();//Перенесено в go_manager_setting.