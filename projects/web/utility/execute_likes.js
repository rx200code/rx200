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

// resource_domain = "kinohd"; likes_count = 10000; offset = 2000;
//var resource_domain = "kinohd";
var resource_domain = "horor";
//var resource_domain = "kino_kaif";// Подправить алгоритм чтоб искал посты только с видео.
var likes_count = 1000;
var offset = 0;

/* CODE getIdsPostUserNotReposted
var result = [];
var items = API.wall.get({"domain":resource_domain, "offset":offset,"count": 100}).items;
var i = 0;
while(i < items.length){ 
	if(items[i].likes.count >= likes_count)result.push(items[i].id);
	i = i + 1;
};
return result;
//
'var result = [];var items = API.wall.get({"domain":"' + resource_domain + '", "offset":' + offset + ',"count": 100}).items;var i = 0;while(i < items.length){ if(items[i].likes.count >= ' + likes_count + ')result.push(items[i].id);i = i + 1;};return result;';
// END CODE */

var time_request = 0;
var boundary = "rx20089607859080";

function search_post(){
	var code = 'var result = [];var items = API.wall.get({"domain":"' + resource_domain + '", "offset":' + offset + ',"count": 100}).items;var i = 0;while(i < items.length){ if(items[i].likes.count >= ' + likes_count + ')result.push(items[i].id);i = i + 1;};return result;';
	
	var message = "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"access_token\"\n\n" + service_key + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"v\"\n\n5.199\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"code\"\n\n" + code + "\n";
	message += "--" + boundary + "--\n";
	
	var strURL = "https://api.vk.com/method/execute";
	var strResult;
	// Проверка времени интервал 340 милисекунд, не больше трех запросов в секунду.
	var sleep_time = 1000 - ((new Date()).getTime() - time_request);
	if(sleep_time > 0)WScript.Sleep(sleep_time);
	
	try{
		var WinHttpReq = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
		var temp = WinHttpReq.Open("POST", strURL, false);
		// Заголовки
		WinHttpReq.SetRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
        //  Send the HTTP request.
        WinHttpReq.Send(message);
		strResult = WinHttpReq.ResponseText;
	}catch(objError){
		strResult = objError + "\n"
		strResult += "WinHTTP returned error: " + (objError.number & 0xFFFF).toString() + "\n\n";
		strResult += objError.description;
	}
	time_request = (new Date()).getTime();
	return strResult;
}

var owner_id;
function url_to_id_vk(){
	var strResult;
	try{
		var WinHttpReq = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
		WinHttpReq.Open("GET", "https://api.vk.com/method/utils.resolveScreenName?access_token=" + service_key + "&screen_name=" + resource_domain + "&v=5.199", false);
		WinHttpReq.Send();
		strResult = WinHttpReq.ResponseText;
	}catch(objError){
		strResult = objError + "\n"
		strResult += "WinHTTP returned error: " + (objError.number & 0xFFFF).toString() + "\n\n";
		strResult += objError.description;
	}
	if(strResult.indexOf("error") != -1){
		WScript.Echo("ERROR: " + strResult + "\n");
		WScript.StdOut.WriteLine("EXIT");
		WScript.StdIn.ReadLine();
		WScript.Quit(0);
	}
	var temp = (JSON.parse(strResult)).response;
	owner_id = (temp.type == "user" ? "": "-") + temp.object_id;
}
url_to_id_vk();

while(true){
	WScript.StdOut.WriteLine("https://vk.com/" + resource_domain);
	WScript.StdOut.WriteLine("likes.count: " + likes_count);
	var report = search_post();
	offset += 100;
	WScript.StdOut.WriteLine("offset: " + offset);
	if(report.indexOf("error") != -1){
		WScript.Echo("ERROR: " + report + "\n");
		WScript.StdOut.WriteLine("EXIT");
		WScript.StdIn.ReadLine();
		WScript.Quit(0);
	}
	var ids_posts = (JSON.parse(report)).response;
	WScript.StdOut.WriteLine("Найдено: " + ids_posts.length + " постов с " + likes_count + " или больше, лайков.");
	for(var i = 0; i < ids_posts.length;){
		//WScript.CreateObject("WScript.Shell").Run("https://oauth.vk.com/authorize?client_id=" + config.id_vk + "&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=" + scope + "&response_type=token&v=5.99&state=123457");
		//https://vk.com/wall-113071474_4605840
		var URL = "https://vk.com/wall" + owner_id + "_" + ids_posts[i];
		i++;
		WScript.StdOut.WriteLine("Открыть: " + i + " из " + ids_posts.length + " URL: " + URL + " или введите 0 чтоб выйти.");
		var exit = WScript.StdIn.ReadLine();
		if(exit == "0")WScript.Quit(0);
		WshShell.Run(URL);
	}
	
	WScript.StdOut.WriteLine("Искать дальше? или введите 0 чтоб выйти.");
	var exit = WScript.StdIn.ReadLine();
	if(exit == "0")WScript.Quit(0);
}

























