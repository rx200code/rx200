/*### версия с обработкой - ###
test_mod.create_input = function(i_to = 255, i_from = 0, i_step = 1){//создает input, i_to - до(длина/размер), i_from - от(начало отсчета), i_step - шаг.
	if(i_from > i_to){
		let temp = i_from;
		i_from = i_to;
		i_to = temp;
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
	let f_input = function(i){
		if(i == "-"){
			if(input_r.value === "-0")i = 0;
			else i = "-"+input_r.value;
		}else if(isNaN(i))i = 0;
		else i *= 1;
		if(input_r.value < 0 && i == 0)i = "-0"
		input_r.value = i;
		input_n.value = i;
		input_t.value = i === "-0" ? "-00" : i < 16 && i >= 0 ? "0"+i.toString(16) : i > -16 && i < 0 ? "-0"+Math.abs(i).toString(16) : i.toString(16);
	}.bind(this);
		input_r.oninput = function(){
			f_input(this.value);
		}
		input_n.oninput = function(e){
			if(e.data == "-")f_input(e.data);
			else f_input(this.value);
		}
		input_t.oninput = function(e){
			f_input(e.data === "-" ? e.data : parseInt(this.value == '' ? '0' : this.value , 16));
		}
	span.append(input_r, input_n, document.createElement('b').innerHTML = " 0x", input_t, document.createElement('br'));
	return span;
}
//*///#########################
/*############## три способа поменять переменные местами. ################
	// 1 - самый очевидный и простой.
	let temp = i_from;
	i_from = i_to;
	i_to = temp;
	// 2 - должнобыть самый быстрый.
	i_from ^= i_to;
	i_to ^= i_from;
	i_from ^= i_to;
	//3 - Возможно не реализовано в старых браузерах. называется Деструктурирование.
	[i_from, i_to] = [i_to, i_from];
//*///####################################################################
