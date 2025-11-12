
var Pro_Filters = function(){
	
	this.textarea_1 = document.getElementById("textarea_1");
	this.span_1 = document.getElementById("span_1");
	this.span_2 = document.getElementById("span_2");
	this.span_3 = document.getElementById("span_3");
	this.span_4 = document.getElementById("span_4");
	this.span_5 = document.getElementById("span_5");
	this.span_6 = document.getElementById("span_6");
	this.span_7 = document.getElementById("span_7");
	
	//загрузка.
	this.f_files = function(files){
		let text = "	123";
		let file = files[0];
		
		
		let reader = new FileReader();
		reader.onload = function(){
			let buffer = reader.result;
			
			let view = new DataView(buffer);
			console.log(view.getUint8(0).toString(16));
			console.log(view.getUint8(1).toString(16));
			console.log(view.getUint8(2).toString(16));
			console.log(view.getUint8(3).toString(16));
			console.log(view.getUint8(4).toString(16));
			console.log(view.getUint8(5).toString(16));
			console.log(view.getUint8(6).toString(16));
			console.log(view.getUint8(7).toString(16));
			console.log(view.getUint8(8).toString(16));
			console.log(view.getUint8(512).toString(16)+" |||");
			this.textarea_1.innerHTML = buffer.byteLength;//reader.result;//.replace("</textarea>", "<.textarea>");
			//console.log(value);
		}.bind(this);
		//reader.readAsText(file);
		//reader.readAsDataURL(file);
		//reader.readAsBinaryString(file);
		reader.readAsArrayBuffer(file);
		
		//this.textarea_1.innerHTML=files[0];
		this.span_1.innerHTML="Файлов выбрано: "+files.length;
		this.span_2.innerHTML="Название первого файла: <b>"+file.name+"</b>";
		this.span_3.innerHTML="Размер первого файла(в байтах): <b>"+file.size+"</b>";
		this.span_4.innerHTML="Тип первого файла: <b>"+file.type+"</b>";
	}.bind(this);
	
	
	this.out = function(text){
		this.textarea_1.innerHTML=text;
		this.span_1.innerHTML=text;
		this.span_2.innerHTML=text;
	}.bind(this);
}

var go = new Pro_Filters();

function f_load(){
	var input = document.createElement("input");
	input.setAttribute("type", "file");
	input.setAttribute("multiple", "");
	input.setAttribute("onchange", "go.f_files(this.files)");
	input.click();
}
function f_handleFiles(files){
	go.f_files(files);
	/*
	var reader = new FileReader();
	reader.onload = function(){
		var o_seve = JSON.parse(reader.result);
		//gb_flag_grid_map = o_seve.flag_grid_map;
		//go_players.load(o_seve.players);
		go_mir.load(o_seve.mir);
		
		go_interf.full_screen_change();//Для настройки миникарты.
	}
	reader.readAsText(file);
	//*/
}