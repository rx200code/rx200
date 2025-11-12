/// 
var game = null;// Корень игры.
window.onload = function(){
	game = new Game();
}
/// Game - Создает игру.
// Свойства, data, view.
// Методы, seve(), load(), clear_game(), new_game().
function Game(){
	this.data = new Data_game();
	this.view = new View_game();
	// methods
	this.clear_game = function(){
		
	};
	this.new_game = function(){
		
	};
	this.seve = function(){
		
	};
	this.load = function(){
		
	};
}
/// Data_game - Создает данные игры.
// Свойства, Player, Shop.
// Методы,
function Data_game(){
	
}
/// View_game - Создает окно игры, пользовательский интерфейс.
// Свойства, настройки окна, цветов.
// Методы, clear, display.
function View_game(){
	//#### Настройки экрана. ####
	this.width = 1500;
	this.height = 800;
	this.color = "#e9e9e9";//"#fff";//
	//###########################
	
	this.clear = function(){// Удаляет полностью окно игры, и убирает все события.
		if(this.canvas !== undefined)this.canvas.remove();
	};
	this.display = function(){// Создает окно игры.
		this.clear();
		// Окно игры canvas.
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		document.body.prepend(this.canvas);
		// Контекст рисования.
		this.ctx = this.canvas.getContext('2d'); 
		// Фон.
		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(0, 0, this.width, this.height);
		///###################.
		// new button run.
		this.button_run = new Button_canvas(this.canvas, this.ctx, this.color, "ХОД", () => alert("Run"), this.width - 100 - 20, this.height - 50 - 20, 100, 50);
		this.button_run.display();
		// new info resources.
		// new interface.
	};
	this.display();
	
	// Доп/test информация.
	this.dop_info = function(e){
		let x = 0;
		let y = 0;
		this.ctx.fillStyle = "#000";
		this.ctx.fillRect(x, y, 50, 20);
		this.ctx.font = "10px sans-serif";
		this.ctx.fillStyle = "#fff";
		this.ctx.fillText("X = "+e.offsetX, x, y+10);
		this.ctx.fillText("Y = "+e.offsetY, x, y+20);
	}.bind(this);
	this.canvas.addEventListener("mousemove", this.dop_info);
}
/// Button_canvas - Создает кнопки игры.
// Свойства,
// Методы, clear, display, inactive, pressed.
function Button_canvas(canvas, ctx, parent_color, text, func, x, y, width, height){
	let background_color = "#888";
	let on_background_color = "#ffc500";
	let on_text_color = "#000";
	// Функции.
	let view_button = function(on = false){
		ctx.fillStyle = on ? on_background_color : background_color;
		ctx.fillRect(x, y, width, height);
		let height_text = height * .6;
		ctx.fillStyle = on ? on_text_color : parent_color;
		ctx.font = height_text+"pt sans-serif";
		ctx.fillText(text, x + (width - ctx.measureText(text).width) / 2 , y + (height - height_text) / 2 + height_text);
	};
	let move_button = function(e){
		view_button(e.offsetX >= x && e.offsetX < x + width && e.offsetY >= y && e.offsetY < y + height);
	};
	let click_button = function(e){
		if(e.offsetX >= x && e.offsetX < x + width && e.offsetY >= y && e.offsetY < y + height)func();
	};
	// Методы
	this.clear = function(){
		canvas.removeEventListener("mousemove", move_button);
		canvas.removeEventListener("click", click_button);
		ctx.fillStyle = parent_color;
		ctx.fillRect(x, y, width, height);
	};
	this.display = function(){
		view_button();
		canvas.addEventListener("mousemove", move_button);
		canvas.addEventListener("click", click_button);
	};
	this.inactive = function(){
		this.clear();
		view_button();
	};
	this.pressed = function(){
		this.clear();
		view_button(true);
	};
}














































