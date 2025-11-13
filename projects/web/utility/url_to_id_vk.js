var WshShell = WScript.CreateObject("WScript.Shell");
if(WScript.FullName.lastIndexOf("cscript.exe") == -1){
	WshShell.Run("cscript " + WScript.ScriptName);
	WScript.Quit(0);
}
var htmlfile = WSH.CreateObject('htmlfile');
htmlfile.write('<meta http-equiv="x-ua-compatible" content="IE=9" />');
var JSON = htmlfile.parentWindow.JSON;
htmlfile.close();

var fso = new ActiveXObject("Scripting.FileSystemObject");
var nameFileConfig = "../config.json";
var service_key;
if(fso.FileExists(nameFileConfig)){
	file = fso.OpenTextFile(nameFileConfig, 1);
	var config = JSON.parse(file.ReadAll());
	service_key = config.keys.service_key;
	file.Close();
}
var WinHttpReq = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
while(true){
	WScript.StdOut.WriteLine("Введите URL:");
	var URL = WScript.StdIn.ReadLine();
	if(URL == "")WScript.Quit(0);
	var screen_name = URL.slice(URL.lastIndexOf('/') + 1);
	WinHttpReq.Open("GET", "https://api.vk.com/method/utils.resolveScreenName?access_token=" + service_key + "&screen_name=" + screen_name + "&v=5.199", false);
	WinHttpReq.Send();
	WScript.StdOut.WriteLine("Ответ: " + WinHttpReq.ResponseText);
}