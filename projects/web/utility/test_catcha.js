var WshShell = WScript.CreateObject("WScript.Shell");
if(WScript.FullName.lastIndexOf("cscript.exe") == -1){
	WshShell.Run("cscript " + WScript.ScriptName);
	WScript.Quit(0);
}
var htmlfile = WSH.CreateObject('htmlfile');
htmlfile.write('<meta http-equiv="x-ua-compatible" content="IE=9" />');
var JSON = htmlfile.parentWindow.JSON;

var fso = new ActiveXObject("Scripting.FileSystemObject");
var nameFileConfig = "../config.json";
var service_key;
var user_key;
if(fso.FileExists(nameFileConfig)){
	file = fso.OpenTextFile(nameFileConfig, 1);
	var config = JSON.parse(file.ReadAll());
	service_key = config.keys.service_key;
	user_key = config.keys.user_key;
	file.Close();
}

var time_request = 0;
var time_offset = 340;
var boundary = "rx20089607859080";

function request_api_vk(method_vk, message){
	var strResult;
	var captcha = "";
	while(true){
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
			if(strResult.indexOf("\"error_code\":14") != -1 && strResult.indexOf("Captcha") != -1){// ќбработка капчи.
				WScript.StdOut.WriteLine("Ошибка капчи: " + strResult);
				WScript.StdIn.ReadLine();
				var obj_error = (JSON.parse(strResult)).error;
				WshShell.Run(obj_error.captcha_img);
				WScript.StdOut.WriteLine("Введите текст с картинки в браузере или exit для выхода:");
				var captcha_key = WScript.StdIn.ReadLine();
				if(captcha_key != "exit"){
					//*
					if(captcha_key == "" && fso.FileExists("text.txt")){
						file = fso.OpenTextFile("text.txt", 1);
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
			return "ERROR method_vk: " + method_vk + " message: " + message + captcha + "--" + boundary + "--\n" + "\nreport: " + strResult;
		}
		return strResult;
	}
}



function test_captcha(){
	var message = "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"access_token\"\n\n" + user_key + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"v\"\n\n5.199\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"oauth\"\n\n1\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"uids\"\n\n1477085\n";
	
	return request_api_vk("captcha.force", message);
}

WScript.StdOut.WriteLine(test_captcha());








WScript.StdOut.WriteLine("EXIT");
WScript.StdIn.ReadLine();
WScript.Quit(0);
htmlfile.close();