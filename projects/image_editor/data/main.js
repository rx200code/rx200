//// Вспомогательные функции.
let createElement = (name, ...attr) => {
	let elm = document.createElement(name);
	for(let arr_set of attr)elm.setAttribute(arr_set[0], arr_set[1]);
	return elm;
};
/*
let input_file_kmz = createElement("input", ["type", "file"], ["multiple", ""]);
	let reg_kmz_format = /\.kmz$/i;
	input_file_kmz.onchange = () => {
		for(let i = 0; i < input_file_kmz.files.length; i++){
			// Проверка по фориату(kmz) имени файла.
			if(!reg_kmz_format.test(input_file_kmz.files[i].name))continue;
			let reader = new FileReader();
			reader.onload = () => {
				create_map(from_zip(reader.result), input_file_kmz.files[i].name);
			};
			reader.readAsArrayBuffer(input_file_kmz.files[i]);
		}
	};//*/

var output, info_tag, canvas, gl;
window.onload = function(){
	//// Создаем кнопку загрузить.
	let input_file = createElement("input", ["type", "file"]);
	document.body.appendChild(input_file);
	document.body.appendChild(createElement("br"));
	input_file.onchange = () => {
		if(input_file.files.length == 0 || !input_file.files[0].type.startsWith("image/"))return;
		let file = input_file.files[0];
		
		out(file.name + "<br>" + file.size + "<br>" + file.type);
	};
	
	//// Создаем canvas
	canvas = createElement("canvas");
	document.body.appendChild(canvas);
	
	//// Создаем поля вывода output, info, error.
	output = createElement("span");
	info_tag = createElement("span");
	document.body.appendChild(createElement("br"));
	document.body.appendChild(output);
	document.body.appendChild(createElement("br"));
	document.body.appendChild(info_tag);
	out("START");
	
	//// Создаём контекст WebGL
	try{
		gl = canvas.getContext("webgl");// || canvas.getContext("experimental-webgl");
	}catch(e){
		error(e);
	}
};
function error(text){
	info("ERROR: " + text);
	//console.log("ERROR: " + text);
};
function out(text){
	output.innerHTML=text;
}
function info(text){
	info_tag.innerHTML=text;
}