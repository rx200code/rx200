//содержит цвета игры.
/*############## СОКРАЩЕНИЯ ###############
g - game. игра.
bg - background. фон.
b - button. кнопка.
i - interface. интерфейс.
############################################*/
var go_colors = null;

function Colors(){
	this.g_bg = "#002f41";//фон всей игры.
	this.i_bg = this.g_bg;//цвет пользовательского интерфейса игры.
	this.bg_main_menu = "navy";//Фон главного меню.
	this.focus = "#fd0";//Цвет фокусировки.
	this.text = "#ccc";//Цвет текстов игры.
	this.frame = "#888";//Цвет рамки игры.
	this.b_frame = this.frame;//Цвет рамки кнопки.
	
}

go_colors = new Colors();