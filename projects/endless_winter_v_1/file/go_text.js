//содержит тексты игры.
/*############## СОКРАЩЕНИЯ ###############
b - button. кнопка.
############################################*/
var go_text = {//Содержит тексты игры.
	//Настройки языка.
	language:"ru",//Активный язык, по умолчанию "ru".
	languages:["ru","en"],//Название(идентификаторы) языков.
	flag_graf:{ru:null,en:null},//ссылки на изображения флагов стран языков.//Добавляет ссылки на изображения флагов конструктор go_graf.
	flag_id:{ru:"#flag_ru",en:"#flag_en"},
	//Далее сами тексты. на разных языках.
	language_title:{ru:"Язык",en:"Language"},
	language_title_b:{ru:"Сменить язык",en:"Change language"},
	language_name:{ru:"Русский",en:"English"},//Название языков, на родном языке.
	
	game_name:{ru:"Бесконечная зима",en:"Endless winter"},//Название игры.
	full_screen:{ru:"Во весь экран",en:"Full screen"},
	exit_full_screen:{ru:"Выход из полноэкранного режима",en:"Exit full screen"},
	exit_full_screen_2:{ru:"Оконный режим",en:"Exit full screen"},
	volume_all:{ru:"Громкость",en:"Volume"},
	volume_music:{ru:"Музыка",en:"Music"},
	volume_effect:{ru:"Эффекты",en:"Effects"},
	new_game:{ru:"Новая игра",en:"New game"},
	load:{ru:"Загрузить",en:"Load"},
	save:{ru:"Сохранить",en:"Save"},
	continue_game:{ru:"Продолжить",en:"Continue"},
	end_game:{ru:"Конец игры",en:"End game"},
	grid:{ru:"Сетка",en:"Grid"},
	menu:{ru:"меню",en:"menu"},
	main_menu:{ru:"Главное меню",en:"Main menu"}
};
Object.defineProperties(go_text, {language:{enumerable: false}, languages:{enumerable: false}});//Делаем параметер, активного языка и идентификаторов языков невидемым для цикла for in.
for(let key in go_text){
	Object.defineProperty(go_text, "_"+key, {enumerable: false, value:go_text[key]});//Делаем ссылку на обект из свойств с похожими иминами, добавляя к имени свойства "_". Делаем сразу их невидимыми для циклов for in.
	Object.defineProperty(go_text, key, {get: function(){return this["_"+key][this.language];}});//назначаем геттеры для обращеней к текстам, что бы автоматически выводились тексты соответствующего языка.
}




/*
var go_text = null;
function Text(){
	//Настройки языка.
	this.language = "ru";//Активный язык, по умолчанию "ru".
	this.languages = ["ru","en"];//Название(идентификаторы) языков.
	this.flag_graf = {ru:go_graf.flag_ru,en:go_graf.flag_en};//ссылки на изображения флагов стран языков.
	//Далее сами тексты. на разных языках.
	this.language_name = {ru:"Русский",en:"English"};//Название языков, на родном языке.
	this.game_name = {ru:"Бесконечная зима",en:"Endless winter"};//Название игры.
	this.full_screen = {ru:"Во весь экран",en:"Full screen"};
	this.exit_full_screen = {ru:"Выход из полноэкранного режима",en:"Exit full screen"};
	
	Object.defineProperties(this, {language:{enumerable: false}, languages:{enumerable: false}});//Делаем параметер, активного языка и идентификаторов языков невидемым для цикла for in.
	for(let key in this){
		Object.defineProperty(this, "_"+key, {enumerable: false, value:this[key]});//Делаем ссылку на обект из свойств с похожими иминами, добавляя к имени свойства "_". Делаем сразу их невидимыми для циклов for in.
		Object.defineProperty(this, key, {get: function(){return this["_"+key][this.language];}});//назначаем геттеры для обращеней к текстам, что бы автоматически выводились тексты соответствующего языка.
	}
}//*/