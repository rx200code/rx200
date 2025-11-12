

var canvas_test = new Object();
// Доп информация.
canvas_test.dop_info = function(e){
	let x = 0;
	let y = 0;
	this.c.fillStyle = "#000";
	this.c.fillRect(x, y, 50, 20);
	this.c.font = "10px sans-serif";
	this.c.fillStyle = "#fff";
	this.c.fillText("X = "+e.offsetX, x, y+10);
	this.c.fillText("Y = "+e.offsetY, x, y+20);
}.bind(canvas_test);
// Текст.
canvas_test.Canvas_text = function(){
	alert(this.width);
}.bind(canvas_test);
canvas_test.start = function(){
	//#### Настройки экрана. ####
	this.width = 1500;
	this.height = 800;
	this.color = "#e9e9e9";//"#fff";//
	//###########################
	// Окно canvas.
	this.canvas = document.createElement('canvas');
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	document.body.prepend(this.canvas);
	// Контекст рисования.
	this.c = this.canvas.getContext('2d'); 
	// Фон.
	this.c.fillStyle = this.color;
	this.c.fillRect(0, 0, this.width, this.height);
}
window.onload = function(){
	canvas_test.start();
	let xx = new canvas_test.Canvas_text();
	//alert(xx.width);
	
	// Доп
	canvas_test.canvas.addEventListener("mousemove", canvas_test.dop_info);
}