
const process = require('process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const readline = require('readline');
const child_process = require('child_process');

var fd_log;
// функции логирования.
process.on('exit', (code) => {
	if(code)err(`Exit error code: ${code}`);
});
async function writeLog(text){
	fs.writeSync(fd_log, Date.now() + " " + text + "\n");
}
async function out(text){
	console.log(text);
}
async function outLog(text){
	console.log('\x1b[1m%s\x1b[0m', text);
	writeLog(text);
}
async function err(text){
	console.error('\x1b[33m%s\x1b[0m', text);
}
async function errLog(text){
	console.error('\x1b[33;1m%s\x1b[0m', text);
	await writeLog(text);
}
async function errExit(text){
	await err(text);
	fs.closeSync(fd_log);
	process.exit(7);
}
async function errExitLog(text){
	await errLog(text);
	fs.closeSync(fd_log);
	process.exit(8);
}
// функция запроса из консоли
function input(text){
	return new Promise(resolve => {
		const rl = readline.createInterface({input: process.stdin, output: process.stdout});
		rl.question("\x1b[34;1m" + text + "\x1b[0m ", (text) => {
			rl.close();
			resolve(text);
		});
	});
}
// функция запуска браузера.
var command_exec_browser;
if(process.platform === 'win32'){
	command_exec_browser = "start firefox ";
}else if(process.platform === 'linux'){
	command_exec_browser = "xdg-open ";
}else if(process.platform === 'darwin'){
	command_exec_browser = "open ";
}else process.exit(3);

function exec_browser(url){
	child_process.execSync(command_exec_browser + "\"" + url+ "\"");
}

// Сообщения об ошибках.
const strErrReqest = "ОШИБКА запроса, проверте интернет и нажмите enter, для повторной попытки запроса, или введите exit для выхода из программы.";

// глобальные константы.
const separator = path.sep;
const dir = __dirname;
const dir_data = "data";
const name_config_file = "config.json";
const path_config_file = dir + separator + dir_data + separator + name_config_file;
const name_log_file = "log";
const path_log_file = dir + separator + dir_data + separator + name_log_file;
var user_id, token;

try{
	const config = JSON.parse(fs.readFileSync(path_config_file, 'utf8'));
	user_id = config.user_id;
	token = config.token;
	// дискриптор файла для логирования.
	fd_log = fs.openSync(path_log_file, 'a');

	//out(config);
}catch(err){
	errExit(err);
}

const host_vk_api = "api.vk.ru";
const path_vk_api = "/method/";
const v_api = "5.199";
const boundary = "rx20089607859080";
const title_message = "--" + boundary + "\nContent-Disposition: form-data; name=\"access_token\"\n\n" + token + "\n--" + boundary + "\nContent-Disposition: form-data; name=\"v\"\n\n" + v_api + "\n";

const startDate = new Date();
const startTime = startDate.getTime();
const limit_execution = 1 * 60 * 60 * 1000;// лимит выполнения скрипта. // 1 час.
const endTime = limit_execution + startTime;
const startZoneOffset = 25200000;//startDate.getTimezoneOffset() * -60000; новосибирск 25200000

var startDay;

var time_request = 0;
const time_offset_short = 2000;// 340;// один вызов. // для time_offset
const time_offset_long = 6000;// 1020;// три вызов. // для time_offset
var time_offset = time_offset_short;

var resources;
var posts;
var postings;

var owner_ids_resources_reposts = [];

const limit_time_storage = 3 * 24 * 60 * 60 * 1000;// лимит хранения данных в storage vk 3 дня.
const limit_restart = 7 * 60 * 60 * 1000;// лимит на повторный запуск 7 часов.
var limit_attempt_start = 3;// лимит попыток старта.
const str_id_random = (Math.random() + "").slice(2);// const str_id_random = (Math.random() + "").slice(2);
async function init(){
	
	let server_time = JSON.parse(await request_0("utils.getServerTime", {})).response * 1000;// метод utils.getServerTime работает без токена.

	startDay = ((server_time + startZoneOffset) / 86400000) | 0;
	while(true){
		// Шаг 1. Запрос storage.getKeys
		let arr_times_ids = JSON.parse((await request_0("storage.getKeys", {})).replace(/\"(\d+)_(\d+)\"/g, "\[$1,\"$2\"\]")).response;
		arr_times_ids.sort((a, b) => b[0] - a[0]);

		//TEST 1
		await out("getKeys_1: " + JSON.stringify(arr_times_ids, null, "\t"));

		// 1.2. очистка от старых записей.
		for(let i = arr_times_ids.length - 1; i >= 0; i--){
			if(arr_times_ids[i][0] < server_time - limit_time_storage){// Удаляем если старше 3 дней.
				let elm = arr_times_ids.pop();
				let test_2_0 = await request_0("storage.set", {key: elm[0] + "_" + elm[1], value: ""});

				//TEST 2_0
				await out("set_2_0: " + JSON.stringify(test_2_0, null, "\t"));

			}else break;
		}
		// 1.3. анализ ответа.
		if(arr_times_ids.length && arr_times_ids[0][0] > server_time - limit_restart)await errExit("Времени с последнего запуска прошло менее 7 часов.");
		// 1.4 проверяем запускались ли сегодня уже программа.
		if(arr_times_ids.length && (((arr_times_ids[0][0] + startZoneOffset) / 86400000) | 0) >= startDay)errExit("Сегодня программа уже выполнялась.");

		// Шаг 2. storage.set
		let test_2 = await request_0("storage.set", {key: server_time + "_" + str_id_random, value: "s"});

		//TEST 2
		await out("set_2: " + JSON.stringify(test_2, null, "\t"));

		// Шаг 3. Запрос storage.getKeys
		let arr_times_ids_2 = JSON.parse((await request_0("storage.getKeys", {})).replace(/\"(\d+)_(\d+)\"/g, "\[$1,\"$2\"\]")).response;
		arr_times_ids_2.sort((a, b) => b[0] - a[0]);

		//TEST 3
		await out("getKeys_3: " + JSON.stringify(arr_times_ids_2, null, "\t"));

		// 3.2. анализ ответа.
		// в случае сбоя переходим к шагу 1
		if(
			arr_times_ids_2.length === 0 || // на всякий случай, если запись, на шаге 2, непрошла.
			arr_times_ids_2[0][0] !== server_time ||
			arr_times_ids_2[0][1] !== str_id_random ||
			(arr_times_ids_2.length > 1 && arr_times_ids_2[1][0] > server_time - limit_restart)
		){
			// затираем свою запись.
			let test_4 = await request_0("storage.set", {key: server_time + "_" + str_id_random, value: ""});

			//TEST 4
			await out("set_4: " + JSON.stringify(test_4, null, "\t"));

			//
			if(--limit_attempt_start <= 0)await errExit("Превышен лимит попыток старта(limit_attempt_start 3).");
			// ждем рандомное время от 3 до 7 секунд
			await sleep(Math.floor(Math.random() * 4000) + 3000);
			// переходим к шагу 1.
		}else break;
	}

	// Всё хорошо запустились.
	// Загружаем данные. resources, posts, postings
	let obj_data = JSON.parse((await request_0("execute.getData", {}))).response;
	resources = obj_data.resources;
	posts = obj_data.posts;
	postings = obj_data.postings;
	
}

async function request_0(method, obj_parameters){
	/**/
	// TEST
	//await out("запрос: " + method + ", obj_parameters: " + obj_parameters);
	/**/
	let captcha = "";
	let message = title_message;
	for(let name in obj_parameters)message += "--" + boundary + "\nContent-Disposition: form-data; name=\"" + name + "\"\n\n" + obj_parameters[name] + "\n";

	while(true){
		// Проверка времени интервал 1000 милисекунд, не больше трех запросов в секунду.
		let sleep_time = time_offset - (Date.now() - time_request);
		if(sleep_time > 0)await sleep(sleep_time);
		// Проверка времени выполнения всего скрипта endTime по limit_execution.
		if(endTime < Date.now())await errExitLog("Время выполнения скрипта превышено,1 час limit_execution");
		// запрос
		let strResult = await request_vk_api(method, message + captcha + "--" + boundary + "--\n");
		time_request = Date.now();
		// проверяем результат на ошибки.
		if(typeof strResult !== "string"){// Ошибки сети, не вк
			await outLog(strResult + "\n");
			if(await input(strErrReqest) === "exit")await errExitLog("exit user");
		}else if(strResult.indexOf("error") != -1){// Ошибки vk api
			if(strResult.indexOf("\"error_code\":14") != -1 && strResult.indexOf("Captcha") != -1){// Обработка капчи.
				out("Ошибка капчи: " + strResult);
				let obj_error = (JSON.parse(strResult)).error;
				
				if("redirect_uri" in obj_error){
					exec_browser(obj_error.redirect_uri);
					let captcha_key = await input("Новая капча открылась в браузере, подождите и отправьте запрос заново, или введите exit для выхода:");
					if(captcha_key != "exit"){
						captcha = "";
						continue;
					}
				}else if("captcha_img" in obj_error){
					exec_browser(obj_error.captcha_img);
					let captcha_key = await input("Введите текст с картинки в браузере или exit для выхода:");
					if(captcha_key != "exit"){
						captcha = "--" + boundary + "\n";
						captcha += "Content-Disposition: form-data; name=\"captcha_sid\"\n\n" + obj_error.captcha_sid + "\n";
						captcha += "--" + boundary + "\n";
						captcha += "Content-Disposition: form-data; name=\"captcha_key\"\n\n" + captcha_key + "\n";
						continue;
					}
				}
			}

			let test = await input("введите \"q\" чтоб выйти или Enter чтобы пропустить запрос.");
			if(test == "q"){
				await errExitLog("method_vk: " + method + "\nparameters: " + JSON.stringify(obj_parameters, null, "\t") + "\nreport: " + strResult);
			}else{
				errLog("method_vk: " + method + "\nparameters: " + JSON.stringify(obj_parameters, null, "\t") + "\nreport: " + strResult);
				return strResult;
			}
		}
		return strResult;
	}
}


function request_vk_api(method, message){
	return new Promise(resolve => {// (resolve, reject)
		let strResult = "";
		const options = {
			hostname: host_vk_api,
			port: 443,
			path: path_vk_api + method,
			method: 'POST',
			headers: {
				'Content-Type': "multipart/form-data; boundary=" + boundary,
				'Content-Length': Buffer.byteLength(message, 'utf8')//message.length
			}
		};
		const req = https.request(options, (res) => {
			res.on('data', (data) => {
				strResult += data;
			});
			res.on('end', () => {
				resolve(strResult);
			});
			
		});
		req.on('error', (error) => {
			resolve(error);
		});
		req.write(message);
		req.end();
	});
}

async function main(){// await
	
	await init();
	await outLog("START");
	/**
	// TEST очистка storageVK
	let arr_times_ids = JSON.parse((await request_0("storage.getKeys", {})).replace(/\"(\d+)_(\d+)\"/g, "\[$1,\"$2\"\]")).response;

		// 1.2. очистка от старых записей.
	for(let i = arr_times_ids.length - 1; i >= 0; i--){// Удаляем если старше 3 дней.
		let elm = arr_times_ids.pop();
		let test_2_0 = await request_0("storage.set", {key: elm[0] + "_" + elm[1], value: ""});
		await out("set_2_0: " + JSON.stringify(test_2_0, null, "\t"));
	}
	await errExitLog("testExit");
	/**/

	for(let i = 0; i < postings.length; i++){
		let resource;
		for(let j = 0; j < resources.length; j++){
			if(resources[j].id === postings[i].resource_id){
				resource = resources[j];
				break;
			}
		}
		let day_number = dayNumber(postings[i].posting.length);
		let post_ids = postings[i].posting[day_number];
		for(let j = 0; j < post_ids.length; j++){
			if(post_ids[j] != -1){
				
				let post;
				for(let k = 0; k < posts.length; k++){
					if(posts[k].id === post_ids[j]){
						post = posts[k];
						break;
					}
				}
				// Публикуем...
				await request_posting(resource, post);
			}
		}
	}
	
	// Завершаем (делаем репосты лайки).
	for(let i = 0; i < owner_ids_resources_reposts.length; i++){
		// проверяем свои или чужие нужны посты.
		for(let j = 0; j < resources.length; j++){
			if(resources[j].owner_id == owner_ids_resources_reposts[i]){
				if(resources[j].rules.repost_other_post == 1){
					let ids_post_ids_other = await getIdsPostIdsOtherReposted(owner_ids_resources_reposts[i]);
					for(let k = 0; k < ids_post_ids_other.ids_post.length; k++){
						await likes_add(owner_ids_resources_reposts[i], ids_post_ids_other.ids_post[k]);
						let temp_resource = owner_ids_resources_reposts[i] + "_" + ids_post_ids_other.ids_post[k];
						await outLog("likes.add: wall" + temp_resource);
						await outLog("wall.repost: not wall" + temp_resource);
					}
					for(let k = 0; k < ids_post_ids_other.ids_other.length; k++){// Репостим себе, не свои посты.
						await wall_repost("wall" + owner_ids_resources_reposts[i] + "_" + ids_post_ids_other.ids_other[k]);
						await outLog("wall.repost: other wall" + owner_ids_resources_reposts[i] + "_" + ids_post_ids_other.ids_other[k]);
					}
				}else{
					// Проверяем, есть ли, на ресурсе, посты от автора без репоста.
					let ids_posts = await getIdsPostUserNotReposted(owner_ids_resources_reposts[i]);
					for(let k = 0; k < ids_posts.length; k++){
						// Ставим лайк. likes.add
						await likes_add(owner_ids_resources_reposts[i], ids_posts[k]);
						let temp_resource = owner_ids_resources_reposts[i] + "_" + ids_posts[k];
						await outLog("likes.add: wall" + temp_resource);
						// Делаем репост. wall.repost
						await wall_repost("wall" + temp_resource);
						await outLog("wall.repost: wall" + temp_resource);
						//// Ставим лайк репосту. likes.add
					}
				}
				break;
			}
		}
	}

	await outLog("END");
	fs.closeSync(fd_log);
}

// вспомогательная функция запроса
async function request_posting(resource, post){
	// Публикуем ПОСТ.
	await post_0(post, resource.owner_id);
	await outLog("offer wall resource: " + resource.id + " post: " + post.id);
	if(owner_ids_resources_reposts.indexOf(resource.owner_id) == -1)owner_ids_resources_reposts.push(resource.owner_id);
}
// Функции запросов. из старого кода.
async function post_0(post, owner_id){
	let post_id = JSON.parse(await request_0("wall.post", {
		owner_id: owner_id,
		message: post.message,
		attachments: post.attachments
	})).response.post_id;

	time_offset = time_offset_short;

	// временно пока вк не исправит баг с полем "signed": "1", чтоб можно было в один запрос "wall.post" публиковать с подписью авторства.
	await request_0("wall.edit", {
		message: post.message,
		"post_id": post_id,
		owner_id: owner_id,
		attachments: post.attachments,
		"signed": "1",
		"check_sign": "0"
	});

	/**
	// TEST
	await out({
		owner_id: owner_id,
		message: post.message,
		attachments: post.attachments
	});
	/**/

}

async function likes_add(owner_id, post_id){
	await request_0("likes.add", {
		type: "post",
		owner_id: owner_id,
		item_id: post_id
	});
	time_offset = time_offset_short;
}

async function wall_repost(str_obj){
	await request_0("wall.repost", {
		object: str_obj
	});
	time_offset = time_offset_short;
}

async function getIdsPostUserNotReposted(owner_id){
	let report = await request_0("execute.getIdsPostUserNotReposted", {
		owner_id: owner_id,
		signer_id: user_id
	});
	time_offset = time_offset_long;
	/**/
	// TEST
	await out("owner_id: " + owner_id + ", report: " + report);
	/**/
	return (JSON.parse(report)).response;
}

async function getIdsPostIdsOtherReposted(owner_id){
	let report = await request_0("execute.getIdsPostIdsOtherReposted", {
		owner_id: owner_id,
		signer_id: user_id
	});
	time_offset = time_offset_long;
	/**/
	// TEST
	await out("owner_id: " + owner_id + ", report: " + report);
	/**/
	return (JSON.parse(report)).response;
}


// дополнительные функции.
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
// Вспомогательные функции.
function dayNumber(n){
	return startDay % n;
}

main();