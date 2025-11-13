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


//
var fso;
var nameFileConfig = "../config.json";
var service_key, user_key, account_id_vk;


var startDate, startTime, startZoneOffset, startTimeZone, startDay;

var nameFileLog = "data/log";
var fileLog;
var JSON;

var owner_ids_resources_reposts;



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
	if(config.keys.time_user_key != 0 && (config.keys.time_user_key - 3600000) < startTime)errorExit("update user key");
	service_key = config.keys.service_key;
	user_key = config.keys.user_key;
	account_id_vk = config.account_id_vk;
	file.Close();
}
else errorExit("not file " + nameFileConfig);


var time_request = 0;
var time_offset = 340;
var boundary = "rx20089607859080";
var title_message = "--" + boundary + "\nContent-Disposition: form-data; name=\"access_token\"\n\n" + user_key + "\n--" + boundary + "\nContent-Disposition: form-data; name=\"v\"\n\n5.199\n";

startDate = new Date();
startTime = startDate.getTime();
startZoneOffset = startDate.getTimezoneOffset() * -60000;
startTimeZone = startTime + startZoneOffset;
startDay = (startTimeZone / 86400000) | 0;


// Функции запросов.

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
				WScript.StdIn.ReadLine();
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
					WScript.StdOut.WriteLine(captcha_key);
					//*/
					captcha = "--" + boundary + "\n";
					captcha += "Content-Disposition: form-data; name=\"captcha_sid\"\n\n" + obj_error.captcha_sid + "\n";
					captcha += "--" + boundary + "\n";
					captcha += "Content-Disposition: form-data; name=\"captcha_key\"\n\n" + captcha_key + "\n";
					continue;
				}
			}
			WScript.StdOut.WriteLine("method_vk: " + method_vk + " message: " + message + captcha + "--" + boundary + "--\n" + "\nreport: " + strResult);
		}
		return strResult;
	}
}

function post_0(message_t, attachments, owner_id){
	var message = title_message;
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"owner_id\"\n\n" + owner_id + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"message\"\n\n" + message_t + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"attachments\"\n\n" + attachments + "\n";
	//message += "--" + boundary + "\n";
	//message += "Content-Disposition: form-data; name=\"primary_attachments_mode\"\n\n" + "carousel" + "\n";
	request_api_vk("wall.post", message);
	time_offset = 340;
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

WScript.StdOut.WriteLine(post_0("123","photo1477085_457239885,photo1477085_457239883,photo1477085_457239880,photo1477085_457239879", "-222541136"));

WScript.StdOut.WriteLine("EXIT");
WScript.StdIn.ReadLine();
WScript.Quit(0);































