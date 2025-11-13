/*
if(WScript.FullName.lastIndexOf("cscript.exe") == -1){
	errorExit("запустите скрипт с помощью cscript.exe, сейчас запущен из " + WScript.FullName);
}
//*/

var WshShell = WScript.CreateObject("WScript.Shell");
if(WScript.FullName.lastIndexOf("cscript.exe") == -1){
	WshShell.Run("cscript " + WScript.ScriptName);
	WScript.Quit(0);
}






var text_out = "";
text_out += "Timeout: " + WScript.Timeout + "\n";
text_out += "Name: " + WScript.Name + "\n";
text_out += "FullName: " + WScript.FullName + "\n";
text_out += "Path: " + WScript.Path + "\n";
text_out += "Version: " + WScript.Version + "\n";
text_out += "BuildVersion: " + WScript.BuildVersion + "\n";
text_out += "ScriptName: " + WScript.ScriptName + "\n";
text_out += "ScriptFullName: " + WScript.ScriptFullName + "\n";




WScript.Echo("text: " + text_out);



var stdin = WScript.StdIn;
var stdout = WScript.StdOut;

var str;

while (str !== ""){
     str = stdin.ReadLine();
     stdout.WriteLine("Line " + (stdin.Line - 1) + ": " + str);
}



WScript.Quit(0);

var fso = new ActiveXObject("Scripting.FileSystemObject");
var nameFileConfig = "../config.json";
var service_key;
var nameFileAccounts = "../accounts.json";
var accounts;
var nameFileResources = "../resources.json";
var resources;

var file;
var htmlfile = WSH.CreateObject('htmlfile');
htmlfile.write('<meta http-equiv="x-ua-compatible" content="IE=9" />');
JSON = htmlfile.parentWindow.JSON;
htmlfile.close();

if(fso.FileExists(nameFileConfig)){
	file = fso.OpenTextFile(nameFileConfig, 1);
	var config = JSON.parse(file.ReadAll());
	service_key = config.keys.service_key;
	file.Close();
}

if(fso.FileExists(nameFileAccounts)){
	file = fso.OpenTextFile(nameFileAccounts, 1);
	accounts = JSON.parse(file.ReadAll());
	file.Close();
}

if(fso.FileExists(nameFileResources)){
	file = fso.OpenTextFile(nameFileResources, 1);
	resources = JSON.parse(file.ReadAll());
	file.Close();
}

var text = "";
var arr_res_name = JSON.parse("[]");

accounts.forEach(function(account){
	if(account.type == "vk"){
		arr_res_name.push(account.URL.slice(account.URL.lastIndexOf('/') + 1));
	}
});

resources.forEach(function(resource){
	if(resource.type == "vk"){
		arr_res_name.push(resource.URL.slice(resource.URL.lastIndexOf('/') + 1));
	}
});


text = JSON.stringify(arr_res_name);

//WScript.Echo("text: " + text);




/*
var WshShell = WScript.CreateObject("WScript.Shell");
var resultat = WshShell.Popup("vvv",0,"TTTtttTTT", 1 | 64);

WScript.Echo(resultat);
//*/








































