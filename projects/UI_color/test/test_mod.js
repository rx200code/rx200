

var test_mod = {};
test_mod.test = function(){
	
	this.out("test");
	this.info("test");
	
}
test_mod.div = document.createElement('div');
test_mod.create_out = function(name){//создает поле span вывода информации, и функцию для вывод, и помещает поле в div.
	this["span_"+name] = document.createElement('span');
	this[name] = function(text){
		this["span_"+name].innerHTML = text;
	}
	this.div.append(this["span_"+name],document.createElement('br'));
}
///################### Ползунок ###################
test_mod.create_input = function(i_to = 255, i_from = 0, i_step = 1){//создает input, i_to - до(длина/размер), i_from - от(начало отсчета), i_step - шаг.
	if(i_from > i_to){
		[i_from, i_to] = [i_to, i_from];
	}
	let i_value = i_from + ((i_to - i_from) / 2);
	i_value = i_value > 0 ? Math.floor(i_value) : Math.ceil(i_value);
	let span = document.createElement('span');
	let input_r = document.createElement('input');
		input_r.type = "range";
		input_r.min = i_from;
		input_r.max = i_to;
		input_r.step = i_step;
		input_r.value = i_value;
	let input_n = document.createElement('input');
		input_n.type = "number";
		input_n.min = i_from;
		input_n.max = i_to;
		input_n.step = i_step;
		input_n.style = "width: 4em;";
		input_n.value = i_value;
	let input_t = document.createElement('input');
		input_t.type = "text";
		input_t.size = 2;
		input_t.value = i_value < 16 && i_value > -1  ? "0"+(i_value).toString(16) : (i_value).toString(16);
		span.f_value = function(i_value){}
		span.value = i_value;
	span.f_input_set = function(i){
		input_r.value = i;
		input_n.value = i;
		input_t.value = i < 16 && i >= 0 ? "0"+i.toString(16) : i > -16 && i < 0 ? "-0"+Math.abs(i).toString(16) : i.toString(16);
		span.value = i;
	}
	let f_input = function(i){
		if(isNaN(i))i = 0;
		else i *= 1;
		span.f_input_set(i);
		span.f_value(i);
	}
	input_r.oninput = function(){
		f_input(this.value);
	}
	input_n.oninput = function(){
		f_input(this.value);
	}
	input_t.oninput = function(){
		f_input(parseInt(this.value == '' ? '0' : this.value , 16));
	}
	span.append(input_r, input_n, " 0x", input_t);
	return span;
}
///################################################
///################### Блок для работы с цветом ###################
test_mod.create_block_color = function(){
	//block
	let div = document.createElement('div');
	let h3 = document.createElement('h3');
	//function/method
	let convert_i_to_t2_hex = function(i){return i < 16 ? "0"+i.toString(16) : i.toString(16);}// принимает значение i от 0 до 255.
		div.f_value = function(t_value){}
		div.value = "7f7f7f";
	let set_value_div = function(t_color_rgb){
		div.f_value(t_color_rgb);
		div.value = t_color_rgb;
	}
	//red
	let input_red = this.create_input(0, 255);
	let span_red = document.createElement('span');
	//green
	let input_green = this.create_input(0, 255);
	let span_green = document.createElement('span');
	//blue
	let input_blue = this.create_input(0, 255);
	let span_blue = document.createElement('span');
	//gray
	let input_gray = this.create_input(0, 255);
	let span_gray = document.createElement('span');
	//color
	let input_rgb = document.createElement('input');
	let span_rgb = document.createElement('span');
	//#block
		h3.innerHTML = "Для работы с цветом.";
	div.append(h3);
	//#red
		span_red.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		input_red.append(" ",span_red);
		input_red.f_value = function(i){
			let t_color_r = convert_i_to_t2_hex(i);
			let t_color_rgb = t_color_r + convert_i_to_t2_hex(input_green.value) + convert_i_to_t2_hex(input_blue.value);
			span_red.style.backgroundColor = "#"+t_color_r+"0000";
			input_rgb.value = t_color_rgb;
			span_rgb.style.backgroundColor = "#"+t_color_rgb;
			set_value_div(t_color_rgb);
		}
		input_red.f_value(input_red.value);
	div.append(input_red, document.createElement('br'));
	//#green
		span_green.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		input_green.append(" ",span_green);
		input_green.f_value = function(i){
			let t_color_g = convert_i_to_t2_hex(i);
			let t_color_rgb = convert_i_to_t2_hex(input_red.value) + t_color_g + convert_i_to_t2_hex(input_blue.value);
			span_green.style.backgroundColor = "#00"+t_color_g+"00";
			input_rgb.value = t_color_rgb;
			span_rgb.style.backgroundColor = "#"+t_color_rgb;
			set_value_div(t_color_rgb);
		}
		input_green.f_value(input_green.value);
	div.append(input_green, document.createElement('br'));
	//#blue
		span_blue.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		input_blue.append(" ",span_blue);
		input_blue.f_value = function(i){
			let t_color_b = convert_i_to_t2_hex(i);
			let t_color_rgb = convert_i_to_t2_hex(input_red.value) + convert_i_to_t2_hex(input_green.value) + t_color_b;
			span_blue.style.backgroundColor = "#0000"+t_color_b;
			input_rgb.value = t_color_rgb;
			span_rgb.style.backgroundColor = "#"+t_color_rgb;
			set_value_div(t_color_rgb);
		}
		input_blue.f_value(input_blue.value);
	div.append(input_blue, document.createElement('br'));
	//#gray
		span_gray.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		input_gray.append(" ",span_gray);
		input_gray.f_value = function(i){
			let gray_color = convert_i_to_t2_hex(i);
			span_rgb.style.backgroundColor = span_gray.style.backgroundColor = "#"+gray_color+gray_color+gray_color;
			input_rgb.value = gray_color+gray_color+gray_color;
			input_red.f_input_set(i);
			span_red.style.backgroundColor = "#"+gray_color+"0000";
			input_green.f_input_set(i);
			span_green.style.backgroundColor = "#00"+gray_color+"00";
			input_blue.f_input_set(i);
			span_blue.style.backgroundColor = "#0000"+gray_color;
			set_value_div(gray_color+gray_color+gray_color);
		}
		input_gray.f_value(input_gray.value);
	div.append(input_gray, document.createElement('br'));
	//#color
		input_rgb.type = "text";
		input_rgb.size = 6;
		input_rgb.value = "7f7f7f";
		span_rgb.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		span_rgb.style.backgroundColor = "#"+input_rgb.value;
		input_rgb.oninput = function(){
			//this.value.length = 2;
			this.value = this.value.toLowerCase();
			let test_hex = function(t){return (!(typeof t === 'undefined') && /[\da-f]/.test(t));}
			let t_color_r = (test_hex(this.value[0]) ? this.value[0] : "0")+(test_hex(this.value[1]) ? this.value[1] : "0");
			span_red.style.backgroundColor = "#"+t_color_r+"0000";
			input_red.f_input_set(parseInt(t_color_r, 16));
			let t_color_g = (test_hex(this.value[2]) ? this.value[2] : "0")+(test_hex(this.value[3]) ? this.value[3] : "0");
			span_green.style.backgroundColor = "#00"+t_color_g+"00";
			input_green.f_input_set(parseInt(t_color_g, 16));
			let t_color_b = (test_hex(this.value[4]) ? this.value[4] : "0")+(test_hex(this.value[5]) ? this.value[5] : "0");
			span_blue.style.backgroundColor = "#0000"+t_color_b;
			input_blue.f_input_set(parseInt(t_color_b, 16));
			let i_selection = input_rgb.selectionStart;
			this.value = t_color_r + t_color_g + t_color_b;
			input_rgb.selectionEnd = input_rgb.selectionStart = i_selection;
			span_rgb.style.backgroundColor = "#"+t_color_r + t_color_g + t_color_b;
			set_value_div(t_color_r + t_color_g + t_color_b);
		}
	div.append(" 0x", input_rgb," ",span_rgb);
	return div;
}
///################################################################
///################### Создаем кнопки ###################
test_mod.create_button = function(text = "test", func = function(){test_mod.test();}){
	//<button>Кнопка с текстом</button>
	let button = document.createElement('button');
	button.innerHTML = text;
	button.onclick = func;
	return button;
}
///######################################################
test_mod.execute = function(){
	/// test 2 функцияю
	this.flag = true;
	let f_button_2 = function(){
		if(this.flag){
			this.flag = false;
			game.view.test_t.out();
		}else{
			this.flag = true;
			game.view.test_t.clear();
		}
		
	}.bind(this);
	this.button_test_2 = this.create_button("test 2",f_button_2);
	this.div.append(this.button_test_2);
	/// test функцияю
	let f_button = function(){
		this.out(this.range_input.value);
		game.logic.set_gold(this.range_input.value);
		
	}.bind(this);
	this.button_test = this.create_button("test",f_button);
	this.div.append(this.button_test);
	this.range_input = this.create_input(-100, 200);
	this.div.append(this.range_input);
	this.div_color = this.create_block_color();
	/// функция изиенения цвета.
	this.div_color.f_value = function(t_value){
		game.view.c.fillStyle = "#"+t_value;
		game.view.c.fillRect(0,0,500,500);
		//game.view.out_resources("Золото:999771", 0, "#"+t_value);
	}.bind(this);
	
	this.div.append(this.div_color);
	this.create_out("out");
	this.create_out("info");
	document.body.append(this.div);
}
test_mod.execute();



























