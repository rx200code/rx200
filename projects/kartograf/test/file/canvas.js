

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
	//alert(this.width);
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
	
	//Рисуем.
	//Координаты.
	let h = 7;
	let w = 7;
	let step_b = 100;
	let step_2 = .01;
	
	
	
	
	this.c.fillStyle = "#000";
	this.c.strokeStyle = "#000";
	this.c.beginPath();
	this.c.moveTo(100, 100);
	this.c.lineTo(100, 700);
	this.c.lineTo(800, 700);
	
	this.c.font = "10px sans-serif";
	
	for(let i = 700; i >= 100; i -= step_b){
		this.c.moveTo(90, i);
		this.c.lineTo(100, i);
		this.c.fillText(h - (i / step_b), 80, i + 4);
	}
	for(let i = 100; i <= 800; i += step_b){
		this.c.moveTo(i, 700);
		this.c.lineTo(i, 710);
		this.c.fillText(i / step_b - 1, i - 4, 720);
	}
	this.c.stroke();
	// Рисуем линию.
	this.c.strokeStyle = "#00f";
	this.c.beginPath();
	
	this.c.moveTo((Math.sin(0) + 3) * 100, Math.cos(0) * -100 + 500);
	
	for(let i = step_2; i <= Math.PI * 2 + step_2; i += step_2){
		let x = (Math.sin(i * 2) + 3) * 100;
		let y = Math.cos(i * 3) * -100 + 500;
		
		this.c.lineTo(x, y);
	}
	
	this.c.stroke();
	
	
	
	
	
	
}
window.onload = function(){
	canvas_test.start();
	let xx = new canvas_test.Canvas_text();
	//alert(xx.width);
	
	// Доп
	//canvas_test.canvas.addEventListener("mousemove", canvas_test.dop_info);
}