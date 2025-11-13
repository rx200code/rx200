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

var htmlfile = WSH.CreateObject('htmlfile');
htmlfile.write('<meta http-equiv="x-ua-compatible" content="IE=9" />');
var JSON = htmlfile.parentWindow.JSON;
htmlfile.close();

var fso = new ActiveXObject("Scripting.FileSystemObject");
var nameFilePosts = "../posts.json";
var posts;
var nameFileConfig = "../config.json";
var config;

if(fso.FileExists(nameFilePosts)){
	file = fso.OpenTextFile(nameFilePosts, 1);
	posts = JSON.parse(file.ReadAll());
	file.Close();
}else errorExit("not file " + nameFilePosts);

if(fso.FileExists(nameFileConfig)){
	file = fso.OpenTextFile(nameFileConfig, 1);
	config = JSON.parse(file.ReadAll());
	file.Close();
}else errorExit("not file " + nameFileConfig);

var boundary = "rx20089607859080";
function test_post(post){
	// post
	var message = "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"access_token\"\n\n" + config.keys.user_key + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"v\"\n\n5.199\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"owner_id\"\n\n-222541136\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"message\"\n\n" + post.message + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"attachments\"\n\n" + post.attachments + "\n";
	message += "--" + boundary + "--\n";
	
	var strURL = "https://api.vk.com/method/wall.post";
	var strResult;
	try{
		var WinHttpReq = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
		var temp = WinHttpReq.Open("POST", strURL, false);
		// Заголовки
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
	WScript.StdOut.WriteLine("id: " + post.id);
	WScript.StdOut.WriteLine(strResult);
	WScript.Sleep(350);
}

//WScript.StdOut.WriteLine(posts[0].message);
//test_post(posts[0]);

for(var i = posts.length - 1; i >= 0; i--)test_post(posts[i]);


//*
WScript.StdOut.WriteLine("EXIT");
WScript.StdIn.ReadLine();
WScript.Quit(0);
//*/



























