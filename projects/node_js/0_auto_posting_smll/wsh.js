var WshShell = WScript.CreateObject("WScript.Shell");
if(WScript.FullName.lastIndexOf("cscript.exe") == -1){
	WshShell.Run("cscript.exe " + WScript.ScriptName);
	WScript.Quit(0);
}

function errorExit(text){
	WScript.StdOut.WriteLine("ERROR: " + text);
	WScript.StdIn.ReadLine();
	WScript.Quit(1);
}
function errorExitLog(text){
	log("ERROR: " + text);
	deinit();
	WScript.StdOut.WriteLine("Нажмите Enter для аварийного завершения, свяжитесь с разработчиком, 89607859080, ошибка сохранена в логах.");
	WScript.StdIn.ReadLine();
	WScript.Quit(1);
}

//
var fso;
var nameFileConfig = "data/config.json";
var service_key, user_key, account_id_vk;
var nameFileResources = "data/resources.json";
var resources;
var nameFilePosts = "data/posts.json";
var posts;
var nameFilePostings = "data/postings.json";
var postings;
var nameFileSave = "data/save/save.json";
var nameFileSave2 = "data/save/save2.json";
var save;
var flagSave = false;

var startDate, startTime, startZoneOffset, startTimeZone, startDay;

var nameFileLog = "data/log";
var fileLog;
var JSON;

var owner_ids_resources_reposts;

var time_request = 0;
//// Увеличиваем интервал между вызовами API VK до 2 секунд, чтобы небыло капчи.
var time_offset_short = 2000;// 340;// один вызов. // для time_offset
var time_offset_long = 6000;// 1020;// три вызов. // для time_offset
////
var time_offset = time_offset_short;
var boundary = "rx20089607859080";
var title_message;

function main(){
	/* TEST
	
	return;
	// END TEST */
	// инициализация, загрузка данных.
	init();
	/* TEST
	WScript.StdOut.WriteLine(startDay);
	WScript.StdOut.WriteLine("EXIT");
	WScript.StdIn.ReadLine();
	WScript.Quit(0);
	//*/
	log("START");
	
	for(var i = 0; i < postings.length; i++){
		var resource;
		for(var j = 0; j < resources.length; j++){
			if(resources[j].id === postings[i].resource_id){
				resource = resources[j];
				break;
			}
		}
		var day_number = dayNumber(postings[i].posting.length);
		var post_ids = postings[i].posting[day_number];
		for(var j = 0; j < post_ids.length; j++){
			if(post_ids[j] != -1){
				
				var post;
				for(var k = 0; k < posts.length; k++){
					if(posts[k].id === post_ids[j]){
						post = posts[k];
						break;
					}
				}
				// Публикуем...
				request_posting(resource, post);
			}
		}
	}
	
	var report;
	// Завершаем (делаем репосты лайки).
	for(var i = 0; i < owner_ids_resources_reposts.length; i++){
		// проверяем свои или чужие нужны посты.
		for(var j = 0; j < resources.length; j++){
			if(resources[j].owner_id == owner_ids_resources_reposts[i]){
				if(resources[j].rules.repost_other_post == 1){
					var ids_post_ids_other = getIdsPostIdsOtherReposted(owner_ids_resources_reposts[i]);
					for(var k = 0; k < ids_post_ids_other.ids_post.length; k++){
						likes_add(owner_ids_resources_reposts[i], ids_post_ids_other.ids_post[k]);
						var temp_resource = owner_ids_resources_reposts[i] + "_" + ids_post_ids_other.ids_post[k];
						log("likes.add: wall" + temp_resource);
						log("wall.repost: not wall" + temp_resource);
					}
					for(var k = 0; k < ids_post_ids_other.ids_other.length; k++){// Репостим себе, не свои посты.
						wall_repost("wall" + owner_ids_resources_reposts[i] + "_" + ids_post_ids_other.ids_other[k]);
						log("wall.repost: other wall" + owner_ids_resources_reposts[i] + "_" + ids_post_ids_other.ids_other[k]);
					}
				}else{
					// Проверяем, есть ли, на ресурсе, посты от автора без репоста.
					var ids_posts = getIdsPostUserNotReposted(owner_ids_resources_reposts[i]);
					for(var k = 0; k < ids_posts.length; k++){
						// Ставим лайк. likes.add
						likes_add(owner_ids_resources_reposts[i], ids_posts[k]);
						var temp_resource = owner_ids_resources_reposts[i] + "_" + ids_posts[k];
						log("likes.add: wall" + temp_resource);
						// Делаем репост. wall.repost
						wall_repost("wall" + temp_resource);
						log("wall.repost: wall" + temp_resource);
						//// Ставим лайк репосту. likes.add
					}
				}
				break;
			}
		}
		
		
		
		
	}
	log("END");
	// де инициализация, сохранение данных.
	deinit();
	//*
	WScript.StdOut.WriteLine("EXIT");
	WScript.StdIn.ReadLine();
	//*/
	WScript.Quit(0);
}

function log(text){
	WScript.Echo(text);
	fileLog.WriteLine((new Date()).getTime() + " " + text);
}

var htmlfile;
function init(){
	startDate = new Date();
	startTime = startDate.getTime();
	startZoneOffset = startDate.getTimezoneOffset() * -60000;
	startTimeZone = startTime + startZoneOffset;
	startDay = (startTimeZone / 86400000) | 0;
	
	fso = new ActiveXObject("Scripting.FileSystemObject");
	var file;
	//var htmlfile = WSH.CreateObject('htmlfile');
	htmlfile = WSH.CreateObject('htmlfile');
	htmlfile.write('<meta http-equiv="x-ua-compatible" content="IE=9" />');
	JSON = htmlfile.parentWindow.JSON;
	//htmlfile.close();
	if(fso.FileExists(nameFileConfig)){
		file = fso.OpenTextFile(nameFileConfig, 1);
		var config = JSON.parse(file.ReadAll());
		//if(config.keys.time_user_key != 0 && (config.keys.time_user_key - 3600000) < startTime)errorExit("update user key");
		service_key = config.keys.service_key;
		user_key = config.keys.user_key;
		account_id_vk = config.account_id_vk;
		file.Close();
	}
	else errorExit("not file " + nameFileConfig);
	
	if(fso.FileExists(nameFileResources)){
		file = fso.OpenTextFile(nameFileResources, 1);
		resources = JSON.parse(file.ReadAll());
		file.Close();
	}
	else errorExit("not file " + nameFileResources);
	
	if(fso.FileExists(nameFilePosts)){
		file = fso.OpenTextFile(nameFilePosts, 1);
		posts = JSON.parse(file.ReadAll());
		file.Close();
	}
	else errorExit("not file " + nameFilePosts);
	
	if(fso.FileExists(nameFilePostings)){
		file = fso.OpenTextFile(nameFilePostings, 1);
		postings = JSON.parse(file.ReadAll());
		file.Close();
	}
	else errorExit("not file " + nameFilePostings);
	
	if(fso.FileExists(nameFileSave)){
		file = fso.OpenTextFile(nameFileSave, 1);
		save = JSON.parse(file.ReadAll());
		file.Close();
	}
	else save = JSON.parse("[]");
	/* Структура объектов save
	{
		//"type":"vk",
		"resource_id":1,
		"post_id":0,
		//"post_id_vk":0,
		//"author_id_vk":1477085,
		"day":0,
		//"state":0 // 0 - запрос на публикацию, 1 - опубликовано, 2 - лайк, 3 - репост на страницу, 4 - лайк на странице.
	}
	//*/
	owner_ids_resources_reposts = JSON.parse("[]");
	
	/* TEST Пока рестируется код ниже для ввода авторизации.
	WScript.StdOut.WriteLine("TEST");
	var var_test = WScript.StdIn.ReadLine();
	WScript.StdOut.WriteLine(htmlfile.parentWindow.clipboardData.getData("text"));
	WScript.StdOut.WriteLine();
	WScript.StdOut.WriteLine(var_test);
	WScript.StdOut.WriteLine();
	WScript.StdOut.WriteLine("END TEST");
	WScript.StdIn.ReadLine();
	WScript.Quit(0);
	// END TEST */
	
	// Проверяем токен пользователя user_key
	if((config.keys.time_user_key != 0 && (config.keys.time_user_key - 3600000) < startTime) || !secure_checkToken(user_key)){// Проводим авторизацию и переустанавливаем user_key.
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
		
		var scope = wall | offline;// | photos | notes | groups;
		
		WshShell.Run("https://oauth.vk.com/authorize?client_id=" + config.id_vk + "&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=" + scope + "&response_type=token&v=5.99&state=123457");
		
		WScript.StdOut.WriteLine("Скопируйте адрес из браузера, и нажмите Enter.");
		WScript.StdIn.ReadLine();
		//var URL = TextToUTF_8(WScript.StdIn.ReadLine(), "cp866");
		var URL = htmlfile.parentWindow.clipboardData.getData("text");// Берем адрес из буфера обмена, а не из потока ввода, так как поток ввода ограничен 255 символами.
		
		var i = URL.indexOf('error=');
		if(i != -1){
			WScript.StdOut.WriteLine("ERROR: " +  URL.slice(i + 1));
			WScript.StdOut.WriteLine("Ошибка. Нажмите Enter для аварийного завершения, свяжитесь с разработчиком, 89607859080.");
			WScript.StdOut.WriteLine("EXIT");
			WScript.StdIn.ReadLine();
			WScript.Quit(0);
		}else{
			var key = URL.slice(URL.indexOf('access_token=') + 13);
			key = key.slice(0, key.indexOf('&'));
			var time_hours = URL.slice(URL.indexOf('expires_in=') + 11);
			time_hours = time_hours.slice(0, time_hours.indexOf('&'));
			
			if(time_hours != "0"){
				config.keys.time_user_key = time_hours * 1000 + startTime;
				time_hours /= 3600;
			}else{
				config.keys.time_user_key = 0;
				time_hours = "Без ограничений";
			}
			
			config.keys.user_key = key;
			user_key = key;
			
			file = fso.OpenTextFile(nameFileConfig, 2);
			file.Write(JSON.stringify(config, null, "\t"));
			file.Close();
			
			
			WScript.StdOut.WriteLine("Ключ: " + key);
			WScript.StdOut.WriteLine("На время: " + time_hours + " часа.");
		}
	}
	
	title_message = "--" + boundary + "\nContent-Disposition: form-data; name=\"access_token\"\n\n" + user_key + "\n--" + boundary + "\nContent-Disposition: form-data; name=\"v\"\n\n5.199\n";
	
	fileLog = fso.OpenTextFile(nameFileLog, 8, true);
	if(!fso.FileExists(nameFileLog))errorExit("failed to create or open file " + nameFileLog);
}

function deinit(){
	if(flagSave){
		if(fso.FileExists(nameFileSave2))fso.DeleteFile(nameFileSave2);
		if(fso.FileExists(nameFileSave))fso.MoveFile(nameFileSave, nameFileSave2);
		var file = fso.CreateTextFile(nameFileSave, true);
		file.Write(JSON.stringify(save));
		file.Close();
	}
	fileLog.Close();
	htmlfile.close();
}

////////////////////

function request_posting(resource, post){
	//*
	// Проверка в save не опубликовано ли ещё.
	// 
	var owner_id = resource.owner_id;
	for(var i = 0; i < save.length; i++)
		if(resource.id == save[i].resource_id && post.id == save[i].post_id){
			if(save[i].day < startDay){// Публикуем РЕПОСТ.
				post_0(post, owner_id);
				save[i].day = ((time_request + startZoneOffset) / 86400000) | 0;
				flagSave = true;
				//save[i].state = 0;
				log("offer wall resource: " + resource.id + " post: " + save[i].post_id);
				if(owner_ids_resources_reposts.indexOf(owner_id) == -1)owner_ids_resources_reposts.push(owner_id);
			}
			return;
		}
	// Публикуем ПОСТ. С добавлением новой записи в save.
	post_0(post, owner_id);
	save.push({
		resource_id: resource.id,
		post_id: post.id,
		day: ((time_request + startZoneOffset) / 86400000) | 0
	});
	flagSave = true;
	log("offer wall resource: " + resource.id + " post: " + save[save.length - 1].post_id);
	if(owner_ids_resources_reposts.indexOf(owner_id) == -1)owner_ids_resources_reposts.push(owner_id);
	return;
}

// Функции запросов.

function request_api_vk_check_token(method_vk, message){// до логов для проверки токена.
	var strResult;
	var captcha = "";
	while(true){
		// Проверка времени интервал 1000 милисекунд, не больше трех запросов в секунду.
		var sleep_time = time_offset - ((new Date()).getTime() - time_request);
		if(sleep_time > 0)WScript.Sleep(sleep_time);
		try{
			var WinHttpReq = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
			var temp = WinHttpReq.Open("POST", "https://api.vk.com/method/" + method_vk, false);
			WinHttpReq.SetRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
			WinHttpReq.Send(message + captcha + "--" + boundary + "--\n");
			strResult = WinHttpReq.ResponseText;
		}catch(objError){
			strResult = objError + "\n"
			strResult += "WinHTTP returned error: " + (objError.number & 0xFFFF).toString() + "\n\n";
			strResult += objError.description;
		}
		time_request = (new Date()).getTime();
		
		if(strResult.indexOf("error") != -1){
			if(strResult.indexOf("\"error_code\":14") != -1 && strResult.indexOf("Captcha") != -1){// Обработка капчи.
				WScript.StdOut.WriteLine("Ошибка капчи: " + strResult);
				var obj_error = (JSON.parse(strResult)).error;
				WshShell.Run(obj_error.captcha_img);
				WScript.StdOut.WriteLine("Введите текст с картинки в браузере или exit для выхода:");
				var captcha_key = TextToWindows_1251(WScript.StdIn.ReadLine(), "cp866");// преобразует ввод в кодировку windows-1251
				if(captcha_key != "exit"){
					//*
					if(captcha_key == "" && fso.FileExists("text.txt")){
						var file = fso.OpenTextFile("text.txt", 1);
						captcha_key = file.ReadAll();
						file.Close();
					}
					//*/
					captcha = "--" + boundary + "\n";
					captcha += "Content-Disposition: form-data; name=\"captcha_sid\"\n\n" + obj_error.captcha_sid + "\n";
					captcha += "--" + boundary + "\n";
					captcha += "Content-Disposition: form-data; name=\"captcha_key\"\n\n" + captcha_key + "\n";
					continue;
				}
			}
			return false;
		}
		var response = (JSON.parse(strResult)).response;
		return response.success == 1 ? true: false;
	}
}

function secure_checkToken(token){
	var message = "--" + boundary + "\nContent-Disposition: form-data; name=\"access_token\"\n\n" + service_key + "\n--" + boundary + "\nContent-Disposition: form-data; name=\"v\"\n\n5.199\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"token\"\n\n" + token + "\n";
	var flag = request_api_vk_check_token("secure.checkToken", message);
	time_offset = time_offset_short;
	return flag;
}

function request_api_vk(method_vk, message){
	var strResult;
	var captcha = "";
	while(true){
		// Проверка времени интервал 1000 милисекунд, не больше трех запросов в секунду.
		var sleep_time = time_offset - ((new Date()).getTime() - time_request);
		if(sleep_time > 0)WScript.Sleep(sleep_time);
		try{
			var WinHttpReq = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
			var temp = WinHttpReq.Open("POST", "https://api.vk.com/method/" + method_vk, false);
			WinHttpReq.SetRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
			WinHttpReq.Send(message + captcha + "--" + boundary + "--\n");
			strResult = WinHttpReq.ResponseText;
		}catch(objError){
			strResult = objError + "\n"
			strResult += "WinHTTP returned error: " + (objError.number & 0xFFFF).toString() + "\n\n";
			strResult += objError.description;
		}
		time_request = (new Date()).getTime();
		
		if(strResult.indexOf("error") != -1){
			if(strResult.indexOf("\"error_code\":14") != -1 && strResult.indexOf("Captcha") != -1){// Обработка капчи.
				WScript.StdOut.WriteLine("Ошибка капчи: " + strResult);
				var obj_error = (JSON.parse(strResult)).error;
				WshShell.Run(obj_error.captcha_img);
				WScript.StdOut.WriteLine("Введите текст с картинки в браузере или exit для выхода:");
				var captcha_key = TextToWindows_1251(WScript.StdIn.ReadLine(), "cp866");// преобразует ввод в кодировку windows-1251
				if(captcha_key != "exit"){
					//*
					if(captcha_key == "" && fso.FileExists("text.txt")){
						var file = fso.OpenTextFile("text.txt", 1);
						captcha_key = file.ReadAll();
						file.Close();
					}
					//*/
					captcha = "--" + boundary + "\n";
					captcha += "Content-Disposition: form-data; name=\"captcha_sid\"\n\n" + obj_error.captcha_sid + "\n";
					captcha += "--" + boundary + "\n";
					captcha += "Content-Disposition: form-data; name=\"captcha_key\"\n\n" + captcha_key + "\n";
					continue;
				}
			}
			errorExitLog("method_vk: " + method_vk + " message: " + message + captcha + "--" + boundary + "--\n" + "\nreport: " + strResult);
		}
		return strResult;
	}
}

function post_0(post, owner_id){
	var message = title_message;
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"owner_id\"\n\n" + owner_id + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"message\"\n\n" + post.message + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"attachments\"\n\n" + post.attachments + "\n";
	request_api_vk("wall.post", message);
	time_offset = time_offset_short;
}

function likes_add(owner_id, post_id){
	var message = title_message;
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"type\"\n\npost\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"owner_id\"\n\n" + owner_id + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"item_id\"\n\n" + post_id + "\n";
	request_api_vk("likes.add", message);
	time_offset = time_offset_short;
}

function wall_repost(obj){
	var message = title_message;
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"object\"\n\n" + obj + "\n";
	request_api_vk("wall.repost", message);
	time_offset = time_offset_short;
}

/* getIdsPostUserNotReposted
var result = [];
var c = 0;
while (c < 3){
 var items = API.wall.get({"owner_id":Args.owner_id, "offset":100 * c,"count": 100}).items;
 var i = 0;
 var i_end = items.length;
 while (i < i_end) { 
  if(items[i].signer_id == Args.signer_id){
   if(items[i].reposts.user_reposted == 0)result.push(items[i].id);
   else return result;
  }
  i = i + 1;
 };
 c = c + 1;
};
return result;

///////////

var result = {"other":[],"ids":[]};
var c = 0;
var c_other = 0;
while (c < 3){
	var items = API.wall.get({"owner_id":Args.owner_id, "offset":100 * c,"count": 100}).items;
	var i = 0;
	var i_end = items.length;
	while (i < i_end) { 
		if(items[i].signer_id == Args.signer_id){
			if(items[i].reposts.user_reposted == 0){
				result.ids.push(items[i].id);
				c_other++;
			}else if(c_other == 0)return result;
		}else if(c_other > 0 && items[i].reposts.user_reposted == 0){
			result.other.push(items[i].id);
			c_other--;
		}
		i = i + 1;
	};
	c = c + 1;
};
return result;

////// getIdsPostIdsOtherReposted

var result = {"ids_post":[],"ids_other":[]};
var ignor_ids = [583188628,710850554];
var c = 0;
var c_other = 0;
var f_exit = false;
while (c < 3){
	var items = API.wall.get({"owner_id":Args.owner_id, "offset":100 * c,"count": 100}).items;
	var i = 0;
	while (i < items.length) { 
		if(items[i].signer_id == Args.signer_id){
			if(items[i].likes.user_likes == 0){
				result.ids_post.push(items[i].id);
				c_other = c_other + 1;
			}else f_exit = true;
		}else if(c_other > 0 && items[i].reposts.user_reposted == 0 && ignor_ids.indexOf(items[i].signer_id) == -1){
			result.ids_other.push(items[i].id);
			c_other = c_other - 1;
			if(c_other == 0 && f_exit)return result;
		}
		i = i + 1;
	};
	c = c + 1;
};
return result;

//*/

function getIdsPostUserNotReposted(owner_id){
	var message = title_message;
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"owner_id\"\n\n" + owner_id + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"signer_id\"\n\n" + account_id_vk + "\n";
	var report = request_api_vk("execute.getIdsPostUserNotReposted", message);
	time_offset = time_offset_long;
	return (JSON.parse(report)).response;
}

function getIdsPostIdsOtherReposted(owner_id){
	var message = title_message;
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"owner_id\"\n\n" + owner_id + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"signer_id\"\n\n" + account_id_vk + "\n";
	var report = request_api_vk("execute.getIdsPostIdsOtherReposted", message);
	time_offset = time_offset_long;
	return (JSON.parse(report)).response;
}


// Вспомогательные функции.

function offsetDay(timeFrom, timeTo, timeZoneOffset){
	if(timeZoneOffset === undefined){
		timeZoneOffset = startZoneOffset;
		if(timeTo === undefined)timeTo = startTime;
	}
	timeFrom += timeZoneOffset;
	timeTo += timeZoneOffset;
	return ((timeTo / 86400000) | 0) - ((timeFrom / 86400000) | 0);
}

function dayNumber(n){
	return startDay % n;
}

function dayWeek(time, timeZoneOffset){// 3 Воскресенье. 0 Четверг.
	if(timeZoneOffset === undefined){
		timeZoneOffset = startZoneOffset;
		if(time === undefined)time = startTime;
	}
	time += timeZoneOffset;
	return ((time / 86400000) | 0) % 7;
}

function TextToWindows_1251(sText, srcCharset) {
	var objStream = new ActiveXObject("ADODB.Stream");
	objStream.type = 2;//Binary 1, Text 2 (default)
	objStream.mode = 3;//Permissions have not been set 0,  Read-only 1,  Write-only 2,  Read-write 3,  Prevent other read 4,  Prevent other write 8,  Prevent other open 12,  Allow others all 16
	objStream.charset = "windows-1251";// Кодировка в которую преобразуется.
	//objStream.charset = "utf-8";
	objStream.open();
	objStream.writeText(sText);
	objStream.position = 0;
	//objStream.charset = "utf-8";
	//objStream.charset = "cp866";
	objStream.charset = srcCharset;
	var text_out = objStream.readText();
	objStream.close();
	return text_out;
}

/*
function TextToUTF_8(sText, srcCharset) {
	var objStream = new ActiveXObject("ADODB.Stream");
	objStream.type = 2;//Binary 1, Text 2 (default)
	objStream.mode = 3;//Permissions have not been set 0,  Read-only 1,  Write-only 2,  Read-write 3,  Prevent other read 4,  Prevent other write 8,  Prevent other open 12,  Allow others all 16
	objStream.charset = "utf-8";// Кодировка в которую преобразуется.
	objStream.open();
	objStream.writeText(sText);
	objStream.position = 0;
	//objStream.charset = "utf-8";
	//objStream.charset = "cp866";
	objStream.charset = srcCharset;
	var text_out = objStream.readText();
	objStream.close();
	return text_out;
}
//*/

main();































