//Функции общего назначения. Начинаются с "f_".
//##################### Для работы с хранилищами данных. #####################
function f_is_localStorage(){//проверяет доступно ли хранилище данных localStorage.
	return f_is_Storage('localStorage');
}
function f_is_sessionStorage(){//проверяет доступно ли хранилище данных sessionStorage.
	return f_is_Storage('sessionStorage');
}
function f_is_Storage(type){//проверяет доступно ли хранилище данных sessionStorage или localStorage, функция используется в f_is_localStorage и f_is_sessionStorage.
	try{
		let storage = window[type];
		let x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e){
		return false;
	}
}
function f_is_IndexedDB(){//проверяет доступно ли хранилище данных indexedD и нормальные способы работы с ним.
	return Boolean(window.indexedDB) && Boolean(window.IDBTransaction) && Boolean(window.IDBKeyRange);
}
//############################################################################

//##################### Свернуть/развернуть на весь экран. #####################
function f_full_screen(){//Открывает игру на весь экран, в случае если игра открыта на весь экран сворачивает её.
	if(document.fullscreenElement){//window.fullScreen){//Если во весь экран.
		document.exitFullscreen();//mozCancelFullScreen();//Свертывает игру к прежнему состояни.
	}else{
		svg.requestFullscreen();//mozRequestFullScreen();//Развертывает на весь экран.
	}
}
//##############################################################################

//##################### устанавливает громкость звука и сохроняет её. #####################
function f_volume(){
	out("All "+go_sizes.volume_all+"; music "+(go_sizes.volume_music*go_sizes.volume_all)+"; effect "+(go_sizes.volume_effect*go_sizes.volume_all)+".");
	//if(go_sound.audio_tag.src == "")go_sound.audio_tag.src = 'music/From_Russia_With_Love.mp3';
	/*
	if(value > 0 && value <= 100){
		go_audio_music.muted = false;
		go_audio_music.volume = value / 100;
	}else{
		go_audio_music.muted = true;
		go_audio_music.volume = 0;
	}//*/
}
//#########################################################################################

//##################### Функции меню. #####################
function f_new_game(){
	go_world = new World();
	
	go_interf.on();
	
	out("NEW GAME");
}

function f_menu_city(){
	if(this.player === go_player){
		go_city_menu.on(this);
	}else{
		out("ne vah gorod a "+this.player.name)
	}
}


//#########################################################











































