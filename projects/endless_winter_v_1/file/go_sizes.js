//содержит размеры игры.
/*############## СОКРАЩЕНИЯ ###############
g - game. игра.
w - width. ширина.
h - height. высота.
i - initial. начальный.
interf - interface. интерфейс.
b - button. кнопка.
m - margin. отступ.
r - right. право.
############################################*/
var go_sizes = null;

function Sizes(){
	this.g_i_w = 1000;//Изначальная ширина игрового окна.
	this.g_i_h = 800;//Изначальная высота игрового окна.
	Object.defineProperty(this, "g_actual_w", {get: function(){return svg.getBoundingClientRect().width;}});//Текущая, актуальная, настоящая, ширина игрового окна.
	Object.defineProperty(this, "g_actual_h", {get: function(){return svg.getBoundingClientRect().height;}});//Текущая, актуальная, настоящая, высота игрового окна.
	this.b_w = 100;//Ширина кнопок.
	this.b_menu_w = this.b_w + 50;//Ширина кнопок.
	this.menu_w = this.b_menu_w + 60;//Ширина меню.
	this.b_h = 30;//Высота кнопок.
	this.b_f_s = this.b_h;//Размер кнопки свернуть/развернуть на весь экран.
	this.b_w_stroke = this.b_h/30;//Ширина контура рамки.
	this.b_margin = 10;//Отступ кнопок от краев окна игры
	this.b_f_s_margin = this.b_margin;//Отступ кнопки свернуть/развернуть на весь экран, от правого, нижнего края окна игры.
	this.language_flag_w = 15;//Ширина флагов языка, пропорции которых высоты к ширене 2 к 3.
	this.language_flag_h = 10;//Высота флагов языка, пропорции которых высоты к ширене 2 к 3.
	this.volume_all = 0.5;//множитель для других видов звуков.
	this.volume_music = 0.5;//Громкость музыки.
	this.volume_effect = 0.5;//Громкость эффектов игры вроди клика на кнопку.
	this.interf_m = 30;//Отступ(рамка) интерфейса игры.
	Object.defineProperty(this, "interf_m_r", {get: function(){return document.fullscreenElement ? 300:200;}});//Отступ(рамка) интерфейса игры с права.
	this.cell = 100;
	
}

go_sizes = new Sizes();