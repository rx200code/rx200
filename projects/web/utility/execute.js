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
	//service_key = config.keys.user_key;
	file.Close();
}

/* CODE getIdsPostUserNotReposted
var owner_id = -222541136;
var signer_id = 262963075;
//
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
//
var result = [];var c = 3;while (c != 0){c = c - 1;var items = API.wall.get({"owner_id":-47388963, "offset":100 * c,"count": 100}).items;var i = items.length;while (i != 0){i = i - 1;if(items[i].signer_id == 262963075)result.push(items[i].id);};};return result;

//
var ids = items@.signer_id;

return API.wall.get({"owner_id":-47388963, "count": 100}).items@.signer_id;
//

var items = API.wall.get({"owner_id":-47388963, "count": 100}).items;var i = items.length;var result = [];while (i != 0) {i = i - 1;if(items[i].signer_id == 262963075 && items[i].reposts.user_reposted == 0)result.push(items[i].id);};return result;

// END CODE */



// TEST
var time_request = 0;
var boundary = "rx20089607859080";

function search_post(owner_id, signer_id){
	//var code = 'var result = [];var c = 3;while (c != 0){c = c - 1;var items = API.wall.get({"owner_id":-222541136, "offset":100 * c,"count": 100}).items;var i = items.length;while (i != 0){i = i - 1;if(items[i].signer_id == 813426251 && items[i].reposts.user_reposted == 0)result.push(items[i].id);};};return result;';
	//var code = 'return API.wall.get({"owner_id":-47388963, "offset":100, "count": 100}).items@.id;';
	
	
	var message = "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"access_token\"\n\n" + service_key + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"v\"\n\n5.199\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"owner_id\"\n\n" + owner_id + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"signer_id\"\n\n" + signer_id + "\n";
	message += "--" + boundary + "--\n";
	
	var strURL = "https://api.vk.com/method/execute.getIdsPostUserNotReposted";
	var strResult;
	// ѕроверка времени интервал 340 милисекунд, не больше трех запросов в секунду.
	var sleep_time = 340 - ((new Date()).getTime() - time_request);
	if(sleep_time > 0)WScript.Sleep(temp_time);
	
	try{
		var WinHttpReq = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
		var temp = WinHttpReq.Open("POST", strURL, false);
		// «аголовки
		//WinHttpReq.setRequestHeader("Content-Charset", "utf-8"); 
		WinHttpReq.SetRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
		//WinHttpReq.SetRequestHeader("Authorization", "Bearer " + service_key);
        //  Send the HTTP request.
        WinHttpReq.Send(message);
		strResult = WinHttpReq.GetAllResponseHeaders() + "\n\n" + WinHttpReq.ResponseText;
	}catch(objError){
		strResult = objError + "\n"
		strResult += "WinHTTP returned error: " + (objError.number & 0xFFFF).toString() + "\n\n";
		strResult += objError.description;
	}
	time_request = (new Date()).getTime();
	return strResult;
}

//WScript.StdOut.WriteLine(search_post("-47388963", "813426251"));
WScript.StdOut.WriteLine(search_post("-222541136", "1477085"));

function search_post_2(){
	//var code = 'var result = [];var c = 3;while (c != 0){c = c - 1;var items = API.wall.get({"owner_id":-222541136, "offset":100 * c,"count": 100}).items;var i = items.length;while (i != 0){i = i - 1;if(items[i].signer_id == 813426251 && items[i].reposts.user_reposted == 0)result.push(items[i].id);};};return result;';
	//var code = 'return API.wall.get({"owner_id":-222541136, "offset":0, "count": 100}).items@.id;';
	var code = 'return API.wall.get({"owner_id":-222541136, "offset":0, "count": 1}).items;';
	
	
	var message = "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"access_token\"\n\n" + service_key + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"v\"\n\n5.199\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"code\"\n\n" + code + "\n";
	message += "--" + boundary + "--\n";
	
	var strURL = "https://api.vk.com/method/execute";
	var strResult;
	// ѕроверка времени интервал 340 милисекунд, не больше трех запросов в секунду.
	var sleep_time = 340 - ((new Date()).getTime() - time_request);
	if(sleep_time > 0)WScript.Sleep(temp_time);
	
	try{
		var WinHttpReq = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
		var temp = WinHttpReq.Open("POST", strURL, false);
		// «аголовки
		//WinHttpReq.setRequestHeader("Content-Charset", "utf-8"); 
		WinHttpReq.SetRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
		//WinHttpReq.SetRequestHeader("Authorization", "Bearer " + service_key);
        //  Send the HTTP request.
        WinHttpReq.Send(message);
		strResult = WinHttpReq.GetAllResponseHeaders() + "\n\n" + WinHttpReq.ResponseText;
	}catch(objError){
		strResult = objError + "\n"
		strResult += "WinHTTP returned error: " + (objError.number & 0xFFFF).toString() + "\n\n";
		strResult += objError.description;
	}
	time_request = (new Date()).getTime();
	return strResult;
}
//WScript.StdOut.WriteLine(search_post_2());


// END TEST

WScript.StdOut.WriteLine("EXIT");
WScript.StdIn.ReadLine();
WScript.Quit(0);
