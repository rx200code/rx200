rem ( /*
@echo off

cscript //nologo //e:javascript %~nx0
if %errorlevel% EQU 77 (
pause
exit
)
set /p URL="‚ўҐ¤ЁвҐ URL:"
cscript //nologo //e:javascript %~nx0 "%URL%"

pause
exit
*/ )

function rem() {
	var notify = 0x00000001;// 1 (1 << 0) Пользователь разрешил отправлять ему уведомления (для flash/iframe-приложений).
	var friends = 0x00000002;// 2 (1 << 1) Доступ к друзьям.
	var photos = 0x00000004;// 4 (1 << 2) Доступ к фотографиям.
	var audio = 0x00000008;// 8 (1 << 3) Доступ к аудиозаписям.
	var video = 0x00000010;// 16 (1 << 4) Доступ к видеозаписям.
	var stories = 0x00000040;// 64 (1 << 6) Доступ к историям.
	var pages = 0x00000080;// 128 (1 << 7) Доступ к wiki-страницам.
	var menu = 0x00000100;// 256 (1 << 8) Добавление ссылки на приложение в меню слева.
	var status = 0x00000400;// 1024 (1 << 10) Доступ к статусу пользователя.
	var notes = 0x00000800;// 2048 (1 << 11) Доступ к заметкам пользователя.
	var messages = 0x00001000;// 4096 (1 << 12) Доступ к расширенным методам работы с сообщениями (только для Standalone-приложений, прошедших модерацию).
	var wall = 0x00002000;// 8192 (1 << 13) Доступ к обычным и расширенным методам работы со стеной. Данное право доступа по умолчанию недоступно для сайтов (игнорируется при попытке авторизации для приложений с типом «Веб-сайт» или по схеме Authorization Code Flow).
	var ads = 0x00008000;// 32768 (1 << 15) Доступ к расширенным методам работы с рекламным API. Доступно для авторизации по схеме Implicit Flow или Authorization Code Flow.
	var offline = 0x00010000;// 65536 (1 << 16) Доступ к API в любое время (при использовании этой опции параметр expires_in, возвращаемый вместе с access_token, содержит 0 — токен бессрочный). Не применяется в Open API.
	var docs = 0x00020000;// 131072 (1 << 17) Доступ к документам.
	var groups = 0x00040000;// 262144 (1 << 18) Доступ к группам пользователя.
	var notifications = 0x00080000;// 524288 (1 << 19) Доступ к оповещениям об ответах пользователю.
	var stats = 0x00100000;// 1048576 (1 << 20) Доступ к статистике групп и приложений пользователя, администратором которых он является.
	var email = 0x00400000;// 4194304 (1 << 22) Доступ к email пользователя.
	var market = 0x08000000;// 134217728 (1 << 27) Доступ к товарам.
	var phone_number = 0x10000000;// 268435456 (1 << 28) Доступ к номеру телефона.
	
	var scope = wall;// | photos | notes | groups;
	
	var htmlfile = WSH.CreateObject('htmlfile');
	htmlfile.write('<meta http-equiv="x-ua-compatible" content="IE=9" />');
	var JSON = htmlfile.parentWindow.JSON;
	htmlfile.close();
	
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var file;
	var nameFileConfig = "../config.json";
	var config;
	if(fso.FileExists(nameFileConfig)){
		file = fso.OpenTextFile(nameFileConfig, 1);
		config = JSON.parse(file.ReadAll());
		file.Close();
	}
	if(config.keys.time_user_key == 0){
		WScript.StdOut.WriteLine("Время ключа не ограничено");
		WScript.Quit(77);
	}
	var date_time = (new Date()).getTime();
	/* Временно отключаю, чтоб всегда токен делать.
	if((config.keys.time_user_key - 3600000) > date_time){
		WScript.StdOut.WriteLine("Ещё осталось: " + (((config.keys.time_user_key - date_time) / 3600000) | 0) + " часа.");
		WScript.Quit(77);
	}
	//*/
	
	if(WScript.Arguments.Length == 0){
		WScript.CreateObject("WScript.Shell").Run("https://oauth.vk.com/authorize?client_id=" + config.id_vk + "&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=" + scope + "&response_type=token&v=5.99&state=123457");
		WScript.Quit(0);
	}
	
	var URL = WScript.Arguments(0);
	
	var i = URL.indexOf('error=');
	if(i != -1)WScript.StdOut.WriteLine("ERROR: " +  URL.slice(i + 1));
	else {
		var key = URL.slice(URL.indexOf('access_token=') + 13);
		key = key.slice(0, key.indexOf('&'));
		var time_hours = URL.slice(URL.indexOf('expires_in=') + 11);
		time_hours = time_hours.slice(0, time_hours.indexOf('&'));
		
		if(time_hours != "0"){
			config.keys.time_user_key = time_hours * 1000 + date_time;
			time_hours /= 3600;
		}else{
			config.keys.time_user_key = 0;
			time_hours = "Без ограничений";
		}
		
		
		
		config.keys.user_key = key;
		
		file = fso.OpenTextFile(nameFileConfig, 2);
		file.Write(JSON.stringify(config, null, "\t"));
		file.Close();
		
		
		WScript.StdOut.WriteLine("Ключ: " + key);
		WScript.StdOut.WriteLine("На время: " + time_hours + " часа.");
	}
}