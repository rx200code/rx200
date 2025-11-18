
var Pro_Filters = function(){
	
	this.span_log = document.getElementById("span_log");
	this.span_0 = document.getElementById("span_0");
	this.span_1 = document.getElementById("span_1");
	this.span_2 = document.getElementById("span_2");
	this.span_3 = document.getElementById("span_3");
	this.span_4 = document.getElementById("span_4");
	this.span_5 = document.getElementById("span_5");
	this.span_6 = document.getElementById("span_6");
	this.span_7 = document.getElementById("span_7");
	//таблица
	let color_offset = "#00f";
	let table_0 = document.createElement("table");
	table_0.style.fontFamily = "monospace";
	this.span_1.appendChild(table_0);
	
	let tr_0 = document.createElement("tr");
	//tr_0.setAttribute("color", "#00f");
	//tr_0.style.cssText = "color: #00f;";
	tr_0.style.color = color_offset;
	table_0.appendChild(tr_0);
	
	let td_0 = document.createElement("td");
	td_0.innerHTML = "Offset";
	tr_0.appendChild(td_0);
	
	let td_1 = document.createElement("td");
	td_1.innerHTML = "&nbsp;00 01 02 03 04 05 06 07&nbsp;&nbsp;08 09 0A 0B 0C 0D 0E 0F";
	tr_0.appendChild(td_1);
	
	let td_2 = document.createElement("td");
	td_2.innerHTML = "Text";
	tr_0.appendChild(td_2);
	
	let tr_1 = document.createElement("tr");
	table_0.appendChild(tr_1);
	
	this.td_offset = document.createElement("td");
	this.td_offset.style.color = color_offset;
	tr_1.appendChild(this.td_offset);
	
	this.td_view = document.createElement("td");
	tr_1.appendChild(this.td_view);
	
	this.td_text = document.createElement("td");
	tr_1.appendChild(this.td_text);
	
	
	this.file = null;
	//загрузка.
	this.f_files = function(files){
		this.file = files[0];
		this.span_log.innerHTML = "Размер: "+this.file.size+". Начало загрузки.";
		
		let reader = new FileReader();
		
		reader.onerror = function(){
			this.span_log.innerHTML = "Ошибка.";
		}.bind(this);
		reader.onabort = function(){
			this.span_log.innerHTML = "Чтение прервано onabort.";
		}.bind(this);
		reader.onloadstart = function(){
			this.span_log.innerHTML = "Начата загрузка. onloadstart";
		}.bind(this);
		reader.onloadend = function(){
			this.span_log.innerHTML = "Чтение завершено. onloadend";
		}.bind(this);
		
		reader.onprogress = function(event){
			this.span_log.innerHTML = "Из "+event.total+" байт загружено "+event.loaded+" Процентов "+Math.round(event.loaded / event.total * 100)+"% Загружено.";
		}.bind(this);
		
		reader.onload = function(){
			this.span_log.innerHTML = "Загружено успешно.";
			let buffer = reader.result;
			let view = new DataView(buffer);
			
			this.span_0.innerHTML = "Фаил: <b>"+this.file.name+"</b> Размер: <b>"+this.file.size+"</b> байт (0x"+this.file.size.toString(16).toUpperCase()+"). Тип: <b>"+this.file.type+"</b>";
			
			let text_offset = "";
			let text_view = "";
			let text = "";
			let text_span_2 = "";
			
			for(let i = 0; i < buffer.byteLength; i++){
				if(i % 16 == 0){
					let str = (i/16).toString(16).toUpperCase()+"0";
					str = ('000000' + str).slice(-8);
					text_offset += str+"<br>";
					if(i != 0){
						text_view += "&nbsp;<br>";
						text += "<br>";
					}
				}else if(i % 8 == 0){
					text_view += "&nbsp;";
				}
				let index = view.getUint8(i);
				let str = index.toString(16).toUpperCase();
				if(str.length == 1)str = "0"+str;
				text_view += "&nbsp;"+str;
				text_span_2 += str;
				if(index < 32 || index == 127)index = 160;
				let str_char = "&#"+index+";";
				text += str_char;
			}
			
			
			this.td_offset.innerHTML = text_offset;
			this.td_view.innerHTML = text_view;
			this.td_text.innerHTML = text;
			this.span_2.innerHTML = text_span_2;
		}.bind(this);
		//reader.readAsText(this.file);
		//reader.readAsDataURL(this.file);
		//reader.readAsBinaryString(this.file);
		reader.readAsArrayBuffer(this.file);
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
