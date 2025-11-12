let toRad = deg => deg * Math.PI / 180;
let toDeg = rad => rad / Math.PI * 180;

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
	
	let center_X = 500;
	let center_Y = 500;
	let r = 4;
	this.c.fillStyle = "#f00";
	this.c.arc(center_X, center_Y, r, 0, Math.PI * 2);
	this.c.fill();
	
	
	
	let step = 40;
	let start_X = -510;
	let start_Y = -510;
	let w_grid = 1500;
	let h_grid = 1500;
	let a = toRad(20);
	let sin_a = Math.sin(a);
	let cos_a = Math.cos(a);
	
	
	let start_x_g = start_X - start_X % step;
	let start_y_g = start_Y - start_Y % step;
	if(start_X % step > 0)start_x_g += step;
	if(start_Y % step > 0)start_y_g += step;
	
	this.c.strokeStyle = "#000";
	this.c.beginPath();
	//*
	for(let i = start_x_g; i <= w_grid + start_X; i += step){
		for(let j = start_y_g; j <= h_grid + start_Y; j += step){
			let a_i = Math.atan2(j, i) - a;
			let r_i = (i ** 2 + j ** 2) ** .5;
			if(j === start_y_g)this.c.moveTo(center_X + r_i * Math.cos(a_i), center_Y - r_i * Math.sin(a_i));
			else this.c.lineTo(center_X + r_i * Math.cos(a_i), center_Y - r_i * Math.sin(a_i));
		}
		this.c.closePath();
	}//*/
	
	let counter = 0;
	
	
	for(let j = start_y_g; j <= h_grid + start_Y; j += step){
		for(let i = start_x_g; i <= w_grid + start_X; i += step){
			let a_i = Math.atan2(j, i) - a;
			let r_i = (i ** 2 + j ** 2) ** .5;
			if(i === start_x_g)this.c.moveTo(center_X + r_i * Math.cos(a_i), center_Y - r_i * Math.sin(a_i));
			else this.c.lineTo(center_X + r_i * Math.cos(a_i), center_Y - r_i * Math.sin(a_i));
			/*
			if(counter === 129){
				this.c.fillStyle = "#0f0";
				this.c.arc(center_X + r_i * Math.cos(a_i), center_Y - r_i * Math.sin(a_i), r, 0, Math.PI * 2);
				this.c.fill();
			}
			
			counter++;
			//*/
		}
		this.c.closePath();
	}
	this.c.stroke();
	// Frame
	this.c.strokeStyle = "#00f8";
	this.c.strokeRect(center_X + start_X, center_Y - start_Y - h_grid, w_grid, h_grid);
	//this.c.stroke();
	// экран
	
	let s_x = 70;
	let s_y = 20;
	let s_w = 230;
	let s_h = 190;
	let s_a = a;//toRad(10);// a;
	// 1 Находим центр экрана.
	let s_c_x = s_x + s_w / 2;
	let s_c_y = s_y + s_h / 2;
	// 2. поворачиваем на угол.
	let a_p = Math.atan2(s_c_y, s_c_x) + s_a;
	let r_p = (s_c_x ** 2 + s_c_y ** 2) ** .5;
	let x_p = r_p * Math.cos(a_p);
	let y_p = r_p * Math.sin(a_p);
	// 3. находим ближайшую точку.
	let offset = x_p % step;
	if(x_p > 0 && offset > step / 2)x_p += step;
	if(x_p < 0 && offset < step / -2)x_p -= step;
	x_p -= offset;
	offset = y_p % step;
	if(y_p > 0 && offset > step / 2)y_p += step;
	if(y_p < 0 && offset < step / -2)y_p -= step;
	y_p -= offset;
	// 4. поворачиваем обратно.
	a_p = Math.atan2(y_p, x_p) - s_a;
	r_p = (x_p ** 2 + y_p ** 2) ** .5;
	x_p = r_p * Math.cos(a_p);
	y_p = r_p * Math.sin(a_p);
	
	// Находим начало i, j и конечные i, j
	let i_e = s_w / step / 2 | 0;
	let i_s = -i_e;
	
	if(x_p - s_x > i_e * step + step)i_s--;
	if(s_x + s_w - x_p > i_e * step + step)i_e++;
	
	
	let j_e = s_h / step / 2 | 0;
	let j_s = -j_e;
	
	if(y_p - s_y > j_e * step + step)j_s--;
	if(s_y + s_h - y_p > j_e * step + step)j_e++;
	
	
	
	/// Рисуем сетку.
	// Находим смещения шага.
	let step_cos = step * Math.cos(s_a);
	let step_sin = step * Math.sin(s_a);
	
	
	this.c.strokeStyle = "#0ff";
	this.c.beginPath();
	for(let i = i_s; i <= i_e; i++){
		for(let j = j_s; j <= j_e; j++){
			let x = center_X + (x_p + i * step_cos + j * step_sin);
			let y = center_Y - (y_p + j * step_cos - i * step_sin);
			if(j === j_s)this.c.moveTo(x, y);
			else this.c.lineTo(x, y);
		}
		this.c.closePath();
	}
	
	for(let j = j_s; j <= j_e; j++){
		for(let i = i_s; i <= i_e; i++){
			let x = center_X + (x_p + i * step_cos + j * step_sin);
			let y = center_Y - (y_p + j * step_cos - i * step_sin);
			if(i === i_s)this.c.moveTo(x, y);
			else this.c.lineTo(x, y);
		}
		this.c.closePath();
	}
	
	
	this.c.stroke();
	
	
	
	
	
	//*
	this.c.beginPath();
	this.c.fillStyle = "#0f0";
	this.c.arc(center_X + x_p, center_Y - y_p, r, 0, Math.PI * 2);
	this.c.fill();
	//*/
	
	//
	this.c.beginPath();
	this.c.fillStyle = "#f00";
	this.c.arc(center_X + s_x, center_Y - s_y, r, 0, Math.PI * 2);
	this.c.fill();
	this.c.strokeStyle = "#f00";
	this.c.strokeRect(center_X + s_x, center_Y - s_y - s_h, s_w, s_h);
	
	
	
	
	
	/*
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
	//*/
	
	
	
	
	
}
window.onload = function(){
	canvas_test.start();
	let xx = new canvas_test.Canvas_text();
	//alert(xx.width);
	
	// Доп
	//canvas_test.canvas.addEventListener("mousemove", canvas_test.dop_info);
}