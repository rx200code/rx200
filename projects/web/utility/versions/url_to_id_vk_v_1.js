/*
function errorExit(text){
	WScript.Echo("ERROR: " + text);
	WScript.Quit(1);
}
if(WScript.FullName.lastIndexOf("cscript.exe") == -1)errorExit("запустите скрипт с помощью cscript.exe, сейчас запущен из " + WScript.FullName);
//*/
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

WScript.Echo("text: " + text);
