var WshShell = WScript.CreateObject("WScript.Shell");
if(WScript.FullName.lastIndexOf("cscript.exe") == -1){
	WshShell.Run("cscript " + WScript.ScriptName);
	WScript.Quit(0);
}



//var tt = WshShell.Run("cmd /C set /p URL=\"Введите URL:\"", 1, true);
//var tt = WshShell.Exec("cmd /C set /p URL=\"Введите URL:\"");
//var tt = WshShell.Exec("cmd /C echo 12345").StdOut.ReadAll();
var tt = WshShell.Exec("cmd /C set /p URL=\"Введите URL:\"").StdOut.ReadAll();
WScript.Sleep(1000);
WScript.Echo(tt);

WScript.Sleep(1000);
WScript.Echo("tt");
WScript.Echo("tt1");
//WScript.Echo(WScript.StdOut.ReadAll());
WScript.Echo("tt2");
WScript.Sleep(10000);

WScript.StdIn.ReadLine();
WScript.Quit(0);




var htmlfile = WSH.CreateObject('htmlfile');
htmlfile.write('<meta http-equiv="x-ua-compatible" content="IE=9" />');
var JSON = htmlfile.parentWindow.JSON;
htmlfile.close();

//* TEST 1
var fso = new ActiveXObject("Scripting.FileSystemObject");
var nameFileConfig = "../config.json";
var config_text, config;
if(fso.FileExists(nameFileConfig)){
	file = fso.OpenTextFile(nameFileConfig, 1);
	config_text = file.ReadAll();
	config = JSON.parse(config_text);
	file.Close();
}

WScript.Echo(config_text);
WScript.Echo("============");
WScript.Echo(JSON.stringify(config, null, "\t"));
WScript.Echo("============");
// END TEST 1 */
//WshShell.Run("https://oauth.vk.com/authorize?client_id="+ config.id_vk +"&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=stats,wall,groups,photos&response_type=token&v=5.99&state=123456");

WScript.StdOut.WriteLine("Введите URL:");
//var URL = WScript.StdIn.ReadLine();
var URL = WScript.StdIn.Read(500);
WScript.StdOut.WriteLine(URL);
WScript.Quit(0);

var i = URL.indexOf('error=');
if(i != -1)WScript.StdOut.WriteLine("ERROR: " +  URL.slice(i + 1));
else {
	
	var key = URL.slice(URL.indexOf('access_token=') + 13);
	//var key2 = key.slice(key.indexOf('&'));
	var time_hours = URL.slice(URL.indexOf('expires_in=') + 11);
	//time_hours = time_hours.slice(time_hours.indexOf('&'));
	//time_hours /= 3600;
	WScript.StdOut.WriteLine("Ключ: " + key);
	WScript.StdOut.WriteLine("На время: " + time_hours + " часов.");
}


WScript.StdIn.ReadLine();

WScript.Quit(0);

//https://oauth.vk.com/blank.html#access_token=vk1.xxxxxXXxxxxexpires_in=86400&user_id=1477085&state=123457

//123123123qweqweqweqweqweq1231231123123123qweqweqweqweqweq1231231123123123qweqweqweqweqweq1231231123123123qweqweqweqweqweq1231231123123123qweqweqweqweqweq1231231123123123qweqweqweqweqweq1231231123123123qweqweqweqweqweq1231231123123123qweqweqweqweqweq1231231123123123qweqweqweqweqweq1231231123123123qweqweqweqweqweq1231231123123123qweqweqweqweqweq1231231xxx



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