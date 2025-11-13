//*
{"error":{"error_code":14,"error_msg":"Captcha needed","request_params":[{"key":"method","value":"wall.repost"},{"key":"oauth","value":"1"},{"key":"v","value":"5.199"},{"key":"object","value":"wall-106887464_299076"}],"captcha_sid":"630525565328","is_refresh_enabled":true,"captcha_img":"https:\/\/vk.com\/captcha.php?sid=630525565328&source=check_user_action_validate%2Bwall_post&app_id=51748111&device_id=&s=1&resized=1","captcha_ts":1709151883.534000,"captcha_attempt":1,"captcha_ratio":2.600000,"is_sound_captcha_available":true,"captcha_track":"https:\/\/vk.com\/sound_captcha.php?captcha_sid=630525565328&act=get&source=check_user_action_validate%2Bwall_post&app_id=51748111&device_id=","is_enabled_vkui":true}}
//*/





function post_0(post, owner_id){
	var message = "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"access_token\"\n\n" + user_key + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"v\"\n\n5.199\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"owner_id\"\n\n" + owner_id + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"message\"\n\n" + post.message + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"attachments\"\n\n" + post.attachments + "\n";
	message += "--" + boundary + "--\n";
	
	var strURL = "https://api.vk.com/method/wall.post";
	var strResult;
	// Проверка времени интервал 340 милисекунд, не больше трех запросов в секунду.
	var sleep_time = time_offset - ((new Date()).getTime() - time_request);
	time_offset = 340;
	if(sleep_time > 0)WScript.Sleep(sleep_time);
	
	try{
		var WinHttpReq = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
		var temp = WinHttpReq.Open("POST", strURL, false);
		WinHttpReq.SetRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
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

function likes_add(owner_id, post_id){
	var message = "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"access_token\"\n\n" + user_key + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"v\"\n\n5.199\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"type\"\n\npost\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"owner_id\"\n\n" + owner_id + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"item_id\"\n\n" + post_id + "\n";
	message += "--" + boundary + "--\n";
	
	var strURL = "https://api.vk.com/method/likes.add";
	var strResult;
	// Проверка времени интервал 340 милисекунд, не больше трех запросов в секунду.
	var sleep_time = time_offset - ((new Date()).getTime() - time_request);
	time_offset = 340;
	if(sleep_time > 0)WScript.Sleep(sleep_time);
	
	try{
		var WinHttpReq = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
		var temp = WinHttpReq.Open("POST", strURL, false);
		WinHttpReq.SetRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
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

function wall_repost(obj){
	var message = "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"access_token\"\n\n" + user_key + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"v\"\n\n5.199\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"object\"\n\n" + obj + "\n";
	message += "--" + boundary + "--\n";
	
	var strURL = "https://api.vk.com/method/wall.repost";
	var strResult;
	// Проверка времени интервал 340 милисекунд, не больше трех запросов в секунду.
	var sleep_time = time_offset - ((new Date()).getTime() - time_request);
	time_offset = 340;
	if(sleep_time > 0)WScript.Sleep(sleep_time);
	
	try{
		var WinHttpReq = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
		var temp = WinHttpReq.Open("POST", strURL, false);
		WinHttpReq.SetRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
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


function getIdsPostUserNotReposted(owner_id){
	var message = "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"access_token\"\n\n" + user_key + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"v\"\n\n5.199\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"owner_id\"\n\n" + owner_id + "\n";
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"signer_id\"\n\n" + account_id_vk + "\n";
	message += "--" + boundary + "--\n";
	
	var strURL = "https://api.vk.com/method/execute.getIdsPostUserNotReposted";
	var strResult;
	// Проверка времени интервал 1000 милисекунд, не больше трех запросов в секунду.
	var sleep_time = time_offset - ((new Date()).getTime() - time_request);
	time_offset = 1020;
	if(sleep_time > 0)WScript.Sleep(sleep_time);
	
	try{
		var WinHttpReq = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
		var temp = WinHttpReq.Open("POST", strURL, false);
		WinHttpReq.SetRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
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

//
// Функции запросов.
var time_request = 0;
var time_offset = 340;
var boundary = "rx20089607859080";
var title_message = "--" + boundary + "\nContent-Disposition: form-data; name=\"access_token\"\n\n" + user_key + "\n--" + boundary + "\nContent-Disposition: form-data; name=\"v\"\n\n5.199\n";

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
				WScript.StdOut.WriteLine("Введите текст с картинки в браузере:");
				var captcha_key = WScript.StdIn.ReadLine();
				captcha = "--" + boundary + "\n";
				captcha += "Content-Disposition: form-data; name=\"captcha_sid\"\n\n" + obj_error.captcha_sid + "\n";
				captcha += "--" + boundary + "\n";
				captcha += "Content-Disposition: form-data; name=\"captcha_key\"\n\n" + captcha_key + "\n";
				continue;
			}
			errorExitLog("method_vk: " + method_vk + " message: " + message + captcha + "--" + boundary + "--\n" + "\nreport: " + strResult);
		}
		return strResult;
	}
}

function getIdsPostUserNotReposted(owner_id){
	var message = title_message;
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"owner_id\"\n\n" + owner_id + "\n";
	var report = request_api_vk("execute.getIdsPostUserNotReposted", message);
	time_offset = 1020;
	return (JSON.parse(report)).response;
}

function wall_repost(obj){
	var message = title_message;
	message += "--" + boundary + "\n";
	message += "Content-Disposition: form-data; name=\"object\"\n\n" + obj + "\n";
	request_api_vk("wall.repost", message);
	time_offset = 340;
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
	time_offset = 340;
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
	time_offset = 340;
}


report = post_0(post, owner_id);
if(report.indexOf("error") != -1)errorExitLog("5 " + report);

report = getIdsPostUserNotReposted(ids_resources_reposts[i]);//{"response":[1]}
if(report.indexOf("error") != -1)errorExitLog("1 " + report);

report = likes_add(ids_resources_reposts[i], ids_posts[k]);
if(report.indexOf("error") != -1)errorExitLog("2 " + report);

report = wall_repost("wall" + temp_resource);
if(report.indexOf("error") != -1)errorExitLog("3 " + report);





























