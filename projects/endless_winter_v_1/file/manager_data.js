//Варианты: Куки, Локальное хранилище, Сессионное хранилище, IndexedDB.
var manager_data = {
	//Проверяем на доступность разных хранилищь данных.
	is_cookie: navigator.cookieEnabled,
	is_localStorage: f_is_localStorage(),
	is_sessionStorage: f_is_sessionStorage(),
	//is_IndexedDB: f_is_IndexedDB(),//пока откажемся от этого типа хранения данных.
	//Проверяем есть ли уже данные и где данные.
	is_data: false,//Если есть сохраненные данные в доступных местах содержит true.
	is_arr_data: [],//Содержит массив в зазваниями мест где данные уже есть.
	//Выбираем хранилище для настроек и сейвов игры, и определяем соответствующие методы.
	type:"localStorage",
	length: 0,
	key: null,
	getItem: null,
	setItem: null,
	removeItem: null,
	clear: null,
	//Сами данные и их значения по умолчанию или если есть те что сохранены ранее. Их изменение приводит к автоматическому сохранению.
	language:"ru",
	volume_all:0.5,
	volume_music:0.5,
	volume_effect:0.5
}
//Проверяем предпочитаемый язык пользователя, и если он есть устанавливаем пока его в качестве стандартного manager_data.language.
let id_language = go_text.languages.indexOf(window.navigator.language.substr(0, 2).toLowerCase());
if(id_language != -1)manager_data.language = go_text.languages[id_language];
//################################################################################################################################
if(manager_data.is_cookie){
	if(document.cookie){
		manager_data.is_arr_data[manager_data.is_arr_data.length] = "cookie";
		manager_data.is_data = true;
	}
}
if(manager_data.is_localStorage){
	if(window.localStorage.length){
		manager_data.is_arr_data[manager_data.is_arr_data.length] = "localStorage";
		manager_data.is_data = true;
	}
}
if(manager_data.is_sessionStorage){
	if(window.sessionStorage.length){
		manager_data.is_arr_data[manager_data.is_arr_data.length] = "sessionStorage";
		manager_data.is_data = true;
	}
}
/*пока откажемся от этого типа хранения данных.
if(manager_data.is_IndexedDB){
	
}//*/
//Выбираем хранилище для настроек и сейвов игры, и определяем соответствующие методы.
if(manager_data.is_localStorage){
	manager_data.type = "localStorage";
	let storage = window.localStorage;
	Object.defineProperty(manager_data, 'length', {get: function(){return storage.length;}});
	manager_data.key = function(n){return storage.key(n);};
	manager_data.getItem = function(key){return storage.getItem(key);};
	manager_data.setItem = function(key, value){storage.setItem(key, value);};
	manager_data.removeItem = function(key){storage.removeItem(key);};
	manager_data.clear = function(){storage.clear();};
}else if(manager_data.is_cookie){
	//Потом сделаем.
}else if(manager_data.is_sessionStorage){
	manager_data.type = "sessionStorage";
	let storage = window.sessionStorage;
	Object.defineProperty(manager_data, 'length', {get: function(){return storage.length;}});
	manager_data.key = function(n){return storage.key(n);};
	manager_data.getItem = function(key){return storage.getItem(key);};
	manager_data.setItem = function(key, value){storage.setItem(key, value);};
	manager_data.removeItem = function(key){storage.removeItem(key);};
	manager_data.clear = function(){storage.clear();};
}else{
	//Потом сделаем.
}
Object.defineProperties(manager_data, {//Делаем предведущие параметер, невидемым для цикла for in.
	is_cookie:{enumerable: false},
	is_localStorage:{enumerable: false},
	is_sessionStorage:{enumerable: false},
	is_data:{enumerable: false},
	is_arr_data:{enumerable: false},
	type:{enumerable: false},
	length:{enumerable: false},
	key:{enumerable: false},
	getItem:{enumerable: false},
	setItem:{enumerable: false},
	removeItem:{enumerable: false},
	clear:{enumerable: false}
});

if(manager_data.is_data){//Если данные уже сохранены.
	//тут надо будет доделать, если донные есть но сохранены не выбранным сейчас спопобом хранения.
	if(manager_data.length){//Сохранены выбранным спопобом.
		for(let i = 0; i < manager_data.length; i++){//загружаем данные.
			let key = manager_data.key(i);
			manager_data[key] = manager_data.getItem(key);
		}
	}
}
for(let key in manager_data){
	Object.defineProperty(manager_data, "_"+key, {enumerable: false, writable: true, value: manager_data[key]});//Делаем ссылку на обект из свойств с похожими иминами, добавляя к имени свойства "_". Делаем сразу их невидимыми для циклов for in.
	Object.defineProperty(manager_data, key, {get: function(){return this["_"+key];}});//назначаем геттеры для переменных которые хранят данные.
	Object.defineProperty(manager_data, key, {set: function(value){//назначаем сеттеры стобы автоматически сохранять данные, при их присвоении переменной на которой сеттер.
		if(value === ""){
			this.removeItem(key);
			return;
		}
		this.setItem(key, value);
		this["_"+key] = value;
	}});
}