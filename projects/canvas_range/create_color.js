function create_color(f){
	// Константы
	let width = 400;
	let height = 400;
	let range_width = width * .5;// 200
	let range_height = range_width * .1;// 20
	let range_height_half = range_height * .5;// 10
	let octet = 0xff;// 255
	let octet_half = 0x7f;// 127
	let color = "aaa";//"7f7f7f";
	//
	let canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	let c = canvas.getContext('2d');
	// Константы
	c.font = range_height+"px serif";
	//
	c.textAlign = "right";
	c.textBaseline = "middle";
	
	
	let create_range = function(x, y){
		
		let is = false;
		let is_down = false;
		let value = octet_half;
		this.move = (e) => {
			is = e.offsetX >= x && e.offsetX <= x + range_width && e.offsetY > y - range_height_half && e.offsetY < y + range_height_half;
			if(is_down && e.offsetX >= x && e.offsetX <= x + range_width)value = (e.offsetX - x) / range_width * octet;
		};
		this.down = (e) => {
			if(is){
				is_down = true;
				value = (e.offsetX - x) / range_width * octet;
			}
		};
		this.up = (e) => {
			is_down = false;
		};
		
		this.draw = (c) => {
			c.lineCap = "round";
			c.lineWidth = 8;
			c.strokeStyle = "#888";
			
			
			c.beginPath();
			c.moveTo(x, y);
			c.lineTo(x + range_width, y);
			c.stroke();
			
			c.lineWidth = 5;
			c.strokeStyle = is ? "#ddd": "#fff";
			c.beginPath();
			c.moveTo(x + range_width * (value / octet), y);
			c.lineTo(x + range_width, y);
			c.stroke();
			
			c.strokeStyle = is ? "#00b": "#00f";
			c.beginPath();
			c.moveTo(x, y);
			c.lineTo(x + range_width * (value / octet), y);
			c.stroke();
			
			c.lineWidth = 2;
			c.strokeStyle = "#fff";
			c.fillStyle = is ? "#00b": "#00f";
			c.beginPath();
			c.arc(x + range_width * (value / octet), y, range_height_half * .9, 0, 2 * Math.PI);
			c.fill();
			c.stroke();
			
			c.strokeStyle = "#888";
			c.fillStyle = "#fff";
			c.beginPath();
			c.rect(x + range_width + range_height_half, y - range_height_half, 40, range_height);
			c.fill();
			c.stroke();
			
			c.fillStyle = "#000";
			c.fillText(value | 0, x + range_width + range_height_half + 35, y);
			
			
		}
		
	};
	
	let range_red = new create_range(40, 100);
	let range_green = new create_range(40, 150);
	let range_blue = new create_range(40, 200);
	let range_gray = new create_range(40, 250);
	let arr_range = [range_red, range_green, range_blue, range_gray];
	
	
	let draw = () => {
		c.fillStyle = "#"+color;
		c.fillRect(0, 0, width, height);
		
		arr_range.forEach(range => range.draw(c));
	}
	
	
	
	let convert_i_to_t2_hex = function(i){return i < 16 ? "0"+i.toString(16) : i.toString(16);};
	canvas.addEventListener("mousemove", e => {
		arr_range.forEach(range => range.move(e));
		draw();
		
	});
	
	canvas.addEventListener("mousedown", e => {
		arr_range.forEach(range => range.down(e));
		
		
		/*
		let text_out = "";
		let x = e.offsetX;
		text_out += x+"<br>";
		if(x > 0xFF)x = 0xFF;
		let t_color_r = convert_i_to_t2_hex(x);
		
		text_out += t_color_r+"0000"+"<br>";
		f(text_out);
		
		
		
		color = t_color_r+"0000";
		//*/
		draw();
		
	});
	canvas.addEventListener("mouseup", e => {
		arr_range.forEach(range => range.up(e));
		//draw();
	});
	draw();
	return canvas;
}